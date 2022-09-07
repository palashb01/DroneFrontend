/**
 * @param  {Number} num
 */
export function Round(num, toDigits = 2) {
  return Math.round((num + Number.EPSILON) * (10 ^ toDigits)) / (10 ^ toDigits);
}
