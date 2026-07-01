export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  /** Optional topic cluster used to group related posts. */
  category?: string;
  /** Optional explicit list of related post slugs (overrides auto-relation). */
  related?: string[];
  /** Optional FAQ pairs rendered as FAQPage structured data. */
  faq?: { question: string; answer: string }[];
  /** When true, the page will have a noindex robots directive. */
  noindex?: boolean;
}

import { POSTS_PART1 } from './journal-data-part1';
import { POSTS_PART2 } from './journal-data-part2';
import { POSTS_PART3 } from './journal-data-part3';
import { POSTS_PART4 } from './journal-data-part4';
import { POSTS_PART5 } from './journal-data-part5';
import { POSTS_PART6 } from './journal-data-part6';
import { POSTS_PART7 } from './journal-data-part7';
import { POSTS_PART8 } from './journal-data-part8';
import { POSTS_PART9 } from './journal-data-part9';
import { POSTS_PART10 } from './journal-data-part10';
import { POSTS_PART11 } from './journal-data-part11';
import { POSTS_PART12 } from './journal-data-part12';
import { POSTS_PART13 } from './journal-data-part13';
import { POSTS_PART14 } from './journal-data-part14';
import { POSTS_PART15 } from './journal-data-part15';
import { POSTS_PART16 } from './journal-data-part16';
import { POSTS_PART17 } from './journal-data-part17';
import { POSTS_PART18 } from './journal-data-part18';
import { POSTS_PART19 } from './journal-data-part19';
import { POSTS_PART20 } from './journal-data-part20';
import { POSTS_PART21 } from './journal-data-part21';
import { POSTS_PART22 } from './journal-data-part22';
import { POSTS_PART23 } from './journal-data-part23';
import { POSTS_PART24 } from './journal-data-part24';
import { POSTS_PART25 } from './journal-data-part25';
import { POSTS_PART26 } from './journal-data-part26';
import { POSTS_PART27 } from './journal-data-part27';
import { POSTS_PART28 } from './journal-data-part28';
import { POSTS_PART29 } from './journal-data-part29';
import { POSTS_PART30 } from './journal-data-part30';
import { POSTS_PART31 } from './journal-data-part31';
import { POSTS_PART32 } from './journal-data-part32';
import { POSTS_PART33 } from './journal-data-part33';
import { POSTS_PART34 } from './journal-data-part34';
import { POSTS_PART35 } from './journal-data-part35';
import { POSTS_PART36 } from './journal-data-part36';
import { POSTS_PART37 } from './journal-data-part37';
import { POSTS_PART38 } from './journal-data-part38';
import { POSTS_PART39 } from './journal-data-part39';
import { POSTS_PART40 } from './journal-data-part40';
import { POSTS_PART41 } from './journal-data-part41';
import { POSTS_PART42 } from './journal-data-part42';
import { POSTS_PART43 } from './journal-data-part43';
import { POSTS_PART44 } from './journal-data-part44';
import { POSTS_PART45 } from './journal-data-part45';
import { POSTS_PART46 } from './journal-data-part46';
import { POSTS_PART47 } from './journal-data-part47';
import { POSTS_PART48 } from './journal-data-part48';
import { POSTS_PART49 } from './journal-data-part49';
import { POSTS_PART50 } from './journal-data-part50';
import { POSTS_PART51 } from './journal-data-part51';
import { POSTS_PART52 } from './journal-data-part52';
import { POSTS_PART53 } from './journal-data-part53';
import { POSTS_PART54 } from './journal-data-part54';
import { POSTS_PART55 } from './journal-data-part55';
import { POSTS_PART56 } from './journal-data-part56';
import { POSTS_PART57 } from './journal-data-part57';
import { POSTS_PART58 } from './journal-data-part58';
import { POSTS_PART59 } from './journal-data-part59';
import { POSTS_PART60 } from './journal-data-part60';
import { POSTS_PART61 } from './journal-data-part61';
import { POSTS_PART62 } from './journal-data-part62';
import { POSTS_PART63 } from './journal-data-part63';
import { POSTS_PART64 } from './journal-data-part64';
import { POSTS_PART65 } from './journal-data-part65';
import { POSTS_PART66 } from './journal-data-part66';
import { POSTS_PART67 } from './journal-data-part67';
import { POSTS_PART68 } from './journal-data-part68';
import { POSTS_PART69 } from './journal-data-part69';

export const JOURNAL_POSTS: JournalPost[] = [
  ...POSTS_PART1,
  ...POSTS_PART2,
  ...POSTS_PART3,
  ...POSTS_PART4,
  ...POSTS_PART5,
  ...POSTS_PART6,
  ...POSTS_PART7,
  ...POSTS_PART8,
  ...POSTS_PART9,
  ...POSTS_PART10,
  ...POSTS_PART11,
  ...POSTS_PART12,
  ...POSTS_PART13,
  ...POSTS_PART14,
  ...POSTS_PART15,
  ...POSTS_PART16,
  ...POSTS_PART17,
  ...POSTS_PART18,
  ...POSTS_PART19,
  ...POSTS_PART20,
  ...POSTS_PART21,
  ...POSTS_PART22,
  ...POSTS_PART23,
  ...POSTS_PART24,
  ...POSTS_PART25,
  ...POSTS_PART26,
  ...POSTS_PART27,
  ...POSTS_PART28,
  ...POSTS_PART29,
  ...POSTS_PART30,
  ...POSTS_PART31,
  ...POSTS_PART32,
  ...POSTS_PART33,
  ...POSTS_PART34,
  ...POSTS_PART35,
  ...POSTS_PART36,
  ...POSTS_PART37,
  ...POSTS_PART38,
  ...POSTS_PART39,
  ...POSTS_PART40,
  ...POSTS_PART41,
  ...POSTS_PART42,
  ...POSTS_PART43,
  ...POSTS_PART44,
  ...POSTS_PART45,
  ...POSTS_PART46,
  ...POSTS_PART47,
  ...POSTS_PART48,
  ...POSTS_PART49,
  ...POSTS_PART50,
  ...POSTS_PART51,
  ...POSTS_PART52,
  ...POSTS_PART53,
  ...POSTS_PART54,
  ...POSTS_PART55,
  ...POSTS_PART56,
  ...POSTS_PART57,
  ...POSTS_PART58,
  ...POSTS_PART59,
  ...POSTS_PART60,
  ...POSTS_PART61,
  ...POSTS_PART62,
  ...POSTS_PART63,
  ...POSTS_PART64,
  ...POSTS_PART65,
  ...POSTS_PART66,
  ...POSTS_PART67,
  ...POSTS_PART68,
  ...POSTS_PART69,
];
