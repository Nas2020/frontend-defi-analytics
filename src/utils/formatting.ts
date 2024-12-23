// utils/formatting.ts
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      notation: num > 1000000 ? 'compact' : 'standard'
    }).format(num);
  };
  
  export const formatPercentage = (num: number): string => {
    return `${num.toFixed(2)}%`;
  };