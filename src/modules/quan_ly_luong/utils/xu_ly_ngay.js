// File: src/modules/quan_ly_tai_chinh/utils/xu_ly_ngay.js
// Nhánh: main

export const dinhDangNgay = (ngay) => {
    if (!ngay) return '';
    
    const date = new Date(ngay);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  export const layThangHienTai = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  };
  
  export const layNgayDauThang = (thang) => {
    const [nam, thangSo] = thang.split('-');
    return new Date(nam, parseInt(thangSo) - 1, 1);
  };
  
  export const layNgayCuoiThang = (thang) => {
    const [nam, thangSo] = thang.split('-');
    return new Date(nam, parseInt(thangSo), 0);
  };