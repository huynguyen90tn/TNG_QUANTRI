// File: src/modules/quan_ly_tai_chinh/utils/xu_ly_du_lieu.js
// Nhánh: main

export const locDuLieuTheoNgay = (duLieu, truongNgay, tuNgay, denNgay) => {
    if (!duLieu || !duLieu.length) return [];
  
    return duLieu.filter(item => {
      const ngay = new Date(item[truongNgay]);
      const start = tuNgay ? new Date(tuNgay) : null;
      const end = denNgay ? new Date(denNgay) : null;
  
      if (start && end) {
        return ngay >= start && ngay <= end;
      }
      if (start) {
        return ngay >= start;
      }
      if (end) {
        return ngay <= end;
      }
      return true;
    });
  };
  
  export const sapXepDuLieuTheoNgay = (duLieu, truongNgay, thuTu = 'desc') => {
    if (!duLieu || !duLieu.length) return [];
  
    return [...duLieu].sort((a, b) => {
      const dateA = new Date(a[truongNgay]);
      const dateB = new Date(b[truongNgay]);
      return thuTu === 'desc' ? dateB - dateA : dateA - dateB;
    });
  };
  
  export const groupDuLieuTheoTruong = (duLieu, truong) => {
    if (!duLieu || !duLieu.length) return {};
  
    return duLieu.reduce((acc, item) => {
      const key = item[truong];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  };