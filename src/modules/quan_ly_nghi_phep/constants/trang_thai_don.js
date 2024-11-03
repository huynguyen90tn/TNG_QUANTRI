// File: src/modules/quan_ly_nghi_phep/constants/trang_thai_don.js
// Link tham khảo: https://firebase.google.com/docs/firestore/manage-data/data-types

const TRANG_THAI_DON = {
  CHO_DUYET: 'CHO_DUYET',
  DA_DUYET: 'DA_DUYET',
  TU_CHOI: 'TU_CHOI',
  HUY: 'HUY'
};

const TRANG_THAI_LABEL = {
  [TRANG_THAI_DON.CHO_DUYET]: 'Chờ duyệt',
  [TRANG_THAI_DON.DA_DUYET]: 'Đã duyệt',
  [TRANG_THAI_DON.TU_CHOI]: 'Từ chối',
  [TRANG_THAI_DON.HUY]: 'Đã hủy'
};

const TRANG_THAI_COLOR = {
  [TRANG_THAI_DON.CHO_DUYET]: 'yellow',
  [TRANG_THAI_DON.DA_DUYET]: 'green',
  [TRANG_THAI_DON.TU_CHOI]: 'red',
  [TRANG_THAI_DON.HUY]: 'gray'
};

const LOAI_NGHI_PHEP = {
  NGHI_PHEP_CO_LUONG: 'nghi-phep-nam',
  NGHI_PHEP_KHONG_LUONG: 'nghi-khong-luong',
  NGHI_OM: 'nghi-om',
  NGHI_THAI_SAN: 'nghi-thai-san',
  NGHI_VIEC_RIENG: 'nghi-viec-rieng'
};

const LOAI_NGHI_PHEP_LABEL = {
  [LOAI_NGHI_PHEP.NGHI_PHEP_CO_LUONG]: 'Nghỉ phép có lương',
  [LOAI_NGHI_PHEP.NGHI_PHEP_KHONG_LUONG]: 'Nghỉ phép không lương',
  [LOAI_NGHI_PHEP.NGHI_OM]: 'Nghỉ ốm',  
  [LOAI_NGHI_PHEP.NGHI_THAI_SAN]: 'Nghỉ thai sản',
  [LOAI_NGHI_PHEP.NGHI_VIEC_RIENG]: 'Nghỉ việc riêng'
};

const SO_NGAY_NGHI_MAC_DINH = {
  [LOAI_NGHI_PHEP.NGHI_PHEP_CO_LUONG]: 12,
  [LOAI_NGHI_PHEP.NGHI_PHEP_KHONG_LUONG]: 0,
  [LOAI_NGHI_PHEP.NGHI_OM]: 30,
  [LOAI_NGHI_PHEP.NGHI_THAI_SAN]: 180,
  [LOAI_NGHI_PHEP.NGHI_VIEC_RIENG]: 5
};

const HANH_DONG = {
  PHE_DUYET: 'PHE_DUYET',
  TU_CHOI: 'TU_CHOI',  
  HUY: 'HUY'
};

const HANH_DONG_LABEL = {
  [HANH_DONG.PHE_DUYET]: 'Phê duyệt',
  [HANH_DONG.TU_CHOI]: 'Từ chối',
  [HANH_DONG.HUY]: 'Hủy đơn'
};

const QUYEN_HANH_DONG = {
  [HANH_DONG.PHE_DUYET]: ['admin-tong'],
  [HANH_DONG.TU_CHOI]: ['admin-tong'],
  [HANH_DONG.HUY]: ['admin-tong', 'member']
};

const VALIDATION_RULES = {
  MIN_DAYS_NOTICE: 3,
  MAX_DAYS_PER_REQUEST: 30,
  MIN_DAYS_BETWEEN_REQUESTS: 7,
  REQUIRED_FIELDS: ['userId', 'leaveType', 'startDate', 'endDate', 'reason']
};

const ERROR_MESSAGES = {
  INSUFFICIENT_NOTICE: 'Phải gửi đơn trước ít nhất 3 ngày',
  EXCEED_MAX_DAYS: 'Không được nghỉ quá 30 ngày trong một đơn',
  TOO_FREQUENT: 'Phải cách ít nhất 7 ngày giữa 2 đơn nghỉ phép',
  MISSING_FIELDS: 'Vui lòng điền đầy đủ thông tin bắt buộc',
  INVALID_DATE_RANGE: 'Ngày bắt đầu phải trước ngày kết thúc'
};

export {
  TRANG_THAI_DON,
  TRANG_THAI_LABEL,
  TRANG_THAI_COLOR,
  LOAI_NGHI_PHEP,
  LOAI_NGHI_PHEP_LABEL,
  SO_NGAY_NGHI_MAC_DINH,
  HANH_DONG,
  HANH_DONG_LABEL,
  QUYEN_HANH_DONG,
  VALIDATION_RULES,
  ERROR_MESSAGES
};