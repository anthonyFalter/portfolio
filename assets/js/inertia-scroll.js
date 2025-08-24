// Inertia/Momentum Scrolling Implementation
class InertiaScroll {
    constructor() {
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.ease = 0.03; // Lower = smoother, higher = more responsive
        this.isScrolling = false;
        this.wheelTimeout = null;
        
        this.init();
    }
    
    init() {
        // Enable CSS smooth scrolling for webkit
        document.documentElement.style.cssText = `
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
        `;
        
        // Bind events
        this.bindEvents();
        
        // Start animation loop
        this.animate();
        
        console.log('Inertia scrolling initialized');
    }
    
    bindEvents() {
        // Handle wheel events
        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
        
        // Handle touch events for mobile
        window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
        window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        window.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: true });
        
        // Handle resize
        window.addEventListener('resize', this.onResize.bind(this));
        
        // Initialize scroll position
        this.scrollY = window.pageYOffset;
        this.targetScrollY = this.scrollY;
    }
    
    onWheel(e) {
        e.preventDefault();
        
        // Clear existing timeout
        if (this.wheelTimeout) {
            clearTimeout(this.wheelTimeout);
        }
        
        // Calculate scroll delta
        const delta = e.deltaY * 0.5; // Adjust sensitivity
        
        // Update target scroll position
        this.targetScrollY += delta;
        this.targetScrollY = Math.max(0, Math.min(this.targetScrollY, this.getMaxScroll()));
        
        this.isScrolling = true;
        
        // Set timeout to stop scrolling
        this.wheelTimeout = setTimeout(() => {
            this.isScrolling = false;
        }, 150);
    }
    
    onTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartScrollY = this.targetScrollY;
        this.isScrolling = true;
    }
    
    onTouchMove(e) {
        if (!this.touchStartY) return;
        
        e.preventDefault();
        
        const touchY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;
        
        this.targetScrollY = this.touchStartScrollY + deltaY * 2; // Adjust sensitivity
        this.targetScrollY = Math.max(0, Math.min(this.targetScrollY, this.getMaxScroll()));
    }
    
    onTouchEnd() {
        this.touchStartY = null;
        this.touchStartScrollY = null;
        
        setTimeout(() => {
            this.isScrolling = false;
        }, 100);
    }
    
    onResize() {
        this.targetScrollY = Math.max(0, Math.min(this.targetScrollY, this.getMaxScroll()));
    }
    
    getMaxScroll() {
        return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }
    
    animate() {
        // Apply easing to scroll position
        const diff = this.targetScrollY - this.scrollY;
        
        if (Math.abs(diff) > 0.1) {
            this.scrollY += diff * this.ease;
            window.scrollTo(0, this.scrollY);
        } else if (!this.isScrolling) {
            // Snap to target when very close and not actively scrolling
            this.scrollY = this.targetScrollY;
            window.scrollTo(0, this.scrollY);
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Public method to scroll to a position
    scrollTo(targetY, duration = 1000) {
        const startY = this.targetScrollY;
        const distance = targetY - startY;
        const startTime = performance.now();
        
        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
            
            this.targetScrollY = startY + distance * easeProgress;
            this.targetScrollY = Math.max(0, Math.min(this.targetScrollY, this.getMaxScroll()));
            
            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        requestAnimationFrame(animateScroll);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not on mobile (to avoid conflicts with native scrolling)
    if (window.innerWidth > 768) {
        window.inertiaScroll = new InertiaScroll();
        
        // Handle anchor links
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a[href^="#"]');
            if (target && target.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const targetPosition = targetElement.offsetTop - 80;
                    window.inertiaScroll.scrollTo(targetPosition, 1200);
                }
            }
        });
    }
});
