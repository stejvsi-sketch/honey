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
    description: 'Read anonymous unsent messages, breakup confessions, and final words people wish they had said to their ex.',
    keywords: ['unsent messages to ex', 'messages to ex', 'breakup confessions', 'apology to ex'],
    searchTerms: ['ex', 'broke', 'left', 'miss you', 'sorry', 'never meant'],
  },
  {
    slug: 'unsent-messages-to-crush',
    title: 'Unsent Messages to a Crush',
    shortTitle: 'To a Crush',
    description: 'Explore anonymous love confessions, secret admirations, and unspoken feelings written for crushes.',
    keywords: ['unsent messages to crush', 'anonymous crush confession', 'secret admirer letters', 'unspoken feelings'],
    searchTerms: ['crush', 'cute', 'smile', 'look at you', 'secret', 'afraid', 'too scared'],
  },
  {
    slug: 'anonymous-love-messages',
    title: 'Anonymous Love Messages',
    shortTitle: 'Love Messages',
    description: 'Browse thousands of anonymous love messages, from deep enduring affection to sudden, intense crushes.',
    keywords: ['anonymous love messages', 'anonymous love letters', 'pure love confessions', 'deep affection'],
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
    description: 'Read anonymous, 25-word unsent letters addressed to someone special. A digital repository of longing and memory.',
    keywords: ['unsent letters to someone', 'letters to someone special', 'longing messages', 'memory archive'],
    searchTerms: ['someone', 'you', 'remember', 'always', 'hope you', 'wherever you are'],
  },
  {
    slug: 'anonymous-confession-messages',
    title: 'Anonymous Confession Messages',
    shortTitle: 'Confessions',
    description: 'A safe space for anonymous confession messages. Discover the secrets, regrets, and truths people hide.',
    keywords: ['anonymous confession messages', 'secret confessions', 'hidden truths', 'guilt and regret letters'],
    searchTerms: ['confess', 'secret', 'guilty', 'sorry', 'lied', 'truth', 'mistake', 'forgive'],
  },
  {
    slug: 'apologies-never-sent',
    title: 'Apologies Never Sent',
    shortTitle: 'Apologies',
    description: 'Read the apologies people were too afraid or too proud to say out loud. Raw admissions of guilt and regret.',
    keywords: ['apologies never sent', 'anonymous apologies', 'guilt letters', 'sorry messages'],
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
];
