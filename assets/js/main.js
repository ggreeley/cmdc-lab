/* ========================================
   Flow Canvas Animation
   Layered, slowly drifting wave field in the
   hero — a nod to cognition as continuous and
   dynamic rather than a fixed structure
   ======================================== */
(function () {
    const canvas = document.getElementById('flow-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height, animationId, t = 0;
    let mouse = { x: -9999, y: -9999, active: false };

    const LAYERS = [
        { baseline: 0.62, amplitude: 34, frequency: 0.006, speed: 0.006, phase: 0, color: '58, 124, 165', alpha: 0.22 },
        { baseline: 0.72, amplitude: 26, frequency: 0.009, speed: -0.009, phase: 2.1, color: '45, 90, 123', alpha: 0.20 },
        { baseline: 0.82, amplitude: 20, frequency: 0.012, speed: 0.007, phase: 4.2, color: '214, 143, 63', alpha: 0.10 },
    ];

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function waveY(layer, x) {
        let y = layer.baseline * height + Math.sin(x * layer.frequency + t * layer.speed * 10 + layer.phase) * layer.amplitude;

        if (mouse.active) {
            const dx = x - mouse.x;
            const bump = Math.exp(-(dx * dx) / (2 * 140 * 140));
            const pull = (mouse.y - y) * 0.35;
            y += pull * bump;
        }

        return y;
    }

    function drawFrame() {
        ctx.clearRect(0, 0, width, height);
        const step = 8;

        for (const layer of LAYERS) {
            ctx.beginPath();
            ctx.moveTo(0, waveY(layer, 0));
            for (let x = step; x <= width; x += step) {
                ctx.lineTo(x, waveY(layer, x));
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, layer.baseline * height - layer.amplitude, 0, height);
            gradient.addColorStop(0, `rgba(${layer.color}, ${layer.alpha})`);
            gradient.addColorStop(1, `rgba(${layer.color}, 0)`);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        t += 1;
        animationId = requestAnimationFrame(drawFrame);
    }

    // Throttled mouse handler
    let mouseTimeout;
    canvas.addEventListener('mousemove', (e) => {
        if (mouseTimeout) return;
        mouseTimeout = setTimeout(() => { mouseTimeout = null; }, 30);
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Reduce animation when not visible
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                if (!animationId) drawFrame();
            } else {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        },
        { threshold: 0.1 }
    );

    window.addEventListener('resize', resize);

    resize();
    observer.observe(canvas);
    drawFrame();
})();

/* ========================================
   Scroll Reveal
   ======================================== */
(function () {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px',
        }
    );

    reveals.forEach((el) => observer.observe(el));
})();

/* ========================================
   Navbar Scroll Behavior
   ======================================== */
(function () {
    const navbar = document.getElementById('navbar');
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrolled = window.scrollY > 60;
            navbar.classList.toggle('scrolled', scrolled);
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            'active',
                            link.getAttribute('href') === `#${id}`
                        );
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));
})();

/* ========================================
   Mobile Navigation Toggle
   ======================================== */
(function () {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    const links = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('open');
        toggle.setAttribute(
            'aria-expanded',
            menu.classList.contains('open')
        );
    });

    // Close menu on link click
    links.forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('open');
        }
    });
})();

/* ========================================
   Smooth scroll for anchor links
   (fallback for browsers without CSS smooth)
   ======================================== */
(function () {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const navHeight = document.getElementById('navbar').offsetHeight;
            const top =
                target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();
