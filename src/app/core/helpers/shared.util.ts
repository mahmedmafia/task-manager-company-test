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
  return new Date(b).getTime() - new Date(a).getTime()
}
