import fs from 'fs';

const content = fs.readFileSync('d:/honey/scripts/generate-messages.mjs', 'utf8');
const lines = content.split('\n');

let msgs = [];
let inArr = false;

for (let i = 0; i < lines.length; i++) {
  const l = lines[i].trim();
  if (l === 'const RAW_MESSAGES = [') inArr = true;
  if (inArr && l === '];') break;
  if (inArr) {
    const match = l.match(/^\s*"(.+)"\s*,?\s*$/);
    if (match) msgs.push(match[1]);
  }
}

let over25 = 0;
let over30 = 0;
let over35 = 0;
let wordCounts = [];

msgs.forEach(msg => {
  const wc = msg.split(/\s+/).length;
  wordCounts.push(wc);
  if (wc > 25) over25++;
  if (wc > 30) over30++;
  if (wc > 35) over35++;
});

console.log('Total messages:', msgs.length);
console.log('Over 25 words:', over25, `(${(over25/msgs.length*100).toFixed(1)}%)`);
console.log('Over 30 words:', over30, `(${(over30/msgs.length*100).toFixed(1)}%)`);
console.log('Over 35 words:', over35, `(${(over35/msgs.length*100).toFixed(1)}%)`);

// Show the longest 10
const sorted = msgs.map((m) => ({ wc: m.split(/\s+/).length, msg: m }))
  .sort((a, b) => b.wc - a.wc)
  .slice(0, 15);

console.log('\n--- Longest messages ---');
sorted.forEach(s => console.log(`  ${s.wc} words: "${s.msg.substring(0, 90)}..."`));

// Distribution
const buckets = { '1-5': 0, '6-10': 0, '11-15': 0, '16-20': 0, '21-25': 0, '26-30': 0, '31-35': 0, '36+': 0 };
wordCounts.forEach(wc => {
  if (wc <= 5) buckets['1-5']++;
  else if (wc <= 10) buckets['6-10']++;
  else if (wc <= 15) buckets['11-15']++;
  else if (wc <= 20) buckets['16-20']++;
  else if (wc <= 25) buckets['21-25']++;
  else if (wc <= 30) buckets['26-30']++;
  else if (wc <= 35) buckets['31-35']++;
  else buckets['36+']++;
});

console.log('\n--- Word count distribution ---');
Object.entries(buckets).forEach(([k, v]) => console.log(`  ${k}: ${v} (${(v/msgs.length*100).toFixed(1)}%)`));
