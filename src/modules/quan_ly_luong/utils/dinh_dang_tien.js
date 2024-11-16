// File: src/modules/quan_ly_tai_chinh/utils/dinh_dang_tien.js
// Nhánh: main

export const dinhDangTien = (soTien) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(soTien);
  };