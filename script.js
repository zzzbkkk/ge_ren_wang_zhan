// 粒子背景动画
class Particle {
    constructor(canvas, x, y) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = Math.random() > 0.5 ? '#8a2be2' : '#4169e1';
        this.alpha = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检测
        if (this.x < 0 || this.x > this.canvas.width) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.speedY *= -1;
        }
    }
    
    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
    
    connect(particles) {
        particles.forEach(particle => {
            const dx = this.x - particle.x;
            const dy = this.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.ctx.save();
                this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                this.ctx.strokeStyle = `rgba(138, 43, 226, ${(100 - distance) / 100 * 0.3})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.beginPath();
                this.ctx.moveTo(this.x, this.y);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.stroke();
                this.ctx.restore();
            }
        });
    }
}

// 粒子系统
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.init();
    }
    
    init() {
        const particleCount = Math.floor(this.canvas.width * this.canvas.height / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.particles.push(new Particle(this.canvas, x, y));
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
            particle.connect(this.particles);
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.particles = [];
        this.init();
    }
    
    // 添加粒子效果
    addParticleEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = new Particle(this.canvas, x, y);
            particle.speedX = (Math.random() - 0.5) * 3;
            particle.speedY = (Math.random() - 0.5) * 3;
            particle.size = Math.random() * 3 + 1;
            particle.alpha = 1;
            this.particles.push(particle);
            
            // 自动移除粒子
            setTimeout(() => {
                const index = this.particles.indexOf(particle);
                if (index > -1) {
                    this.particles.splice(index, 1);
                }
            }, 2000);
        }
    }
}

// 水波纹效果
function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 中英文切换功能
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const langBtns = document.querySelectorAll('.lang-btn');
    
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有激活状态
            langBtns.forEach(b => b.classList.remove('active'));
            // 添加当前激活状态
            btn.classList.add('active');
            
            // 切换语言
            if (btn.textContent === 'EN') {
                document.body.classList.add('en');
            } else {
                document.body.classList.remove('en');
            }
        });
    });
}

// 回到顶部功能
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 导航链接平滑滚动
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 粒子效果绑定到交互元素
function bindParticleEffects(particleSystem) {
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .social-link, .project-card, .tag');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            // 创建水波纹效果
            createRippleEffect(element, e);
            
            // 添加粒子效果
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            particleSystem.addParticleEffect(x, y);
        });
    });
}

// 初始化所有功能
function init() {
    // 初始化粒子系统
    const canvas = document.getElementById('particleCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particleSystem = new ParticleSystem(canvas);
    particleSystem.animate();
    
    // 窗口大小调整
    window.addEventListener('resize', () => {
        particleSystem.resize();
    });
    
    // 初始化各功能模块
    initLanguageToggle();
    initBackToTop();
    initSmoothScroll();
    bindParticleEffects(particleSystem);
    initRadarParticleEffect();
    initResumeDownload();
    
    // 页面加载完成后的动画效果
    window.addEventListener('load', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 文字粒子化效果
class TextParticle {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.color = color;
        this.size = size;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4;
        this.alpha = 1;
        this.targetX = x + (Math.random() - 0.5) * 100;
        this.targetY = y + (Math.random() - 0.5) * 100;
        this.phase = 0; // 0: 初始状态, 1: 扩散中, 2: 重组中
        this.life = Math.random() * 0.5 + 0.5;
        this.maxLife = this.life;
    }
    
    update() {
        if (this.phase === 1) {
            // 扩散阶段
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.02;
            
            if (this.life <= 0) {
                this.phase = 2;
                this.life = this.maxLife;
            }
        } else if (this.phase === 2) {
            // 重组阶段
            const dx = this.originalX - this.x;
            const dy = this.originalY - this.y;
            this.x += dx * 0.1;
            this.y += dy * 0.1;
            this.life -= 0.02;
        }
        
        this.alpha = this.life / this.maxLife;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    startExplosion() {
        this.phase = 1;
    }
}

// 文字粒子化管理器
class TextParticleManager {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isAnimating = false;
        this.originalText = '';
        this.targetElement = null;
    }
    
    init(element) {
        this.targetElement = element;
        this.originalText = element.textContent;
        
        // 设置canvas样式
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10';
        
        // 获取元素位置和尺寸
        const rect = element.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // 将canvas添加到元素父容器
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(this.canvas);
        
        // 生成粒子
        this.generateParticles(element.textContent);
    }
    
    generateParticles(text) {
        this.ctx.font = window.getComputedStyle(this.targetElement).font;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        // 清空粒子数组
        this.particles = [];
        
        // 绘制文字到canvas
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(text, 0, 0);
        
        // 获取像素数据
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // 遍历像素生成粒子
        for (let y = 0; y < this.canvas.height; y += 4) {
            for (let x = 0; x < this.canvas.width; x += 4) {
                const index = (y * this.canvas.width + x) * 4;
                const alpha = data[index + 3];
                
                if (alpha > 128) {
                    const particle = new TextParticle(
                        x,
                        y,
                        '#8a2be2',
                        Math.random() * 2 + 1
                    );
                    this.particles.push(particle);
                }
            }
        }
        
        // 清空canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        let allDone = true;
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
            if (particle.phase !== 0) {
                allDone = false;
            }
        });
        
        if (allDone) {
            this.isAnimating = false;
            this.targetElement.style.opacity = '1';
        } else {
            requestAnimationFrame(() => this.animate());
        }
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.targetElement.style.opacity = '0';
        
        // 开始所有粒子的扩散
        this.particles.forEach(particle => {
            particle.startExplosion();
        });
        
        this.animate();
    }
    
    destroy() {
        if (this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

// 绘制雷达图
function drawRadarChart() {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 50;
    
    // 能力数据
    const abilities = [
        { name: 'AI产品设计', value: 8, nameEn: 'AI Product Design' },
        { name: '需求挖掘', value: 9, nameEn: 'Requirements Mining' },
        { name: '数据驱动', value: 7, nameEn: 'Data Driven' },
        { name: '技术认知', value: 8, nameEn: 'Technical Cognition' },
        { name: '业务分析', value: 8, nameEn: 'Business Analysis' },
        { name: '项目管理', value: 7, nameEn: 'Project Management' }
    ];
    
    const numAbilities = abilities.length;
    const angleStep = (Math.PI * 2) / numAbilities;
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制网格线
    ctx.strokeStyle = 'rgba(138, 43, 226, 0.3)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 10; i++) {
        const currentRadius = (radius / 10) * i;
        ctx.beginPath();
        for (let j = 0; j < numAbilities; j++) {
            const angle = j * angleStep - Math.PI / 2;
            const x = centerX + Math.cos(angle) * currentRadius;
            const y = centerY + Math.sin(angle) * currentRadius;
            
            if (j === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // 绘制轴线
    for (let i = 0; i < numAbilities; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 绘制能力名称
        ctx.fillStyle = '#fff';
        ctx.font = '14px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textX = centerX + Math.cos(angle) * (radius + 20);
        const textY = centerY + Math.sin(angle) * (radius + 20);
        
        // 根据当前语言显示对应文本
        const isZh = !document.body.classList.contains('en');
        const text = isZh ? abilities[i].name : abilities[i].nameEn;
        ctx.fillText(text, textX, textY);
    }
    
    // 绘制能力值区域
    ctx.fillStyle = 'rgba(138, 43, 226, 0.5)';
    ctx.strokeStyle = '#8a2be2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < numAbilities; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const currentRadius = (radius / 10) * abilities[i].value;
        const x = centerX + Math.cos(angle) * currentRadius;
        const y = centerY + Math.sin(angle) * currentRadius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // 绘制能力值点
    abilities.forEach((ability, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const currentRadius = (radius / 10) * ability.value;
        const x = centerX + Math.cos(angle) * currentRadius;
        const y = centerY + Math.sin(angle) * currentRadius;
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#8a2be2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.stroke();
    });
    
    return { canvas, abilities, centerX, centerY, radius, angleStep };
}

// 初始化雷达图粒子高亮效果
function initRadarParticleEffect() {
    const radarData = drawRadarChart();
    if (!radarData) return;
    
    const { canvas, abilities, centerX, centerY, radius, angleStep } = radarData;
    const particleSystem = new ParticleSystem(canvas);
    
    // 窗口大小改变时重新绘制雷达图
    window.addEventListener('resize', () => {
        drawRadarChart();
    });
    
    // 语言切换时重新绘制雷达图
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            drawRadarChart();
        });
    });
    
    // 雷达图鼠标交互
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 检测鼠标是否在某个能力区域
        abilities.forEach((ability, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const currentRadius = (radius / 10) * ability.value;
            const x = centerX + Math.cos(angle) * currentRadius;
            const y = centerY + Math.sin(angle) * currentRadius;
            
            const dx = mouseX - x;
            const dy = mouseY - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) {
                // 粒子高亮效果
                particleSystem.addParticleEffect(x, y);
            }
        });
    });
}

// 简历下载提示粒子
class ResumeParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 5;
        this.speedY = (Math.random() - 0.5) * 5;
        this.color = Math.random() > 0.5 ? '#8a2be2' : '#4169e1';
        this.alpha = 1;
        this.gravity = 0.2;
        this.life = Math.random() * 1 + 1;
        this.maxLife = this.life;
    }
    
    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.03;
        this.alpha = this.life / this.maxLife;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// 简历下载提示管理器
class ResumeNotificationManager {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isVisible = false;
        this.notificationText = '';
        this.x = 0;
        this.y = 0;
        this.life = 3;
        this.maxLife = 3;
    }
    
    init() {
        // 设置canvas样式
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10000';
        document.body.appendChild(this.canvas);
        
        // 窗口大小改变时重新设置canvas尺寸
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    showNotification(x, y, text) {
        this.isVisible = true;
        this.notificationText = text;
        this.x = x;
        this.y = y;
        this.life = this.maxLife;
        
        // 生成粒子效果
        for (let i = 0; i < 20; i++) {
            this.particles.push(new ResumeParticle(x, y));
        }
        
        this.animate();
    }
    
    animate() {
        if (!this.isVisible) return;
        
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.particles = this.particles.filter(particle => {
            particle.update();
            particle.draw(this.ctx);
            return !particle.isDead();
        });
        
        // 绘制通知文字
        if (this.life > 0) {
            this.ctx.save();
            this.ctx.globalAlpha = this.life / this.maxLife;
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px Segoe UI';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.shadowColor = 'rgba(138, 43, 226, 0.8)';
            this.ctx.shadowBlur = 10;
            this.ctx.fillText(this.notificationText, this.x, this.y - 50);
            this.ctx.restore();
            
            this.life -= 0.016; // 60fps
        } else {
            this.isVisible = false;
        }
        
        // 继续动画
        if (this.isVisible || this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// 初始化简历下载功能
function initResumeDownload() {
    const downloadBtns = document.querySelectorAll('.resume-btn');
    const notificationManager = new ResumeNotificationManager();
    notificationManager.init();
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 创建水波纹效果
            createRippleEffect(btn, e);
            
            // 获取按钮位置用于通知显示
            const rect = btn.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // 根据当前语言选择通知文本
            const isZh = !document.body.classList.contains('en');
            const notificationText = isZh ? '简历已发送至你的设备' : 'Resume sent to your device';
            
            // 显示通知
            notificationManager.showNotification(window.innerWidth / 2, window.innerHeight / 2, notificationText);
            
            // 这里可以添加实际的简历下载逻辑
            // 示例：模拟下载
            console.log('Resume download initiated');
            
            // 实际项目中，你可以使用以下代码触发下载
            // const a = document.createElement('a');
            // a.href = 'path/to/your/resume.pdf';
            // a.download = 'resume.pdf';
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
        });
    });
}

// 初始化文字粒子高亮交互
function initTextParticleEffect() {
    const thinkingTitles = document.querySelectorAll('.thinking-title');
    const particleManagers = [];
    
    thinkingTitles.forEach(title => {
        const manager = new TextParticleManager();
        manager.init(title);
        particleManagers.push(manager);
        
        title.addEventListener('click', () => {
            manager.startAnimation();
        });
    });
    
    // 窗口大小改变时重新初始化
    window.addEventListener('resize', () => {
        particleManagers.forEach(manager => {
            manager.destroy();
        });
        
        thinkingTitles.forEach(title => {
            const manager = new TextParticleManager();
            manager.init(title);
            particleManagers.push(manager);
            
            title.addEventListener('click', () => {
                manager.startAnimation();
            });
        });
    });
}

// 添加滚动动画效果
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为所有section添加滚动动画
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
    
    // 为项目卡片添加滚动动画
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // 为思考卡片添加滚动动画
    const thinkingCards = document.querySelectorAll('.thinking-card');
    thinkingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// 添加到初始化函数
initScrollAnimations();
initTextParticleEffect();