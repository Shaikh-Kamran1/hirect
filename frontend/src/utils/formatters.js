/**
 * Format salary to Indian Rupees format
 * @param {string|number} salary - The salary value (can be a number or string like "50000-100000")
 * @returns {string} - Formatted salary with rupee symbol
 */
export const formatSalaryINR = (salary) => {
  if (!salary) return 'Not disclosed';

  // If it's a range like "50000-100000"
  if (typeof salary === 'string' && salary.includes('-')) {
    const [min, max] = salary.split('-').map(s => {
      const num = parseInt(s.trim(), 10);
      return isNaN(num) ? 0 : num;
    });

    if (min === 0 && max === 0) return salary; // Return original if parsing failed

    return `₹${formatNumber(min)} - ₹${formatNumber(max)}`;
  }

  // Single number
  const num = parseInt(String(salary).replace(/[^0-9]/g, ''), 10);
  if (isNaN(num)) return salary;

  return `₹${formatNumber(num)}`;
};

/**
 * Format number with commas (Indian numbering system)
 * @param {number} num - The number to format
 * @returns {string} - Formatted number with commas
 */
export const formatNumber = (num) => {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + ' Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(1) + ' L';
  } else if (num >= 1000) {
    return num.toLocaleString('en-IN');
  }
  return num.toString();
};

/**
 * Format salary with annual/monthly suffix
 * @param {string|number} salary - The salary value
 * @param {string} type - Type: 'annual' or 'monthly'
 * @returns {string} - Formatted salary with suffix
 */
export const formatSalaryWithType = (salary, type = 'annual') => {
  const formatted = formatSalaryINR(salary);
  if (formatted === 'Not disclosed') return formatted;

  const suffix = type === 'monthly' ? '/month' : '/annum';
  return formatted + ' ' + suffix;
};
