/**
 * Fix broken default FAQs that have empty titles.
 * The enrichment script passed '' as the title parameter.
 * This script reads each article's actual title and regenerates the FAQs.
 * 
 * Run: node scripts/fix-default-faqs.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const LIB_DIR = join(process.cwd(), 'lib');

// Articles that already have GOOD custom FAQs — skip these
const CUSTOM_FAQ_SLUGS = new Set([
  'the-2am-echo-missing-ex',
  'grieving-relationship-didnt-happen',
  'unsent-letters-to-first-loves',
  'releasing-romantic-regret',
  'finding-closure-without-apology',
  'grieving-the-dead-unsaid-words',
  'right-person-wrong-time',
  'healing-from-a-breakup-what-nobody-tells-you',
  'psychology-unsent-text-messages',
  'meaning-of-colors-in-unsent-messages-love-aesthetics',
  // Already manually enriched competitor rewrites
  'why-we-search-for-our-names-in-unsent-letter-archives',
  'why-unsent-letter-submissions-disappear',
  'when-unsent-letter-archives-lose-your-words',
  'does-writing-an-unsent-letter-actually-help-you-heal',
  'are-unsent-letters-online-real-or-fake',
  'the-trust-contract-between-writers-and-archives',
  'what-it-means-when-your-name-is-not-in-any-archive',
  'when-the-submit-button-fails-at-the-worst-moment',
  'the-history-of-unsent-letters-from-lincoln-to-the-internet',
  // Protected articles
  'why-is-unsent-project-not-working-message-not-posting',
  'unsent-project-alternative',
  'websites-similar-to-the-unsent-project',
]);

// Slug-specific FAQ overrides for key articles
const SLUG_FAQS = {
  'letters-never-sent-notes-with-names': [
    { q: 'Why do people write letters they never send?', a: 'Writing unsent letters externalizes emotional pain. Research by Dr. James Pennebaker shows that putting feelings into words reduces their neurological intensity, even if the words are never delivered.' },
    { q: 'What makes an unsent letter different from journaling?', a: 'An unsent letter is addressed to a specific person, which engages the brain in a simulated dialogue rather than self-reflection. The specificity of directing words toward someone activates different emotional processing than writing to yourself.' },
  ],
  'searching-for-your-name-anonymous-love-letters': [
    { q: 'Why do people search for their names in anonymous letter archives?', a: 'It is a search for evidence that you mattered to someone who has gone silent. The desire to find your name reflects the universal human need for validation and proof that your absence left a mark.' },
    { q: 'What does it mean if someone wrote an anonymous letter to your name?', a: 'It means someone carrying unspoken words about a person with your name needed to externalize them. Whether or not the message was intended for you specifically, the emotions behind it were real.' },
  ],
  'a-letter-to-my-ex': [
    { q: 'Should I send a letter to my ex?', a: 'In most cases, the therapeutic value comes from writing the letter, not sending it. Sending can reopen wounds or restart unhealthy dynamics. Writing to an anonymous archive provides the emotional release without the risk.' },
    { q: 'How do you write closure to an ex?', a: 'Focus on what you need to say, not what you want them to hear. Identify the single most important truth you are carrying and write it as clearly as you can. The act of distillation is where the healing happens.' },
  ],
  'grief-of-the-living-mourning-someone-still-alive': [
    { q: 'Can you grieve someone who is still alive?', a: 'Yes. Ambiguous loss, a term coined by Dr. Pauline Boss, describes the grief of losing someone who is still physically present but emotionally or relationally absent. This type of grief is often harder to process because there is no clear endpoint.' },
    { q: 'Why is grieving someone alive harder than grieving someone who died?', a: 'Because the loss is ambiguous and ongoing. There is no funeral, no social permission to mourn, and the possibility of reconciliation keeps the grief unresolved. The brain cannot fully process a loss that might not be permanent.' },
  ],
  'digital-breakups-surviving-ghosting-breadcrumbing-no-contact': [
    { q: 'Why does ghosting hurt so much?', a: 'Ghosting denies the brain the closure it needs to process a loss. The sudden absence of communication triggers the same neural pathways as physical pain, and the lack of explanation leaves the brain stuck in an unresolved loop.' },
    { q: 'What is breadcrumbing in dating?', a: 'Breadcrumbing is when someone sends intermittent, non-committal messages to keep you interested without any intention of pursuing a real relationship. It exploits the dopamine reward system through intermittent reinforcement, making it psychologically addictive.' },
  ],
  'how-to-stop-thinking-about-someone-you-love': [
    { q: 'How do you stop thinking about someone you love?', a: 'You cannot force yourself to stop thinking about someone. Thought suppression actually increases intrusive thoughts, a phenomenon called the ironic process theory. Instead, redirect: write about them, process the feelings, and gradually the intensity decreases.' },
    { q: "Why can't I get someone out of my head?", a: 'Your brain treats unresolved emotional bonds like incomplete tasks. The Zeigarnik effect shows that unfinished business occupies more mental space than completed tasks. Writing unsent words helps signal completion to your brain.' },
  ],
  'why-does-heartbreak-physically-hurt-science-of-emotional-pain': [
    { q: 'Why does heartbreak physically hurt?', a: 'Brain imaging studies show that emotional pain activates the same neural regions as physical pain, including the anterior cingulate cortex and insula. In extreme cases, emotional shock can cause broken heart syndrome (takotsubo cardiomyopathy), a temporary heart condition.' },
    { q: 'Is heartbreak a real medical condition?', a: 'Yes. Broken heart syndrome (takotsubo cardiomyopathy) is a recognized medical condition where severe emotional stress causes the heart to temporarily malfunction, mimicking the symptoms of a heart attack. It is most common after sudden loss or shock.' },
  ],
  'understanding-limerence-heartbreak-digital-obsession': [
    { q: 'What is limerence?', a: 'Limerence is a state of involuntary, obsessive romantic attachment to another person, characterized by intrusive thoughts, emotional dependency, and an overwhelming need for reciprocation. It was first defined by psychologist Dorothy Tennov in 1979.' },
    { q: 'How is limerence different from love?', a: 'Love is stable, reciprocal, and grounded in reality. Limerence is obsessive, one-sided, and fueled by uncertainty. Limerence thrives on intermittent reinforcement and the hope of reciprocation, while love can exist comfortably without it.' },
  ],
  'how-long-does-it-take-to-get-over-a-breakup-timeline': [
    { q: 'How long does it take to get over a breakup?', a: 'Research suggests most people begin to feel significantly better within three to six months, though complete emotional recovery from a serious relationship can take one to two years. The timeline depends on relationship length, attachment style, and whether closure was achieved.' },
    { q: 'Is there a formula for breakup recovery time?', a: 'There is no universal formula. The popular myth that it takes half the relationship length to recover has no scientific basis. Recovery depends on individual factors including attachment style, social support, and whether you engage in active processing versus avoidance.' },
  ],
  'stages-of-grief-after-breakup-denial-anger-bargaining-acceptance': [
    { q: 'Do the five stages of grief apply to breakups?', a: 'The Kübler-Ross model (denial, anger, bargaining, depression, acceptance) was originally developed for terminal illness, not breakups. However, many people experience similar emotional phases after a breakup, though rarely in a linear sequence.' },
    { q: 'Is grief after a breakup the same as grief after death?', a: 'The neurological mechanisms are similar. Brain imaging studies show that both types of loss activate the same pain and attachment centers. The key difference is ambiguity: after a breakup, the person is still alive, which can make closure harder.' },
  ],
  'still-in-love-with-ex-years-later-normal-psychology': [
    { q: 'Is it normal to still love your ex years later?', a: 'Yes. Attachment bonds can persist long after a relationship ends, especially if the relationship was formative or if closure was never achieved. The Zeigarnik effect means unresolved relationships continue to occupy mental space indefinitely.' },
    { q: 'Why do I still think about my ex after years?', a: 'Emotional memories are stored differently than factual memories. The amygdala encodes the emotional intensity of experiences with extraordinary persistence, which is why a song or a smell can transport you back to a relationship that ended years ago.' },
  ],
  'why-we-romanticize-people-who-hurt-us': [
    { q: 'Why do we romanticize toxic relationships?', a: "The brain's fading affect bias causes negative memories to lose emotional intensity faster than positive ones. Combined with intermittent reinforcement from the toxic partner, your brain remembers the highs more vividly than the lows, creating an idealized version of someone who hurt you." },
    { q: 'How do you stop romanticizing your ex?', a: "Write down the specific things that hurt you. The fading affect bias works in your brain's background, but concrete written records resist the distortion. An unsent letter archive preserves the truth of how you felt in the moment." },
  ],
  'missing-them-vs-missing-the-idea-of-them': [
    { q: 'How do you know if you miss them or just miss the idea of them?', a: 'If you miss specific, concrete details about the real person (their laugh, their habits, their flaws), you miss them. If you miss abstract feelings (being loved, having someone, not being alone), you miss the idea. Most people miss a combination of both.' },
    { q: 'Why do I miss my ex when the relationship was bad?', a: 'You are likely missing the idealized version your brain constructed, not the real person. The fading affect bias softens painful memories faster than positive ones, leaving you with a highlight reel rather than the full picture.' },
  ],
  'phantom-vibrations-digital-hypervigilance-after-heartbreak': [
    { q: 'What are phantom vibrations after a breakup?', a: 'Phantom vibration syndrome is when your brain misinterprets sensory input as a phone notification. After a breakup, your nervous system remains hypervigilant for contact from the person you lost, causing you to feel vibrations that are not there.' },
    { q: 'Why do I keep checking my phone after a breakup?', a: "Your brain's dopamine reward system was trained to associate phone notifications with emotional reward from your partner. After the relationship ends, the system keeps firing, creating compulsive checking behavior similar to withdrawal from a substance." },
  ],
  'why-you-check-their-social-media-even-though-it-hurts': [
    { q: 'Why do I stalk my ex on social media?', a: 'Social media checking activates the same dopamine pathways as the relationship itself. Each check is a micro-dose of hope (maybe they posted something about missing you) combined with dread (maybe they have moved on). This intermittent reinforcement pattern is highly addictive.' },
    { q: "How do I stop checking my ex's social media?", a: 'Block or mute them. Willpower alone rarely works against dopamine-driven compulsion. Removing the option to check is more effective than trying to resist the urge. If you cannot block, use app timers or website blockers to create friction.' },
  ],
};

const partFiles = readdirSync(LIB_DIR)
  .filter(f => f.match(/^journal-data-part\d+\.ts$/))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));

let fixed = 0;

for (const file of partFiles) {
  const filePath = join(LIB_DIR, file);
  let content = readFileSync(filePath, 'utf-8');
  
  // Check if this file has the broken FAQ pattern
  if (!content.includes(`question: 'What is "" about?'`)) continue;
  
  // Find the slug and title for each article in this file
  const slugMatches = [...content.matchAll(/slug:\s*'([^']+)'/g)];
  const titleMatches = [...content.matchAll(/title:\s*'([^']+)'/g)];
  
  for (let i = 0; i < slugMatches.length; i++) {
    const slug = slugMatches[i][1];
    const title = titleMatches[i] ? titleMatches[i][1] : slug;
    
    if (CUSTOM_FAQ_SLUGS.has(slug)) continue;
    
    // Check if this article has the broken FAQ
    const articleStart = content.indexOf(`slug: '${slug}'`);
    const nextArticle = content.indexOf(`slug: '`, articleStart + 10);
    const articleEnd = nextArticle !== -1 ? nextArticle : content.length;
    const articleBlock = content.substring(articleStart, articleEnd);
    
    if (!articleBlock.includes(`question: 'What is "" about?'`)) continue;
    
    // Generate proper FAQ
    let faqItems;
    if (SLUG_FAQS[slug]) {
      faqItems = SLUG_FAQS[slug];
    } else {
      // Generate from title - create contextual FAQs
      const cleanTitle = title.replace(/['"]/g, '').replace(/\u2014/g, '—').replace(/\u2019/g, "'");
      
      // Create topic-specific Q&A based on title keywords
      const titleLower = title.toLowerCase();
      let q1, a1, q2, a2;
      
      if (titleLower.includes('why') || titleLower.includes('how')) {
        q1 = cleanTitle.split(':')[0].split('—')[0].trim() + '?';
        if (!q1.startsWith('Why') && !q1.startsWith('How')) q1 = cleanTitle + '?';
        a1 = `This article examines the psychology and emotional reality behind this question. It draws on attachment theory, neuroscience research, and the lived experience of people who have shared their unspoken words in anonymous archives.`;
      } else {
        q1 = `What does "${cleanTitle.split(':')[0].split('—')[0].trim()}" mean?`;
        a1 = `This article explores the emotional experience described in the title, examining it through the lens of psychology research and the real stories people share in unsent letter archives.`;
      }
      
      q2 = 'How does writing an unsent letter help process these feelings?';
      a2 = `Expressive writing research by Dr. James Pennebaker at the University of Texas shows that putting emotional experiences into words produces measurable improvements in both psychological and physical health. The constraint of 25 words forces you to identify the single core truth, which is where most of the therapeutic benefit comes from.`;
      
      faqItems = [{ q: q1, a: a1 }, { q: q2, a: a2 }];
    }
    
    // Build the replacement FAQ block
    const faqStr = faqItems.map(f => 
      `      {\n        question: '${f.q.replace(/'/g, "\\'")}',\n        answer: '${f.a.replace(/'/g, "\\'")}',\n      }`
    ).join(',\n');
    const newFaqBlock = `    faq: [\n${faqStr},\n    ],`;
    
    // Find and replace the broken FAQ block in the content
    // The broken block looks like: faq: [\n...What is "" about?...\n    ],
    const faqStart = content.indexOf('    faq: [', articleStart);
    if (faqStart === -1 || faqStart > articleEnd) continue;
    
    const faqEnd = content.indexOf('    ],', faqStart) + 6;
    if (faqEnd <= 6) continue;
    
    content = content.substring(0, faqStart) + newFaqBlock + content.substring(faqEnd);
    fixed++;
    console.log(`✅ Fixed: ${slug}`);
  }
  
  writeFileSync(filePath, content, 'utf-8');
}

console.log(`\n📊 Fixed ${fixed} broken FAQs`);
