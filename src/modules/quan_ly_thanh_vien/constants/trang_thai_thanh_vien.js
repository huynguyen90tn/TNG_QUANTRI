// File: src/modules/quan_ly_thanh_vien/constants/trang_thai_thanh_vien.js
// Link tham khảo: https://eslint.org/docs/rules/
// Nhánh: main

export const TRANG_THAI_THANH_VIEN = {
  DANG_CONG_TAC: 'DANG_CONG_TAC',
  DUNG_CONG_TAC: 'DUNG_CONG_TAC',
  NGHI: 'NGHI',
};

export const TRANG_THAI_LABEL = {
  [TRANG_THAI_THANH_VIEN.DANG_CONG_TAC]: 'Đang công tác',
  [TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC]: 'Dừng công tác', 
  [TRANG_THAI_THANH_VIEN.NGHI]: 'Nghỉ',
};

export const PHONG_BAN = {
  THIEN_MINH_DUONG: 'thien-minh-duong',
  TAY_VAN_CAC: 'tay-van-cac',
  HOA_TAM_DUONG: 'hoa-tam-duong',
  HO_LY_SON_TRANG: 'ho-ly-son-trang',
  HOA_VAN_CAC: 'hoa-van-cac',
  TINH_VAN_CAC: 'tinh-van-cac',
};

export const PHONG_BAN_LABEL = {
  [PHONG_BAN.THIEN_MINH_DUONG]: 'Thiên Minh Đường',
  [PHONG_BAN.TAY_VAN_CAC]: 'Tây Vân Các',
  [PHONG_BAN.HOA_TAM_DUONG]: 'Hoa Tâm Đường',
  [PHONG_BAN.HO_LY_SON_TRANG]: 'Hồ Ly Sơn Trang',
  [PHONG_BAN.HOA_VAN_CAC]: 'Hoa Vân Các',
  [PHONG_BAN.TINH_VAN_CAC]: 'Tinh Vân Các',
};

export const PHONG_BAN_OPTIONS = [
  { value: '', label: 'Chọn phòng ban' },
  { value: PHONG_BAN.THIEN_MINH_DUONG, label: PHONG_BAN_LABEL[PHONG_BAN.THIEN_MINH_DUONG] },
  { value: PHONG_BAN.TAY_VAN_CAC, label: PHONG_BAN_LABEL[PHONG_BAN.TAY_VAN_CAC] },
  { value: PHONG_BAN.HOA_TAM_DUONG, label: PHONG_BAN_LABEL[PHONG_BAN.HOA_TAM_DUONG] },
  { value: PHONG_BAN.HO_LY_SON_TRANG, label: PHONG_BAN_LABEL[PHONG_BAN.HO_LY_SON_TRANG] },
  { value: PHONG_BAN.HOA_VAN_CAC, label: PHONG_BAN_LABEL[PHONG_BAN.HOA_VAN_CAC] },
  { value: PHONG_BAN.TINH_VAN_CAC, label: PHONG_BAN_LABEL[PHONG_BAN.TINH_VAN_CAC] },
];

export const CHUC_VU = {
  THANH_VIEN: 'THANH_VIEN',
  DUONG_CHU: 'DUONG_CHU',
  PHO_BANG_CHU: 'PHO_BANG_CHU',
};

export const CHUC_VU_LABEL = {
  [CHUC_VU.THANH_VIEN]: 'Thành viên',
  [CHUC_VU.DUONG_CHU]: 'Đường chủ',
  [CHUC_VU.PHO_BANG_CHU]: 'Phó Bang chủ',
};

export const CAP_BAC = {
  THU_SINH: 'THU_SINH',
  VO_SINH: 'VO_SINH',
  TIEU_HIEP: 'TIEU_HIEP',
  HIEP_SI: 'HIEP_SI',
  KIEM_KHACH: 'KIEM_KHACH',
  HIEP_KHACH: 'HIEP_KHACH', // Sửa thành uppercase
  DAI_HIEP: 'DAI_HIEP', // Sửa thành uppercase
  KIEM_THANH: 'KIEM_THANH', // Sửa thành uppercase
  KIEM_DE: 'KIEM_DE', // Sửa thành uppercase 
  KIEM_THAN: 'KIEM_THAN', // Sửa thành uppercase
};

export const CAP_BAC_LABEL = {
  [CAP_BAC.THU_SINH]: 'Thư sinh',
  [CAP_BAC.VO_SINH]: 'Võ sinh', 
  [CAP_BAC.TIEU_HIEP]: 'Tiểu hiệp',
  [CAP_BAC.HIEP_SI]: 'Hiệp sĩ',
  [CAP_BAC.KIEM_KHACH]: 'Kiếm khách',
  [CAP_BAC.HIEP_KHACH]: 'Hiệp khách',
  [CAP_BAC.DAI_HIEP]: 'Đại hiệp',
  [CAP_BAC.KIEM_THANH]: 'Kiếm thánh',
  [CAP_BAC.KIEM_DE]: 'Kiếm đế',
  [CAP_BAC.KIEM_THAN]: 'Kiếm thần',
};

export const CAP_BAC_OPTIONS = Object.entries(CAP_BAC).map(([key, value]) => ({
  value,
  label: CAP_BAC_LABEL[value],
}));

export default {
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  PHONG_BAN,
  PHONG_BAN_LABEL,
  PHONG_BAN_OPTIONS,
  CHUC_VU,
  CHUC_VU_LABEL,
  CAP_BAC,
  CAP_BAC_LABEL,
  CAP_BAC_OPTIONS,
};