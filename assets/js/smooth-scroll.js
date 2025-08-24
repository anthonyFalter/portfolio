// Enhanced smooth scrolling with easing for all browsers
document.addEventListener('DOMContentLoaded', function() {
    // Easing function for smooth animation
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // Smooth scroll function with delay
    function smoothScrollTo(targetPosition, duration = 1500, delay = 300) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            
            // Apply delay before starting animation
            if (timeElapsed < delay) {
                requestAnimationFrame(animation);
                return;
            }
            
            const adjustedTime = timeElapsed - delay;
            const progress = Math.min(adjustedTime / duration, 1);
            
            // Apply easing
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (adjustedTime < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // Override default anchor link behavior
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (target && target.getAttribute('href') !== '#') {
            e.preventDefault();
            
            const targetId = target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - 80; // Account for fixed headers
                smoothScrollTo(targetPosition, 1800, 400); // 1.8 second duration with 400ms delay
            }
        }
    });

    // Smooth scroll for programmatic scrolling
    window.smoothScrollTo = smoothScrollTo;
    
    // Add smooth scrolling to any element with data-smooth-scroll attribute
    document.querySelectorAll('[data-smooth-scroll]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-smooth-scroll');
            const targetElement = document.querySelector(target);
            
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - 80;
                smoothScrollTo(targetPosition, 1800, 400);
            }
        });
    });

    console.log('Enhanced smooth scrolling initialized');
});
