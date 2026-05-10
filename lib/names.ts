export function formatSubmittedName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return name;
  if (trimmed !== trimmed.toLowerCase() && trimmed !== trimmed.toUpperCase()) return trimmed;

  return trimmed.toLowerCase().replace(/\b[a-z]/g, char => char.toUpperCase());
}
