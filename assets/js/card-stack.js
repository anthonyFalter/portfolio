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

    // Card data with support for both images and videos
    const cardsData = [
        {
            title: 'In 2014...',
            type: 'video',
            videoUrl: 'assets/images/cardstory/firstGameSample.mp4',
            description: 'The year I learned to program a game at the age of 9 because I was curious of how games work.'
        },
        {
            title: 'In 2020...',    
            type: 'video',
            videoUrl: 'assets/images/cardstory/timelapseBrandingMMJC.mp4',
            description: 'I started offering my graphics design skills as a service to clients.'
        },
        {
            title: 'In 2024...',
            type: 'image',
            imageUrl: 'assets/images/cardstory/MMJCCARD.png',
            description: 'Attended tech camps to further deepen my knowledge on the tech industry.'
        },
        {
            title: 'Present',
            type: 'image',
            imageUrl: 'assets/images/cardstory/MMJCCARD.png',
            description: 'Currently exploring things that will help me develop my skills in the tech industry.'
        }
    ];

    // Initialize card stack with proper z-index and transforms
    function initializeCardStack() {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.transition = 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out';
            if (index === 0) {
                // Front card
                card.style.zIndex = cards.length + 1;
                card.style.transform = 'translateZ(0) rotateY(0deg) translateX(0)';
                card.style.opacity = 1;
            } else {
                // Other cards in the stack
                card.style.zIndex = cards.length - index;
                card.style.transform = `translateZ(${-30 * index}px) rotateY(${5 * index}deg) translateX(${15 * index}px)`;
                card.style.opacity = Math.max(0.6, 1 - 0.1 * index);
            }
        });
    }

    // Create cards
    cardsData.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        
        // Create card content based on type (video or image)
        let mediaContent = '';
        if (card.type === 'video') {
            mediaContent = `
                <div class="card-video">
                    <div class="video-background">
                        <video autoplay muted loop playsinline>
                            <source src="${card.videoUrl}" type="video/mp4">
                        </video>
                    </div>
                    <div class="video-foreground">
                        <video autoplay muted loop playsinline>
                            <source src="${card.videoUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>`;
        } else if (card.type === 'image' && card.imageUrl) {
            mediaContent = `
                <div class="card-video">
                    <img src="${card.imageUrl}" alt="${card.title}" class="card-image" loading="lazy">
                </div>`;
        }
        
        cardEl.innerHTML = `
            <div class="card-content">
                <div class="card-header">
                    <h2>${card.title}</h2>
                </div>
                ${mediaContent}
            </div>
        `;
        
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
    
    // Initialize card stack positions
    initializeCardStack();

    function moveCardToFront() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Get all cards
        const cards = Array.from(document.querySelectorAll('.card'));
        if (cards.length === 0) {
            isAnimating = false;
            return;
        }
        
        // Move the first card to the end of the array
        const firstCard = cards.shift();
        cards.push(firstCard);
        
        // Update z-index and transform for smooth animation
        cards.forEach((card, index) => {
            card.style.zIndex = cards.length - index;
            if (index === 0) {
                // New front card
                card.style.transform = 'translateZ(0) rotateY(0deg) translateX(0)';
                card.style.opacity = 1;
            } else {
                // Other cards
                card.style.transform = `translateZ(${-30 * index}px) rotateY(${5 * index}deg) translateX(${15 * index}px)`;
                card.style.opacity = Math.max(0.6, 1 - 0.1 * index);
            }
        });
        
        // Reorder the DOM after animation completes
        setTimeout(() => {
            cards.forEach(card => cardStack.appendChild(card));
            isAnimating = false;
        }, 700); // Match this with CSS transition duration
    }
    
    function updateCardVisuals() {
        const cards = document.querySelectorAll('.card');
    
        cards.forEach((card, index) => {
            card.style.transition = 'transform 0.7s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease-out';
            
            if (index === 0) {
                // Front card
                card.style.zIndex = cards.length + 1;
                card.style.transform = 'translateZ(0) rotateY(0deg) translateX(0)';
                card.style.opacity = 1;
            } else {
                // Other cards in the stack
                card.style.zIndex = cards.length - index;
                card.style.transform = `translateZ(${-30 * index}px) rotateY(${5 * index}deg) translateX(${15 * index}px)`;
                card.style.opacity = Math.max(0.6, 1 - 0.1 * index);
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
        // Clear any existing interval to prevent duplicates
        if (window.cardStackRotationInterval) {
            clearInterval(window.cardStackRotationInterval);
        }
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
        
        // Use a single global interval for card rotation
        window.cardStackRotationInterval = setInterval(() => {
            if (!isAnimating) {
                // Move the next card to the front
                moveCardToFront(1);
            }
        }, 6000); // 6 seconds
    }
    
    // Start auto-rotation
    startAutoRotate();
    
    // Pause auto-rotation on hover
    cardStack.addEventListener('mouseenter', () => {
        if (window.cardStackRotationInterval) {
            clearInterval(window.cardStackRotationInterval);
        }
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
    });
    
    // Resume auto-rotation when mouse leaves
    cardStack.addEventListener('mouseleave', () => {
        if (window.cardStackRotationInterval) {
            clearInterval(window.cardStackRotationInterval);
        }
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
        }
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
