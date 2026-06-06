// Remove flagged messages from unsent-data.ts
// After manual review of the scan results, these IDs are confirmed AdSense-risk:
import fs from 'fs';

// IDs to REMOVE — confirmed problematic content after manual review
// Includes: profanity, slurs, sexual accusations, insults, hate
const REMOVE_IDS = new Set([
  56,   // "Keep the fuck away from her"
  67,   // "you fucking idiot ... wanna vomit ... wanting to fuck your husband"
  70,   // "cringed as fuck"
  75,   // "crazy ass hoe"
  76,   // "miss you so fucking much" + asshole
  124,  // "Fuck. I KNOW I'm overthinking"
  129,  // "turn around and fuck my ex. Your just as pathetic"
  154,  // "lost my shit"
  165,  // "racist dick of a man child"
  228,  // "Crack Whore"
  233,  // "intuition was fucking right"
  300,  // "I hate you you dick"
  341,  // "Are you fucking with me"
  346,  // "Fuck u for fucking ur cousin... Disgusting incest fucker"
  377,  // "rot in hell... complete lying dick"
  540,  // "I still fucking love you"
  806,  // "miss you so fucking much"
  844,  // "You protect pedophiles" — accusations
  904,  // "Ur an asshole... god damn asshole"
  1044, // "sorry... fucking"
  1095, // "I fucking loved you"
  1230, // "fuck me up"
  1264, // "Fuck you bro"
  1319, // "fuck u bitch"
  1395, // "You fucked my mental health"
  1439, // "bullshit"
]);

// IDs explicitly KEPT — reviewed as false positives or contextually safe:
// 12   — "stab" used metaphorically ("You could stab me and I'd still pull you closer")
// 268  — "damn" in poetry context ("a damn ready to break")
// 304  — "ass" part of "sapiosexual ass" (compound)
// 326  — "shit" in "People make shit up" — borderline but common expression (REMOVE)
// 562  — "abuse" used by victim describing parental manipulation (survivor context — KEEP)
// 660  — "damn" in reflective context
// 754  — "xxx" used as kisses
// 811  — "damn" in "every damn day" — common expression
// 1323 — "fucking up" (self-blame) — less vulgar but still profane (REMOVE)
// 1391 — "xxx" used as kisses
// 1432 — "CP" is place name, "shoot" is photography
// 1442 — "shit" in "get anxiety if your partner talks shit" (REMOVE)
// 1458 — "asshole" self-directed apology (REMOVE)
// 1464 — "damn" in goodbye letter

// After borderline review, also add these:
REMOVE_IDS.add(326);   // "People make shit up"
REMOVE_IDS.add(1323);  // "kept fucking up"
REMOVE_IDS.add(1442);  // "talks shit"
REMOVE_IDS.add(1458);  // "being an asshole"

const content = fs.readFileSync('d:/honey/lib/unsent-data.ts', 'utf8');
const lines = content.split('\n');

const newLines = [];
let removedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/\{\s*id:\s*(\d+)/);
  
  if (idMatch && REMOVE_IDS.has(parseInt(idMatch[1], 10))) {
    removedCount++;
    continue; // Skip this line
  }
  
  newLines.push(line);
}

// Now renumber all IDs sequentially and update constants
let newId = 1;
const finalLines = newLines.map(line => {
  const idMatch = line.match(/^(\s*\{\s*id:\s*)(\d+)(,.*)/);
  if (idMatch) {
    const result = `${idMatch[1]}${newId}${idMatch[3]}`;
    newId++;
    return result;
  }
  return line;
});

// Update the total count references
const newTotal = newId - 1;
const output = finalLines.join('\n')
  .replace(/1471 records/, `${newTotal} records`)
  .replace(/Math\.ceil\(1471\s*\//, `Math.ceil(${newTotal} /`);

fs.writeFileSync('d:/honey/lib/unsent-data.ts', output, 'utf8');

console.log(`\n=== REMOVAL COMPLETE ===`);
console.log(`Removed: ${removedCount} messages`);
console.log(`Remaining: ${newTotal} messages`);
console.log(`IDs renumbered 1-${newTotal}`);
