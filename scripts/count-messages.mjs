import { readFileSync } from 'fs';
const c = readFileSync('generate-messages.mjs', 'utf8');
const lines = c.split('\n');
let count = 0, inArr = false, endLine = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const RAW_MESSAGES')) inArr = true;
  if (inArr && lines[i].trim().startsWith('"')) count++;
  if (inArr && lines[i].trim() === '];') { endLine = i + 1; break; }
}
console.log(`Raw messages: ${count}`);
console.log(`Array ends at line: ${endLine}`);
console.log(`File total lines: ${lines.length}`);
