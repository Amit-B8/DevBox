export function readNumber(value: string): number {
  if (!value.trim() || !Number.isFinite(Number(value))) {
    throw new Error('Enter a finite number in every field.');
  }
  return Number(value);
}

export function percentage(mode: string, a: number, b: number): number {
  if (mode !== 'of' && b === 0) throw new Error('The base value cannot be zero.');
  const result = mode === 'of' ? (a / 100) * b : mode === 'change' ? ((a - b) / Math.abs(b)) * 100 : (a / b) * 100;
  if (!Number.isFinite(result)) throw new Error('These values are too large to calculate.');
  return result;
}

export function quadratic(a: number, b: number, c: number): string[] {
  if (a === 0) {
    if (b === 0) return [c === 0 ? 'Every number is a solution.' : 'No solution.'];
    const root = -c / b;
    if (!Number.isFinite(root)) throw new Error('These values are too large to calculate.');
    return [`Linear equation: x = ${formatNumber(root)}`];
  }
  // Scale coefficients to avoid overflow in the discriminant.
  const scale = Math.max(Math.abs(a), Math.abs(b), Math.abs(c));
  a /= scale; b /= scale; c /= scale;
  const d = b * b - 4 * a * c;
  if (a === 0) throw new Error('The coefficient range is too large to calculate reliably.');
  if (d < 0) {
    const real = -b / (2 * a);
    const imaginary = Math.sqrt(-d) / Math.abs(2 * a);
    if (![real, imaginary].every(Number.isFinite)) throw new Error('These values are too large to calculate.');
    return [`x = ${formatNumber(real)} ± ${formatNumber(imaginary)}i`, 'Two complex roots.'];
  }
  if (d === 0) return [`x = ${formatNumber(-b / (2 * a))}`, 'One repeated real root.'];
  // Avoid cancellation when one root is much smaller than the other.
  const q = -0.5 * (b + (b >= 0 ? 1 : -1) * Math.sqrt(d));
  const roots = [q / a, c / q].sort((x, y) => x - y);
  if (!roots.every(Number.isFinite)) throw new Error('These values are too large to calculate.');
  return roots.map((root, index) => `x${index + 1} = ${formatNumber(root)}`);
}

export function statistics(raw: string): Record<string, number | null> {
  const tokens = raw.trim().split(/[\s,;]+/);
  if (tokens.length > 10000) throw new Error('Enter at most 10,000 values.');
  const values = tokens.map(readNumber).sort((a, b) => a - b);
  const n = values.length;
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = values.reduce((total, value) => total + value / n, 0);
  const squared = values.reduce((total, value) => total + (value - mean) ** 2, 0);
  const middle = Math.floor(n / 2);
  const result = {
    Count: n, Sum: sum, Mean: mean,
    Median: n % 2 ? values[middle] : values[middle - 1] / 2 + values[middle] / 2,
    Minimum: values[0], Maximum: values[n - 1], Range: values[n - 1] - values[0],
    'Population variance': squared / n,
    'Population standard deviation': Math.sqrt(squared / n),
    'Sample variance': n > 1 ? squared / (n - 1) : null,
    'Sample standard deviation': n > 1 ? Math.sqrt(squared / (n - 1)) : null,
  };
  if (Object.values(result).some(value => value !== null && !Number.isFinite(value))) {
    throw new Error('These values are too large to calculate.');
  }
  return result;
}

export function formatNumber(value: number): string {
  return Number(value.toPrecision(12)).toString();
}
