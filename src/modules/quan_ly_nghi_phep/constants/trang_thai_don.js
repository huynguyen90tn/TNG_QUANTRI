// File: src/modules/quan_ly_nghi_phep/constants/trang_thai_don.js
// Link tham khảo: https://firebase.google.com/docs/firestore/manage-data/data-types
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
  // Object chứa số ngày nghỉ mặc định cho mỗi loại
  export const SO_NGAY_NGHI_MAC_DINH = {
  [LOAI_NGHI_PHEP.NGHI_PHEP_CO_LUONG]: 12, // 12 ngày/năm
  [LOAI_NGHI_PHEP.NGHI_PHEP_KHONG_LUONG]: 0, // Không giới hạn
  [LOAI_NGHI_PHEP.NGHI_OM]: 30, // 30 ngày/năm
  [LOAI_NGHI_PHEP.NGHI_THAI_SAN]: 180 // 6 tháng
  };
  // Trạng thái duyệt và các hành động
  export const HANH_DONG = {
  PHE_DUYET: 'PHE_DUYET',
  TU_CHOI: 'TU_CHOI',
  HUY: 'HUY'
  };
  export const HANH_DONG_LABEL = {
  [HANH_DONG.PHE_DUYET]: 'Phê duyệt',
  [HANH_DONG.TU_CHOI]: 'Từ chối',
  [HANH_DONG.HUY]: 'Hủy đơn'
  };
  // Phân quyền cho từng hành động
  export const QUYEN_HANH_DONG = {
  [HANH_DONG.PHE_DUYET]: ['admin-tong'],
  [HANH_DONG.TU_CHOI]: ['admin-tong'],
  [HANH_DONG.HUY]: ['admin-tong', 'user'] // User chỉ được hủy đơn của mình khi chưa duyệt
  };
  // Định nghĩa các validation rules
  export const VALIDATION_RULES = {
  MIN_DAYS_NOTICE: 3, // Số ngày tối thiểu phải báo trước
  MAX_DAYS_PER_REQUEST: 30, // Số ngày tối đa cho 1 đơn
  MIN_DAYS_BETWEEN_REQUESTS: 7, // Số ngày tối thiểu giữa 2 đơn
  REQUIRED_FIELDS: ['userId', 'leaveType', 'startDate', 'endDate', 'reason']
  };
  // Định nghĩa các thông báo lỗi
  export const ERROR_MESSAGES = {
  INSUFFICIENT_NOTICE: 'Phải gửi đơn trước ít nhất 3 ngày',
  EXCEED_MAX_DAYS: 'Không được nghỉ quá 30 ngày trong một đơn',
  TOO_FREQUENT: 'Phải cách ít nhất 7 ngày giữa 2 đơn nghỉ phép',
  MISSING_FIELDS: 'Vui lòng điền đầy đủ thông tin bắt buộc',
  INVALID_DATE_RANGE: 'Ngày bắt đầu phải trước ngày kết thúc'
  };
  // Export tất cả các constants
  export default {
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