 
// File: src/modules/quan_ly_tai_chinh/utils/tinh_toan_tai_chinh.js
// Link tham khảo: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
// Nhánh: main

export const tinhTongTien = (danhSach = [], truongTien = 'soTien') => {
    if (!Array.isArray(danhSach)) return 0;
    
    return danhSach.reduce((tong, item) => {
      const tien = Number(item[truongTien]) || 0;
      return tong + tien;
    }, 0);
  };
  
  export const tinhPhanTramThayDoi = (giaTruoc, giaSau) => {
    if (giaTruoc === 0) return giaSau > 0 ? 100 : 0;
    return ((giaSau - giaTruoc) / Math.abs(giaTruoc)) * 100;
  };
  
  export const tinhTyLePhanTram = (phanSo, tongSo) => {
    if (tongSo === 0) return 0;
    return (phanSo / tongSo) * 100;
  };
  
  export const lamTronSo = (so, soThapPhan = 2) => {
    const heSo = Math.pow(10, soThapPhan);
    return Math.round(so * heSo) / heSo;
  };
  
  export const tinhLaiSuat = (soTienGoc, soTienLai, kyHan) => {
    if (soTienGoc === 0 || kyHan === 0) return 0;
    return ((soTienLai - soTienGoc) / soTienGoc / kyHan) * 100;
  };
  
  export const tinhTongTheoThang = (danhSach = [], truongNgay = 'ngay', truongTien = 'soTien') => {
    return danhSach.reduce((acc, item) => {
      const thang = new Date(item[truongNgay]).toISOString().slice(0, 7);
      if (!acc[thang]) {
        acc[thang] = 0;
      }
      acc[thang] += Number(item[truongTien]) || 0;
      return acc;
    }, {});
  };