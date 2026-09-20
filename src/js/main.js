document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');


    const handleNavbar = () => {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 40);
    };

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (href.length <= 1) return;
            const target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });


    const navTargets = ['home', 'about', 'features', 'carousel', 'video', 'contact'];
    const sections = navTargets
        .map((id) => document.getElementById(id))
        .filter(Boolean);
    const navLinks = document.querySelectorAll('.nav-link');

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
        });
    };

    const updateActiveSection = () => {
        const navBottom = navbar.getBoundingClientRect().bottom;
        let current = navTargets[0];

        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= navBottom + 1) {
                current = section.id;
            }
        });


        const reachedBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 2;
        if (reachedBottom) {
            current = navTargets[navTargets.length - 1];
        }

        setActiveLink(current);
    };

    // ===== 4. Carousel =====
    const track = document.getElementById('carouselTrack');
    const slides = track.querySelectorAll('.carousel__slide');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    let currentSlide = 0;

    // Build one dot per slide.
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel__dot' + (index === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.carousel__dot');

    const goToSlide = (index) => {
        currentSlide = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentSlide));
    };

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // ===== 5. Modal window =====
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    const modalContent = {
        about: {
            title: 'About Hold',
            body: '<p>Hold is a personal mood-tracking and self-reflection website. ' +
                'It helps you capture how you feel in the moment with a Quick Record, ' +
                'and unpack bigger feelings with a step-by-step Guided Record.</p>' +
                '<p>Over time, your Timeline, Calendar, and Pattern Discovery views turn ' +
                'small daily check-ins into a clearer picture of your emotional life.</p>'
        },
        privacy: {
            title: 'Your privacy',
            body: '<p>Your reflections are personal, and Hold treats them that way. ' +
                'Everything you record stays yours, and is only ever used to build your ' +
                'own timeline, calendar, and patterns.</p>' +
                '<p>We never share your data, and you can delete any record at any time.</p>'
        }
    };

    const openModal = (key) => {
        const content = modalContent[key] || modalContent.about;
        modalTitle.textContent = content.title;
        modalBody.innerHTML = content.body;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    };

    document.querySelectorAll('[data-modal-open]').forEach((button) => {
        button.addEventListener('click', () => openModal(button.dataset.modalOpen));
    });
    modalClose.addEventListener('click', closeModal);
    modal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });

    // ===== Wire up scroll handling & run once on load =====
    window.addEventListener('scroll', () => {
        handleNavbar();
        updateActiveSection();
    }, { passive: true });

    handleNavbar();
    updateActiveSection();
});
