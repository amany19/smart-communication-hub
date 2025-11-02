// Helper method to interpret durations like “15m”, “60d”
export function parseDuration(input: string): number {
  const num = parseInt(input, 10);
  if (input.endsWith('m')) return num * 60 * 1000;
  if (input.endsWith('h')) return num * 60 * 60 * 1000;
  if (input.endsWith('d')) return num * 24 * 60 * 60 * 1000;
  return num * 1000;
}