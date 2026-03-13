
import https from 'https';

const apiKey = 'ninbvn_8aa6c00bb3dbcffeac156e00';
const baseUrl = 'https://ninbvnportal.com.ng/api';

async function testEndpoint(endpoint, method = 'POST', body = null) {
    const url = new URL(`${baseUrl}${endpoint}`);
    console.log(`Testing ${method} ${url}...`);
    
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
    };

    const postData = body ? JSON.stringify({ ...body, consent: true }) : null;
    if (postData) {
        headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const options = {
        method,
        headers,
        timeout: 10000
    };

    return new Promise((resolve) => {
        const req = https.request(url, options, (res) => {
            console.log(`  Status: ${res.statusCode}`);
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`  Data: ${data.substring(0, 100)}...`);
                resolve(true);
            });
        });

        req.on('error', (e) => {
            console.error(`  ERROR: ${e.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.error('  TIMEOUT');
            req.destroy();
            resolve(false);
        });

        if (postData) req.write(postData);
        req.end();
    });
}

async function runTests() {
    await testEndpoint('/balance', 'GET');
    // Testing with a fake NIN just to see the response
    await testEndpoint('/nin', 'POST', { nin: '12345678901' });
}

runTests();
