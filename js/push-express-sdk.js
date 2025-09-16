const DB_VERSION = 1
const SDK_VERSION = '2.0.2';

function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("PushExpressDB", DB_VERSION);
      request.onerror = (event) => reject("DB error: " + event.target.error);
      request.onsuccess = (event) => resolve(event.target.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("push_express")) {
          db.createObjectStore("push_express", { keyPath: "key" });
        }
      };
    });
  }
  
async function saveDataToDB(key, value) {
  try {
      const db = await openDatabase();
      const tx = db.transaction("push_express", "readwrite");
      const store = tx.objectStore("push_express");
      const dataToStore = key.includes("PUSHEXPRESS_") ? JSON.stringify(value) : value;
      
      await new Promise((resolve, reject) => {
      const request = store.put({ key, value: dataToStore });
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
      });
  } catch (error) {
      await logErrorToServer({
          type: 'indexeddb_write',
          key: key,
          valueType: typeof value,
          message: error.message,
          severity: 'medium'
        });
        throw error;
  }
}
  
async function getDataFromDB(key) {
  const db = await openDatabase();
  const tx = db.transaction("push_express", "readonly");
  const store = tx.objectStore("push_express");
  const request = store.get(key);

  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result?.value || null);
  });
}

async function getPushExpressConfig() {
  try {
    const config = await getDataFromDB("PUSHEXPRESS_CONFIG");
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error("Error getting pushExpressConfig:", error);
    return null;
  }
}

function getInfoAboutDevices() {
  let language = navigator.language.split("-")[0] || "en";
  let date = new Date();
  let currentTimeZone = date.getTimezoneOffset() * -60;
  let infoAboutDevice = {
      "transport_type": "webpush.fcm",
      "transport_token": "",
      "platform_type": "browser",
      "lang": language,
      "agent_name": "px_js_browser_sdk_"+SDK_VERSION,
      "tz_sec": currentTimeZone,
      "notif_perm_granted": true
  };
  return infoAboutDevice;
}

async function logErrorToServer(errorData) {
  try {
    const pushExpressConfig = await getPushExpressConfig();
    const response = await fetch('https://core.push.express/api/sdk/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...errorData,
        appID: pushExpressConfig.appID,
        timestamp: new Date().toISOString(),
        sdk_version: '2.1.1'
      })
    });

    if (!response.ok) {
      console.error('Failed to send error to server', await response.text());
    }
  } catch (e) {
    console.error('Error logging failed:', e);
  }
}

async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.warn("Service workers are not supported in this browser.");
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.warn("[Service Worker] The user declined the subscription to notifications.");
            return false;
        }

        const registration = await navigator.serviceWorker.register('/lander/push-express-sw/push-express-sw.js');
        
        if (registration) {
            console.log("push-express-sw.js already registered:", registration);
            navigator.serviceWorker.controller?.postMessage({ type: "APP_LAUNCH" });
            return true;
        }

        const newRegistration = await navigator.serviceWorker.register(serviceWorkerPath);
        console.log("The service worker is registered:", newRegistration);
        return true;

    } catch (error) {
        console.error("Error during service worker registration:", error);
        await logErrorToServer({
            type: 'service_worker_registration',
            message: error.message,
            stack: error.stack,
            severity: 'high'
          });
        return false;
    }
}

async function initPushExpress(pushExpressConfig) {
    if (!pushExpressConfig) {
        throw new Error("pushExpressConfig is required");
    }

    if (!pushExpressConfig.appID || !pushExpressConfig.vapidKey) {
        throw new Error("appID and vapidKey are required in pushExpressConfig");
    }
    
    if (!pushExpressConfig.tags || typeof pushExpressConfig.tags !== "object") {
        pushExpressConfig.tags = {};
    }

    try {
        await saveDataToDB("PUSHEXPRESS_CONFIG", pushExpressConfig);
        await saveDataToDB('PUSHEXPRESS_INFO_' + pushExpressConfig.appID, getInfoAboutDevices());
        return await registerServiceWorker();
    } catch (error) {
        console.error("Error in initPushExpress:", error);
        await logErrorToServer({
            type: 'initialization',
            config: pushExpressConfig ? { 
              appID: pushExpressConfig.appID,
              hasVapidKey: !!pushExpressConfig.vapidKey
            } : null,
            message: error.message,
            severity: 'critical'
          });
        throw error;
    }
}