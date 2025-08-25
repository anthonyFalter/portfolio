// Initialize the card stack
function initCardStack() {
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
        
        cardEl.addEventListener('click', () => {
            if (!isAnimating) {
                moveCardToFront(index);
            }
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

// Initialize the card stack when the page loads
document.addEventListener('DOMContentLoaded', initCardStack);
