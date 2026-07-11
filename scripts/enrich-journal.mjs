/**
 * Batch enrichment script for journal articles.
 * Adds: related arrays, FAQ pairs, and inline citations.
 * Skips articles that already have these fields.
 * 
 * Run: node scripts/enrich-journal.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LIB_DIR = join(process.cwd(), 'lib');

// ─── Citation database: maps topic keywords to real, verifiable citations ───
const CITATION_DB = {
  // Psychology of grief and loss
  grief: {
    text: 'Elisabeth Kübler-Ross\'s five stages of grief',
    url: 'https://en.wikipedia.org/wiki/K%C3%BCbler-Ross_model',
    keywords: ['grief', 'stages of grief', 'denial', 'bargaining', 'acceptance'],
  },
  attachment: {
    text: 'attachment theory',
    url: 'https://en.wikipedia.org/wiki/Attachment_theory',
    keywords: ['attachment', 'attachment style', 'anxious attachment', 'avoidant'],
  },
  pennebaker: {
    text: 'Dr. James Pennebaker\'s expressive writing research',
    url: 'https://psycnet.apa.org/record/1997-36935-008',
    keywords: ['expressive writing', 'writing therapy', 'therapeutic writing', 'pennebaker'],
  },
  nocontact: {
    text: 'no-contact rule',
    url: 'https://en.wikipedia.org/wiki/No_contact_rule',
    keywords: ['no contact', 'no-contact'],
  },
  limerence: {
    text: 'limerence',
    url: 'https://en.wikipedia.org/wiki/Limerence',
    keywords: ['limerence', 'obsessive love', 'intrusive thoughts about ex'],
  },
  rumination: {
    text: 'rumination',
    url: 'https://en.wikipedia.org/wiki/Rumination_(psychology)',
    keywords: ['rumination', 'ruminat', 'overthinking', 'spiral'],
  },
  dopamine: {
    text: 'dopamine reward system',
    url: 'https://en.wikipedia.org/wiki/Reward_system',
    keywords: ['dopamine', 'reward system', 'addicted to', 'withdrawal'],
  },
  cortisol: {
    text: 'cortisol and stress response',
    url: 'https://en.wikipedia.org/wiki/Cortisol',
    keywords: ['cortisol', 'stress hormone', 'stress response'],
  },
  brokenHeart: {
    text: 'broken heart syndrome (takotsubo cardiomyopathy)',
    url: 'https://en.wikipedia.org/wiki/Takotsubo_cardiomyopathy',
    keywords: ['broken heart syndrome', 'takotsubo', 'heartbreak physically hurt', 'chest pain'],
  },
  closure: {
    text: 'need for cognitive closure',
    url: 'https://en.wikipedia.org/wiki/Need_for_closure',
    keywords: ['closure', 'need for closure', 'cognitive closure'],
  },
  parasocial: {
    text: 'parasocial relationships',
    url: 'https://en.wikipedia.org/wiki/Parasocial_interaction',
    keywords: ['parasocial', 'one-sided'],
  },
  selfDisclosure: {
    text: 'self-disclosure',
    url: 'https://en.wikipedia.org/wiki/Self-disclosure',
    keywords: ['self-disclosure', 'sharing vulnerable', 'confess'],
  },
  disenfranchised: {
    text: 'disenfranchised grief',
    url: 'https://en.wikipedia.org/wiki/Disenfranchised_grief',
    keywords: ['disenfranchised grief', 'unacknowledged grief', 'situationship'],
  },
  zeigarnik: {
    text: 'Zeigarnik effect',
    url: 'https://en.wikipedia.org/wiki/Zeigarnik_effect',
    keywords: ['zeigarnik', 'unfinished business', 'incomplete', 'unresolved'],
  },
  nostalgia: {
    text: 'nostalgia',
    url: 'https://en.wikipedia.org/wiki/Nostalgia',
    keywords: ['nostalgia', 'nostalgic', 'romanticize the past'],
  },
  cogReappraisal: {
    text: 'cognitive reappraisal',
    url: 'https://en.wikipedia.org/wiki/Cognitive_reappraisal',
    keywords: ['cognitive reappraisal', 'reframe', 'reframing'],
  },
  somaticMemory: {
    text: 'somatic experiencing',
    url: 'https://en.wikipedia.org/wiki/Somatic_experiencing',
    keywords: ['somatic', 'body remembers', 'body keeps the score', 'physical symptoms'],
  },
  phantomVibration: {
    text: 'phantom vibration syndrome',
    url: 'https://en.wikipedia.org/wiki/Phantom_vibration_syndrome',
    keywords: ['phantom vibration', 'phantom buzz', 'imagined notification'],
  },
  socialComparison: {
    text: 'social comparison theory',
    url: 'https://en.wikipedia.org/wiki/Social_comparison_theory',
    keywords: ['social media stalking', 'compare', 'social comparison', 'checking their profile'],
  },
  dreamPsych: {
    text: 'dream psychology',
    url: 'https://en.wikipedia.org/wiki/Dream#Psychology',
    keywords: ['dream about', 'dreaming about', 'dream psychology'],
  },
  emotionalContagion: {
    text: 'emotional contagion',
    url: 'https://en.wikipedia.org/wiki/Emotional_contagion',
    keywords: ['emotional contagion', 'empathy', 'absorb emotions'],
  },
  gratitude: {
    text: 'gratitude interventions in psychology',
    url: 'https://en.wikipedia.org/wiki/Gratitude#Psychological_research',
    keywords: ['gratitude', 'thankful', 'gratitude letter', 'appreciation'],
  },
  shadowWork: {
    text: 'shadow work in Jungian psychology',
    url: 'https://en.wikipedia.org/wiki/Shadow_(psychology)',
    keywords: ['shadow work', 'shadow self', 'jungian', 'hidden insecurities'],
  },
  boundaries: {
    text: 'personal boundaries',
    url: 'https://en.wikipedia.org/wiki/Personal_boundaries',
    keywords: ['boundaries', 'red flags', 'green flags', 'setting boundaries'],
  },
  emotionalSobriety: {
    text: 'emotional sobriety and addiction recovery',
    url: 'https://en.wikipedia.org/wiki/Emotional_sobriety',
    keywords: ['emotional sobriety', 'addiction', 'toxic relationship addiction'],
  },
  forgiveness: {
    text: 'psychology of forgiveness',
    url: 'https://en.wikipedia.org/wiki/Forgiveness',
    keywords: ['forgiveness', 'forgiving', 'forgive yourself', 'self-forgiveness'],
  },
  musicMemory: {
    text: 'music-evoked autobiographical memories',
    url: 'https://en.wikipedia.org/wiki/Music-evoked_autobiographical_memories',
    keywords: ['music trigger', 'song remind', 'music memories', 'hearing a song'],
  },
};

// ─── Topic-based related article mapping ───
const TOPIC_CLUSTERS = {
  'grief-loss': [
    'grieving-the-dead-unsaid-words',
    'finding-closure-without-apology',
    'grief-of-the-living-mourning-someone-still-alive',
    'writing-as-a-tool-for-grief-how-unsent-letters-help-process-loss',
    'stages-of-grief-after-breakup-denial-anger-bargaining-acceptance',
  ],
  'breakup-healing': [
    'healing-from-a-breakup-what-nobody-tells-you',
    'how-long-does-it-take-to-get-over-a-breakup-timeline',
    'signs-you-are-healing-from-heartbreak-recovery-milestones',
    'the-2am-echo-missing-ex',
    'why-does-heartbreak-physically-hurt-science-of-emotional-pain',
  ],
  'psychology-self': [
    'psychology-unsent-text-messages',
    'psychology-unspoken-words-letters-never-sent',
    'the-psychology-of-closure-why-we-dont-need-an-apology-to-move-on',
    'understanding-limerence-heartbreak-digital-obsession',
    'shadow-work-heartbreak-integrating-hidden-insecurities',
  ],
  'writing-letters': [
    'grief-letter-writing-how-putting-heartbreak-on-paper-sets-you-free',
    'healing-through-letters-writing-to-past-present-future-self',
    'writing-through-anger-vs-sadness-after-breakup',
    'what-to-write-for-closure',
    'does-writing-an-unsent-letter-actually-help-you-heal',
  ],
  'digital-modern': [
    'digital-breakups-surviving-ghosting-breadcrumbing-no-contact',
    'phantom-vibrations-digital-hypervigilance-after-heartbreak',
    'why-you-check-their-social-media-even-though-it-hurts',
    'the-digital-footprint-of-heartbreak-archiving-our-unsent-thoughts',
    'the-illusion-of-the-perfect-response-why-sending-the-draft-rarely-helps',
  ],
  'ex-obsession': [
    'why-do-i-miss-my-ex-suddenly-psychology-of-emotional-triggers',
    'still-in-love-with-ex-years-later-normal-psychology',
    'how-to-stop-thinking-about-someone-you-love',
    'why-we-romanticize-people-who-hurt-us',
    'missing-them-vs-missing-the-idea-of-them',
  ],
  'relationships': [
    'right-person-wrong-time',
    'grieving-relationship-didnt-happen',
    'grieving-an-almost-relationship-situationship-pain',
    'the-weight-of-being-someones-secret',
    'you-dont-find-the-same-person-twice',
  ],
  'self-work': [
    'releasing-romantic-regret',
    'how-to-forgive-yourself-after-breakup-self-blame-guilt',
    'emotional-sobriety-breaking-addiction-to-toxic-relationships',
    'when-forgiveness-feels-impossible-and-you-do-it-anyway',
    'red-flags-green-flags-setting-boundaries-after-heartbreak',
  ],
  'archive-platform': [
    'why-we-search-for-our-names-in-unsent-letter-archives',
    'what-it-means-when-your-name-is-not-in-any-archive',
    'are-unsent-letters-online-real-or-fake',
    'when-unsent-letter-archives-lose-your-words',
    'the-history-of-unsent-letters-from-lincoln-to-the-internet',
  ],
};

// ─── FAQ templates per topic ───
const FAQ_TEMPLATES = {
  'the-2am-echo-missing-ex': [
    { question: 'Why do I miss my ex more at night?', answer: 'At night, the distractions that keep grief at bay during the day disappear. The prefrontal cortex, which helps regulate emotions, becomes less active during fatigue, letting the emotional brain (amygdala) dominate. This is why memories and longing feel more intense at 2 AM.' },
    { question: 'Is it normal to think about your ex late at night?', answer: 'Yes. Nighttime rumination after a breakup is extremely common and well-documented in psychology. The quiet of night removes the cognitive load that normally suppresses painful memories during the day.' },
  ],
  'grieving-relationship-didnt-happen': [
    { question: 'Can you grieve a relationship that never happened?', answer: 'Yes. Psychologists call this disenfranchised grief — mourning a loss that society does not recognize as legitimate. The pain of losing a situationship or almost-relationship is real, even if there was never an official label.' },
    { question: 'Why does a situationship hurt as much as a real breakup?', answer: 'Because the emotional investment was real. Your brain formed attachment bonds based on shared vulnerability and intimacy, regardless of whether the relationship had an official label. The neurochemistry of attachment does not require a title.' },
  ],
  'unsent-letters-to-first-loves': [
    { question: 'Why do people never forget their first love?', answer: 'First love creates the strongest neurological imprint because the brain is encountering romantic neurochemicals (dopamine, oxytocin, serotonin) at peak novelty. The amygdala and hippocampus encode these memories with maximum emotional weight because there is no prior reference point.' },
    { question: 'Is it normal to still think about your first love years later?', answer: 'Yes. Research shows that first love memories are stored with extraordinary vividness and persist throughout life. This is not sentimentality — it is neuroscience. The original emotional baseline against which all future romance is compared never fully fades.' },
  ],
  'releasing-romantic-regret': [
    { question: 'How do you forgive yourself for being the toxic partner?', answer: 'Start by distinguishing between guilt (I did something bad) and shame (I am bad). Guilt is productive — it motivates change. Shame is destructive — it paralyzes. Acknowledge what you did, make amends where possible, and commit to different behavior going forward.' },
    { question: 'Can you heal from being the one who caused the breakup?', answer: 'Yes. Self-forgiveness is a well-studied process in psychology. It requires honest accountability, genuine remorse, behavioral change, and eventually, the willingness to release the guilt without forgetting the lesson.' },
  ],
  'finding-closure-without-apology': [
    { question: 'Can you find closure without an apology?', answer: 'Yes. Closure is an internal process, not an external event. Research on the need for cognitive closure shows that waiting for someone else to give you permission to move on keeps you psychologically stuck. You can construct your own closure through writing, therapy, and meaning-making.' },
    { question: 'Why do I need closure after a breakup?', answer: 'The human brain has a strong need for narrative completion — the Zeigarnik effect shows that incomplete tasks and unresolved situations occupy more mental space than completed ones. Closure is about completing the narrative internally so your brain can release its grip on the relationship.' },
  ],
  'grieving-the-dead-unsaid-words': [
    { question: 'How do you grieve someone who has died when you never said goodbye?', answer: 'Expressive writing research shows that writing a letter to someone who has died — even though they will never read it — produces real therapeutic benefits. The act of composing the words forces cognitive processing of the loss and provides a sense of completion that the death itself denied.' },
    { question: 'Is it normal to feel guilty about things you never said to someone who died?', answer: 'Yes. Regret over unspoken words is one of the most common and persistent forms of complicated grief. Writing those words, even now, even to someone who cannot read them, helps externalize the guilt and begin the process of self-forgiveness.' },
  ],
  'right-person-wrong-time': [
    { question: 'Is right person wrong time a real thing?', answer: 'It depends on the situation. Sometimes timing genuinely prevents a relationship from working — career moves, personal growth stages, or life circumstances. But often, "right person wrong time" is a comforting narrative that avoids the harder truth: the relationship was not working for reasons beyond timing.' },
    { question: 'Should you wait for someone if the timing is wrong?', answer: 'Generally, no. Waiting indefinitely for someone keeps you psychologically stuck in what researchers call an approach-avoidance conflict. If the relationship cannot work now, the healthiest path is to grieve it as a loss and remain open to what comes next.' },
  ],
  'healing-from-a-breakup-what-nobody-tells-you': [
    { question: 'What does healing from a breakup actually feel like?', answer: 'Healing is not linear. It involves periods of progress followed by setbacks, and the timeline varies widely. The most reliable sign of healing is not the absence of pain but the gradual decrease in its frequency and intensity over time.' },
    { question: 'How long does it take to heal from a breakup?', answer: 'Research suggests that most people begin to feel significantly better within three to six months, though complete emotional recovery can take one to two years depending on the length and intensity of the relationship.' },
  ],
  'psychology-unsent-text-messages': [
    { question: 'Why do people write text messages they never send?', answer: 'Writing unsent messages serves as a pressure valve for emotional intensity. The act of composing the message provides cognitive processing benefits similar to journaling, while the decision not to send protects the writer from the vulnerability and potential rejection of actual communication.' },
    { question: 'Is it healthy to write messages you never send?', answer: 'Yes, when done as a form of emotional processing rather than avoidance. Expressive writing research shows that externalizing emotions through writing produces measurable psychological benefits, including reduced anxiety and improved emotional regulation.' },
  ],
  'meaning-of-colors-in-unsent-messages-love-aesthetics': [
    { question: 'What do colors mean in unsent letter archives?', answer: 'Colors in unsent letter archives are chosen by the writer to match the emotional tone of their message. Research in color psychology shows that people consistently associate specific colors with specific emotions: blues with sadness and longing, reds with passion and anger, greens with growth and jealousy, and gold with nostalgia.' },
    { question: 'Why does the color of an unsent letter matter?', answer: 'Color is processed by the brain before text. The emotional temperature of a message is absorbed through its visual presentation before a single word is read. This is why curated color palettes in archives create a more emotionally coherent reading experience.' },
  ],
};

// Generate default FAQs from article title/slug
function generateDefaultFaq(slug, title) {
  const topic = title.replace(/['"]/g, '');
  return [
    { question: `What is "${topic}" about?`, answer: `This article explores the psychology and emotional reality behind ${topic.toLowerCase()}. It examines the experience through the lens of research and real human stories from unsent letter archives.` },
    { question: `How does writing an unsent letter help with this?`, answer: `Expressive writing research by Dr. James Pennebaker shows that putting emotional experiences into words produces measurable improvements in both psychological and physical health. The 25-word constraint forces distillation of the core truth, which is where most of the therapeutic benefit comes from.` },
  ];
}

// Find related articles for a given slug
function getRelated(slug) {
  // Find which clusters this slug belongs to
  const matches = [];
  for (const [cluster, slugs] of Object.entries(TOPIC_CLUSTERS)) {
    if (slugs.includes(slug)) {
      // Add other slugs from same cluster (not self)
      for (const s of slugs) {
        if (s !== slug && !matches.includes(s)) matches.push(s);
      }
    }
  }
  // If no cluster match, pick from thematically adjacent clusters
  if (matches.length === 0) {
    // Default related from different clusters
    matches.push(
      'the-2am-echo-missing-ex',
      'psychology-unspoken-words-letters-never-sent',
      'does-writing-an-unsent-letter-actually-help-you-heal',
      'the-psychology-of-closure-why-we-dont-need-an-apology-to-move-on',
    );
  }
  return matches.slice(0, 4);
}

// Find best citation to inject into content
function findBestCitation(content) {
  const lowerContent = content.toLowerCase();
  const citations = [];
  
  for (const [key, citation] of Object.entries(CITATION_DB)) {
    for (const keyword of citation.keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        citations.push(citation);
        break; // only add each citation once
      }
    }
  }
  
  return citations.slice(0, 3); // max 3 citations per article
}

// Inject a citation into content near its keyword
function injectCitation(content, citation) {
  const lowerContent = content.toLowerCase();
  
  // Find first occurrence of a keyword
  let bestPos = -1;
  let bestKeyword = '';
  for (const keyword of citation.keywords) {
    const pos = lowerContent.indexOf(keyword.toLowerCase());
    if (pos !== -1 && (bestPos === -1 || pos < bestPos)) {
      bestPos = pos;
      bestKeyword = keyword;
    }
  }
  
  if (bestPos === -1) return content;
  
  // Find the actual case-preserved text at that position
  const actualText = content.substring(bestPos, bestPos + bestKeyword.length);
  
  // Only inject if the keyword isn't already part of a markdown link
  const before = content.substring(Math.max(0, bestPos - 2), bestPos);
  if (before.includes('[') || before.includes('(')) return content;
  
  // Replace first occurrence with linked version
  const linked = `[${actualText}](${citation.url})`;
  return content.substring(0, bestPos) + linked + content.substring(bestPos + bestKeyword.length);
}

// ─── Main processing ───
const partFiles = readdirSync(LIB_DIR)
  .filter(f => f.match(/^journal-data-part\d+\.ts$/))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

let totalProcessed = 0;
let totalSkipped = 0;
let totalCitations = 0;

for (const file of partFiles) {
  const filePath = join(LIB_DIR, file);
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Parse all articles in this file
  // Find each article object
  const slugMatches = [...content.matchAll(/slug:\s*'([^']+)'/g)];
  
  for (const slugMatch of slugMatches) {
    const slug = slugMatch[1];
    
    // Skip if already has related and faq
    const hasRelated = content.includes(`related:`) && content.indexOf('related:') < content.indexOf(slug) + 500;
    const hasFaq = content.includes(`faq:`) && content.indexOf('faq:') < content.indexOf(slug) + 500;
    
    // Check if this specific article block has related/faq
    const articleStart = content.indexOf(`slug: '${slug}'`);
    const nextArticleMatch = content.indexOf(`slug: '`, articleStart + 10);
    const articleEnd = nextArticleMatch !== -1 ? nextArticleMatch : content.length;
    const articleBlock = content.substring(articleStart, articleEnd);
    
    const articleHasRelated = articleBlock.includes('related:');
    const articleHasFaq = articleBlock.includes('faq:');
    
    if (articleHasRelated && articleHasFaq) {
      totalSkipped++;
      continue;
    }
    
    // Find the content: ` line for this article
    const contentLinePos = content.indexOf("content: `", articleStart);
    if (contentLinePos === -1 || contentLinePos > articleEnd) continue;
    
    // Build the fields to insert
    let insertFields = '';
    
    if (!articleHasRelated) {
      const related = getRelated(slug);
      insertFields += `    related: [${related.map(s => `'${s}'`).join(', ')}],\n`;
    }
    
    if (!articleHasFaq) {
      const faq = FAQ_TEMPLATES[slug] || generateDefaultFaq(slug, '');
      const faqStr = faq.map(f => 
        `      {\n        question: '${f.question.replace(/'/g, "\\'")}',\n        answer: '${f.answer.replace(/'/g, "\\'")}',\n      }`
      ).join(',\n');
      insertFields += `    faq: [\n${faqStr},\n    ],\n`;
    }
    
    if (insertFields) {
      // Insert before the content: ` line
      content = content.substring(0, contentLinePos) + insertFields + '    ' + content.substring(contentLinePos).trimStart();
      modified = true;
    }
    
    // Now inject citations into the article content
    const newContentPos = content.indexOf("content: `", articleStart);
    const closingBacktick = content.indexOf('`', newContentPos + 10 + 100); // skip past opening
    const endOfContent = content.indexOf('`\n', newContentPos + 10);
    
    if (endOfContent !== -1) {
      const articleContent = content.substring(newContentPos + 10, endOfContent);
      
      // Check if already has citations
      if (!articleContent.includes('](http')) {
        const citations = findBestCitation(articleContent);
        let newArticleContent = articleContent;
        
        for (const citation of citations) {
          const before = newArticleContent;
          newArticleContent = injectCitation(newArticleContent, citation);
          if (newArticleContent !== before) totalCitations++;
        }
        
        if (newArticleContent !== articleContent) {
          content = content.substring(0, newContentPos + 10) + newArticleContent + content.substring(endOfContent);
          modified = true;
        }
      }
    }
    
    totalProcessed++;
  }
  
  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated: ${file}`);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Processed: ${totalProcessed} articles`);
console.log(`   Skipped (already enriched): ${totalSkipped}`);
console.log(`   Citations injected: ${totalCitations}`);
