export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
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
];
