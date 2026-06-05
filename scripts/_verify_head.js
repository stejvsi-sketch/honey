const https = require('https');

https.get('https://www.honeyifonly.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const titleMatch = data.match(/<title>([\s\S]*?)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
    if (data.includes('adsbygoogle.js')) {
      console.log('adsbygoogle.js is somewhere in the document!');
    } else {
      console.log('adsbygoogle.js is entirely missing!');
    }
  });
}).on('error', (err) => console.error(err));
