import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particle colors matching the theme - brighter and more distinct
    const colors = [
      'rgba(139, 92, 246, 0.8)', // purple-500 - brighter
      'rgba(236, 72, 153, 0.8)',  // pink-500 - brighter
      'rgba(59, 130, 246, 0.8)',  // blue-500 - brighter
      'rgba(168, 85, 247, 0.7)',  // purple-400 - brighter
      'rgba(244, 114, 182, 0.7)', // pink-400 - brighter
      'rgba(192, 132, 252, 0.75)', // purple-300
      'rgba(249, 168, 212, 0.75)', // pink-300
    ];

    // Helper function to create particles
    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 6000);
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 3 + 2.5, // Larger particles (2.5-5.5 instead of 1-3)
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Recreate particles on resize
      createParticles();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Add glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color.replace('0.8', '0.4').replace('0.7', '0.3').replace('0.75', '0.35'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add bright center
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace('0.8', '1').replace('0.7', '0.9').replace('0.75', '0.95');
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            const opacity = 0.4 * (1 - distance / 150); // More visible connections
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 1; // Thicker lines
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticleBackground;
