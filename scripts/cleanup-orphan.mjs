import fs from 'fs';

const content = fs.readFileSync('d:/honey/scripts/generate-messages.mjs', 'utf8');
const lines = content.split('\n');

// Find RAW_MESSAGES array end
let rawStart = -1;
let rawEnd = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const RAW_MESSAGES = [')) rawStart = i;
  if (rawStart >= 0 && rawEnd < 0 && lines[i].trim() === '];') rawEnd = i;
}

console.log(`RAW_MESSAGES: line ${rawStart + 1} to ${rawEnd + 1}`);

// Find next ]; after rawEnd (the orphaned one)
let orphanEnd = -1;
for (let i = rawEnd + 1; i < lines.length; i++) {
  if (lines[i].trim() === '];') {
    orphanEnd = i;
    break;
  }
}

if (orphanEnd > 0) {
  console.log(`Orphaned ]; at line ${orphanEnd + 1}`);
  
  // Check if there's string content between rawEnd and orphanEnd
  let hasStrings = false;
  for (let i = rawEnd + 1; i < orphanEnd; i++) {
    if (lines[i].trim().startsWith('"')) { hasStrings = true; break; }
  }
  
  if (hasStrings) {
    console.log('Found orphaned string content, removing...');
    const before = lines.slice(0, rawEnd + 1);
    const after = lines.slice(orphanEnd + 1);
    const newLines = [...before, '', '', ...after];
    fs.writeFileSync('d:/honey/scripts/generate-messages.mjs', newLines.join('\n'), 'utf8');
    console.log(`Removed lines ${rawEnd + 2} to ${orphanEnd + 1} (${orphanEnd - rawEnd} lines)`);
  } else {
    console.log('No orphaned strings found');
  }
} else {
  console.log('No orphan ]; found - file is clean');
}
