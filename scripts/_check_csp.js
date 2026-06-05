const https = require('https');

https.request('https://www.honeyifonly.com/', { method: 'HEAD' }, (res) => {
  console.log(res.headers['content-security-policy']);
}).end();
