export const formatNumber = (number, style = 'decimal', minimumFractionDigits = 0, maximumFractionDigits = 2) => {
  return new Intl.NumberFormat('en-US', {
    style: style,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
    currency: 'USD',
  }).format(number);
};
