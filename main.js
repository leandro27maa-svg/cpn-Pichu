// ==========================================
// MAIN JAVASCRIPT: C.N.P LANDING PAGE
// Compañía Nacional Pichu - Electromecánica
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // 2. ACTIVE NAV LINK ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });

  // 3. CONTACT FORM VALIDATION & SUBMISSION
  const contactForm = document.getElementById('contactForm');
  const successAlert = document.getElementById('successAlert');
  const resetFormBtn = document.getElementById('resetFormBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Inputs
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      // Simple Email Pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate Name
      if (!nameInput.value.trim()) {
        showError(nameInput, true);
        isValid = false;
      } else {
        showError(nameInput, false);
      }

      // Validate Email
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, true);
        isValid = false;
      } else {
        showError(emailInput, false);
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        showError(messageInput, true);
        isValid = false;
      } else {
        showError(messageInput, false);
      }

      if (isValid) {
        // Show success
        contactForm.classList.add('hidden');
        successAlert.classList.remove('hidden');
      }
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        contactForm.reset();
        contactForm.classList.remove('hidden');
        successAlert.classList.add('hidden');
      });
    }
  }

  function showError(inputElement, hasError) {
    const parentGroup = inputElement.closest('.form-group');
    if (parentGroup) {
      if (hasError) {
        parentGroup.classList.add('error');
      } else {
        parentGroup.classList.remove('error');
      }
    }
  }

  // 4. SCHOOL MODAL LOGIC
  const schoolModal = document.getElementById('schoolModal');
  const openSchoolModalBtn = document.getElementById('openSchoolModalBtn');
  const closeSchoolModalBtn = document.getElementById('closeSchoolModalBtn');
  const modalCloseAction = document.getElementById('modalCloseAction');

  function openModal() {
    if (schoolModal) schoolModal.classList.remove('hidden');
  }

  function closeModal() {
    if (schoolModal) schoolModal.classList.add('hidden');
  }

  if (openSchoolModalBtn) openSchoolModalBtn.addEventListener('click', openModal);
  if (closeSchoolModalBtn) closeSchoolModalBtn.addEventListener('click', closeModal);
  if (modalCloseAction) modalCloseAction.addEventListener('click', closeModal);

  if (schoolModal) {
    schoolModal.addEventListener('click', (e) => {
      if (e.target === schoolModal) closeModal();
    });
  }

  // 5. MUSIC WIDGET LOGIC
  const musicWidget = document.getElementById('musicWidget');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');
  const musicTooltip = document.getElementById('musicTooltip');
  const bgMusic = document.getElementById('bgMusic');

  let isPlaying = false;
  let userInteracted = false;

  // Configuración inicial del audio
  if (bgMusic) {
    bgMusic.volume = 0.3; // Volumen moderado (30%)
  }

  // Función para actualizar UI
  function updateMusicUI() {
    if (musicToggleBtn && musicIcon && musicTooltip) {
      if (isPlaying) {
        musicToggleBtn.classList.add('playing');
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-pause');
        musicTooltip.textContent = 'Pausar Música';
      } else {
        musicToggleBtn.classList.remove('playing');
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-music');
        musicTooltip.textContent = 'Activar Música';
      }
    }
  }

  // Toggle Play/Pause
  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener('click', async () => {
      userInteracted = true; // Marcar interacción del usuario para autoplay policies
      
      if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
      } else {
        try {
          await bgMusic.play();
          isPlaying = true;
        } catch (error) {
          console.log('Autoplay bloqueado por el navegador:', error);
          // El usuario ya hizo click, debería poder reproducirse
          isPlaying = false;
        }
      }
      updateMusicUI();
    });
  }

  // Actualizar tooltip y estado cuando la música termina o se pausa por el navegador
  if (bgMusic) {
    bgMusic.addEventListener('pause', () => {
      if (isPlaying) { // Solo si no fue pausa intencional
        isPlaying = false;
        updateMusicUI();
      }
    });

    bgMusic.addEventListener('ended', () => {
      isPlaying = false;
      updateMusicUI();
    });
  }

  // Opcional: Intentar reproducir automáticamente en la primera interacción del usuario con la página
  // (click, scroll, tecla) si el navegador lo permite
  function tryAutoplayOnFirstInteraction() {
    if (userInteracted || !bgMusic || isPlaying) return;
    
    bgMusic.play()
      .then(() => {
        isPlaying = true;
        userInteracted = true;
        updateMusicUI();
      })
      .catch(() => {
        // Silencioso - el usuario deberá clickear el botón
      });
  }

  ['click', 'keydown', 'scroll', 'touchstart'].forEach(eventType => {
    document.addEventListener(eventType, tryAutoplayOnFirstInteraction, { once: true, passive: true });
  });

});
