
console.log('Testing general connectivity from Node...');

const urls = [
    'https://google.com',
    'https://github.com',
    'https://ninbvnportal.com.ng/api/balance'
];

async function test() {
    for (const url of urls) {
        try {
            console.log(`Fetching ${url}...`);
            const start = Date.now();
            const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
            console.log(`  Success! Status: ${res.status} (${Date.now() - start}ms)`);
        } catch (err) {
            console.error(`  FAILED: ${url} error: ${err.message}`);
        }
    }
}

test();
