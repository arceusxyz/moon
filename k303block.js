// blokir-kominfo.js
(function () {
  // ---- KONFIGURASI (ubah sesuai kebutuhan) ----
  //const OWNER_NAME = "Nama Pemilik / Pemilik Situs"; // ganti nama owner
  const GOOGLE_MAPS_URL = "https://www.google.com/maps?ll=-6.177,106.6284&z=12&t=m&hl=en-US&gl=US&mapclient=embed&q=6%C2%B010%2737.2%22S+106%C2%B037%2742.2%22E+-6.177000,+106.628400@-6.177,106.6284"; // ganti url Google Maps
  const SHOW_MAP = true; // tampilkan link maps jika true
  const SHOW_COPY_IP_BUTTON = true; // tampilkan tombol salin IP
  const TITLE_TEXT = "Situs diblokir oleh Kementerian Komunikasi dan Informatika (Kominfo)";
  // ---------------------------------------------

  // helper: escape text untuk keamanan
  function esc(s) {
    if (!s && s !== 0) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // buat markup HTML
  function buildHtml(ipText) {
    return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(TITLE_TEXT)}</title>
  <style>
    html,body {height:100%;margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial;}
    .wrap {box-sizing:border-box;min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;background:linear-gradient(180deg,#f8fafc,#ffffff);}
    .card {max-width:880px;width:100%;border-radius:12px;padding:28px;background:#fff;box-shadow:0 12px 40px rgba(2,6,23,0.08);border:1px solid rgba(2,6,23,0.04);}
    .header {display:flex;gap:16px;align-items:center;}
    .badge {background:#111827;color:#fff;padding:6px 10px;border-radius:6px;font-weight:700;font-size:14px;}
    h1 {margin:0;font-size:20px;color:#111827;}
    p.desc {margin:10px 0 18px;color:#374151;}
    .info {display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;}
    .info .row {padding:12px;border-radius:8px;background:#f3f4f6;border:1px solid rgba(2,6,23,0.04);}
    .info .label {font-size:12px;color:#6b7280;margin-bottom:6px;}
    .info .value {font-weight:700;color:#111827;word-break:break-word;}
    .actions {margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;}
    .btn {padding:10px 14px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;border:0;cursor:pointer}
    .btn-primary {background:#0ea5a4;color:#fff}
    .btn-secondary {background:#e6e9ef;color:#111827}
    .small {font-size:12px;color:#6b7280;margin-top:14px;}
    footer {margin-top:18px;font-size:12px;color:#9ca3af;text-align:center;}
    @media (max-width:640px){ .info{grid-template-columns:1fr} .card{padding:18px} h1{font-size:18px} }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card" role="main" aria-labelledby="blocked-title">
      <div class="header">
        <div class="badge">PENGUMUMAN</div>
        <div style="flex:1">
          <h1 id="blocked-title">${esc(TITLE_TEXT)}</h1>
          <p class="desc">Akses ke situs ini dibatasi sementara. Informasi pemilik situs dan lokasi dapat dilihat di bawah.</p>
        </div>
      </div>

      <div class="info" aria-live="polite">
        

        <div class="row">
          <div class="label">IP Pemilik</div>
          <div class="value" id="owner-ip">${esc(ipText || "Sedang mengambil...")}</div>
        </div>

        <div class="row" style="grid-column:1 / -1;">
          <div class="label">Lokasi (Google Maps)</div>
          <div class="value">
            ${SHOW_MAP ? `<a id="maps-link" href="${esc(GOOGLE_MAPS_URL)}" target="_blank" rel="noopener noreferrer">${esc(GOOGLE_MAPS_URL)}</a>` : `<span>-</span>`}
          </div>
        </div>
      </div>

      <div class="actions">
        ${SHOW_MAP ? `<a class="btn btn-primary" id="maps-open" href="${esc(GOOGLE_MAPS_URL)}" target="_blank" rel="noopener noreferrer">Buka Google Maps</a>` : ""}
        ${SHOW_COPY_IP_BUTTON ? `<button class="btn btn-secondary" id="copy-ip">Salin IP</button>` : ""}
      </div>

      <div class="small">Jika informasi ini tidak benar, hubungi administrator situs untuk klarifikasi.</div>
      <footer>Halaman ini dibuat untuk tujuan pemberitahuan. Tidak ada tindakan otomatis diambil.</footer>
    </div>
  </div>

  <script>
    (function () {
      // button salin IP
      var copyBtn = document.getElementById('copy-ip');
      if (copyBtn) {
        copyBtn.addEventListener('click', function () {
          var ipText = document.getElementById('owner-ip').textContent || '';
          if (!ipText || ipText.toLowerCase().includes('sedang')) {
            alert('IP belum tersedia untuk disalin.');
            return;
          }
          navigator.clipboard && navigator.clipboard.writeText(ipText).then(function () {
            alert('IP disalin ke clipboard:\\n' + ipText);
          }, function () {
            alert('Gagal menyalin. IP:\\n' + ipText);
          });
        });
      }
    })();
  </script>
</body>
</html>`;
  }

  // fungsi utama: ambil IP publik dari layanan lalu render
  function fetchIpAndRender() {
    // layanan utama
    var services = [
      'https://api.ipify.org?format=json',
      'https://ifconfig.co/json'
    ];

    // coba satu per satu
    var tried = 0;
    function tryNext() {
      if (tried >= services.length) {
        renderWithIp("Tidak dapat mengambil IP");
        return;
      }
      var url = services[tried++];
      fetch(url, {method: 'GET', mode: 'cors'})
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (j) {
          // struktur bisa berbeda: ip atau ip_address or ip
          var ip = j.ip || j.ip_address || j.IP || j.address || (typeof j === 'string' ? j : null);
          if (!ip && typeof j === 'string') ip = j;
          if (!ip) throw new Error('No ip in response');
          renderWithIp(ip);
        })
        .catch(function () {
          tryNext();
        });
    }

    tryNext();
  }

  function renderWithIp(ipText) {
    // ganti seluruh dokumen
    try {
      var newHtml = buildHtml(ipText);
      // replace entire document (lebih pasti menggantikan semua)
      document.open('text/html', 'replace');
      document.write(newHtml);
      document.close();
    } catch (e) {
      // fallback: ganti body saja
      document.body.innerHTML = buildHtml(ipText);
    }
  }

  // jalankan
  fetchIpAndRender();
})();
