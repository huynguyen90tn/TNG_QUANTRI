// File: src/modules/quan_ly_luong/constants/loai_luong.js
// Nhánh: main

export const CAP_BAC = {
  THU_SINH: 'THU_SINH',
  VO_SINH: 'VO_SINH', 
  TIEU_HIEP: 'TIEU_HIEP',
  HIEP_SI: 'HIEP_SI',
  KIEM_KHACH: 'KIEM_KHACH',
  HIEP_KHACH: 'HIEP_KHACH',
  DAI_HIEP: 'DAI_HIEP', 
  KIEM_THANH: 'KIEM_THANH',
  KIEM_DE: 'KIEM_DE',
  KIEM_THAN: 'KIEM_THAN'
};

export const CAP_BAC_LABEL = {
  THU_SINH: 'Thư Sinh',
  VO_SINH: 'Võ Sinh',
  TIEU_HIEP: 'Tiểu Hiệp',
  HIEP_SI: 'Hiệp Sĩ', 
  KIEM_KHACH: 'Kiếm Khách',
  HIEP_KHACH: 'Hiệp Khách',
  DAI_HIEP: 'Đại Hiệp',
  KIEM_THANH: 'Kiếm Thánh',
  KIEM_DE: 'Kiếm Đế', 
  KIEM_THAN: 'Kiếm Thần'
};

export const LUONG_THEO_CAP_BAC = {
  THU_SINH: 0,
  VO_SINH: 1000000,
  TIEU_HIEP: 3000000,
  HIEP_SI: 6000000,
  KIEM_KHACH: 8000000,
  HIEP_KHACH: 10000000, 
  DAI_HIEP: 12000000,
  KIEM_THANH: 20000000,
  KIEM_DE: 24000000,
  KIEM_THAN: 30000000
};

export const TRANG_THAI_LUONG = {
  CHO_DUYET: 'cho_duyet',
  DA_DUYET: 'da_duyet', 
  DA_THANH_TOAN: 'da_thanh_toan'
};

export const TRANG_THAI_LABEL = {
  cho_duyet: 'Chờ duyệt',
  da_duyet: 'Đã duyệt',
  da_thanh_toan: 'Đã thanh toán'
};

export const LOAI_PHU_CAP = {
  AN_UONG: 'an_uong',
  DI_LAI: 'di_lai',
  DIEN_THOAI: 'dien_thoai',
  KHAC: 'khac'
};

export const PHU_CAP_LABEL = {
  an_uong: 'Ăn uống',
  di_lai: 'Đi lại',
  dien_thoai: 'Điện thoại', 
  khac: 'Khác'
};

export const MUC_THUE = [
  { muc: 5000000, tiLe: 0.05 },
  { muc: 10000000, tiLe: 0.1 },
  { muc: 18000000, tiLe: 0.15 },
  { muc: 32000000, tiLe: 0.2 },
  { muc: 52000000, tiLe: 0.25 },
  { muc: 80000000, tiLe: 0.3 },
  { muc: Infinity, tiLe: 0.35 }
];

export const BAO_HIEM = {
  BHYT: 0.015, // 1.5%
  BHXH: 0.08,  // 8%
  BHTN: 0.01   // 1%
};

export const BAO_HIEM_LABEL = {
  BHYT: 'Bảo hiểm y tế',
  BHXH: 'Bảo hiểm xã hội',
  BHTN: 'Bảo hiểm thất nghiệp'
};

export const PHONG_BAN = [
  { id: 'thien-minh-duong', ten: 'Thiên Minh Đường' },
  { id: 'tay-van-cac', ten: 'Tây Văn Các' },  
  { id: 'hoa-tam-duong', ten: 'Hòa Tâm Đường' },
  { id: 'ho-ly-son-trang', ten: 'Hồ Ly Sơn Trang' },
  { id: 'hoa-van-cac', ten: 'Hoa Văn Các' },
  { id: 'tinh-van-cac', ten: 'Tinh Văn Các' }
];

export const PHONG_BAN_LABEL = PHONG_BAN.reduce((acc, { id, ten }) => {
  acc[id] = ten;
  return acc;
}, {});

export default {
  CAP_BAC,
  CAP_BAC_LABEL,
  LUONG_THEO_CAP_BAC,
  TRANG_THAI_LUONG,
  TRANG_THAI_LABEL,
  LOAI_PHU_CAP,
  PHU_CAP_LABEL,
  MUC_THUE,
  BAO_HIEM,
  BAO_HIEM_LABEL,
  PHONG_BAN,
  PHONG_BAN_LABEL
};