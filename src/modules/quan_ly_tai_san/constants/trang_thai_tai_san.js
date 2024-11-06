// File: src/modules/quan_ly_tai_san/constants/trang_thai_tai_san.js
// Link tham khảo: https://www.figma.com/file/XXXXX (link thiết kế)
// Nhánh: main

export const TRANG_THAI_TAI_SAN = {
    CHO_CAP_PHAT: 'cho_cap_phat',
    DA_CAP_PHAT: 'da_cap_phat',
    DANG_BAO_TRI: 'dang_bao_tri',
    DA_THU_HOI: 'da_thu_hoi',
    HONG: 'hong',
    THANH_LY: 'thanh_ly'
  };
  
  export const TEN_TRANG_THAI = {
    [TRANG_THAI_TAI_SAN.CHO_CAP_PHAT]: 'Chờ cấp phát',
    [TRANG_THAI_TAI_SAN.DA_CAP_PHAT]: 'Đã cấp phát',
    [TRANG_THAI_TAI_SAN.DANG_BAO_TRI]: 'Đang bảo trì',
    [TRANG_THAI_TAI_SAN.DA_THU_HOI]: 'Đã thu hồi',
    [TRANG_THAI_TAI_SAN.HONG]: 'Hỏng',
    [TRANG_THAI_TAI_SAN.THANH_LY]: 'Thanh lý'
  };
  
  export const MAU_TRANG_THAI = {
    [TRANG_THAI_TAI_SAN.CHO_CAP_PHAT]: 'blue',
    [TRANG_THAI_TAI_SAN.DA_CAP_PHAT]: 'green', 
    [TRANG_THAI_TAI_SAN.DANG_BAO_TRI]: 'orange',
    [TRANG_THAI_TAI_SAN.DA_THU_HOI]: 'purple',
    [TRANG_THAI_TAI_SAN.HONG]: 'red',
    [TRANG_THAI_TAI_SAN.THANH_LY]: 'gray'
  };
  
  export const TRANG_THAI_BAO_TRI = {
    DANG_THUC_HIEN: 'dang_thuc_hien',
    DA_HOAN_THANH: 'da_hoan_thanh',
    DA_HUY: 'da_huy'
  };
  
  export const TEN_TRANG_THAI_BAO_TRI = {
    [TRANG_THAI_BAO_TRI.DANG_THUC_HIEN]: 'Đang thực hiện',
    [TRANG_THAI_BAO_TRI.DA_HOAN_THANH]: 'Đã hoàn thành',
    [TRANG_THAI_BAO_TRI.DA_HUY]: 'Đã hủy'
  };
  
  export const TRANG_THAI_KIEM_KE = {
    BINH_THUONG: 'binh_thuong',
    HU_HONG: 'hu_hong', 
    MAT: 'mat'
  };
  
  export const TEN_TRANG_THAI_KIEM_KE = {
    [TRANG_THAI_KIEM_KE.BINH_THUONG]: 'Bình thường',
    [TRANG_THAI_KIEM_KE.HU_HONG]: 'Hư hỏng',
    [TRANG_THAI_KIEM_KE.MAT]: 'Mất'
  };
  
  export default {
    TRANG_THAI_TAI_SAN,
    TEN_TRANG_THAI,
    MAU_TRANG_THAI,
    TRANG_THAI_BAO_TRI,
    TEN_TRANG_THAI_BAO_TRI,
    TRANG_THAI_KIEM_KE,
    TEN_TRANG_THAI_KIEM_KE
  };
 

