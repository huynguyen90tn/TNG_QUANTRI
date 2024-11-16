 
// File: src/modules/quan_ly_tai_chinh/utils/xu_ly_ngay.js
// Link tham khảo: https://date-fns.org/
// Nhánh: main

const DINH_DANG_NGAY = 'dd/MM/yyyy';

export const dinhDangNgay = (ngay) => {
  if (!ngay) return '';
  
  try {
    const date = new Date(ngay);
    const ngayFormatted = date.getDate().toString().padStart(2, '0');
    const thangFormatted = (date.getMonth() + 1).toString().padStart(2, '0');
    const nam = date.getFullYear();
    
    return `${ngayFormatted}/${thangFormatted}/${nam}`;
  } catch (error) {
    console.error('Lỗi định dạng ngày:', error);
    return '';
  }
};

export const layNgayHienTai = () => {
  const ngay = new Date();
  return ngay.toISOString().split('T')[0];
};

export const layThangHienTai = () => {
  const ngay = new Date();
  const thang = (ngay.getMonth() + 1).toString().padStart(2, '0');
  const nam = ngay.getFullYear();
  return `${nam}-${thang}`;
};

export const layNgayDauThang = (thang = new Date()) => {
  const ngay = new Date(thang);
  ngay.setDate(1);
  return ngay.toISOString().split('T')[0];
};

export const layNgayCuoiThang = (thang = new Date()) => {
  const ngay = new Date(thang);
  ngay.setMonth(ngay.getMonth() + 1);
  ngay.setDate(0);
  return ngay.toISOString().split('T')[0];
};

export const soSanhNgay = (ngay1, ngay2) => {
  if (!ngay1 || !ngay2) return 0;
  
  const date1 = new Date(ngay1);
  const date2 = new Date(ngay2);
  
  return date1.getTime() - date2.getTime();
};

export const tinhSoNgay = (ngayBatDau, ngayKetThuc) => {
  if (!ngayBatDau || !ngayKetThuc) return 0;
  
  const date1 = new Date(ngayBatDau);
  const date2 = new Date(ngayKetThuc);
  
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const layDanhSachThang = (soThang = 12) => {
  const danhSachThang = [];
  const ngayHienTai = new Date();
  
  for (let i = 0; i < soThang; i++) {
    const ngay = new Date(ngayHienTai);
    ngay.setMonth(ngayHienTai.getMonth() - i);
    
    const thang = (ngay.getMonth() + 1).toString().padStart(2, '0');
    const nam = ngay.getFullYear();
    
    danhSachThang.push(`${nam}-${thang}`);
  }
  
  return danhSachThang;
};
