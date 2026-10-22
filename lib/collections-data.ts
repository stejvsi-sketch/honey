export interface CollectionData {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  keywords: string[];
  searchTerms: string[]; // words to look for in the message body using ILIKE
}

export const COLLECTIONS: CollectionData[] = [
  {
    slug: 'unsent-messages-to-ex',
    title: 'Unsent Messages to an Ex',
    shortTitle: 'To an Ex',
    description: 'Read unsent messages, breakup confessions, and final words people wish they had said to an ex.',
    keywords: ['unsent messages to ex', 'messages to ex', 'breakup confessions', 'apology to ex'],
    searchTerms: ['ex', 'broke', 'left', 'miss you', 'sorry', 'never meant'],
  },
  {
    slug: 'unsent-messages-to-crush',
    title: 'Unsent Messages to a Crush',
    shortTitle: 'To a Crush',
    description: 'Explore love confessions, secret admirations, and unspoken feelings written for crushes.',
    keywords: ['unsent messages to crush', 'crush confession', 'secret admirer letters', 'unspoken feelings'],
    searchTerms: ['crush', 'cute', 'smile', 'look at you', 'secret', 'afraid', 'too scared'],
  },
  {
    slug: 'anonymous-love-messages',
    title: 'Unsent Love Messages',
    shortTitle: 'Love Messages',
    description: 'Browse love messages, from enduring affection to sudden, intense crushes. Approved letters are public, and an optional sender name may appear.',
    keywords: ['unsent love messages', 'unsent love letters', 'pure love confessions', 'deep affection'],
    searchTerms: ['love', 'forever', 'beautiful', 'perfect', 'marry', 'soulmate'],
  },
  {
    slug: 'messages-you-never-sent',
    title: 'Messages You Never Sent',
    shortTitle: 'Never Sent',
    description: 'An archive of messages people wrote but never hit send on. Read the unfiltered truth of what was held back.',
    keywords: ['messages you never sent', 'letters never sent', 'held back words', 'unfiltered confessions'],
    searchTerms: ['never', 'wish', 'held back', "couldn't say", "didn't send", 'too late', 'regret'],
  },
  {
    slug: 'unsent-letters-to-someone',
    title: 'Unsent Letters to Someone',
    shortTitle: 'To Someone',
    description: 'Read short unsent letters addressed to someone special, with words about longing and memory.',
    keywords: ['unsent letters to someone', 'letters to someone special', 'longing messages', 'memory archive'],
    searchTerms: ['someone', 'you', 'remember', 'always', 'hope you', 'wherever you are'],
  },
  {
    slug: 'anonymous-confession-messages',
    title: 'Unsent Confession Messages',
    shortTitle: 'Confessions',
    description: 'A public archive of short confession messages. Read words about secrets, regrets, and truths people may find difficult to share.',
    keywords: ['unsent confession messages', 'secret confessions', 'hidden truths', 'guilt and regret letters'],
    searchTerms: ['confess', 'secret', 'guilty', 'sorry', 'lied', 'truth', 'mistake', 'forgive'],
  },
  {
    slug: 'apologies-never-sent',
    title: 'Apologies Never Sent',
    shortTitle: 'Apologies',
    description: 'Read the apologies people were too afraid or too proud to say out loud. Raw admissions of guilt and regret.',
    keywords: ['apologies never sent', 'unsent apologies', 'guilt letters', 'sorry messages'],
    searchTerms: ['sorry', 'apologize', 'my fault', 'forgive me', 'ruined', 'should have', 'wish I'],
  },
  {
    slug: 'final-goodbyes',
    title: 'Final Goodbyes',
    shortTitle: 'Goodbyes',
    description: 'The heartbreaking final messages people wrote when it was finally time to let go and move on.',
    keywords: ['final goodbyes', 'letting go messages', 'moving on letters', 'last words to someone'],
    searchTerms: ['goodbye', 'last time', 'moving on', 'letting go', 'take care', 'farewell', 'over'],
  },

  {
    slug: 'unsent-letters-to-first-love',
    title: 'Unsent Letters to a First Love',
    shortTitle: 'First Love',
    description: 'Letters to first loves: confessions about the person who changed everything and never fully left the writer’s thoughts.',
    keywords: ['unsent letter to first love', 'first love letters', 'message to first love', 'letter to my first love', 'unsent project first love'],
    searchTerms: ['first love', 'first time', 'first kiss', 'young', 'high school', 'remember when', 'first person'],
  },
  {
    slug: 'letters-about-grief-and-loss',
    title: 'Letters About Grief and Loss',
    shortTitle: 'Grief & Loss',
    description: 'Unsent letters to people who are no longer here. Read messages to loved ones lost, words that came too late, or never found the right moment.',
    keywords: ['unsent letter to someone who died', 'grief letters', 'letters to heaven', 'message to someone who passed away', 'letter to lost loved one'],
    searchTerms: ['died', 'heaven', 'gone', 'passed', 'funeral', 'grave', 'angel', 'rest in peace', 'lost you', 'still here', 'watching'],
  },
  {
    slug: 'letters-to-myself',
    title: 'Letters to Myself',
    shortTitle: 'To Myself',
    description: 'Unsent letters people wrote to themselves, their younger self, their future self, or who they are now.',
    keywords: ['letter to myself', 'letter to my younger self', 'unsent letter to future self', 'message to myself', 'note to self'],
    searchTerms: ['myself', 'younger me', 'future me', 'dear me', 'self', 'I wish I knew', 'proud of you', 'younger self'],
  },
  {
    slug: 'unsent-messages-to-best-friend',
    title: 'Unsent Messages to a Best Friend',
    shortTitle: 'Best Friend',
    description: 'Read unsent messages to best friends about friendships lost, drifted apart, or bonds that words could not capture.',
    keywords: ['unsent message to best friend', 'letter to best friend', 'friendship letters', 'message to friend I lost', 'letter to old friend'],
    searchTerms: ['best friend', 'friend', 'friendship', 'grew apart', 'miss our', 'used to be', 'bff', 'like a sister', 'like a brother'],
  },
  {
    slug: 'i-miss-you-messages',
    title: 'I Miss You Messages',
    shortTitle: 'I Miss You',
    description: 'Read short “I miss you” messages about longing, hurt, and words that came too late.',
    keywords: ['i miss you messages', 'miss you letter', 'unsent i miss you text', 'missing someone messages'],
    searchTerms: ['miss you', 'missing you', 'miss your', 'miss us', 'miss the way', 'come back', 'without you'],
  },
  {
    slug: 'heartbreak-letters',
    title: 'Heartbreak Letters',
    shortTitle: 'Heartbreak',
    description: 'Unsent letters about heartbreak, betrayal, and the pain of being left behind.',
    keywords: ['heartbreak letters', 'heartbroken messages', 'broken heart letters', 'unsent heartbreak confessions', 'pain of heartbreak'],
    searchTerms: ['heart', 'broke my', 'broken', 'pain', 'hurt', 'tears', 'cry', 'shattered', 'ache', 'destroyed'],
  },
  {
    slug: 'unsent-letters-to-parents',
    title: 'Unsent Letters to Mom and Dad',
    shortTitle: 'To Parents',
    description: 'Unsent letters to parents: thank-yous never said, apologies held back, and complicated family love.',
    keywords: ['unsent letter to mom', 'unsent letter to dad', 'letter to parents never sent', 'message to mother', 'message to father'],
    searchTerms: ['mom', 'dad', 'mother', 'father', 'mama', 'papa', 'parent', 'raised me', 'family'],
  },
  {
    slug: 'toxic-relationship-letters',
    title: 'Letters About Toxic Relationships',
    shortTitle: 'Toxic Love',
    description: 'Unsent letters about toxic relationships. Manipulation, gaslighting, and the moment people realized they deserved better.',
    keywords: ['toxic relationship letters', 'unsent message to toxic ex', 'narcissist letters', 'abusive relationship confessions', 'gaslighting letters'],
    searchTerms: ['toxic', 'manipulate', 'gaslight', 'narcissist', 'abusive', 'controlling', 'deserve better', 'used me', 'damaged'],
  },
  {
    slug: 'late-night-thoughts',
    title: 'Late Night Thoughts',
    shortTitle: '3AM Thoughts',
    description: 'Words people think about late at night but never say: confessions, overthinking, and midnight longing.',
    keywords: ['late night thoughts', '3am thoughts', 'midnight messages', 'things I think about at night', 'cant sleep thinking about you'],
    searchTerms: ['night', '3am', 'midnight', "can't sleep", 'awake', 'alone', 'dark', 'tonight', 'pillow', 'insomnia', 'late'],
  },
  {
    slug: 'thank-you-letters-never-sent',
    title: 'Thank You Letters Never Sent',
    shortTitle: 'Thank You',
    description: 'Letters of gratitude that were never delivered: thank-yous for kindness, love, and simply being there.',
    keywords: ['thank you letter never sent', 'unsent thank you message', 'gratitude letters', 'appreciation messages'],
    searchTerms: ['thank you', 'thanks', 'grateful', 'appreciate', 'thankful', 'meant so much', 'changed my life', 'saved me'],
  },

  {
    slug: 'letters-about-cheating',
    title: 'Letters About Cheating and Betrayal',
    shortTitle: 'Cheating',
    description: 'Unsent letters about cheating, from both sides. Read confessions of betrayal, the pain of being cheated on, and the guilt that followed.',
    keywords: ['unsent letter about cheating', 'cheating confessions', 'betrayal letters', 'letter to someone who cheated', 'infidelity messages'],
    searchTerms: ['cheat', 'cheated', 'affair', 'betray', 'behind my back', 'another', 'unfaithful', 'loyal', 'trusted you'],
  },

  {
    slug: 'one-sided-love-letters',
    title: 'One-Sided Love Letters',
    shortTitle: 'One-Sided Love',
    description: 'Letters about unrequited love and caring for someone who may not feel the same way.',
    keywords: ['one-sided love letter', 'unrequited love messages', 'loving someone who doesnt love you', 'one sided love confessions'],
    searchTerms: ['unrequited', 'one-sided', "don't love me", "doesn't know", 'invisible', 'notice me', "don't feel the same", 'friend zone'],
  },
];
