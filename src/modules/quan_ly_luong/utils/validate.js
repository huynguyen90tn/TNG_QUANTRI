// File: src/modules/quan_ly_tai_chinh/utils/validate.js
// Nhánh: main

export const validateSoTien = (soTien) => {
    if (!soTien) return 'Số tiền là bắt buộc';
    if (isNaN(soTien)) return 'Số tiền không hợp lệ';
    if (soTien < 0) return 'Số tiền không được âm';
    return '';
  };
  
  export const validateNgay = (ngay) => {
    if (!ngay) return 'Ngày là bắt buộc';
    const date = new Date(ngay);
    if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
    if (date > new Date()) return 'Ngày không được lớn hơn ngày hiện tại';
    return '';
  };
  
  export const validateLoaiThu = (loaiThu) => {
    if (!loaiThu) return 'Loại thu là bắt buộc';
    return '';
  };
  
  export const validateLoaiChi = (loaiChi) => {
    if (!loaiChi) return 'Loại chi là bắt buộc';
    return '';
  };