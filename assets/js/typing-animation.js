// Simple typing animation script
console.log('Typing animation script loaded');

// Track animated elements
const animatedElements = new Set();
let isAnimating = false;
let animationQueue = [];

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    // More lenient viewport check (120% of viewport height)
    return (
        rect.top <= windowHeight * 1.2 &&
        rect.bottom >= -windowHeight * 0.2 &&
        !animatedElements.has(element)
    );
}

// Animate text function
function animateText(element) {
    return new Promise((resolve) => {
        console.log('Animating element:', element);
        if (animatedElements.has(element)) {
            console.log('Element already animated, skipping');
            return resolve();
        }
        
        const originalHTML = element.innerHTML;
        element.innerHTML = ''; // Clear existing content
        element.style.textAlign = 'center';
        element.style.width = '100%';
        element.style.whiteSpace = 'pre'; // Preserve whitespace
        
        const textContainer = document.createElement('span');
        textContainer.className = 'typing-text';
        textContainer.style.display = 'inline-block';
        textContainer.style.textAlign = 'center';
        element.appendChild(textContainer);
        
        // Preserve all characters including spaces
        const text = originalHTML.replace(/<[^>]*>?/gm, '');
        animatedElements.add(element);
        
        // Make element visible
        requestAnimationFrame(() => {
            element.classList.add('visible');
            
            // Animate characters one by one
            let currentChar = 0;
            const speed = 30; // Lower is faster
            
            function typeCharacter() {
                if (currentChar < text.length) {
                    const char = document.createElement('span');
                    // Preserve spaces and special characters
                    let charToAdd = text.charAt(currentChar);
                    if (charToAdd === ' ') {
                        char.innerHTML = '&nbsp;';
                    } else {
                        char.textContent = charToAdd;
                    }
                    char.style.opacity = '0';
                    char.style.animation = 'fadeIn 0.3s forwards';
                    char.style.display = 'inline-block';
                    textContainer.appendChild(char);
                    currentChar++;
                    setTimeout(typeCharacter, speed);
                } else {
                    element.classList.add('animated');
                    resolve();
                }
            }
            
            // Start the animation
            typeCharacter();
        });
    });
}

// Process animation queue
function processQueue() {
    if (isAnimating || animationQueue.length === 0) return;
    
    isAnimating = true;
    const element = animationQueue.shift();
    
    animateText(element).then(() => {
        isAnimating = false;
        // Process next in queue after a small delay
        if (animationQueue.length > 0) {
            setTimeout(processQueue, 200);
        }
    });
}

// Handle scroll and check for elements to animate
function handleScroll() {
    const elements = document.querySelectorAll('.typing-animation:not(.no-animation):not(.animated)');
    elements.forEach(element => {
        if (isInViewport(element) && !animationQueue.includes(element)) {
            animationQueue.push(element);
        }
    });
    
    if (!isAnimating) {
        processQueue();
    }
}

// Initialize typing animation
function initTypingAnimation() {
    console.log('Initializing typing animation');
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .typing-animation {
            display: block !important;
            position: relative;
            opacity: 0;
            visibility: hidden;
            text-align: center;
            width: 100%;
            white-space: pre;
        }
        
        .typing-animation.visible,
        .typing-animation.animated {
            opacity: 1;
            visibility: visible;
        }
        
        .typing-text {
            display: inline-block;
            white-space: pre;
            text-align: center;
            width: auto;
            margin: 0 auto;
        }
        
        .typing-text span {
            opacity: 0;
            animation: fadeIn 0.3s forwards;
            display: inline-block;
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Initial check with minimal delay
    setTimeout(handleScroll, 50);
    
    // More responsive scroll handling with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Start the animation when the page is fully loaded
window.addEventListener('load', function() {
    initTypingAnimation();
});
