/**
 * Validate that number can be converted to letter
 */
export const validateNumberToLetter = (value: number) => {
  if (value < 1 || value > 26 ) throw new Error('invalid alphabetical number')
}


/**
 * Gets the letter of the alphabet using the order number
 */
export const numberToLetter = (value: number): string => {
  validateNumberToLetter(value);
  return String.fromCharCode(value+64);
}
