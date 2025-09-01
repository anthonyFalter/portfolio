// Global variables
let tooltip;
let mouseX = 0;
let mouseY = 0;

function updateTooltipPosition() {
    if (tooltip) {
        tooltip.style.left = `${mouseX}px`;
        
        // Calculate tooltip height and adjust position
        const tooltipHeight = tooltip.offsetHeight;
        const windowHeight = window.innerHeight;
        const tooltipTop = mouseY - tooltipHeight - 10; // 10px offset from cursor
        
        // If tooltip would go above viewport, show below cursor
        if (tooltipTop < 0) {
            tooltip.style.top = `${mouseY + 20}px`; // 20px below cursor
            tooltip.style.transform = 'translateX(-50%)';
        } else {
            tooltip.style.top = `${tooltipTop}px`;
            tooltip.style.transform = 'translateX(-50%)';
        }
    }
}

// Track mouse position with delay
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const followSpeed = 0.1; // Lower value = more delay

function updateCursorPosition() {
    // Smoothly interpolate towards the target position
    currentX += (targetX - currentX) * followSpeed;
    currentY += (targetY - currentY) * followSpeed;
    
    // Update the tooltip position
    mouseX = currentX;
    mouseY = currentY;
    updateTooltipPosition();
    
    // Continue the animation
    requestAnimationFrame(updateCursorPosition);
}

// Start the animation loop
updateCursorPosition();

// Update target position on mouse move
document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

// Initialize the card stack
function initCardStack() {
    // Tooltip is now created in initializeCardStack
    
    const cardStack = document.getElementById('cardStack');
    if (!cardStack) return;
    
    let currentIndex = 0;
    let isAnimating = false;
    let autoRotateInterval;

    // Card data
    const cardsData = [
        {
            title: 'Graphic Design',
            image: 'assets/images/content/card1.jpg',
            description: 'Creative visual solutions that capture attention and communicate effectively.'
        },
        {
            title: 'Web Development',
            image: 'assets/images/content/card2.jpg',
            description: 'Building modern, responsive websites with clean and efficient code.'
        },
        {
            title: 'UI/UX Design',
            image: 'assets/images/content/card1.jpg',
            description: 'Creating intuitive and engaging user experiences through thoughtful design.'
        },
        {
            title: 'Brand Identity',
            image: 'assets/images/content/card2.jpg',
            description: 'Developing unique brand identities that stand out and make an impact.'
        },
        {
            title: 'Digital Illustration',
            image: 'assets/images/content/card1.jpg',
            description: 'Bringing ideas to life through creative and expressive illustrations.'
        }
    ];

    // Create cards
    cardsData.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        
        cardEl.innerHTML = `
            <div class="card-content">
                <div class="card-header">
                    <h2>${card.title}</h2>
                </div>
                <div class="card-image">
                    <img src="${card.image}" alt="${card.title}">
                </div>
            </div>
        `;
        
        // Click functionality removed as per user request
        
        // Add description as data attribute
        cardEl.setAttribute('data-description', card.description);
        
        // Add hover events
        cardEl.addEventListener('mouseenter', (e) => {
            tooltip.textContent = card.description;
            tooltip.classList.add('visible');
        });
        
        cardEl.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            updateTooltipPosition();
        });
        
        cardEl.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
        
        cardStack.appendChild(cardEl);
    });

    function moveCardToFront(clickedIndex) {
        if (isAnimating) return;
        isAnimating = true;
    
        const cards = document.querySelectorAll('.card');
    
        // Step 1: Animate positions
        updateCardVisuals(clickedIndex);
    
        // Step 2: After animation, rotate order
        setTimeout(() => {
            // Rotate the array (first -> last)
            const first = cardsData.shift();
            cardsData.push(first);
    
            // Re-render order
            reorderCards(cardsData);
    
            isAnimating = false;
        }, 700); // matches transition
    }
    
    function updateCardVisuals(clickedIndex) {
        const cards = document.querySelectorAll('.card');
    
        cards.forEach((card, index) => {
            card.style.transition = 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease-out';
    
            if (index === clickedIndex) {
                // Card at index 1 should slide forward
                card.style.zIndex = cards.length + 1;
                card.style.transform = 'translateZ(0) rotateY(0deg) translateX(0)';
                card.style.opacity = 1;
            } else if (index === 0) {
                // First card (front) will move to back
                card.style.zIndex = 1;
                card.style.transform = `translateZ(-${30 * (cards.length - 1)}px) rotateY(${5 * (cards.length - 1)}deg) translateX(${15 * (cards.length - 1)}px)`;
                card.style.opacity = 0.6;
            } else {
                // Everything else shifts one step forward
                const pos = index - 1;
                card.style.zIndex = cards.length - index;
                card.style.transform = `translateZ(${-30 * pos}px) rotateY(${5 * pos}deg) translateX(${15 * pos}px)`;
                card.style.opacity = Math.max(0.6, 1 - 0.1 * pos);
            }
        });
    }
    
    
    function reorderCards(newOrder) {
        const cardStack = document.getElementById('cardStack');
        const cards = Array.from(cardStack.querySelectorAll('.card'));
        
        // Create a document fragment to hold the reordered cards
        const fragment = document.createDocumentFragment();
        
        // Add cards to fragment in the correct order
        newOrder.forEach(cardData => {
            const card = cards.find(c => c.querySelector('h2').textContent === cardData.title);
            if (card) {
                fragment.appendChild(card);
            }
        });
        
        // Clear and repopulate the container
        cardStack.innerHTML = '';
        cardStack.appendChild(fragment);
        
        // Reset transforms after reordering
        requestAnimationFrame(() => {
            const updatedCards = cardStack.querySelectorAll('.card');
            updatedCards.forEach((card, index) => {
                card.style.transition = 'none';
                if (index === 0) {
                    card.style.transform = 'translateZ(0) rotateY(0deg)';
                    card.style.opacity = 1;
                } else if (index === 1) {
                    card.style.transform = 'translateZ(-30px) rotateY(5deg) translateX(15px)';
                    card.style.opacity = 0.9;
                } else if (index === 2) {
                    card.style.transform = 'translateZ(-60px) rotateY(10deg) translateX(30px)';
                    card.style.opacity = 0.8;
                } else if (index === 3) {
                    card.style.transform = 'translateZ(-90px) rotateY(15deg) translateX(45px)';
                    card.style.opacity = 0.7;
                } else if (index === 4) {
                    card.style.transform = 'translateZ(-120px) rotateY(20deg) translateX(60px)';
                    card.style.opacity = 0.6;
                }
                // Force reflow
                void card.offsetHeight;
                // Re-enable transitions
                card.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out';
            });
        });
    }
    
    // Auto-rotate cards
    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            if (!isAnimating) {
                // Always move the next card (index 1) to the front
                // This will automatically cycle through all cards as we reorder them
                moveCardToFront(1);
            }
        }, 3000);
    }
    
    // Start auto-rotation
    startAutoRotate();
    
    // Pause auto-rotation on hover
    cardStack.addEventListener('mouseenter', () => {
        clearInterval(autoRotateInterval);
    });
    
    // Resume auto-rotation when mouse leaves
    cardStack.addEventListener('mouseleave', () => {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    });
}

// Initialize when the DOM is fully loaded
function initializeCardStack() {
    // Create tooltip element
    tooltip = document.createElement('div');
    tooltip.className = 'card-tooltip';
    document.body.appendChild(tooltip);
    
    // Initialize the card stack
    initCardStack();
}

// Initialize based on document state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCardStack);
} else {
    setTimeout(initializeCardStack, 0);
}

// Reinitialize when the about section comes into view
const aboutSection = document.querySelector('.aboutme-section');
if (aboutSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ensure cards are properly initialized and visible
                const cards = document.querySelectorAll('.card');
                if (cards.length > 0) {
                    cards.forEach(card => {
                        card.style.transition = 'none';
                        card.style.opacity = '1';
                        // Force reflow
                        void card.offsetHeight;
                        card.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out';
                    });
                }
            }
        });
    }, {
        threshold: 0.1 // Trigger when at least 10% of the section is visible
    });

    observer.observe(aboutSection);
}
