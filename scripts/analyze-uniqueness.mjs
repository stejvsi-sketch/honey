#!/usr/bin/env node
// Analyze the uniqueness of seed-messages.json
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = JSON.parse(readFileSync(join(__dirname, 'seed-messages.json'), 'utf8'));

console.log(`Total messages: ${pool.length}\n`);

// 1. Exact duplicates (case-insensitive)
const seen = new Map();
let exactDupes = 0;
for (const entry of pool) {
  const key = entry.message.toLowerCase().trim();
  if (seen.has(key)) {
    exactDupes++;
  } else {
    seen.set(key, 0);
  }
  seen.set(key, (seen.get(key) || 0) + 1);
}
console.log(`=== EXACT DUPLICATES ===`);
console.log(`Exact duplicate messages: ${exactDupes}`);

// 2. Prefix pattern analysis
const prefixCounts = {};
const prefixes = [
  'not gonna lie', 'ngl', 'honestly', 'tbh', 'idk why but', 'look',
  'hey', 'listen', 'okay so', 'i mean', 'lowkey', 'real talk',
  'fr tho', 'god', 'ugh', 'man', 'bro', 'dude', 'yo', 'okay',
  'so', 'like', 'can i just say', 'the truth is', 'hear me out',
  'i just wanna say', 'here goes', 'okay hear me out',
  'no but seriously', 'for what it\'s worth', 'between us',
  'confession:', 'unpopular opinion but', 'idk man',
  'it\'s 3am and', 'late night thoughts but', 'can\'t sleep so',
  'random thought but', 'just saying', 'fwiw',
  'not to be dramatic but', 'please don\'t judge me but',
];

for (const entry of pool) {
  const msg = entry.message.toLowerCase();
  for (const p of prefixes) {
    if (msg.startsWith(p)) {
      prefixCounts[p] = (prefixCounts[p] || 0) + 1;
    }
  }
}
console.log(`\n=== PREFIX FREQUENCY ===`);
const sortedPrefixes = Object.entries(prefixCounts).sort((a, b) => b[1] - a[1]);
let totalPrefixed = 0;
for (const [prefix, count] of sortedPrefixes) {
  totalPrefixed += count;
  console.log(`  "${prefix}": ${count} (${(count/pool.length*100).toFixed(1)}%)`);
}
console.log(`Total messages with common prefixes: ${totalPrefixed} (${(totalPrefixed/pool.length*100).toFixed(1)}%)`);

// 3. Suffix pattern analysis
const suffixCounts = {};
const suffixes = [
  'bruh', 'ngl', 'istg', 'smh', 'tbh', 'fr', 'no cap',
  'always', 'forever', 'lol', 'haha', ':(', ':)',
  'sigh', 'ugh', 'idk',
];

for (const entry of pool) {
  const msg = entry.message.toLowerCase().trim();
  for (const s of suffixes) {
    if (msg.endsWith(s) || msg.endsWith(s + '.') || msg.endsWith('. ' + s)) {
      suffixCounts[s] = (suffixCounts[s] || 0) + 1;
    }
  }
}
console.log(`\n=== SUFFIX FREQUENCY ===`);
const sortedSuffixes = Object.entries(suffixCounts).sort((a, b) => b[1] - a[1]);
let totalSuffixed = 0;
for (const [suffix, count] of sortedSuffixes) {
  totalSuffixed += count;
  console.log(`  "${suffix}": ${count} (${(count/pool.length*100).toFixed(1)}%)`);
}
console.log(`Total messages with common suffixes: ${totalSuffixed} (${(totalSuffixed/pool.length*100).toFixed(1)}%)`);

// 4. Similarity analysis — check for messages that differ only by 1-2 words
function tokenize(msg) {
  return msg.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 0);
}

// Jaccard similarity
function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}

// Sample 2000 random pairs and check similarity
console.log(`\n=== SIMILARITY ANALYSIS (sampling 5000 random pairs) ===`);
const tokenized = pool.map(e => tokenize(e.message));
let highSimilar = 0;
let veryHighSimilar = 0;
const sampleSize = 5000;
const similarExamples = [];

for (let i = 0; i < sampleSize; i++) {
  const a = Math.floor(Math.random() * pool.length);
  let b = Math.floor(Math.random() * pool.length);
  while (b === a) b = Math.floor(Math.random() * pool.length);
  
  const sim = jaccard(tokenized[a], tokenized[b]);
  if (sim > 0.7) {
    veryHighSimilar++;
    if (similarExamples.length < 10) {
      similarExamples.push({
        a: pool[a].message,
        b: pool[b].message,
        sim: sim.toFixed(3)
      });
    }
  } else if (sim > 0.5) {
    highSimilar++;
  }
}

console.log(`  Pairs with >70% word overlap: ${veryHighSimilar} / ${sampleSize} (${(veryHighSimilar/sampleSize*100).toFixed(1)}%)`);
console.log(`  Pairs with >50% word overlap: ${highSimilar} / ${sampleSize} (${(highSimilar/sampleSize*100).toFixed(1)}%)`);

if (similarExamples.length > 0) {
  console.log(`\n  Examples of highly similar pairs:`);
  for (const ex of similarExamples.slice(0, 5)) {
    console.log(`\n  [${ex.sim}] A: "${ex.a}"`);
    console.log(`          B: "${ex.b}"`);
  }
}

// 5. Structural pattern analysis — how many are "opener + closer" combos
console.log(`\n=== STRUCTURAL PATTERN ANALYSIS ===`);
const openerFragments = [
  "i miss you", "i love you", "i'm sorry", "i think about you",
  "i wish we", "i hope you", "i never told you", "i can't stop thinking",
  "i'm still not over you", "i should have told you",
  "i need you to know", "i keep wondering",
  "i just wanted to say", "i still care about you",
  "i'm trying to move on", "i can't believe you left",
  "i wish things were different", "sometimes i wonder",
  "i'm learning to live without you", "the truth is i never stopped",
  "i never meant to hurt you", "every day i think about",
  "i'm still waiting for you", "part of me still loves you",
];
const closerFragments = [
  "and i don't think i ever will",
  "but i was too afraid", "even after everything",
  "and it breaks my heart", "but i never had the courage",
  "more than you'll ever know", "and that's okay",
  "but it's too late now", "and i hope you know",
  "even when you don't deserve it", "and it haunts me",
  "but some things are better left unsaid",
  "even if you never read this", "and i'm tired of pretending",
  "and i probably always will", "but the timing was never right",
  "but i don't know how to anymore",
  "but maybe it's for the best",
];

let comboCount = 0;
for (const entry of pool) {
  const msg = entry.message.toLowerCase();
  let hasOpener = false;
  let hasCloser = false;
  for (const o of openerFragments) {
    if (msg.startsWith(o) || msg.includes(o)) { hasOpener = true; break; }
  }
  for (const c of closerFragments) {
    if (msg.endsWith(c) || msg.includes(c)) { hasCloser = true; break; }
  }
  if (hasOpener && hasCloser) comboCount++;
}
console.log(`Messages matching "opener + closer" pattern: ${comboCount} (${(comboCount/pool.length*100).toFixed(1)}%)`);

// 6. Word frequency — find overused words
console.log(`\n=== MOST OVERUSED WORDS ===`);
const wordFreq = {};
for (const entry of pool) {
  const words = tokenize(entry.message);
  const uniqueWords = new Set(words);
  for (const w of uniqueWords) {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
}
// Filter common stop words
const stopWords = new Set(['i', 'you', 'me', 'my', 'to', 'the', 'a', 'and', 'of', 'in', 'it', 'is', 'that', 'for', 'was', 'but', 'not', 'with', 'be', 'on', 'at', 'so', 'or', 'if', 'do', 'no', 'am', 'an', 'as', 'this', 'what', 'when', 'how', 'who', 'all', 'we', 'they', 'are', 'had', 'has', 'have', 'will', 'would', 'could', 'should', 'its', 'ur', 'u', 'im', 'dont', 'cant', 'wont', 'thats', 'about', 'just', 'from', 'up', 'out', 'them']);
const meaningfulWords = Object.entries(wordFreq)
  .filter(([w]) => !stopWords.has(w) && w.length > 2)
  .sort((a, b) => b[1] - a[1]);

for (const [word, count] of meaningfulWords.slice(0, 30)) {
  const pct = (count / pool.length * 100).toFixed(1);
  console.log(`  "${word}": appears in ${count} messages (${pct}%)`);
}

// 7. Sentence structure analysis
console.log(`\n=== SENTENCE STRUCTURE PATTERNS ===`);
const structures = {};
for (const entry of pool) {
  const words = tokenize(entry.message);
  // Create a simplified structure pattern (first 4 words)
  const pattern = words.slice(0, 4).join(' ');
  structures[pattern] = (structures[pattern] || 0) + 1;
}
const topStructures = Object.entries(structures).sort((a, b) => b[1] - a[1]).slice(0, 20);
console.log(`Top 20 most repeated opening patterns (first 4 words):`);
for (const [pattern, count] of topStructures) {
  console.log(`  "${pattern}": ${count} messages`);
}

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log(`SUMMARY`);
console.log(`${'='.repeat(60)}`);
console.log(`Total messages: ${pool.length}`);
console.log(`Exact duplicates: ${exactDupes}`);
console.log(`Messages with bot-like prefixes: ${totalPrefixed}`);
console.log(`Estimated highly similar pairs (>70%): ~${Math.round(veryHighSimilar / sampleSize * pool.length * pool.length / 2)}`);
console.log(`Messages from opener+closer combos: ${comboCount}`);
