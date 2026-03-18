(function () {
  var escapeHtml = function (s) {
    if (!s) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  };

  const currentYear = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = currentYear;

  // Set min date for appointment to today
  const dateInput = document.getElementById('preferred-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Packages from packages-data.js: populate grid and dropdown
  if (window.PACKAGES_DATA && window.PACKAGES_DATA.PACKAGES) {
    var list = window.PACKAGES_DATA.PACKAGES;
    var formatPrice = window.PACKAGES_DATA.formatPrice;

    var gridEl = document.getElementById('packages-grid');
    if (gridEl) {
      gridEl.innerHTML = '';
      list.forEach(function (p) {
        var offPct = p.mrp > 0 ? Math.round((1 - p.offerPrice / p.mrp) * 100) : 0;
        var card = document.createElement('article');
        card.className = 'package-card' + (p.badge === 'Best value' ? ' featured' : '');
        var count = p.parameterCount;
        var hasTests = p.tests && p.tests.length > 0;
        var testsAttr = (p.tests && p.tests.length)
          ? JSON.stringify(p.tests).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          : '[]';
        var testTriggerHtml = (count || hasTests)
          ? '<button type="button" class="package-test-trigger" data-tests="' + testsAttr + '" data-package-name="' + escapeHtml(p.name) + '">' +
              '<strong>' + (count ? count + ' parameters' : 'View tests') + '</strong> <span class="package-test-trigger-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>' +
            '</button>'
          : '';
        card.innerHTML =
          (p.badge ? '<span class="package-badge">' + escapeHtml(p.badge) + '</span>' : '') +
          '<h3 class="package-name">' + escapeHtml(p.name) + '</h3>' +
          '<p class="package-desc">' + escapeHtml(p.description) + '</p>' +
          testTriggerHtml +
          '<div class="package-price">' +
          '<span class="price-current">' + escapeHtml(formatPrice(p.offerPrice)) + '</span>' +
          (p.mrp ? ' <span class="price-old">' + escapeHtml(formatPrice(p.mrp)) + '</span>' : '') +
          (offPct > 0 ? ' <span class="price-off">' + offPct + '% off</span>' : '') +
          '</div>' +
          '<a href="#book" class="btn btn-card' + (p.badge === 'Best value' ? ' btn-primary' : '') + '" data-package="' + escapeHtml(p.name) + '">Book Now</a>';
        gridEl.appendChild(card);
      });

      gridEl.addEventListener('click', function (e) {
        var trigger = e.target.closest('.package-test-trigger');
        if (!trigger) return;
        var tests = [];
        try {
          tests = JSON.parse(trigger.getAttribute('data-tests') || '[]');
        } catch (err) {}
        var name = trigger.getAttribute('data-package-name') || 'Tests';
        var modal = document.getElementById('tests-modal');
        var titleEl = modal && modal.querySelector('.tests-modal-title');
        var listEl = modal && modal.querySelector('.tests-modal-list');
        if (modal && titleEl && listEl) {
          titleEl.textContent = name;
          listEl.innerHTML = tests.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('');
          modal.hidden = false;
          document.body.style.overflow = 'hidden';
        }
      });
    }

    var selectEl = document.getElementById('package');
    if (selectEl) {
      var otherOpt = selectEl.querySelector('option[value="Other"]');
      list.forEach(function (p) {
        var opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = p.name + ' – ' + formatPrice(p.offerPrice);
        selectEl.insertBefore(opt, otherOpt);
      });
    }
  }

  // Tests modal: close on button or overlay (tap/click)
  (function () {
    var modal = document.getElementById('tests-modal');
    if (!modal) return;
    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
    modal.querySelector('.tests-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.tests-modal-overlay').addEventListener('click', closeModal);
  })();

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
      var percent = total > 0 ? (current * 100 / total) : 0;
      if (inner) inner.style.transform = 'translateX(-' + percent + '%)';
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
