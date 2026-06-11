/* ============================================================
   摄影师「亦」个人网站 — JavaScript
   画廊筛选 · 灯箱 · 轮播 · 滚动动画 · 表单
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ==================== DOM 引用 ====================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const galleryGrid = document.getElementById('galleryGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCategory = document.getElementById('lightboxCategory');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const heroSection = document.querySelector('.hero');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dots .dot');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    const heroProgressFill = document.getElementById('heroProgressFill');
    const heroCounterCurr = document.getElementById('heroCounterCurr');
    const heroCounterTotal = document.getElementById('heroCounterTotal');
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const newsletterForm = document.getElementById('newsletterForm');
    const statNumbers = document.querySelectorAll('.stat-number');

    // ==================== 导航栏滚动效果 ====================
    let lastScroll = 0;

    function updateNavbar() {
        const scrollY = window.scrollY;

        // 滚动添加背景
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 高亮当前区块对应的导航
        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + section.id) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // 回到顶部按钮
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });

    // ==================== 移动端汉堡菜单 ====================
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // 点击导航链接关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==================== Hero 轮播 ====================
    let currentSlide = 0;
    const totalSlides = heroSlides.length;
    const SLIDE_DURATION = 5000;
    let heroProgress = 0;
    let heroRafId = null;
    let heroLastTime = performance.now();
    let heroPaused = false;

    // 初始化总数显示
    if (heroCounterTotal) {
        heroCounterTotal.textContent = String(totalSlides).padStart(2, '0');
    }

    function goToSlide(index) {
        // 移除旧幻灯片
        heroSlides[currentSlide].classList.remove('active');
        heroDots[currentSlide].classList.remove('active');

        // 计算新索引
        currentSlide = (index + totalSlides) % totalSlides;

        // 激活新幻灯片
        heroSlides[currentSlide].classList.add('active');
        heroDots[currentSlide].classList.add('active');

        // 更新计数器
        if (heroCounterCurr) {
            heroCounterCurr.textContent = String(currentSlide + 1).padStart(2, '0');
        }

        // 重置进度
        heroProgress = 0;
        heroLastTime = performance.now();
        if (heroProgressFill) {
            heroProgressFill.style.width = '0%';
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // RAF 驱动的进度条
    function heroTick(now) {
        if (!heroPaused) {
            const delta = now - heroLastTime;
            heroProgress += delta / SLIDE_DURATION;

            if (heroProgress >= 1) {
                heroProgress = 0;
                nextSlide();
            }

            if (heroProgressFill) {
                heroProgressFill.style.width = (heroProgress * 100) + '%';
            }
        }
        heroLastTime = now;
        heroRafId = requestAnimationFrame(heroTick);
    }

    function startHeroSlideshow() {
        heroLastTime = performance.now();
        heroRafId = requestAnimationFrame(heroTick);
    }

    function stopHeroSlideshow() {
        if (heroRafId) {
            cancelAnimationFrame(heroRafId);
            heroRafId = null;
        }
    }

    // 悬停暂停 / 恢复
    if (heroSection) {
        heroSection.addEventListener('mouseenter', function() {
            heroPaused = true;
        });

        heroSection.addEventListener('mouseleave', function() {
            heroPaused = false;
            heroLastTime = performance.now(); // 重置计时避免跳帧
        });
    }

    // 导航箭头点击
    if (heroPrev) {
        heroPrev.addEventListener('click', function(e) {
            e.stopPropagation();
            prevSlide();
        });
    }

    if (heroNext) {
        heroNext.addEventListener('click', function(e) {
            e.stopPropagation();
            nextSlide();
        });
    }

    // 分页点点击
    heroDots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
        });
    });

    // 键盘导航（全局，仅在非灯箱状态下生效）
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // 初始化轮播
    startHeroSlideshow();

    // ==================== 画廊筛选 ====================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // 按钮激活状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 筛选项目
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    // 重新触发动画
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ==================== 灯箱 ====================
    let currentLightboxIndex = 0;
    let visibleItems = [];

    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    }

    function openLightbox(index) {
        updateVisibleItems();
        currentLightboxIndex = index;
        const item = visibleItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const category = item.querySelector('p').textContent;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxCategory.textContent = category;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function lightboxNextImg() {
        updateVisibleItems();
        if (visibleItems.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
        const item = visibleItems[currentLightboxIndex];
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = item.querySelector('h3').textContent;
        lightboxCategory.textContent = item.querySelector('p').textContent;
    }

    function lightboxPrevImg() {
        updateVisibleItems();
        if (visibleItems.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
        const item = visibleItems[currentLightboxIndex];
        const img = item.querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxTitle.textContent = item.querySelector('h3').textContent;
        lightboxCategory.textContent = item.querySelector('p').textContent;
    }

    // 画廊点击
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            updateVisibleItems();
            const visibleIndex = visibleItems.indexOf(item);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
    });

    // 灯箱按钮
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', lightboxNextImg);
    lightboxPrev.addEventListener('click', lightboxPrevImg);

    // 点击遮罩关闭
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        switch (e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowRight': lightboxNextImg(); break;
            case 'ArrowLeft': lightboxPrevImg(); break;
        }
    });

    // ==================== 评价轮播 ====================
    let currentTestimonial = 0;
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonialCards.length;

    function goToTestimonial(index) {
        currentTestimonial = (index + totalTestimonials) % totalTestimonials;
        testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTestimonial);
        });
    }

    testimonialDots.forEach(dot => {
        dot.addEventListener('click', function() {
            goToTestimonial(parseInt(this.getAttribute('data-index')));
        });
    });

    // 自动轮播评价
    setInterval(() => {
        goToTestimonial(currentTestimonial + 1);
    }, 6000);

    // ==================== 滚动显示动画 ====================
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==================== 数字滚动动画 ====================
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                function updateCount(timestamp) {
                    const elapsed = timestamp - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutExpo
                    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const current = Math.floor(eased * target);

                    stat.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target.toLocaleString();
                    }
                }

                requestAnimationFrame(updateCount);
                statObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statObserver.observe(stat));

    // ==================== 联系表单 ====================
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        // 显示加载状态
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        // 模拟发送（生产环境替换为真实 API 调用）
        setTimeout(() => {
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
        }, 1500);
    });

    // ==================== 订阅表单 ====================
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = this.querySelector('input');
        const btn = this.querySelector('button');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#4caf50';
        input.value = '';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 2000);
    });

    // ==================== 导航栏社交图标 ====================
    const socialIcons = document.querySelectorAll('.nav-socials .social-icon');

    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.getAttribute('data-action');
            const tip = this.getAttribute('data-tip');

            if (action === 'copy') {
                const text = this.getAttribute('data-copy');
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        showSocialTooltip(this, tip);
                    }).catch(() => {
                        // Fallback for older browsers
                        fallbackCopy(text);
                        showSocialTooltip(this, tip);
                    });
                } else {
                    fallbackCopy(text);
                    showSocialTooltip(this, tip);
                }
            } else if (action === 'coming-soon') {
                showSocialTooltip(this, tip);
            }
        });
    });

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
        } catch (e) {
            // ignore
        }
        document.body.removeChild(textarea);
    }

    function showSocialTooltip(el, tip) {
        // Remove any existing tooltips
        document.querySelectorAll('.social-icon.tooltip-visible').forEach(item => {
            item.removeAttribute('data-tooltip');
            item.classList.remove('tooltip-visible');
        });

        // Set and show tooltip
        el.setAttribute('data-tooltip', tip);
        el.classList.add('tooltip-visible');

        // Hide after 2 seconds
        setTimeout(() => {
            el.classList.remove('tooltip-visible');
            setTimeout(() => {
                el.removeAttribute('data-tooltip');
            }, 300);
        }, 2000);
    }

    // ==================== 回到顶部 ====================
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== 平滑滚动（处理 # 链接） ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // 社交图标等占位链接，阻止默认跳转行为
            if (targetId === '#') {
                e.preventDefault();
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== 初始化 ====================
    updateNavbar();
});
