"use client";
import { useEffect, useRef } from "react";

export function SlimeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Slime blob properties with dripping effect
    class SlimeBlob {
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      vx: number;
      vy: number;
      points: { angle: number; offset: number; speed: number; drip: number }[];
      color: string;
      dripTime: number;
      trail: { x: number; y: number; radius: number; opacity: number }[];

      constructor(x: number, y: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8; // Free movement in all directions
        this.color = color;
        this.dripTime = 0;
        this.trail = [];
        
        // Create wobbly points with dripping capability
        this.points = [];
        const numPoints = 12;
        for (let i = 0; i < numPoints; i++) {
          this.points.push({
            angle: (i / numPoints) * Math.PI * 2,
            offset: Math.random() * 30,
            speed: 0.015 + Math.random() * 0.025,
            drip: 0,
          });
        }
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off all edges
        if (this.x - this.radius < 0 || this.x + this.radius > width) {
          this.vx *= -1;
          this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));
        }
        
        if (this.y - this.radius < 0 || this.y + this.radius > height) {
          this.vy *= -1;
          this.y = Math.max(this.radius, Math.min(height - this.radius, this.y));
        }

        // Add trail effect
        if (Math.random() > 0.7) {
          this.trail.push({
            x: this.x,
            y: this.y,
            radius: this.radius * 0.3,
            opacity: 0.6,
          });
        }

        // Update and fade trail
        this.trail = this.trail.filter((drop) => {
          drop.y += 2;
          drop.opacity -= 0.02;
          return drop.opacity > 0;
        });

        // Update wobbly points with dripping animation
        this.dripTime += 0.05;
        this.points.forEach((point, i) => {
          point.angle += point.speed;
          
          // Create drip effect on bottom points
          const bottomBias = Math.sin(point.angle + this.dripTime) * 0.5 + 0.5;
          point.drip = Math.sin(this.dripTime + i * 0.5) * 15 * bottomBias;
          point.offset = Math.sin(point.angle) * 25 + point.drip;
        });
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Draw trail drops
        this.trail.forEach((drop) => {
          const gradient = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.radius);
          gradient.addColorStop(0, this.color + Math.floor(drop.opacity * 128).toString(16).padStart(2, '0'));
          gradient.addColorStop(1, this.color + "00");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw main blob with stretchy slime effect
        ctx.beginPath();
        
        this.points.forEach((point, i) => {
          const angle = (i / this.points.length) * Math.PI * 2;
          const nextAngle = ((i + 1) / this.points.length) * Math.PI * 2;
          const nextPoint = this.points[(i + 1) % this.points.length];
          
          const x = this.x + Math.cos(angle) * (this.radius + point.offset);
          const y = this.y + Math.sin(angle) * (this.radius + point.offset);
          
          const nextX = this.x + Math.cos(nextAngle) * (this.radius + nextPoint.offset);
          const nextY = this.y + Math.sin(nextAngle) * (this.radius + nextPoint.offset);
          
          if (i === 0) {
            ctx.moveTo(x, y);
          }
          
          // More organic curves for slime-like appearance
          const cpX = this.x + Math.cos(angle + Math.PI / this.points.length) * (this.radius + (point.offset + nextPoint.offset) / 2 + point.drip);
          const cpY = this.y + Math.sin(angle + Math.PI / this.points.length) * (this.radius + (point.offset + nextPoint.offset) / 2 + point.drip);
          
          ctx.quadraticCurveTo(cpX, cpY, nextX, nextY);
        });
        
        ctx.closePath();
        
        // Gradient fill with stronger center
        const gradient = ctx.createRadialGradient(
          this.x, 
          this.y - this.radius * 0.3, 
          0, 
          this.x, 
          this.y, 
          this.radius * 1.5
        );
        gradient.addColorStop(0, this.color + "CC");
        gradient.addColorStop(0.5, this.color + "66");
        gradient.addColorStop(1, this.color + "00");
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add glossy highlight
        ctx.beginPath();
        ctx.ellipse(
          this.x - this.radius * 0.2,
          this.y - this.radius * 0.3,
          this.radius * 0.4,
          this.radius * 0.25,
          0,
          0,
          Math.PI * 2
        );
        const highlight = ctx.createRadialGradient(
          this.x - this.radius * 0.2,
          this.y - this.radius * 0.3,
          0,
          this.x - this.radius * 0.2,
          this.y - this.radius * 0.3,
          this.radius * 0.4
        );
        highlight.addColorStop(0, "rgba(255, 255, 255, 0.3)");
        highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = highlight;
        ctx.fill();
      }
    }

    // Create slime blobs spread across the canvas
    const blobs: SlimeBlob[] = [];
    const numBlobs = 15;
    
    for (let i = 0; i < numBlobs; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = 60 + Math.random() * 80;
      const colors = ["#8BF500", "#7CE400", "#6DD400", "#9EFF00"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      blobs.push(new SlimeBlob(x, y, radius, color));
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      blobs.forEach((blob) => {
        blob.update(canvas.width, canvas.height);
        blob.draw(ctx);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
