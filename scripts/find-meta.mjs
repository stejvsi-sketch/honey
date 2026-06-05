import fs from 'fs';

const filePath = 'd:/honey/scripts/generate-messages.mjs';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find RAW_MESSAGES boundaries
let startLine = -1, endLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const RAW_MESSAGES = [')) startLine = i;
  if (startLine >= 0 && endLine < 0 && lines[i].trim() === '];') endLine = i;
}

// Find all meta/community messages that aren't directed at a specific person
const metaPatterns = [
  /^to whoever/i,
  /^to everyone/i,
  /^to the person who/i,
  /^to the person reading/i,
  /^to the person working/i,
  /^to whoever runs/i,
  /^to whoever made/i,
  /^to whoever created/i,
  /^to whoever invented/i,
  /^to whoever is on/i,
  /^to whoever is reading/i,
  /^to whoever is also/i,
  /^to whoever is crying/i,
  /^to whoever is debating/i,
  /^to whoever is typing/i,
  /^to whoever is too/i,
  /^to whoever is on their/i,
  /^to whoever is pretending/i,
  /^to whoever is writing/i,
  /^to whoever is stress/i,
  /^to whoever is scrolling/i,
  /^to whoever is having/i,
  /^to whoever is lying/i,
  /^to whoever else/i,
  /^to whoever just/i,
  /^to whoever keeps/i,
  /^to whoever needs/i,
  /^to whoever lost/i,
  /^to whoever submitted/i,
  /^to whoever submits/i,
  /^to whoever posts/i,
  /^to whoever writes/i,
  /^to whoever left/i,
  /^to whoever hurt/i,
  /^to whoever found/i,
  /^to whoever got/i,
  /^to whoever reads/i,
  /^to the stranger/i,
  /^to the random person/i,
  /^to the barista/i,
  /^to the server/i,
  /^to the uber/i,
  /^to the nurse/i,
  /^to the bus driver/i,
  /^to the mailman/i,
  /^to the delivery/i,
  /^to the security guard/i,
  /^to the crossing guard/i,
  /^to the janitor/i,
  /^to the old man/i,
  /^to the girl at the gym/i,
  /^to the girl who held/i,
  /^to the girl in my math/i,
  /^to the girl from camp/i,
  /^to the boy at the coffee/i,
  /^to the person at the pharmacy/i,
  /^to the person i accidentally/i,
  /^to the kid who smiled/i,
  /^to anyone whos afraid/i,
  /^to anyone reading this/i,
  /^to the universe/i,
  /^hey u\. yeah u reading/i,
  /^hey admin/i,
  /^hey just checking in on everyone/i,
  /^hey does anyone else/i,
  /^hey to everyone who found/i,
  /^hey to the person/i,
  /^hey to the one/i,
  /^hey to whoever/i,
  /^imagine explaining this website/i,
  /^can someone pls tell me why i keep coming back to this site/i,
  /^shoutout to everyone/i,
  /this website knows more/i,
  /^ok im actually going to bed/i,
  /^lol jk im still here/i,
  /^ok NOW im going/i,
  /^im gonna stop coming to this website/i,
  /^im done now for real/i,
  /^note to self/i,
  /^dear future me/i,
  /^dear god if/i,
  /^to my future self/i,
  /^to my future partner/i,
  /^to my future kid/i,
  /^this is my \d+th time on this site/i,
  /^this site has heard/i,
  /^im on this site so often/i,
  /^im at \d+ messages/i,
  /^this is message number/i,
  /^im on message who/i,
  /^i wrote u \d+ messages tonight/i,
  /^im adding this to the pile/i,
];

let metaMessages = [];
for (let i = startLine; i <= endLine; i++) {
  const match = lines[i].match(/^\s*"(.+)"\s*,?\s*$/);
  if (!match) continue;
  
  const msg = match[1];
  for (const pattern of metaPatterns) {
    if (pattern.test(msg)) {
      metaMessages.push({ line: i + 1, msg: msg.substring(0, 80) });
      break;
    }
  }
}

console.log(`Found ${metaMessages.length} meta/non-person-directed messages:\n`);
metaMessages.forEach(m => {
  console.log(`  Line ${m.line}: "${m.msg}..."`);
});
