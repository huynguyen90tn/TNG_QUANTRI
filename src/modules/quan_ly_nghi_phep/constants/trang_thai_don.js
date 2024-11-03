// src/modules/quan_ly_nghi_phep/constants/trang_thai_don.js

export const TRANG_THAI_DON = {
    CHO_DUYET: 'CHO_DUYET',
    DA_DUYET: 'DA_DUYET',
    TU_CHOI: 'TU_CHOI',
    HUY: 'HUY'
  };
  
  export const TRANG_THAI_LABEL = {
    [TRANG_THAI_DON.CHO_DUYET]: 'Chờ duyệt',
    [TRANG_THAI_DON.DA_DUYET]: 'Đã duyệt',
    [TRANG_THAI_DON.TU_CHOI]: 'Từ chối',
    [TRANG_THAI_DON.HUY]: 'Đã hủy'
  };
  
  export const TRANG_THAI_COLOR = {
    [TRANG_THAI_DON.CHO_DUYET]: 'yellow',
    [TRANG_THAI_DON.DA_DUYET]: 'green',
    [TRANG_THAI_DON.TU_CHOI]: 'red',
    [TRANG_THAI_DON.HUY]: 'gray'
  };
  
  export const LOAI_NGHI_PHEP = {
    NGHI_PHEP_CO_LUONG: 'NGHI_PHEP_CO_LUONG',
    NGHI_PHEP_KHONG_LUONG: 'NGHI_PHEP_KHONG_LUONG',
    NGHI_OM: 'NGHI_OM',
    NGHI_THAI_SAN: 'NGHI_THAI_SAN'
  };
  
  export const LOAI_NGHI_PHEP_LABEL = {
    [LOAI_NGHI_PHEP.NGHI_PHEP_CO_LUONG]: 'Nghỉ phép có lương',
    [LOAI_NGHI_PHEP.NGHI_PHEP_KHONG_LUONG]: 'Nghỉ phép không lương',
    [LOAI_NGHI_PHEP.NGHI_OM]: 'Nghỉ ốm',
    [LOAI_NGHI_PHEP.NGHI_THAI_SAN]: 'Nghỉ thai sản'
  };