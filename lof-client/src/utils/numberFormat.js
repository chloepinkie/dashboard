export const formatNumber = (number, style = 'decimal', minimumFractionDigits = 0, maximumFractionDigits = 2) => {
  if (typeof number !== 'number') {
    return number; // Return as is if it's not a number
  }

  const options = {
    style: style,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  };

  if (style === 'currency') {
    options.currency = 'USD';
  }

  return new Intl.NumberFormat('en-US', options).format(number);
};
