
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

const apiKey = 'ninbvn_8aa6c00bb3dbcffeac156e00';
const baseUrl = 'https://ninbvnportal.com.ng/api';

async function testWithCurl(endpoint) {
    const url = `${baseUrl}${endpoint}`;
    console.log(`Testing CURL for ${url}...`);
    
    // Simple GET for balance
    const command = `curl -s -H "x-api-key: ${apiKey}" "${url}"`;
    
    try {
        const { stdout, stderr } = await execPromise(command);
        console.log('  STDOUT:', stdout.substring(0, 100));
        if (stderr) console.error('  STDERR:', stderr);
    } catch (e) {
        console.error('  EXEC ERROR:', e.message);
    }
}

testWithCurl('/balance');
