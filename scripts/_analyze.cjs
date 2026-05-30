// Analyze the generated seed-messages.json for repetition problems
const data = require('./seed-messages.json');

console.log('=== REPETITION ANALYSIS ===\n');
console.log('Total messages:', data.length);

// 1. Check name-in-body frequency
let nameInBody = 0;
data.forEach(e => { if (e.message.includes(e.name)) nameInBody++; });
console.log(`\nNames in message body: ${nameInBody} (${(nameInBody/data.length*100).toFixed(1)}%)`);

// 2. First-word frequency
const firstWord = {};
data.forEach(e => {
  const w = e.message.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g,'');
  if (w) firstWord[w] = (firstWord[w]||0) + 1;
});
console.log('\nTop 20 first words:');
Object.entries(firstWord).sort((a,b)=>b[1]-a[1]).slice(0,20).forEach(([w,n]) => {
  console.log(`  "${w}": ${n} (${(n/data.length*100).toFixed(1)}%)`);
});

// 3. First 3-word patterns
const pat3 = {};
data.forEach(e => {
  const p = e.message.split(/\s+/).slice(0,3).join(' ').toLowerCase();
  pat3[p] = (pat3[p]||0) + 1;
});
const over20 = Object.entries(pat3).filter(([,n]) => n > 20).sort((a,b) => b[1]-a[1]);
console.log(`\n3-word patterns appearing >20 times: ${over20.length}`);
over20.forEach(([p,n]) => console.log(`  "${p}": ${n}`));

// 4. First 5-word patterns
const pat5 = {};
data.forEach(e => {
  const p = e.message.split(/\s+/).slice(0,5).join(' ').toLowerCase();
  pat5[p] = (pat5[p]||0) + 1;
});
const over10_5 = Object.entries(pat5).filter(([,n]) => n > 10).sort((a,b) => b[1]-a[1]);
console.log(`\n5-word patterns appearing >10 times: ${over10_5.length}`);
over10_5.slice(0,30).forEach(([p,n]) => console.log(`  "${p}": ${n}`));

// 5. Exact message length distribution
const lengths = {};
data.forEach(e => {
  const wc = e.message.split(/\s+/).length;
  const bucket = wc <= 5 ? '1-5' : wc <= 10 ? '6-10' : wc <= 15 ? '11-15' : wc <= 20 ? '16-20' : '21-25';
  lengths[bucket] = (lengths[bucket]||0) + 1;
});
console.log('\nWord count distribution:');
Object.entries(lengths).forEach(([b,n]) => console.log(`  ${b} words: ${n} (${(n/data.length*100).toFixed(1)}%)`));
