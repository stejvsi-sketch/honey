import fs from 'fs';

const content = fs.readFileSync('d:/honey/scripts/generate-messages.mjs', 'utf8');
const lines = content.split('\n');

let startLine = -1;
let endLine = -1;

for (let i = 0; i < lines.length; i++) {
  const l = lines[i].trim();
  if (l === 'const RAW_MESSAGES = [') startLine = i;
  if (startLine >= 0 && l === '];') { endLine = i; break; }
}

// Find all 25-word messages (likely trimmed) that don't end naturally
let suspicious = [];
for (let i = startLine; i <= endLine; i++) {
  const match = lines[i].match(/^\s*"(.+)"\s*,?\s*$/);
  if (!match) continue;
  
  const msg = match[1];
  const words = msg.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 25) {
    // Check if it ends mid-thought (doesn't end with natural punctuation or feels cut)
    const lastWord = words[24];
    const endsNaturally = /[.!?)\"]$/.test(msg.trim()) || 
                          ['u', 'me', 'it', 'ok', 'too', 'tho', 'rn', 'lol', 'ever', 'always', 'forever', 'love', 'sorry'].includes(lastWord);
    
    suspicious.push({ line: i + 1, msg, lastWord, endsNaturally });
  }
}

console.log(`Total 25-word messages: ${suspicious.length}`);
console.log(`\n--- ALL 25-word messages (likely trimmed) ---\n`);
suspicious.forEach(s => {
  const flag = s.endsNaturally ? '  ' : '⚠️';
  console.log(`${flag} Line ${s.line}: "${s.msg}"`);
});
