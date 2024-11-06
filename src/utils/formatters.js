// File: src/utils/formatters.js
// Nhánh: main

export const formatCurrency = (number) => {
    return new Intl.NumberFormat('vi-VN').format(number);
  };