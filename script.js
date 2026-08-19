'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // Utility functions for performance
    // --------------------------------------------------------
    
    // Debounce function to limit how often a function runs
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    // --------------------------------------------------------
    // 1. Scroll Reveal Animation
    // --------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only trigger once
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --------------------------------------------------------
    // 2. Mobile Navigation
    // --------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    if (hamburger && navLinksContainer) {
        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);

        // Close menu when a nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside the nav
        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('active') && 
                !hamburger.contains(e.target) && 
                !navLinksContainer.contains(e.target)) {
                toggleMenu();
            }
        });
    }

    // --------------------------------------------------------
    // 3. Smooth Scroll Navigation
    // --------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 80;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });

    // --------------------------------------------------------
    // 4. Active Navigation Highlighting
    // --------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    
    const navHighlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { 
        rootMargin: `-${navbarHeight}px 0px -60% 0px`, // Adjust based on navbar height
        threshold: 0
    });

    sections.forEach(section => navHighlightObserver.observe(section));

    // --------------------------------------------------------
    // 5. Navbar Background on Scroll
    // --------------------------------------------------------
    const handleNavbarScroll = debounce(() => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }, 10);

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // --------------------------------------------------------
    // 6. Animated Counters
    // --------------------------------------------------------
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const startTime = performance.now();
            const suffix = stat.getAttribute('data-suffix') || '';
            
            const updateCounter = (currentTime) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Ease out quad function for smooth deceleration
                const easeOutQuad = progress * (2 - progress);
                const currentNum = Math.floor(easeOutQuad * target);
                
                stat.innerText = currentNum + suffix;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target + suffix;
                }
            };
            
            requestAnimationFrame(updateCounter);
        });
    };

    // Observe an 'about' or 'stats' section to trigger counter
    const statsSection = document.querySelector('#about') || document.querySelector('#stats');
    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                animateCounters();
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // --------------------------------------------------------
    // 7. Project Filtering
    // --------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === category) {
                        card.style.display = 'block'; // Or flex/grid depending on CSS
                        // Slight delay to allow display change before setting opacity for transition
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // Should match CSS transition duration
                    }
                });
            });
        });
    }

    // --------------------------------------------------------
    // 8. Testimonial Carousel
    // --------------------------------------------------------
    const track = document.querySelector('.testimonial-track');
    const slides = Array.from(document.querySelectorAll('.testimonial-card'));
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        let slideWidth = slides[0].getBoundingClientRect().width;
        let autoRotateInterval;

        // Create dots dynamically
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            if (dotsContainer) dotsContainer.appendChild(dot);
        });
        
        const dots = Array.from(document.querySelectorAll('.carousel-dot'));

        const setSlidePosition = () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        const updateDots = () => {
            if (!dots.length) return;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        const goToSlide = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            if (currentIndex >= slides.length) currentIndex = 0;
            
            setSlidePosition();
            updateDots();
        };

        const nextSlide = () => goToSlide(currentIndex + 1);
        const prevSlide = () => goToSlide(currentIndex - 1);

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Resize handler for responsive carousel
        window.addEventListener('resize', debounce(() => {
            setSlidePosition();
        }, 100));

        // Auto-rotation
        const startAutoRotate = () => {
            autoRotateInterval = setInterval(nextSlide, 5000);
        };
        
        const stopAutoRotate = () => {
            clearInterval(autoRotateInterval);
        };

        startAutoRotate();

        // Pause on hover
        const carouselContainer = document.querySelector('.testimonial-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoRotate);
            carouselContainer.addEventListener('mouseleave', startAutoRotate);
        }
    }

    // --------------------------------------------------------
    // 9. Contact Form Handling
    // --------------------------------------------------------
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic validation check
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const btn = contactForm.querySelector('button[type="submit"]');
                const originalText = btn.innerText;
                btn.innerText = 'Sending...';
                btn.disabled = true;
                
                setTimeout(() => {
                    contactForm.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                    
                    // Show success message
                    let successMsg = contactForm.querySelector('.form-success');
                    if (!successMsg) {
                        successMsg = document.createElement('div');
                        successMsg.classList.add('form-success');
                        successMsg.innerHTML = 'Message sent successfully! <br><small>Note: Connect to Formspree for real functionality.</small>';
                        successMsg.style.color = 'green';
                        successMsg.style.marginTop = '15px';
                        contactForm.appendChild(successMsg);
                    }
                    
                    setTimeout(() => {
                        if (successMsg) successMsg.remove();
                    }, 5000);
                }, 1500);
            }
        });
    }

    // --------------------------------------------------------
    // 10. Typing Effect
    // --------------------------------------------------------
    const typingElement = document.querySelector('.typing-text') || document.querySelector('.hero-subtitle');
    
    if (typingElement) {
        const words = ['Full Stack Developer', 'UI/UX Designer', 'Open Source Contributor'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeEffect = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 50 : 150;
            
            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before new word
            }
            
            setTimeout(typeEffect, typingSpeed);
        };
        
        // Initial call
        setTimeout(typeEffect, 1000);
    }

    // --------------------------------------------------------
    // 11. Back to Top Button
    // --------------------------------------------------------
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        const handleBackToTopVisibility = debounce(() => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
                // Ensure CSS has transition for opacity/visibility
            } else {
                backToTopBtn.classList.remove('show');
            }
        }, 100);
        
        window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
