/* ============================================================
   ENHANCED EFFECTS - Additional stunning animations
   Know Your Nutrition - Enhanced Animation Layer
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* ===== PARTICLE SYSTEM ===== */
    function createParticleSystem() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particleContainer = document.createElement('div');
        particleContainer.className = 'hero-particles';
        hero.appendChild(particleContainer);

        const colors = ['#6fdc8c', '#8cc152', '#d5a13c', '#4cb36a'];
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '0';
            particle.style.background = `radial-gradient(circle at center, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
            particle.style.setProperty('--duration', (6 + Math.random() * 6) + 's');
            particle.style.setProperty('--delay', Math.random() * 5 + 's');
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
            particle.style.setProperty('--ty', -(100 + Math.random() * 300) + 'px');
            particleContainer.appendChild(particle);
        }
    }

    /* ===== MAGNETIC CURSOR EFFECT ===== */
    function initMagneticElements() {
        const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (!canHover) return;

        document.querySelectorAll('.popular a, .search-box button, .search-again-button').forEach(function (el) {
            el.classList.add('magnetic');

            el.addEventListener('mousemove', function (e) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
            });

            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    /* ===== FLOATING FOOD EMOJIS ENHANCED ===== */
    function enhanceFloatingFoods() {
        const floatingFoods = document.querySelectorAll('.floating-food');

        floatingFoods.forEach(function (food, index) {
            food.style.animationDelay = (index * 0.5) + 's';

            // Add random rotation animation
            const randomRotation = Math.random() * 360;
            food.style.transform = `rotate(${randomRotation}deg)`;

            // Add hover effect
            food.addEventListener('mouseenter', function () {
                food.style.animation = 'none';
                food.style.transform = `scale(1.3) rotate(${randomRotation + 180}deg)`;
                food.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            });

            food.addEventListener('mouseleave', function () {
                food.style.animation = '';
                food.style.transform = `rotate(${randomRotation}deg)`;
            });
        });
    }

    /* ===== LIQUID BLOBS BACKGROUND ===== */
    function createLiquidBlobs() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const blobData = [
            { size: 300, color: 'rgba(76, 175, 105, 0.15)', top: '10%', left: '5%', duration: '10s' },
            { size: 400, color: 'rgba(140, 193, 82, 0.12)', top: '60%', right: '8%', duration: '15s' },
            { size: 250, color: 'rgba(213, 161, 60, 0.1)', bottom: '15%', left: '50%', duration: '12s' }
        ];

        blobData.forEach(function (blob, index) {
            const blobEl = document.createElement('div');
            blobEl.className = 'liquid-blob';
            blobEl.style.width = blob.size + 'px';
            blobEl.style.height = blob.size + 'px';
            blobEl.style.background = blob.color;
            blobEl.style.animationDuration = blob.duration;
            blobEl.style.animationDelay = (index * 2) + 's';

            Object.keys(blob).forEach(function (key) {
                if (['top', 'left', 'right', 'bottom'].includes(key)) {
                    blobEl.style[key] = blob[key];
                }
            });

            hero.appendChild(blobEl);
        });
    }

    /* ===== STAGGER ANIMATION FOR FEATURE CARDS ===== */
    function staggerFeatureCards() {
        const cards = document.querySelectorAll('.feature-card');

        cards.forEach(function (card, index) {
            card.classList.add('stagger-fade-in');
            card.style.setProperty('--stagger-delay', index);
        });
    }

    /* ===== RESULT CARDS ENHANCED ===== */
    function enhanceResultCards() {
        const cards = document.querySelectorAll('.result-card');

        cards.forEach(function (card, index) {
            card.classList.add('result-card-enhanced');

            // Add bounce-in animation
            setTimeout(function () {
                card.classList.add('bounce-in');
                card.style.animationDelay = (index * 0.1) + 's';
            }, 100);
        });
    }

    /* ===== SPARKLE EFFECT ON HOVER ===== */
    function addSparkleEffect() {
        const elements = document.querySelectorAll('.result-value, .calorie-number');

        elements.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                if (!el.classList.contains('sparkle')) {
                    el.classList.add('sparkle');
                }
            });
        });
    }

    /* ===== BREATHING ANIMATION FOR ICONS ===== */
    function addBreathingIcons() {
        const icons = document.querySelectorAll('.preview-icon, .result-food-icon, .data-check');

        icons.forEach(function (icon) {
            icon.classList.add('breathe');
        });
    }

    /* ===== SCROLL TRIGGERED ANIMATIONS ===== */
    function initScrollAnimations() {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const target = entry.target;

                    if (target.classList.contains('about-container')) {
                        target.querySelectorAll('p').forEach(function (p, index) {
                            p.classList.add('fade-blur-in');
                            p.style.animationDelay = (index * 0.15) + 's';
                        });
                    }

                    if (target.classList.contains('about-quote')) {
                        target.classList.add('flip-in');
                        target.style.animationDelay = '0.3s';
                    }

                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.about-container, .about-quote').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ===== GLOW PULSE ON SEARCH BOX FOCUS ===== */
    function enhanceSearchBox() {
        const searchBox = document.querySelector('.search-box');
        if (!searchBox) return;

        const input = searchBox.querySelector('input');

        input.addEventListener('focus', function () {
            searchBox.classList.add('glow-pulse');
        });

        input.addEventListener('blur', function () {
            searchBox.classList.remove('glow-pulse');
        });
    }

    /* ===== CONFETTI ON SUCCESSFUL SEARCH ===== */
    function createConfetti(x, y) {
        const colors = ['#2f9e57', '#8cc152', '#d5a13c', '#4cb36a', '#6fdc8c'];
        const confettiCount = 30;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;
            const tx = Math.cos(angle) * velocity * 50;
            const ty = Math.sin(angle) * velocity * 50;

            confetti.style.setProperty('--tx', tx + 'px');
            confetti.style.setProperty('--ty', ty + 'px');
            confetti.style.animation = 'confetti-fall ' + (Math.random() * 2 + 2) + 's ease-out forwards';

            document.body.appendChild(confetti);

            setTimeout(function () {
                confetti.remove();
            }, 4000);
        }
    }

    /* ===== NAVBAR LOGO ROTATION ON SCROLL ===== */
    function animateNavbarLogo() {
        const logo = document.querySelector('.logo-symbol');
        if (!logo) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset;
            const scrollDelta = currentScroll - lastScroll;

            logo.style.transform = `rotateY(${scrollDelta * 2}deg)`;

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /* ===== GRADIENT TEXT ANIMATION ===== */
    function addGradientTextAnimation() {
        const headings = document.querySelectorAll('.section-heading h2, .about-container h2');

        headings.forEach(function (heading) {
            const text = heading.textContent;
            heading.setAttribute('data-text', text);

            heading.addEventListener('mouseenter', function () {
                heading.classList.add('gradient-text');
            });

            heading.addEventListener('mouseleave', function () {
                setTimeout(function () {
                    heading.classList.remove('gradient-text');
                }, 2000);
            });
        });
    }

    /* ===== ELASTIC BOUNCE FOR POPULAR LINKS ===== */
    function enhancePopularLinks() {
        const popularLinks = document.querySelectorAll('.popular a');

        popularLinks.forEach(function (link, index) {
            link.classList.add('elastic-bounce');
            link.style.animationDelay = (0.7 + index * 0.1) + 's';
        });
    }

    /* ===== WOBBLE EFFECT ON FLOATING FOODS ===== */
    function addWobbleToFoods() {
        const foods = document.querySelectorAll('.floating-food');

        foods.forEach(function (food) {
            food.addEventListener('click', function () {
                food.classList.add('wobble');

                setTimeout(function () {
                    food.classList.remove('wobble');
                }, 2000);
            });
        });
    }

    /* ===== NEON GLOW ON RESULT VALUES ===== */
    function addNeonGlow() {
        const values = document.querySelectorAll('.result-value');

        values.forEach(function (value) {
            value.addEventListener('mouseenter', function () {
                value.classList.add('neon-glow');
            });

            value.addEventListener('mouseleave', function () {
                setTimeout(function () {
                    value.classList.remove('neon-glow');
                }, 1000);
            });
        });
    }

    /* ===== PARALLAX SCROLL EFFECT ===== */
    function initParallaxScroll() {
        const parallaxElements = document.querySelectorAll('.floating-food, .nutrition-preview');

        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(function (el) {
                const speed = el.classList.contains('floating-food') ? 0.5 : 0.3;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }

    /* ===== HEARTBEAT ANIMATION ON HOVER ===== */
    function addHeartbeatEffect() {
        const cards = document.querySelectorAll('.feature-card, .result-card');

        cards.forEach(function (card) {
            card.addEventListener('mouseenter', function () {
                const picture = card.querySelector('.feature-picture');
                if (picture) {
                    picture.classList.add('heartbeat');
                }
            });

            card.addEventListener('mouseleave', function () {
                const picture = card.querySelector('.feature-picture');
                if (picture) {
                    picture.classList.remove('heartbeat');
                }
            });
        });
    }

    /* ===== ROTATE SCALE IN FOR ICONS ===== */
    function animateIcons() {
        const icons = document.querySelectorAll('.feature-picture');

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('rotate-scale-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        icons.forEach(function (icon) {
            observer.observe(icon);
        });
    }

    /* ===== SLIDE IN ANIMATIONS ===== */
    function addSlideInAnimations() {
        const leftElements = document.querySelectorAll('.hero-content');
        const rightElements = document.querySelectorAll('.hero-visual');

        leftElements.forEach(function (el) {
            el.classList.add('slide-in-left');
        });

        rightElements.forEach(function (el) {
            el.classList.add('slide-in-right');
        });
    }

    /* ===== INIT ALL EFFECTS ===== */
    function initAllEffects() {
        createParticleSystem();
        initMagneticElements();
        enhanceFloatingFoods();
        createLiquidBlobs();
        staggerFeatureCards();
        addSparkleEffect();
        addBreathingIcons();
        initScrollAnimations();
        enhanceSearchBox();
        animateNavbarLogo();
        addGradientTextAnimation();
        enhancePopularLinks();
        addWobbleToFoods();
        addHeartbeatEffect();
        animateIcons();
        addSlideInAnimations();

        // Page-specific effects
        if (document.querySelector('.results-page')) {
            enhanceResultCards();
            addNeonGlow();
        }
    }

    // Initialize after a small delay to ensure DOM is ready
    setTimeout(initAllEffects, 100);

    /* ===== CONFETTI ON SEARCH BUTTON CLICK ===== */
    const searchForm = document.querySelector('.search-box');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            const button = searchForm.querySelector('button');
            const rect = button.getBoundingClientRect();
            createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    }

    /* ===== SMOOTH SCROLL ENHANCEMENT ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
