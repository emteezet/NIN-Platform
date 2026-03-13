const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

async function supabaseRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${supabaseUrl}${path}`);
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'apikey': supabaseServiceRoleKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : null;
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`Supabase error (${res.statusCode}): ${JSON.stringify(json)}`));
          }
        } catch (e) {
          reject(new Error(`Invalid JSON: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function checkWallet(email) {
  console.log(`Checking wallet for: ${email}`);
  
  try {
    // 1. Find profile
    const profiles = await supabaseRequest(`/rest/v1/profiles?email=eq.${encodeURIComponent(email)}&select=id,email`);
    const profile = profiles[0];

    if (!profile) {
      console.error("Profile not found for email:", email);
      return;
    }

    console.log(`Profile ID: ${profile.id}`);

    // 2. Find wallet
    const wallets = await supabaseRequest(`/rest/v1/wallets?user_id=eq.${profile.id}&select=id,user_id`);
    const wallet = wallets[0];

    if (!wallet) {
      console.error("Wallet not found for profile ID:", profile.id);
      return;
    }

    console.log(`Wallet ID: ${wallet.id}`);

    // 3. Get transactions
    const transactions = await supabaseRequest(`/rest/v1/transactions?wallet_id=eq.${wallet.id}&select=*&order=created_at.desc`);

    console.log(`\nTransactions Found: ${transactions.length}`);
    let computedBalance = 0;
    
    transactions.forEach(t => {
      console.log(`- [${t.created_at}] ${t.type}: ${t.amount} (Ref: ${t.reference || 'N/A'})`);
      computedBalance += Number(t.amount);
    });

    console.log(`\nFinal Computed Balance: ₦${computedBalance}`);
  } catch (err) {
    console.error("Diagnostic failed:");
    console.error(err);
  }
}

const email = process.argv[2];
if (!email) {
  console.log("Usage: node scripts/check-wallet.js <email>");
} else {
  checkWallet(email).catch(console.error);
}
