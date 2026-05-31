const fs = require('fs');
const c = fs.readFileSync('scripts/generate-messages.mjs', 'utf8');

// Count {N} in TPL
const m1 = c.match(/const TPL = \[([\s\S]*?)\n\];/);
const tLines = m1[1].split('\n').filter(l => l.trim().startsWith('"'));
const tWithN = tLines.filter(l => l.includes('{N}'));
console.log(`TPL: ${tLines.length} total, ${tWithN.length} with {N}`);

// Count {N} in EXPAND
const m2 = c.match(/const EXPAND = \[([\s\S]*?)\n\];/);
const eLines = m2[1].split('\n').filter(l => l.trim().startsWith('"'));
const eWithN = eLines.filter(l => l.includes('{N}'));
console.log(`EXPAND: ${eLines.length} total, ${eWithN.length} with {N}`);

console.log(`\nTotal {N}: ${tWithN.length + eWithN.length} out of ${tLines.length + eLines.length}`);
