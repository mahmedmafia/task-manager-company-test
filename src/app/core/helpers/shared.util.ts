export function getDiffInDays(data: string): number {
  const due = new Date(data);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffMs = today.getTime() - due.getTime();
  const diffInDays = diffMs / (1000 * 60 * 60 * 24);
  return diffInDays;
}
export function comparedDate(a: string, b: string): number {
  return new Date(a).getTime() - new Date(b).getTime();
}
export function deepCompare(a: any, b: any): boolean {
  if (a === b) return true;

  if (a == null || b == null || typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => deepCompare(val, b[idx]));
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => keysB.includes(key) && deepCompare(a[key], b[key]));
  }

  return false;
}
