(function () {
  const currentYear = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = currentYear;

  // Set min date for appointment to today
  const dateInput = document.getElementById('preferred-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Prefill package from "Book Now" on package cards
  document.querySelectorAll('[data-package]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const pkg = this.getAttribute('data-package');
      const select = document.getElementById('package');
      if (select) {
        const option = Array.from(select.options).find(function (o) { return o.value === pkg; });
        if (option) select.value = option.value;
      }
    });
  });

  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const headerInner = document.querySelector('.header-inner');
  if (menuToggle && headerInner) {
    menuToggle.addEventListener('click', function () {
      headerInner.classList.toggle('nav-open');
    });
  }

  // Booking form submit
  const form = document.getElementById('booking-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim() || null;
    var packageVal = document.getElementById('package').value || null;
    var preferredDate = document.getElementById('preferred-date').value || null;
    var message = document.getElementById('message').value.trim() || null;

    if (!name || !phone) {
      setStatus('Please enter your name and phone number.', true);
      return;
    }

    if (phone.length !== 10) {
      setStatus('Please enter a valid 10-digit phone number.', true);
      return;
    }

    if (window.firebaseInitialized) {
      submitBtn.disabled = true;
      setStatus('Submitting...', false);

      var db = firebase.firestore();
      db.collection('appointments')
        .add({
          name: name,
          phone: phone,
          email: email,
          package: packageVal,
          preferredDate: preferredDate,
          message: message,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          source: 'shivanya-website',
        })
        .then(function () {
          setStatus('Thank you! We will call you shortly to confirm your appointment.', false);
          form.reset();
        })
        .catch(function (err) {
          setStatus('Something went wrong. Please call us at +91 63887 44465 to book.', true);
          console.error('Firebase error:', err);
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    } else {
      // No Firebase: show message to call
      setStatus('Booking is not configured yet. Please call us at +91 63887 44465 or +91 93365 95411 to book your appointment.', true);
    }
  });

  function setStatus(text, isError) {
    if (!formStatus) return;
    formStatus.textContent = text;
    formStatus.className = 'form-status' + (isError ? ' error' : ' success');
  }

  // Contact carousel: 3 images, auto-advance every 5s
  (function () {
    var carousel = document.getElementById('contact-carousel');
    if (!carousel) return;
    var inner = carousel.querySelector('.contact-carousel-inner');
    var slides = carousel.querySelectorAll('.contact-carousel-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var total = slides.length;
    if (total === 0) return;

    var current = 0;

    function goTo(index) {
      current = (index + total) % total;
      if (inner) inner.style.transform = 'translateX(-' + current * 100 + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        resetTimer();
      });
    });

    var interval = 5000;
    var timer;

    function next() {
      goTo(current + 1);
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, interval);
    }

    goTo(0);
    timer = setInterval(next, interval);
  })();
})();
