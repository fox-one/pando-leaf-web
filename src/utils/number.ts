export function isValid(num: number): boolean {
  return (
    !isNaN(num) &&
    num !== undefined &&
    num !== null &&
    num !== Infinity &&
    num !== -Infinity
  );
}
