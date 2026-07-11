/**
 * Citation injection script - pass 2.
 * Finds articles without inline citations and adds them.
 * Run: node scripts/inject-citations.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LIB_DIR = join(process.cwd(), 'lib');

// Citation database: keyword → markdown link text
const CITATIONS = [
  { find: 'attachment theory', link: '[attachment theory](https://en.wikipedia.org/wiki/Attachment_theory)' },
  { find: 'Kübler-Ross', link: '[Kübler-Ross](https://en.wikipedia.org/wiki/K%C3%BCbler-Ross_model)' },
  { find: 'five stages of grief', link: '[five stages of grief](https://en.wikipedia.org/wiki/K%C3%BCbler-Ross_model)' },
  { find: 'stages of grief', link: '[stages of grief](https://en.wikipedia.org/wiki/K%C3%BCbler-Ross_model)' },
  { find: 'disenfranchised grief', link: '[disenfranchised grief](https://en.wikipedia.org/wiki/Disenfranchised_grief)' },
  { find: 'limerence', link: '[limerence](https://en.wikipedia.org/wiki/Limerence)' },
  { find: 'Zeigarnik effect', link: '[Zeigarnik effect](https://en.wikipedia.org/wiki/Zeigarnik_effect)' },
  { find: 'dopamine', link: '[dopamine](https://en.wikipedia.org/wiki/Dopamine)' },
  { find: 'oxytocin', link: '[oxytocin](https://en.wikipedia.org/wiki/Oxytocin)' },
  { find: 'cortisol', link: '[cortisol](https://en.wikipedia.org/wiki/Cortisol)' },
  { find: 'amygdala', link: '[amygdala](https://en.wikipedia.org/wiki/Amygdala)' },
  { find: 'hippocampus', link: '[hippocampus](https://en.wikipedia.org/wiki/Hippocampus)' },
  { find: 'prefrontal cortex', link: '[prefrontal cortex](https://en.wikipedia.org/wiki/Prefrontal_cortex)' },
  { find: 'cognitive reappraisal', link: '[cognitive reappraisal](https://en.wikipedia.org/wiki/Cognitive_reappraisal)' },
  { find: 'rumination', link: '[rumination](https://en.wikipedia.org/wiki/Rumination_(psychology))' },
  { find: 'no-contact rule', link: '[no-contact rule](https://en.wikipedia.org/wiki/No_contact_rule)' },
  { find: 'phantom vibration syndrome', link: '[phantom vibration syndrome](https://en.wikipedia.org/wiki/Phantom_vibration_syndrome)' },
  { find: 'phantom vibrations', link: '[phantom vibrations](https://en.wikipedia.org/wiki/Phantom_vibration_syndrome)' },
  { find: 'somatic experiencing', link: '[somatic experiencing](https://en.wikipedia.org/wiki/Somatic_experiencing)' },
  { find: 'broken heart syndrome', link: '[broken heart syndrome](https://en.wikipedia.org/wiki/Takotsubo_cardiomyopathy)' },
  { find: 'takotsubo', link: '[takotsubo cardiomyopathy](https://en.wikipedia.org/wiki/Takotsubo_cardiomyopathy)' },
  { find: 'social comparison theory', link: '[social comparison theory](https://en.wikipedia.org/wiki/Social_comparison_theory)' },
  { find: 'need for closure', link: '[need for closure](https://en.wikipedia.org/wiki/Need_for_closure)' },
  { find: 'confirmation bias', link: '[confirmation bias](https://en.wikipedia.org/wiki/Confirmation_bias)' },
  { find: 'shadow work', link: '[shadow work](https://en.wikipedia.org/wiki/Shadow_(psychology))' },
  { find: 'Carl Jung', link: '[Carl Jung](https://en.wikipedia.org/wiki/Carl_Jung)' },
  { find: 'emotional sobriety', link: '[emotional sobriety](https://en.wikipedia.org/wiki/Emotional_sobriety)' },
  { find: 'personal boundaries', link: '[personal boundaries](https://en.wikipedia.org/wiki/Personal_boundaries)' },
  { find: 'self-disclosure', link: '[self-disclosure](https://en.wikipedia.org/wiki/Self-disclosure)' },
  { find: 'nostalgia', link: '[nostalgia](https://en.wikipedia.org/wiki/Nostalgia)' },
  { find: 'learned helplessness', link: '[learned helplessness](https://en.wikipedia.org/wiki/Learned_helplessness)' },
  { find: 'fading affect bias', link: '[fading affect bias](https://en.wikipedia.org/wiki/Fading_affect_bias)' },
  { find: 'approach-avoidance conflict', link: '[approach-avoidance conflict](https://en.wikipedia.org/wiki/Approach%E2%80%93avoidance_conflict)' },
  { find: 'James Pennebaker', link: '[James Pennebaker](https://en.wikipedia.org/wiki/James_Pennebaker)' },
  { find: 'trauma bonding', link: '[trauma bonding](https://en.wikipedia.org/wiki/Traumatic_bonding)' },
  { find: 'gaslighting', link: '[gaslighting](https://en.wikipedia.org/wiki/Gaslighting)' },
  { find: 'emotional regulation', link: '[emotional regulation](https://en.wikipedia.org/wiki/Emotional_self-regulation)' },
  { find: 'intermittent reinforcement', link: '[intermittent reinforcement](https://en.wikipedia.org/wiki/Reinforcement#Intermittent_reinforcement_schedules)' },
];

const partFiles = readdirSync(LIB_DIR)
  .filter(f => f.match(/^journal-data-part\d+\.ts$/))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

let totalInjected = 0;
let filesModified = 0;

for (const file of partFiles) {
  const filePath = join(LIB_DIR, file);
  let content = readFileSync(filePath, 'utf-8');
  let fileModified = false;
  
  // Skip files that already have multiple citations
  const existingCitations = (content.match(/\]\(https?:\/\//g) || []).length;
  if (existingCitations >= 2) {
    continue;
  }
  
  let citationsAdded = 0;
  const maxCitations = 2; // Add up to 2 citations per file
  
  for (const citation of CITATIONS) {
    if (citationsAdded >= maxCitations) break;
    
    const findText = citation.find;
    const linkText = citation.link;
    
    // Skip if already linked
    if (content.includes(linkText)) continue;
    
    // Find the keyword in content (case insensitive for first match)
    const lowerContent = content.toLowerCase();
    const findLower = findText.toLowerCase();
    const pos = lowerContent.indexOf(findLower);
    
    if (pos === -1) continue;
    
    // Make sure we're inside a template literal (content field)
    // Check that we're between content: ` and the closing `
    const lastContentStart = content.lastIndexOf('content: `', pos);
    if (lastContentStart === -1) continue;
    
    // Verify this position is inside the template literal
    const openBacktick = content.indexOf('`', lastContentStart + 9);
    if (openBacktick >= pos) continue; // pos is before the content starts
    
    // Check we're not inside an existing markdown link
    const nearbyBefore = content.substring(Math.max(0, pos - 5), pos);
    if (nearbyBefore.includes('[') || nearbyBefore.includes('](')) continue;
    
    // Get the actual text at this position (preserving case)
    const actualText = content.substring(pos, pos + findText.length);
    
    // Replace only the first occurrence
    content = content.substring(0, pos) + linkText.replace(findText, actualText) + content.substring(pos + findText.length);
    
    citationsAdded++;
    totalInjected++;
    fileModified = true;
  }
  
  if (fileModified) {
    writeFileSync(filePath, content, 'utf-8');
    filesModified++;
    console.log(`✅ ${file}: +${citationsAdded} citations`);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total citations injected: ${totalInjected}`);
