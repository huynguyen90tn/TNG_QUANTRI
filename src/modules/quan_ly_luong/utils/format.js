// File: src/modules/quan_ly_luong/utils/format.js
// Nhánh: main

/**
 * Format số thành định dạng tiền tệ VND
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  /**
   * Format phần trăm với 1 số thập phân
   */
  export const formatPercent = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  /**
   * Format ngày tháng theo định dạng Việt Nam
   */
  export const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };
  
  /**
   * Tính tổng array các số
   */
  export const sumArray = (arr) => {
    return arr.reduce((sum, num) => sum + (Number(num) || 0), 0);
  };
  
  /**
   * Làm tròn số đến n chữ số thập phân
   */
  export const roundNumber = (num, decimals = 0) => {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  };
  
  export default {
    formatCurrency,
    formatPercent,
    formatDate,
    sumArray,
    roundNumber
  };