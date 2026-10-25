export interface EnglishCheckResult {
  passed: boolean;
  reason?: string;
}

const NON_ENGLISH_WORDS = new Set([
  'hola', 'gracias', 'adios', 'bonjour', 'bonsoir', 'merci', 'ciao', 'grazie',
  'obrigado', 'obrigada', 'danke', 'hvala', 'srecan', 'sretan', 'rodjendan',
  'rodendan', 'ljubavi', 'volim', 'namaste', 'shukriya', 'dhanyavaad', 'asante',
]);

const NON_ENGLISH_PHRASES = [
  'te amo', 'te quiero', 'mi amor', 'por favor', 'buenos dias', 'buenas noches',
  'au revoir', 'je t aime', 'ich liebe dich', 'guten morgen', 'ti amo', 'bom dia',
  'srecan rodjendan', 'sretan rodjendan', 'volim te', 'nedostajes mi',
];

const ENGLISH_ERROR = 'Please write your letter in English. Non-English scripts and common non-English words are not accepted.';

/**
 * Local, privacy-preserving submission check. It rejects non-Latin scripts and
 * a small set of unambiguous, common non-English words/phrases. It deliberately
 * does not reject every unknown word, since that would also reject names and
 * uncommon English vocabulary.
 */
export function checkEnglishText(text: string): EnglishCheckResult {
  if (!text.trim()) return { passed: true };

  const letterRuns = text.match(/\p{L}+/gu) ?? [];
  if (letterRuns.length === 0 || letterRuns.some(run => /[^\p{Script=Latin}]/u.test(run))) {
    return { passed: false, reason: ENGLISH_ERROR };
  }

  const normalized = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  const words = normalized.match(/[a-z]+(?:'[a-z]+)*/g) ?? [];

  if (words.some(word => NON_ENGLISH_WORDS.has(word))) {
    return { passed: false, reason: ENGLISH_ERROR };
  }

  const phraseScanWords = normalized.replace(/'/g, ' ').match(/[a-z]+/g) ?? [];
  for (const phrase of NON_ENGLISH_PHRASES) {
    const phraseWords = phrase.split(' ');
    for (let index = 0; index <= phraseScanWords.length - phraseWords.length; index++) {
      if (phraseWords.every((word, offset) => phraseScanWords[index + offset] === word)) {
        return { passed: false, reason: ENGLISH_ERROR };
      }
    }
  }

  return { passed: true };
}
