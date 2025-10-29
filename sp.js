async function loadTest() {
    const url = "https://lucifer.yutupprem0.workers.dev/?message=a";
    const requests = [];
    const maxRequests = 10; // Batas wajar untuk testing
    
    for (let i = 0; i < maxRequests; i++) {
        requests.push(
            fetch(url)
                .then(response => console.log(`Request ${i}: ${response.status}`))
                .catch(error => console.log(`Request ${i} failed: ${error}`))
        );
    }
    
    await Promise.all(requests);
    console.log("Testing selesai");
}
