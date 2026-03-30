const fs = require('fs');

// Read the original file (we know it has the issue with \n)
const filePath = './firebase-service-account.json';
const fileContent = fs.readFileSync(filePath, 'utf8');

// Parse JSON - this will interpret \n as literal backslash-n
const serviceAccount = JSON.parse(fileContent);

// The private key currently has both literal \n and newlines
// We need to clean it up
if (serviceAccount.private_key) {
  // First, split by newlines to get the actual lines
  const lines = serviceAccount.private_key.split('\n');

  // Join them back, but also ensure we remove any remaining \n literals
  serviceAccount.private_key = lines.join('\n').replace(/\\n/g, '\n');
}

// Write the corrected JSON back
// When we write with JSON.stringify, it will escape newlines again
// So we need to write it manually
const corrected = `{
  "type": "${serviceAccount.type}",
  "project_id": "${serviceAccount.project_id}",
  "private_key_id": "${serviceAccount.private_key_id}",
  "private_key": "${serviceAccount.private_key}",
  "client_email": "${serviceAccount.client_email}",
  "client_id": "${serviceAccount.client_id}",
  "auth_uri": "${serviceAccount.auth_uri}",
  "token_uri": "${serviceAccount.token_uri}",
  "auth_provider_x509_cert_url": "${serviceAccount.auth_provider_x509_cert_url}",
  "client_x509_cert_url": "${serviceAccount.client_x509_cert_url}",
  "universe_domain": "${serviceAccount.universe_domain}"
}`;

fs.writeFileSync(filePath, corrected);

console.log('✅ Firebase service account JSON file has been fixed');
console.log('✅ Private key now has actual newlines');
console.log('✅ Restart server to test');
