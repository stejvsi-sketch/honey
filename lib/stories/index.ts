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

export const STORIES: Story[] = [
  THE_LAST_RIDE,
];
