export interface Chapter {
  number: number;
  title: string;
  epigraph?: string;
  content: string;
}

export interface Story {
  slug: string;
  title: string;
  author: string;
  date: string;
  synopsis: string;
  coverColor: string;
  chapters: Chapter[];
}

import { THE_LAST_RIDE } from './the-last-ride';
import { WHILE_YOU_SLEEP } from './while-you-sleep';
import { UNTIL_YOU_REMEMBER } from './until-you-remember';
import { STILL_HERE } from './still-here';
import { SEVENTEEN_YEARS } from './seventeen-years';
import { ALMOST_HOME } from './almost-home';
import { MICHAEL } from './michael';

export const STORIES: Story[] = [
  THE_LAST_RIDE,
  WHILE_YOU_SLEEP,
  UNTIL_YOU_REMEMBER,
  STILL_HERE,
  SEVENTEEN_YEARS,
  ALMOST_HOME,
  MICHAEL,
];
