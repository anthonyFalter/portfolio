class GlitchText {
    constructor(element, options = {}) {
        this.element = element;
        this.originalText = element.textContent;
        this.glitchDuration = options.duration || 2000; // ms
        this.glitchInterval = options.interval || 3000; // ms
        this.glitchActive = false;
        this.glitchTimer = null;
        
        // Add required styles
        this.addStyles();
        
        // Initialize the glitch effect
        this.init();
    }
    
    addStyles() {
        if (document.getElementById('glitch-text-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'glitch-text-styles';
        style.textContent = `
            .glitch-text {
                position: relative;
                display: inline-block;
                line-height: 1;
                padding: 0;
                margin: 0;
                vertical-align: baseline;
                transform: translateY(0);
            }
            
            .glitch-text::before,
            .glitch-text::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: inherit;
                color: inherit;
                opacity: 0.8;
                overflow: hidden;
                pointer-events: none;
                white-space: nowrap;
                transform: translateZ(0);
            }
            
            .glitch-text::before {
                left: 2px;
                text-shadow: -2px 0 #ff00ff;
                clip: rect(0, 450px, 60px, 0);
                animation: glitch-anim-1 2s infinite linear alternate-reverse;
            }
            
            .glitch-text::after {
                left: -2px;
                text-shadow: -2px 0 #00ffff, 2px 2px #ff00ff;
                clip: rect(44px, 450px, 56px, 0);
                animation: glitch-anim-2 2s infinite linear alternate-reverse;
            }
            
            @keyframes glitch-anim-1 {
                0% { clip: rect(32px, 9999px, 54px, 0); }
                10% { clip: rect(13px, 9999px, 76px, 0); }
                20% { clip: rect(54px, 9999px, 17px, 0); }
                30% { clip: rect(23px, 9999px, 89px, 0); }
                40% { clip: rect(76px, 9999px, 34px, 0); }
                50% { clip: rect(5px, 9999px, 67px, 0); }
                60% { clip: rect(45px, 9999px, 12px, 0); }
                70% { clip: rect(87px, 9999px, 32px, 0); }
                80% { clip: rect(12px, 9999px, 98px, 0); }
                90% { clip: rect(34px, 9999px, 56px, 0); }
                100% { clip: rect(67px, 9999px, 23px, 0); }
            }
            
            @keyframes glitch-anim-2 {
                0% { clip: rect(54px, 9999px, 32px, 0); }
                10% { clip: rect(76px, 9999px, 13px, 0); }
                20% { clip: rect(17px, 9999px, 54px, 0); }
                30% { clip: rect(89px, 9999px, 23px, 0); }
                40% { clip: rect(34px, 9999px, 76px, 0); }
                50% { clip: rect(67px, 9999px, 5px, 0); }
                60% { clip: rect(12px, 9999px, 45px, 0); }
                70% { clip: rect(32px, 9999px, 87px, 0); }
                80% { clip: rect(98px, 9999px, 12px, 0); }
                90% { clip: rect(56px, 9999px, 34px, 0); }
                100% { clip: rect(23px, 9999px, 67px, 0); }
            }
            
            @keyframes glitch-anim-3 {
                0% { clip: rect(65px, 9999px, 43px, 0); }
                5% { clip: rect(29px, 9999px, 87px, 0); }
                10% { clip: rect(43px, 9999px, 12px, 0); }
                15% { clip: rect(78px, 9999px, 34px, 0); }
                20% { clip: rect(21px, 9999px, 56px, 0); }
                25% { clip: rect(87px, 9999px, 43px, 0); }
                30% { clip: rect(12px, 9999px, 76px, 0); }
                35% { clip: rect(54px, 9999px, 98px, 0); }
                40% { clip: rect(32px, 9999px, 21px, 0); }
                45% { clip: rect(76px, 9999px, 54px, 0); }
                50% { clip: rect(5px, 9999px, 32px, 0); }
                55% { clip: rect(43px, 9999px, 76px, 0); }
                60% { clip: rect(12px, 9999px, 54px, 0); }
                65% { clip: rect(87px, 9999px, 32px, 0); }
                70% { clip: rect(21px, 9999px, 76px, 0); }
                75% { clip: rect(54px, 9999px, 43px, 0); }
                80% { clip: rect(32px, 9999px, 98px, 0); }
                85% { clip: rect(76px, 9999px, 21px, 0); }
                90% { clip: rect(43px, 9999px, 87px, 0); }
                95% { clip: rect(12px, 9999px, 34px, 0); }
                100% { clip: rect(65px, 9999px, 54px, 0); }
            }
            
            @keyframes glitch-anim-4 {
                0% { clip: rect(31px, 9999px, 94px, 0); }
                10% { clip: rect(112px, 9999px, 76px, 0); }
                20% { clip: rect(85px, 9999px, 98px, 0); }
                30% { clip: rect(27px, 9999px, 112px, 0); }
                40% { clip: rect(64px, 9999px, 41px, 0); }
                50% { clip: rect(107px, 9999px, 13px, 0); }
                60% { clip: rect(46px, 9999px, 85px, 0); }
                70% { clip: rect(98px, 9999px, 23px, 0); }
                80% { clip: rect(14px, 9999px, 68px, 0); }
                90% { clip: rect(75px, 9999px, 102px, 0); }
                100% { clip: rect(23px, 9999px, 36px, 0); }
            }
            
            @keyframes glitch-anim-5 {
                0% { clip: rect(33px, 9999px, 85px, 0); }
                15% { clip: rect(12px, 9999px, 16px, 0); }
                30% { clip: rect(65px, 9999px, 52px, 0); }
                45% { clip: rect(28px, 9999px, 37px, 0); }
                60% { clip: rect(42px, 9999px, 23px, 0); }
                75% { clip: rect(15px, 9999px, 85px, 0); }
                85% { clip: rect(23px, 9999px, 48px, 0); }
                95% { clip: rect(75px, 9999px, 5px, 0); }
                100% { clip: rect(42px, 9999px, 31px, 0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    init() {
        // Add the glitch-text class to the element
        this.element.classList.add('glitch-text');
        
        // Set the data-text attribute for the glitch effect
        this.element.setAttribute('data-text', this.originalText);
        
        // Start the glitch effect
        this.startGlitch();
    }
    
    startGlitch() {
        if (this.glitchActive) return;
        
        this.glitchActive = true;
        this.glitchTimer = setInterval(() => {
            this.triggerGlitch();
        }, this.glitchInterval);
    }
    
    triggerGlitch() {
        if (!this.glitchActive) return;
        
        // Add glitch class
        this.element.classList.add('glitch');
        
        // Remove glitch class after duration
        setTimeout(() => {
            this.element.classList.remove('glitch');
        }, this.glitchDuration);
    }
    
    stopGlitch() {
        if (!this.glitchActive) return;
        
        clearInterval(this.glitchTimer);
        this.glitchActive = false;
        this.element.classList.remove('glitch');
    }
    
    destroy() {
        this.stopGlitch();
        this.element.classList.remove('glitch-text');
        this.element.removeAttribute('data-text');
    }
}

// Initialize glitch effect on elements with data-glitch attribute
document.addEventListener('DOMContentLoaded', () => {
    const glitchElements = document.querySelectorAll('[data-glitch]');
    glitchElements.forEach(element => {
        const options = {
            duration: element.dataset.glitchDuration ? parseInt(element.dataset.glitchDuration) : 2000,
            interval: element.dataset.glitchInterval ? parseInt(element.dataset.glitchInterval) : 3000
        };
        new GlitchText(element, options);
    });
});
