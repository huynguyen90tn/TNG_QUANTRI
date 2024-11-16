// File: src/modules/quan_ly_tai_chinh/utils/dinh_dang_tien.js
// Link tham khảo: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
// Nhánh: main

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export const dinhDangTien = (number) => {
  if (!number || isNaN(number)) return '0 ₫';
  return formatter.format(number);
};

// Đọc số tiền bằng chữ
const docSoTienBangChu = (number) => {
  if (number === 0) return 'không đồng';
  
  const units = [
    '', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười',
    'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu',
    'mười bảy', 'mười tám', 'mười chín'
  ];

  const tens = [
    '', '', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi',
    'bảy mươi', 'tám mươi', 'chín mươi'
  ];

  const docSoDuoi1000 = (n) => {
    let str = '';
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + ' trăm ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      if (n % 10) str += units[n % 10];
    } else if (n > 0) {
      str += units[n];
    }
    return str.trim();
  };

  if (!number || isNaN(number)) return 'không đồng';
  let str = '';
  let hasValue = false;

  if (number >= 1000000000) {
    const billions = Math.floor(number / 1000000000);
    str += docSoDuoi1000(billions) + ' tỷ ';
    number %= 1000000000;
    hasValue = true;
  }

  if (number >= 1000000) {
    const millions = Math.floor(number / 1000000);
    if (hasValue && millions < 100) str += 'không trăm ';
    str += docSoDuoi1000(millions) + ' triệu ';
    number %= 1000000;
    hasValue = true;
  }

  if (number >= 1000) {
    const thousands = Math.floor(number / 1000);
    if (hasValue && thousands < 100) str += 'không trăm ';
    str += docSoDuoi1000(thousands) + ' nghìn ';
    number %= 1000;
    hasValue = true;
  }

  if (number > 0) {
    if (hasValue && number < 100) str += 'không trăm ';
    str += docSoDuoi1000(number);
  }

  return (str + ' đồng').trim();
};

// Format số tiền với dấu phẩy ngăn cách
export const formatSoTien = (value) => {
  if (!value) return '';
  const number = value.toString().replace(/[^\d]/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Chuyển đổi chuỗi có dấu phẩy thành số
export const parseFormattedSoTien = (formattedValue) => {
  if (!formattedValue) return 0;
  return parseInt(formattedValue.replace(/,/g, ''), 10);
};

export const tienTe = {
  dinhDangTien,
  docSoTienBangChu,
  formatSoTien,
  parseFormattedSoTien
};

export default {
  dinhDangTien,
  docSoTienBangChu,
  formatSoTien, 
  parseFormattedSoTien
};