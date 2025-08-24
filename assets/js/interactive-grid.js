console.log('Interactive grid script loaded - FIXED VERSION');

class InteractiveGrid {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.cells = [];
    this.cellSize = 40; // Slightly larger cells for better visibility
    this.mouse = { x: 0, y: 0 };
    this.radius = 150;

    this.init();
  }

  init() {
    this.createCanvas();
    this.setupEventListeners();
    this.animate();
    console.log('Interactive grid initialized');
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    // Set canvas styles
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '9999';
    this.canvas.style.opacity = '1';
    this.canvas.style.backgroundColor = 'transparent'; // Transparent background
    this.canvas.style.pointerEvents = 'none'; // Allow clicks through

    // Immediately mark canvas to prevent duplicates
    this.canvas.setAttribute('data-grid-initialized', 'true');

    // Add to container
    this.container.prepend(this.canvas);

    this.resize();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  resize() {
    // Get device pixel ratio
    const dpr = window.devicePixelRatio || 1;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Set canvas resolution in device pixels
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    // Scale CSS back down
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';

    // Reset transform before scaling
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.initGrid();
  }

  initGrid() {
    this.cells = [];
    const cols = Math.ceil(this.width / this.cellSize) + 1;
    const rows = Math.ceil(this.height / this.cellSize) + 1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.cells.push({
          x: x * this.cellSize,
          y: y * this.cellSize,
          originalX: x * this.cellSize,
          originalY: y * this.cellSize,
          vx: 0,
          vy: 0,
        });
      }
    }
  }

  update() {
    for (const cell of this.cells) {
      const dx = this.mouse.x - cell.x;
      const dy = this.mouse.y - cell.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (1 - distance / this.radius) * 0.8;

        cell.vx += Math.cos(angle) * force;
        cell.vy += Math.sin(angle) * force;
      }

      // Spring back
      cell.vx += (cell.originalX - cell.x) * 0.05;
      cell.vy += (cell.originalY - cell.y) * 0.05;

      // Friction
      cell.vx *= 0.9;
      cell.vy *= 0.9;

      // Update pos
      cell.x += cell.vx;
      cell.y += cell.vy;
    }
  }

  draw() {
    // Clear screen with transparency
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Line style - subtle white with low opacity
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    this.ctx.lineWidth = 1;

    const cols = Math.ceil(this.width / this.cellSize) + 1;

    // Horizontal lines
    this.ctx.beginPath();
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      const nextCell = this.cells[i + 1];

      if (nextCell && (i % cols !== cols - 1)) {
        this.ctx.moveTo(cell.x, cell.y);
        this.ctx.lineTo(nextCell.x, nextCell.y);
      }
    }
    this.ctx.stroke();

    // Vertical lines
    this.ctx.beginPath();
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      const nextRowIndex = i + cols;

      if (nextRowIndex < this.cells.length) {
        const nextRowCell = this.cells[nextRowIndex];
        if (nextRowCell) {
          this.ctx.moveTo(cell.x, cell.y);
          this.ctx.lineTo(nextRowCell.x, nextRowCell.y);
        }
      }
    }
    this.ctx.stroke();
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Run only once
if (!window.interactiveGridInitialized) {
  window.interactiveGridInitialized = true;

  // Remove any old grids
  const existingCanvases = document.querySelectorAll('canvas[data-grid-initialized]');
  existingCanvases.forEach((canvas) => {
    console.log('Removing duplicate canvas');
    canvas.remove();
  });

  // Wait for DOM
  function initGrid() {
    const container = document.querySelector('.background-section-container');
    if (!container) {
      console.error('Background container not found');
      return;
    }

    new InteractiveGrid(container);
    console.log('Grid initialized successfully');
    window.dispatchEvent(new Event('resize'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrid);
  } else {
    initGrid();
  }
}
