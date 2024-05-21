<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  // Define prop types
  interface Props {
    numExplosions: number;
    explosionSize: 'small' | 'big';
    colors: string[];
  }

  // Access props reactively
  const { numExplosions, explosionSize, colors }: Props = $props();

  interface Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    color: string;
    life: number;
  }

  let particles: Particle[] = [];
  const smallParticleCount = 50;
  const bigParticleCount = 200;
  let isVisible = false;

  function createParticle(x: number, y: number): Particle {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * (explosionSize === 'big' ? 7 : 4) + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      color,
      life: Math.random() * (explosionSize === 'big' ? 50 : 30) + 20
    };
  }

  function explode(x: number, y: number): void {
    const count = explosionSize === 'big' ? bigParticleCount : smallParticleCount;
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(x, y));
    }
  }

  function drawParticles(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.life--;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  function animate(): void {
    drawParticles();
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      isVisible = false;
      canvas.style.zIndex = '-1'; // Move canvas behind other elements
    }
  }

  onMount(() => {
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  onDestroy(() => {
    // Clear any ongoing animations if needed
  });

  export function triggerExplosions(): void {
    canvas.style.zIndex = '10'; // Move canvas in front of other elements
    for (let i = 0; i < 7; i++) {
      const x = i === 0 ? window.innerWidth / 2 : Math.random() * window.innerWidth;
      const y = i === 0 ? window.innerHeight / 2 : Math.random() * window.innerHeight;
      for (let j = 0; j < numExplosions; j++) {
        explode(x, y);
      }
    }
    isVisible = true;
    animate();
  }

  export function triggerExplosion(x: number, y: number): void {
      canvas.style.zIndex = '10'; // Move canvas in front of other elements
      for (let i = 0; i < numExplosions; i++) {
        explode(x, y);
      }
      isVisible = true;
      animate();
    }
</script>

<canvas bind:this={canvas} class:is-visible={isVisible}></canvas>

<style>
  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1; /* Ensure it starts behind everything */
    pointer-events: none; /* Prevent interactions */
  }
  canvas.is-visible {
    pointer-events: auto; /* Allow interactions when visible */
  }
</style>
