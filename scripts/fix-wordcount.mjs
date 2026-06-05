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

let overCount = 0;
let fixedCount = 0;
const newLines = [...lines];

for (let i = startLine; i <= endLine; i++) {
  const match = lines[i].match(/^(\s*)"(.+)"(,?\s*)$/);
  if (!match) continue;
  
  const indent = match[1];
  const msg = match[2];
  const trailing = match[3];
  
  const words = msg.split(/\s+/).filter(w => w.length > 0);
  if (words.length > 25) {
    overCount++;
    // Trim to 25 words
    const trimmed = words.slice(0, 25).join(' ');
    newLines[i] = `${indent}"${trimmed}"${trailing}`;
    fixedCount++;
    if (overCount <= 5) {
      console.log(`Line ${i+1}: ${words.length} -> 25 words`);
      console.log(`  BEFORE: "${msg.substring(0, 80)}..."`);
      console.log(`  AFTER:  "${trimmed.substring(0, 80)}..."`);
    }
  }
}

console.log(`\nTotal over 25: ${overCount}`);
console.log(`Fixed: ${fixedCount}`);

fs.writeFileSync('d:/honey/scripts/generate-messages.mjs', newLines.join('\n'), 'utf8');
console.log('File saved!');

// Verify
const verify = fs.readFileSync('d:/honey/scripts/generate-messages.mjs', 'utf8');
const vLines = verify.split('\n');
let stillOver = 0;
for (let i = 0; i < vLines.length; i++) {
  const m = vLines[i].match(/^(\s*)"(.+)"(,?\s*)$/);
  if (!m) continue;
  const wc = m[2].split(/\s+/).filter(w => w.length > 0).length;
  if (wc > 25) stillOver++;
}
console.log(`Verification - still over 25: ${stillOver}`);
