async function properLoadTest() {
    const url = "https://lucifer.yutupprem0.workers.dev/?message=a";
    const testConfig = {
        concurrentUsers: 5,
        requestsPerUser: 20,
        delayBetweenBatches: 1000 // ms
    };
    
    let successCount = 0;
    let errorCount = 0;
    const startTime = Date.now();
    
    for (let batch = 0; batch < testConfig.concurrentUsers; batch++) {
        const batchRequests = [];
        
        for (let i = 0; i < testConfig.requestsPerUser; i++) {
            batchRequests.push(
                fetch(url)
                    .then(response => {
                        successCount++;
                        console.log(`✅ Success: ${response.status}`);
                        return response;
                    })
                    .catch(error => {
                        errorCount++;
                        console.log(`❌ Error: ${error.message}`);
                    })
            );
        }
        
        await Promise.all(batchRequests);
        console.log(`Batch ${batch + 1} completed`);
        
        if (batch < testConfig.concurrentUsers - 1) {
            await new Promise(resolve => setTimeout(resolve, testConfig.delayBetweenBatches));
        }
    }
    
    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`
📊 Test Results:
✅ Successful: ${successCount}
❌ Errors: ${errorCount}
⏱️ Total Time: ${totalTime}s
📈 RPS: ${(successCount / totalTime).toFixed(2)} requests/second
    `);
}

// Jalankan test
properLoadTest();
