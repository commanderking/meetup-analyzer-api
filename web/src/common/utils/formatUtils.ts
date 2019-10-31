export const getPercentage = (num: number, den: number) => {
  if (!den) {
    return null;
  }
  return Math.round((num / den) * 100);
};
