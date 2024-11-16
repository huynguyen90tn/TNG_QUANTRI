 
// File: src/modules/quan_ly_tai_chinh/constants/loai_nguon_thu.js
// Nhánh: main

export const LOAI_NGUON_THU = {
    GAME: 'GAME',
    MARKETING: 'MARKETING',
    PHAN_MEM: 'PHAN_MEM',
    WEB: 'WEB',
    KHAC: 'KHAC'
  };
  
  export const TEN_LOAI_NGUON_THU = {
    [LOAI_NGUON_THU.GAME]: 'Game',
    [LOAI_NGUON_THU.MARKETING]: 'Marketing',
    [LOAI_NGUON_THU.PHAN_MEM]: 'Phần mềm',
    [LOAI_NGUON_THU.WEB]: 'Web',
    [LOAI_NGUON_THU.KHAC]: 'Khác'
  };
  
  // File: src/modules/quan_ly_tai_chinh/constants/loai_chi_tieu.js
  // Nhánh: main
  
  export const LOAI_CHI_TIEU = {
    THUONG_XUYEN: 'THUONG_XUYEN',
    ONLINE: 'ONLINE',
    MUA_SAM: 'MUA_SAM',
    KHAC: 'KHAC'
  };
  
  export const TEN_LOAI_CHI_TIEU = {
    [LOAI_CHI_TIEU.THUONG_XUYEN]: 'Chi thường xuyên',
    [LOAI_CHI_TIEU.ONLINE]: 'Chi online',
    [LOAI_CHI_TIEU.MUA_SAM]: 'Mua sắm vật chất',
    [LOAI_CHI_TIEU.KHAC]: 'Chi khác'
  };