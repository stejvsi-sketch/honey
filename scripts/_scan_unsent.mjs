// Scan unsent-data.ts for AdSense-risk content
import fs from 'fs';

const content = fs.readFileSync('d:/honey/lib/unsent-data.ts', 'utf8');
const lines = content.split('\n');

// Comprehensive AdSense-risk terms — hard-ban + expanded list
const RISK_WORDS = [
  // Existing hard-ban
  'porn', 'pornography', 'cp', 'nigga', 'nigger', 'dick', 'penis', 'vagina',
  'pussy', 'cock', 'cum', 'semen', 'rape', 'rapist', 'molest', 'pedophile',
  'paedophile', 'pedo', 'incest', 'bestiality', 'necrophilia', 'hentai',
  'xxx', 'nude', 'nudes', 'naked', 'genitals', 'genital', 'anus', 'anal',
  'blowjob', 'handjob', 'masturbate', 'masturbation', 'orgasm', 'erection',
  'ejaculate', 'ejaculation', 'whore', 'slut', 'prostitute', 'hooker',
  'faggot', 'fag', 'retard', 'retarded', 'cunt', 'twat', 'wanker',
  'kike', 'spic', 'chink', 'gook', 'wetback', 'beaner',
  'bitch', 'bitches', 'bitchy',
  'fatty', 'fatass', 'skank', 'tramp', 'thot', 'hoe',
  'kill yourself', 'kys', 'incel', 'tranny',
  
  // Expanded: self-harm / suicide
  'kill myself', 'kill me', 'want to die', 'wanna die', 'end my life',
  'end it all', 'suicide', 'suicidal', 'slit my wrists', 'hang myself',
  'overdose', 'self-harm', 'self harm', 'cutting myself',
  
  // Expanded: sexual
  'fucked me', 'fuck me', 'sex', 'sexy', 'sexual', 'sexually',
  'horny', 'orgasm', 'climax', 'erotic', 'smut', 'boobs', 'tits',
  'titties', 'breasts', 'clitoris', 'dildo', 'vibrator', 'condom',
  'threesome', 'orgy', 'kinky', 'fetish', 'bondage', 'bdsm',
  'strip', 'stripper',
  
  // Expanded: violence / criminal
  'murder', 'stab', 'shoot', 'gun', 'weapon', 'assault',
  'abuse', 'abuser', 'abused', 'abusive', 'domestic violence',
  'beat the shit', 'beat you', 'punch',
  
  // Expanded: drugs
  'cocaine', 'heroin', 'meth', 'methamphetamine', 'crack',
  'weed', 'marijuana', 'drugs', 'drug dealer', 'overdose',
  
  // Expanded: slurs / hate
  'dyke', 'homo', 'queer', 'troon',
  
  // Expanded: profanity (in hardcoded content, not behind user choice)
  'fuck', 'fucking', 'fucked', 'fucker', 'fucks',
  'shit', 'shitty', 'shitting', 'bullshit',
  'ass', 'asshole', 'asses',
  'bastard', 'bastards',
  'piss', 'pissed', 'pissing',
  'damn', 'damned', 'dammit',
];

// Build regex patterns for whole-word matching
const patterns = RISK_WORDS.map(word => {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\b${escaped}\\b`, 'i');
});

const flagged = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Only scan message content lines
  if (!line.includes("message:")) continue;
  
  // Extract message content
  const msgMatch = line.match(/message:\s*'(.*?)'/s) || line.match(/message:\s*"(.*?)"/s);
  if (!msgMatch) continue;
  const msg = msgMatch[1];
  
  // Extract id
  const idMatch = line.match(/id:\s*(\d+)/);
  const id = idMatch ? idMatch[1] : '?';
  
  const matched = [];
  for (let j = 0; j < patterns.length; j++) {
    if (patterns[j].test(msg)) {
      matched.push(RISK_WORDS[j]);
    }
  }
  
  if (matched.length > 0) {
    flagged.push({
      line: i + 1,
      id,
      matched,
      excerpt: msg.substring(0, 120),
    });
  }
}

console.log(`\n=== UNSENT ARCHIVE SCAN ===`);
console.log(`Total flagged: ${flagged.length}\n`);

for (const f of flagged) {
  console.log(`Line ${f.line} | ID ${f.id} | Matched: [${f.matched.join(', ')}]`);
  console.log(`  "${f.excerpt}..."\n`);
}

// Output just the IDs for easy removal
console.log(`\n=== FLAGGED IDs ===`);
console.log(flagged.map(f => f.id).join(', '));
