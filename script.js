/**
 * DEVELOPER: Alex Nguyen | Modern Portfolio
 * SCRIPT.JS - Interactive Website Logic
 * Features: Dark/Light Mode, Typing Effect, Sticky Navbar, Scroll Highlights, Portfolio Filters, Form Validation, Toast
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. CHUYỂN ĐỔI GIAO DIỆN (THEME TOGGLE)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Hàm thiết lập Theme
    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('portfolio-theme', 'dark');
        }
    }

    // Kiểm tra cài đặt theme cũ từ localStorage hoặc hệ điều hành của người dùng
    const savedTheme = localStorage.getItem('portfolio-theme');
    const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (savedTheme === null && userPrefersLight)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    // Lắng nghe sự kiện click thay đổi theme
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });


    // ==========================================
    // 2. HIỆU ỨNG GÕ CHỮ (TYPING EFFECT)
    // ==========================================
    const typingTextEl = document.getElementById('typing-text');
    const phrases = ["Lập trình viên Web", "UI/UX Designer", "Người đam mê công nghệ"];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            // Xóa chữ
            typingTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Tốc độ xóa nhanh hơn gõ
        } else {
            // Gõ chữ
            typingTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 120;
        }

        // Kiểm tra chuyển trạng thái
        if (!isDeleting && charIdx === currentPhrase.length) {
            // Đã gõ xong từ, dừng lại một chút rồi xóa
            isDeleting = true;
            typingSpeed = 1500; // Dừng lại 1.5s ở cuối từ
        } else if (isDeleting && charIdx === 0) {
            // Đã xóa xong từ, chuyển sang từ tiếp theo
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // Nghỉ một chút trước khi gõ từ mới
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Kích hoạt hiệu ứng gõ chữ
    if (typingTextEl) {
        setTimeout(typeEffect, 1000);
    }


    // ==========================================
    // 3. MENU ĐIỀU HƯỚNG DI ĐỘNG (MOBILE NAVBAR)
    // ==========================================
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navbarMenu = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileIcon = mobileToggleBtn.querySelector('i');

    function toggleMenu() {
        navbarMenu.classList.toggle('active');
        const isActive = navbarMenu.classList.contains('active');
        
        // Thay đổi Icon từ Hamburger sang dấu X
        if (isActive) {
            mobileIcon.className = 'fa-solid fa-xmark';
        } else {
            mobileIcon.className = 'fa-solid fa-bars';
        }
    }

    mobileToggleBtn.addEventListener('click', toggleMenu);

    // Click vào Menu Link thì tự động đóng menu di động
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    // ==========================================
    // 4. STICKY HEADER & HIGHLIGHT ACTIVE NAV LINK
    // ==========================================
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');

    function handleScroll() {
        const scrollPosition = window.scrollY;

        // Sticky Header
        if (scrollPosition > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Highlight Active Link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Trừ khoảng trống Header
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Chạy ngay lập tức khi load để cập nhật trạng thái ban đầu


    // ==========================================
    // 5. BỘ LỌC DỰ ÁN (PORTFOLIO FILTER)
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Thay đổi nút active
            filterButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Hiệu ứng ẩn/hiển thị với Class CSS animation
                card.classList.remove('fade-in');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    // Delay nhẹ để kích hoạt animation fade-in mượt mà
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    // ==========================================
    // 6. ANIME ON SCROLL & KÍCH HOẠT SKILL BAR
    // ==========================================
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    // Cấu hình Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                
                // Nếu là Section About thì kích hoạt chạy thanh Skill bars
                if (entry.target.id === 'about') {
                    animateSkillBars();
                }
                
                observer.unobserve(entry.target); // Ngừng theo dõi sau khi đã xuất hiện
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });

    function animateSkillBars() {
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('style').match(/width:\s*(\d+)%/)[1];
            // Đầu tiên set về 0 để reset
            bar.style.width = '0%';
            // Chạy animation tăng dần thông qua CSS transition
            setTimeout(() => {
                bar.style.width = `${targetWidth}%`;
            }, 100);
        });
    }


    // ==========================================
    // 7. XÁC THỰC FORM LIÊN HỆ & TOAST THÔNG BÁO
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    
    // Regex định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(fieldId, errorId, validationFn) {
        const fieldEl = document.getElementById(fieldId);
        const parentGroup = fieldEl.parentElement;
        const isValid = validationFn(fieldEl.value.trim());

        if (isValid) {
            parentGroup.classList.remove('invalid');
        } else {
            parentGroup.classList.add('invalid');
        }
        return isValid;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngăn hành vi load lại trang mặc định

            // Chạy xác thực cho từng trường
            const isNameValid = validateField('name', 'name-error', value => value.length > 0);
            const isEmailValid = validateField('email', 'email-error', value => emailRegex.test(value));
            const isMessageValid = validateField('message', 'message-error', value => value.length > 0);

            // Kiểm tra tổng thể form
            if (isNameValid && isEmailValid && isMessageValid) {
                // Giả lập trạng thái đang gửi
                const submitBtn = document.getElementById('submit-btn');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Đang gửi... <i class="fa-solid fa-spinner fa-spin"></i>';

                // Giả lập cuộc gọi API (sau 1.2 giây sẽ gửi thành công)
                setTimeout(() => {
                    // Reset nút
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;

                    // Hiển thị Toast thông báo thành công
                    showToast();

                    // Reset toàn bộ Form
                    contactForm.reset();
                    document.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('invalid');
                    });
                }, 1200);
            }
        });

        // Thêm sự kiện input để xóa lỗi khi người dùng đang nhập
        ['name', 'email', 'message'].forEach(fieldId => {
            const el = document.getElementById(fieldId);
            el.addEventListener('input', () => {
                const parentGroup = el.parentElement;
                if (parentGroup.classList.contains('invalid')) {
                    parentGroup.classList.remove('invalid');
                }
            });
        });
    }

    function showToast() {
        toast.classList.remove('hidden');
        // Kích hoạt hiệu ứng slide-in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Tự động ẩn sau 4 giây
        setTimeout(() => {
            toast.classList.remove('show');
            // Đợi animation chạy xong thì ẩn hẳn
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 400);
        }, 4000);
    }
});
