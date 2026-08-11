/* ============================================
   SoLuna — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- Navbar scroll effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Contact form handler ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const status = contactForm.querySelector('.form-status');
      const origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      status.textContent = '';
      status.className = 'form-status';

      try {
        const endpoint = contactForm.action.replace(
          'https://formsubmit.co/',
          'https://formsubmit.co/ajax/'
        );
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: {
            Accept: 'application/json'
          }
        });
        const result = await response.json();

        if (!response.ok || result.success === false || result.success === 'false') {
          throw new Error(result.message || 'Message delivery failed.');
        }

        btn.textContent = 'Message Sent!';
        status.textContent = 'Thank you! Your message has been sent.';
        status.classList.add('success');
        contactForm.reset();
      } catch (error) {
        btn.textContent = origText;
        btn.disabled = false;
        status.textContent = 'We could not send your message. Please email solunasacredsound@gmail.com directly.';
        status.classList.add('error');
        console.error('Contact form submission failed:', error);
      }
    });
  }

  // --- Gallery Lightbox ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      if (lightbox && lightboxContent) {
        const image = item.querySelector('img');
        const emoji = item.querySelector('.gallery-emoji');
        if (image) {
          lightboxContent.src = image.currentSrc || image.src;
          lightboxContent.alt = image.alt;
          lightboxContent.style.display = '';
        } else if (emoji) {
          lightboxContent.removeAttribute('src');
          lightboxContent.alt = emoji.textContent;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxContent) {
        lightboxContent.removeAttribute('src');
        lightboxContent.alt = '';
      }
    }
  }

  // --- Scroll-triggered fade-in animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.glass-card, .gallery-item, .event-card, .product-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // --- Active nav link highlight ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Add to Cart (simple demo) ---
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const origText = btn.textContent;
      btn.textContent = '✓ Added to Cart!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
      }, 2000);
    });
  });

});
