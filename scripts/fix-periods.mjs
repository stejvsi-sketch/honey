import fs from 'fs';

const filePath = 'd:/honey/scripts/generate-messages.mjs';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find RAW_MESSAGES array boundaries
let startLine = -1, endLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const RAW_MESSAGES = [')) startLine = i;
  if (startLine >= 0 && endLine < 0 && lines[i].trim() === '];') endLine = i;
}

let fixCount = 0;
let overCount = 0;

for (let i = startLine; i <= endLine; i++) {
  const match = lines[i].match(/^(\s*)"(.+)"(,?\s*)$/);
  if (!match) continue;
  
  let msg = match[1 + 1]; // match[2]
  const indent = match[1];
  const trail = match[3];
  
  // Count mid-sentence periods (not at the very end, not in abbreviations like mr. mrs. etc.)
  // Split by '. ' to count sentence breaks
  const periodBreaks = (msg.match(/\.\s+[a-z]/g) || []).length;
  
  if (periodBreaks >= 3) {
    // Too many period breaks - randomly remove some
    // Strategy: keep the first period break, remove 40-70% of the rest
    let breakIndex = 0;
    msg = msg.replace(/\.\s+([a-z])/g, (match, nextChar) => {
      breakIndex++;
      if (breakIndex === 1) return `. ${nextChar}`; // keep first one sometimes
      
      const rand = Math.random();
      if (rand < 0.45) {
        // Remove period, just use space
        return ` ${nextChar}`;
      } else if (rand < 0.65) {
        // Replace with comma
        return `, ${nextChar}`;
      } else if (rand < 0.80) {
        // Replace with " and "
        return ` and ${nextChar}`;
      } else {
        // Keep as is
        return `. ${nextChar}`;
      }
    });
    
    lines[i] = `${indent}"${msg}"${trail}`;
    fixCount++;
  } else if (periodBreaks === 2) {
    // Sometimes fix these too (30% chance)
    if (Math.random() < 0.35) {
      let breakIndex = 0;
      msg = msg.replace(/\.\s+([a-z])/g, (match, nextChar) => {
        breakIndex++;
        if (breakIndex <= 1) return `. ${nextChar}`;
        const rand = Math.random();
        if (rand < 0.5) return ` ${nextChar}`;
        if (rand < 0.75) return `, ${nextChar}`;
        return `. ${nextChar}`;
      });
      lines[i] = `${indent}"${msg}"${trail}`;
      fixCount++;
    }
  }
  
  // Also fix word count while we're here
  const words = msg.split(/\s+/).filter(w => w.length > 0);
  if (words.length > 25) {
    msg = words.slice(0, 25).join(' ');
    lines[i] = `${indent}"${msg}"${trail}`;
    overCount++;
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log(`Fixed ${fixCount} messages with excessive periods`);
console.log(`Trimmed ${overCount} messages over 25 words`);

// Stats after fix
const newContent = fs.readFileSync(filePath, 'utf8');
const newLines = newContent.split('\n');
let totalPeriodHeavy = 0;
let totalMsgs = 0;
for (const l of newLines) {
  const m = l.match(/^\s*"(.+)"\s*,?\s*$/);
  if (!m) continue;
  totalMsgs++;
  const breaks = (m[1].match(/\.\s+[a-z]/g) || []).length;
  if (breaks >= 3) totalPeriodHeavy++;
}
console.log(`\nAfter fix: ${totalPeriodHeavy}/${totalMsgs} messages still have 3+ period breaks`);
