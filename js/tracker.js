(function() {
  // Function to get cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Function to get user ID with retry logic
  async function getUserId() {
    let userId = getCookie('_subid');
    if (userId) return userId;

    // Try 3 times with 1 second delay between attempts
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      userId = getCookie('_subid');
      if (userId) return userId;
    }

    // If cookie still doesn't exist after retries, generate random UUID
    return crypto.randomUUID();
  }

  // Initialize with a placeholder, will be updated asynchronously
  let userId = null;
  let userIdReady = false;
  
  const landingId = window.location.pathname;
  let eventQueue = [];
  let stepCounter = 0;
  
  // Start the async process to get the user ID
  getUserId().then(id => {
    userId = id;
    userIdReady = true;
    
    // Update all queued events with the correct userId
    eventQueue.forEach(event => {
      event.user_id = userId;
    });
    
    // Flush events if we have enough queued
    if (eventQueue.length >= 5) flushEvents();
  });

  function pushEvent(eventName, meta = {}) {
    eventQueue.push({
      user_id: userId, // This might be null initially, but will be updated when userId is ready
      landing_id: landingId,
      event_name: eventName,
      step: ++stepCounter,
      meta: meta,
      timestamp: Date.now() / 1000 // Add timestamp in seconds to match backend format
    });

    // Only flush if userId is ready and we have enough events
    if (userIdReady && eventQueue.length >= 5) flushEvents();
  }

  function flushEvents() {
    // Don't flush if userId is not ready or queue is empty
    if (!userIdReady || !eventQueue.length) return;
    
    const batch = [...eventQueue];
    eventQueue = [];

    // fetch('/api/events', {
    fetch('https://track.click-to-click.com/api/events', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(batch)
    }).catch(err => {
      eventQueue = batch.concat(eventQueue);
    });
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (el) {
      pushEvent('click_' + el.dataset.track, {text: el.innerText});
    }
  });

  let scrollTracked = false;
  window.addEventListener('scroll', () => {
    if (!scrollTracked && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      scrollTracked = true;
      pushEvent('scroll_end');
    }
  });

  window.addEventListener('beforeunload', flushEvents);

  window.trackEvent = function(eventName, meta = {}) {
    pushEvent(eventName, meta);
  }
})();