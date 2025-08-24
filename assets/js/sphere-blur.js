document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const BASE_FOLLOW_SPEED = 0.01; // Base speed for 3-second delay
    const IDLE_SPEED = 0.005; // Slower idle speed
    const MIN_DISTANCE = 300; // Minimum distance between spheres
    const SPHERE_RADIUS = 150; // Distance from cursor
    
    // Speed multipliers for each sphere (higher = faster)
    const SPEED_MULTIPLIERS = {
        'sphere-blur-2': 1.5,  // Cyan - fastest
        'sphere-blur-1': 1.0,  // Purple - medium
        'sphere-blur-3': 0.7   // Green - slowest
    };
    
    // Calculate initial angles for even distribution
    const SPHERE_COUNT = 3;
    const angleStep = (Math.PI * 2) / SPHERE_COUNT;
    
    // Get all sphere blur elements
    const spheres = [
        { 
            element: document.querySelector('.sphere-blur-1'), 
            angle: 0, // Will be set below
            baseX: 0,
            baseY: 0,
            x: 0,
            y: 0,
            randomX: 0,
            randomY: 0
        },
        {
            element: document.querySelector('.sphere-blur-2'),
            angle: angleStep,
            baseX: 0,
            baseY: 0,
            x: 0,
            y: 0,
            randomX: 0,
            randomY: 0
        },
        {
            element: document.querySelector('.sphere-blur-3'),
            angle: angleStep * 2,
            baseX: 0,
            baseY: 0,
            x: 0,
            y: 0,
            randomX: 0,
            randomY: 0
        }
    ];
    
    // Mouse tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let lastMoveTime = Date.now();
    let isMouseMoving = false;
    const MOUSE_STOPPED_DELAY = 1000; // 1 second of no movement
    
    // Initialize sphere positions randomly
    spheres.forEach(sphere => {
        if (sphere.element) {
            // Random position within viewport with minimum distance
            let x, y, isValid;
            let attempts = 0;
            const maxAttempts = 100;
            
            do {
                isValid = true;
                // Use viewport corners more aggressively
                const corner = Math.floor(Math.random() * 4);
                switch (corner) {
                    case 0: // Top-left
                        x = Math.random() * (window.innerWidth * 0.4);
                        y = Math.random() * (window.innerHeight * 0.4);
                        break;
                    case 1: // Top-right
                        x = (window.innerWidth * 0.6) + Math.random() * (window.innerWidth * 0.4);
                        y = Math.random() * (window.innerHeight * 0.4);
                        break;
                    case 2: // Bottom-left
                        x = Math.random() * (window.innerWidth * 0.4);
                        y = (window.innerHeight * 0.6) + Math.random() * (window.innerHeight * 0.4);
                        break;
                    case 3: // Bottom-right
                        x = (window.innerWidth * 0.6) + Math.random() * (window.innerWidth * 0.4);
                        y = (window.innerHeight * 0.6) + Math.random() * (window.innerHeight * 0.4);
                        break;
                }
                
                // Check distance from other spheres
                for (const other of spheres) {
                    if (other.x && other.y) {
                        const dx = x - other.x;
                        const dy = y - other.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < MIN_DISTANCE) {
                            isValid = false;
                            break;
                        }
                    }
                }
                attempts++;
            } while (!isValid && attempts < maxAttempts);
            
            sphere.x = x;
            sphere.y = y;
            sphere.randomX = (Math.random() - 0.5) * 800; // Much larger random offset
            sphere.randomY = (Math.random() - 0.5) * 800;
            
            sphere.element.style.position = 'fixed';
            sphere.element.style.left = sphere.x + 'px';
            sphere.element.style.top = sphere.y + 'px';
            sphere.element.style.transform = 'translate(-50%, -50%)';
        }
    });
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        lastMoveTime = Date.now();
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Check if mouse just started moving
        if (!isMouseMoving) {
            isMouseMoving = true;
        }
        
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    });
    
    // Check if mouse is idle
    function checkMouseIdle() {
        const now = Date.now();
        const wasMoving = isMouseMoving;
        
        if (now - lastMoveTime > MOUSE_STOPPED_DELAY) {
            isMouseMoving = false;
        } else {
            isMouseMoving = true;
        }
        
        // Only request next frame if something changed
        if (wasMoving !== isMouseMoving || isMouseMoving) {
            requestAnimationFrame(checkMouseIdle);
        } else {
            // If we're idle, check again in 100ms
            setTimeout(checkMouseIdle, 100);
        }
    }
    checkMouseIdle();
    
    // Optimized animation loop
    let lastFrameTime = performance.now();
    let deltaTime = 0;
    let time = 0;
    // Animation loop
    function animate(timestamp) {
        requestAnimationFrame(animate);
        
        const currentTime = performance.now();
        isMouseMoving = (currentTime - lastMoveTime) < MOUSE_STOPPED_DELAY;
        
        // Throttle the animation frame rate
        const elapsed = currentTime - lastFrameTime;
        const targetElapsed = 1000 / 30; // Target 30fps for smoother performance
        
        if (elapsed < targetElapsed) {
            return; // Skip frame to maintain performance
        }
        lastFrameTime = currentTime;
        
        // Update each sphere
        spheres.forEach(sphere => {
            if (!sphere.element) return;
            
            let targetX, targetY;
            
            if (isMouseMoving) {
                // Calculate position in a circle around cursor
                const time = Date.now() * 0.001;
                const radius = SPHERE_RADIUS * (0.9 + Math.sin(time * 0.5 + sphere.angle * 10) * 0.1);
                const angle = sphere.angle + (Math.sin(time * 0.3) * 0.2);
                
                targetX = mouseX + Math.cos(angle) * radius;
                targetY = mouseY + Math.sin(angle) * radius;
            } else {
                // Idle movement - larger random wandering
                if (Math.random() < 0.01) {
                    sphere.randomX = (Math.random() - 0.5) * 1000; // Much larger random movement
                    sphere.randomY = (Math.random() - 0.5) * 1000;
                }
                // Move in a larger circle when idle
                const time = Date.now() * 0.0005;
                const radius = SPHERE_RADIUS * 2 * (0.8 + Math.sin(time + sphere.angle * 10) * 0.2);
                targetX = lastMouseX + Math.cos(time + sphere.angle) * radius;
                targetY = lastMouseY + Math.sin(time + sphere.angle) * radius;
            }
            
            // Move towards target with easing for smoother motion
            const baseSpeed = isMouseMoving ? BASE_FOLLOW_SPEED : IDLE_SPEED;
            const speedMultiplier = SPEED_MULTIPLIERS[sphere.element.className.split(' ').find(cls => cls.startsWith('sphere-blur-'))] || 1;
            const speed = baseSpeed * speedMultiplier;
            
            const dx = targetX - sphere.x;
            const dy = targetY - sphere.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply easing based on distance
            const ease = distance > 5 ? speed : (distance * speed) / 5;
            
            sphere.x += dx * ease;
            sphere.y += dy * ease;
            
            // Update position
            sphere.element.style.left = sphere.x + 'px';
            sphere.element.style.top = sphere.y + 'px';
        });
    }
    
    // Start animation
    animate();
    
    // Handle window resize
    function handleResize() {
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
    }
    
    window.addEventListener('resize', handleResize);
});
