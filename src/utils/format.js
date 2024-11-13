// File: src/utils/format.js
// Nhánh: main

/**
 * Format số thành định dạng tiền tệ VND
 * @param {number} amount - Số tiền cần format
 * @returns {string} Chuỗi đã được format
 */
export const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  } catch (error) {
    console.error('Lỗi format tiền tệ:', error);
    return '0 ₫';
  }
};

/**
 * Format số thành chuỗi có dấu phẩy ngăn cách
 * @param {number} value - Số cần format 
 * @returns {string} Chuỗi đã được format
 */
export const formatNumber = (value) => {
  try {
    if (!value && value !== 0) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    console.error('Lỗi format số:', error);
    return '';
  }
};

/**
 * Chuyển chuỗi số có dấu phẩy thành số
 * @param {string} value - Chuỗi số cần parse
 * @returns {number} Số đã được parse
 */
export const parseFormattedNumber = (value) => {
  try {
    if (!value) return 0;
    return parseInt(value.replace(/,/g, ''), 10) || 0;
  } catch (error) {
    console.error('Lỗi parse số:', error);
    return 0;
  }
};

/**
 * Format phần trăm với 1 số thập phân
 * @param {number} value - Giá trị cần format
 * @returns {string} Chuỗi phần trăm đã format
 */
export const formatPercent = (value) => {
  try {
    if (!value && value !== 0) return '0%';
    return `${((value) * 100).toFixed(1)}%`;
  } catch (error) {
    console.error('Lỗi format phần trăm:', error);
    return '0%';
  }
};

/**
 * Format ngày tháng theo định dạng Việt Nam
 * @param {Date|string} date - Ngày cần format
 * @returns {string} Chuỗi ngày đã format
 */
export const formatDate = (date) => {
  try {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    }).format(dateObj);

  } catch (error) {
    console.error('Lỗi format ngày:', error);
    return '';
  }
};

/**
 * Format thời gian theo định dạng Việt Nam
 * @param {Date|string} date - Thời gian cần format
 * @returns {string} Chuỗi thời gian đã format
 */
export const formatDateTime = (date) => {
  try {
    if (!date) return '';

    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(dateObj);

  } catch (error) {
    console.error('Lỗi format thời gian:', error);
    return '';
  }
};

export default {
  formatCurrency,
  formatNumber,
  parseFormattedNumber,
  formatPercent,
  formatDate,
  formatDateTime
};