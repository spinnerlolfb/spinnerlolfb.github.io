!function() {
    "use strict";

    window.addEventListener("load", function() {
        // Hide preloader
        var preloader = document.querySelector(".preloader");
        if (preloader) {
            preloader.style.opacity = 0;
            preloader.style.visibility = "hidden";
        }

        // Scroll to wheel for small screens in landscape
        if (window.innerWidth <= 896 && window.innerWidth > window.innerHeight) {
            var wheel = document.querySelector(".wheel");
            if (wheel) wheel.scrollIntoView({ behavior: "smooth" });
        }
    });

    var spinElements = document.querySelectorAll(".js-rotate"),
        spinCounter = document.querySelector(".js-spin-counter"),
        spinsLeft = 10; // 10 attempts

    // Update counter on page load
    if (spinCounter) spinCounter.innerHTML = spinsLeft;

    var wheelInner = document.querySelector(".wheel-inner"),
        wheelWinSector = document.querySelector(".wheel-win-sector");

    function spinWheel() {
        if (spinsLeft <= 0) return; // No attempts left

        // Disable buttons during spin
        spinElements.forEach(function(btn) {
            btn.disabled = true;
            btn.classList.add("disabled");
        });

        // Start wheel animation
        if (wheelInner) {
            wheelInner.classList.remove("animate-preview");
            wheelInner.classList.add("rotate");
        }

        // Decrease attempts
        spinsLeft--;
        if (spinCounter) spinCounter.innerHTML = spinsLeft;

        // Animate win sector after 3 seconds
        setTimeout(function() {
            if (wheelWinSector) wheelWinSector.classList.add("animate");
        }, 3000);

        // Re-enable buttons after animation ends
        if (wheelInner) {
            wheelInner.addEventListener("animationend", function handler() {
                wheelInner.removeEventListener("animationend", handler); // remove this listener
                if (spinsLeft > 0) {
                    spinElements.forEach(function(btn) {
                        btn.disabled = false;
                        btn.classList.remove("disabled");
                    });
                }
            });
        }
    }

    // Attach click event
    spinElements.forEach(function(btn) {
        btn.addEventListener("click", spinWheel);
    });
}();
