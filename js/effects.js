// Anime Effects & Particle System
class AnimeEffects {
    constructor() {
        this.particles = [];
        this.initParticles();
        this.initSakura();
        this.initHoverEffects();
    }
    
    initParticles() {
        const canvas = document.getElementById('particle-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.color = `rgba(124, 58, 237, ${Math.random() * 0.3})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle());
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    initSakura() {
        setInterval(() => {
            if (Math.random() > 0.7) {
                const sakura = document.createElement('div');
                sakura.className = 'sakura';
                sakura.style.left = Math.random() * window.innerWidth + 'px';
                sakura.style.width = sakura.style.height = Math.random() * 10 + 5 + 'px';
                document.body.appendChild(sakura);
                
                setTimeout(() => sakura.remove(), 8000);
            }
        }, 500);
    }
    
    initHoverEffects() {
        const cards = document.querySelectorAll('.stat-card, .chart-card, .activity-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                anime({
                    targets: card,
                    scale: 1.02,
                    duration: 300,
                    easing: 'easeOutElastic(1, .5)'
                });
            });
            
            card.addEventListener('mouseleave', (e) => {
                anime({
                    targets: card,
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
        
        // Glitch effect on logo
        const logo = document.querySelector('.logo-icon');
        if (logo) {
            setInterval(() => {
                if (Math.random() > 0.95) {
                    logo.classList.add('anime-glitch');
                    setTimeout(() => logo.classList.remove('anime-glitch'), 200);
                }
            }, 5000);
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-glass);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize effects
window.effects = new AnimeEffects();
