(function () {
  'use strict';

  var PAGE_SIZE = 100;
  var SESSION_KEY = 'shivanya_admin_session';

  var loginView = document.getElementById('admin-login-view');
  var dashboardView = document.getElementById('admin-dashboard');
  var loginForm = document.getElementById('admin-login-form');
  var loginError = document.getElementById('admin-login-error');
  var adminEmailInput = document.getElementById('admin-email');
  var adminPasswordInput = document.getElementById('admin-password');
  var listEl = document.getElementById('admin-list');
  var paginationEl = document.getElementById('admin-pagination');
  var emptyEl = document.getElementById('admin-empty');

  function showLogin() {
    if (loginView) loginView.style.display = 'block';
    if (dashboardView) dashboardView.style.display = 'none';
  }

  function showDashboard() {
    if (loginView) loginView.style.display = 'none';
    if (dashboardView) dashboardView.style.display = 'block';
    loadBookings();
  }

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  }

  function setLoggedIn(value) {
    if (value) sessionStorage.setItem(SESSION_KEY, 'true');
    else sessionStorage.removeItem(SESSION_KEY);
  }

  // —— Remote Config: fetch and compare credentials ——
  function getRemoteConfigCredentials() {
    return new Promise(function (resolve) {
      if (!window.firebaseInitialized || !firebase.remoteConfig) {
        resolve({ email: '', password: '' });
        return;
      }
      var rc = firebase.remoteConfig();
      rc.settings.minimumFetchIntervalMillis = 60000;
      rc.defaultConfig = {
        admin_email: '',
        admin_password: ''
      };
      rc.fetchAndActivate()
        .then(function () {
          var email = rc.getValue('admin_email').asString();
          var password = rc.getValue('admin_password').asString();
          resolve({ email: email || '', password: password || '' });
        })
        .catch(function () {
          resolve({ email: '', password: '' });
        });
    });
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (adminEmailInput && adminEmailInput.value) ? adminEmailInput.value.trim() : '';
    var password = adminPasswordInput ? adminPasswordInput.value : '';
    if (!email || !password) {
      if (loginError) {
        loginError.textContent = 'Enter email and password.';
        loginError.style.display = 'block';
      }
      return;
    }
    if (loginError) loginError.style.display = 'none';

    getRemoteConfigCredentials().then(function (creds) {
      if (creds.email === email && creds.password === password) {
        setLoggedIn(true);
        showDashboard();
      } else {
        if (loginError) {
          loginError.textContent = 'Invalid email or password.';
          loginError.style.display = 'block';
        }
      }
    });
  });

  document.getElementById('admin-logout').addEventListener('click', function () {
    setLoggedIn(false);
    showLogin();
  });

  // —— Filters: today, 1 week, 1 month, all ——
  function getFilterBounds(filter) {
    var now = new Date();
    var start;
    if (filter === 'today') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    } else if (filter === 'week') {
      start = new Date(now);
      start.setDate(start.getDate() - 7);
    } else if (filter === 'month') {
      start = new Date(now);
      start.setMonth(start.getMonth() - 1);
    } else {
      start = null;
    }
    return start ? firebase.firestore.Timestamp.fromDate(start) : null;
  }

  var currentFilter = 'today';
  var lastDoc = null;

  function loadBookings(forward) {
    if (!window.firebaseInitialized || !firebase.firestore) {
      listEl.innerHTML = '<p class="admin-empty">Firebase is not configured.</p>';
      return;
    }
    var db = firebase.firestore();
    var q = db.collection('appointments').orderBy('createdAt', 'desc').limit(PAGE_SIZE);

    var startBound = getFilterBounds(currentFilter);
    if (startBound) {
      q = q.where('createdAt', '>=', startBound);
    }

    if (forward && lastDoc) {
      q = q.startAfter(lastDoc);
    } else {
      lastDoc = null;
    }

    listEl.innerHTML = '<p>Loading…</p>';
    paginationEl.style.display = 'none';
    emptyEl.style.display = 'none';

    q.get().then(function (snapshot) {
      if (snapshot.docs.length > 0) lastDoc = snapshot.docs[snapshot.docs.length - 1];

      listEl.innerHTML = '';
      snapshot.docs.forEach(function (docSnap) {
        var d = docSnap.data();
        var id = docSnap.id;
        var createdAt = d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate() : new Date(d.createdAt.seconds * 1000)) : null;
        var dateStr = createdAt ? createdAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
        var done = !!d.done;

        var card = document.createElement('div');
        card.className = 'admin-card' + (done ? ' done' : '');
        card.innerHTML =
          '<h3>' + escapeHtml(d.name || '—') + '</h3>' +
          '<div class="meta">' +
            '<span>📞 ' + (d.phone ? '<a href="tel:' + escapeHtml(d.phone.replace(/[^0-9+]/g, '')) + '">' + escapeHtml(d.phone) + '</a>' : '—') + '</span>' +
            (d.email ? '<span>✉️ ' + escapeHtml(d.email) + '</span>' : '') +
            '<span>📅 ' + dateStr + '</span>' +
          '</div>' +
          (d.package ? '<p class="meta"><strong>Package:</strong> ' + escapeHtml(d.package) + '</p>' : '') +
          (d.preferredDate ? '<p class="meta"><strong>Preferred date:</strong> ' + escapeHtml(d.preferredDate) + '</p>' : '') +
          (d.message ? '<div class="message">' + escapeHtml(d.message) + '</div>' : '') +
          '<div class="row">' +
            (done ? '<span class="badge-done">✓ Contacted</span>' : '<button type="button" class="btn-done" data-id="' + escapeHtml(id) + '">Mark as done</button>') +
          '</div>';
        listEl.appendChild(card);
      });

      if (snapshot.docs.length === 0 && !forward) {
        emptyEl.style.display = 'block';
      }
      if (snapshot.docs.length >= PAGE_SIZE) {
        paginationEl.style.display = 'flex';
        paginationEl.innerHTML =
          '<button type="button" id="admin-prev">First page</button>' +
          '<span class="page-info">100 per page</span>' +
          '<button type="button" id="admin-next">Next</button>';
        paginationEl.querySelector('#admin-next').addEventListener('click', function () { loadBookings(true); });
        paginationEl.querySelector('#admin-prev').addEventListener('click', function () { lastDoc = null; loadBookings(false); });
      }
    }).catch(function (err) {
      console.error(err);
      listEl.innerHTML = '<p class="admin-empty">Could not load bookings. Check Firestore rules (read allowed for appointments).</p>';
    });
  }

  function escapeHtml(s) {
    if (s == null) return '';
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  listEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-done');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    if (!id) return;
    btn.disabled = true;
    var db = firebase.firestore();
    db.collection('appointments').doc(id).update({ done: true }).then(function () {
      var card = btn.closest('.admin-card');
      if (card) {
        card.classList.add('done');
        var row = card.querySelector('.row');
        if (row) {
          row.innerHTML = '<span class="badge-done">✓ Contacted</span>';
        }
      }
    }).catch(function (err) {
      console.error(err);
      btn.disabled = false;
    });
  });

  document.querySelectorAll('.admin-filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.admin-filter').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'today';
      lastDoc = null;
      loadBookings(false);
    });
  });

  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
})();
