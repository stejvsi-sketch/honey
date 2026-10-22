import { NAME_INDEX_THRESHOLD } from './constants';

export function formatSubmittedName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return name;
  if (trimmed !== trimmed.toLowerCase() && trimmed !== trimmed.toUpperCase()) return trimmed;

  return trimmed.toLowerCase().replace(/\b[a-z]/g, char => char.toUpperCase());
}

export function isIndexableName(name: string, count: number): boolean {
  return formatSubmittedName(name).replace(/\s/g, '').length >= 3 && count >= NAME_INDEX_THRESHOLD;
}
