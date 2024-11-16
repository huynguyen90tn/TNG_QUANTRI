// File: src/modules/quan_ly_tai_chinh/utils/tinh_toan_tai_chinh.js
// Nhánh: main

export const tinhTongThu = (nguonThu = []) => {
    return nguonThu.reduce((total, item) => total + (item.soTien || 0), 0);
  };
  
  export const tinhTongChi = (chiTieu = []) => {
    return chiTieu.reduce((total, item) => total + (item.soTien || 0), 0);
  };
  
  export const tinhCanDoi = (nguonThu = [], chiTieu = []) => {
    const tongThu = tinhTongThu(nguonThu);
    const tongChi = tinhTongChi(chiTieu);
    return tongThu - tongChi;
  };
  
  export const phanLoaiTheoThang = (duLieu = [], truongNgay = 'ngay') => {
    return duLieu.reduce((acc, item) => {
      const thang = new Date(item[truongNgay]).toISOString().slice(0, 7);
      if (!acc[thang]) {
        acc[thang] = [];
      }
      acc[thang].push(item);
      return acc;
    }, {});
  };
  
  export const tinhPhanTramThayDoi = (giaTriCu, giaTriMoi) => {
    if (giaTriCu === 0) return 100;
    return ((giaTriMoi - giaTriCu) / giaTriCu) * 100;
  };