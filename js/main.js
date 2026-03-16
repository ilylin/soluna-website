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

  // --- Newsletter form handler ---
  document.querySelectorAll('.newsletter-form, .footer-newsletter').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const successMsg = form.parentElement.querySelector('.newsletter-success');

      if (input && input.value) {
        // In production, this would POST to an email service API (Mailchimp, ConvertKit, etc.)
        console.log('Newsletter signup:', input.value);
        input.value = '';

        if (successMsg) {
          successMsg.classList.add('show');
          setTimeout(() => successMsg.classList.remove('show'), 4000);
        } else {
          const btn = form.querySelector('button');
          const origText = btn.textContent;
          btn.textContent = '✓ Subscribed!';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = origText;
            btn.disabled = false;
          }, 3000);
        }
      }
    });
  });

  // --- Contact form handler ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // In production, POST to a form backend (Formspree, Netlify Forms, etc.)
      const formData = new FormData(contactForm);
      console.log('Contact form submitted:', Object.fromEntries(formData));

      const btn = contactForm.querySelector('button[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.disabled = true;
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = origText;
        btn.disabled = false;
      }, 4000);
    });
  }

  // --- Gallery Lightbox ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      if (lightbox && lightboxContent) {
        const emoji = item.querySelector('.gallery-emoji');
        const caption = item.querySelector('.overlay')?.textContent || '';
        if (emoji) {
          lightboxContent.textContent = emoji.textContent;
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
