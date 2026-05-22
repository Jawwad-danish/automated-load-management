// Peruse uses a mix of string and string[] (if there are multiple possibilities)
// First element is more probable to be the correct one
export const getFirstElement = (input: string | string[]): string => {
  if (!input) {
    return '';
  }
  if (Array.isArray(input)) {
    return input.length > 0 ? input[0] : '';
  }
  return input;
};

// Big.js does not like the format from Peruse (eg. 3,500.02)
export const cleanMonetaryValue = (input: string): string => {
  return input.replace(/,/g, '');
};
