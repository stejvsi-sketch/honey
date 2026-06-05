const https = require('https');

const options = {
  hostname: 'honeyifonly.com',
  path: '/ads.txt',
  method: 'HEAD',
  headers: {
    'User-Agent': 'Mediapartners-Google'
  }
};

https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Location:', res.headers.location);
}).end();
