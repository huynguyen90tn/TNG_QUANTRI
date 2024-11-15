// File: src/modules/quan_ly_luong/constants/luong_cap_bac.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

// Định nghĩa các hằng số cấp bậc
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

// Lương theo từng cấp bậc
export const LUONG_THEO_CAP_BAC = {
  [CAP_BAC.THU_SINH]: 0,
  [CAP_BAC.VO_SINH]: 1000000,
  [CAP_BAC.TIEU_HIEP]: 3000000,
  [CAP_BAC.HIEP_SI]: 6000000,
  [CAP_BAC.KIEM_KHACH]: 8000000,
  [CAP_BAC.HIEP_KHACH]: 10000000,
  [CAP_BAC.DAI_HIEP]: 12000000, 
  [CAP_BAC.KIEM_THANH]: 20000000,
  [CAP_BAC.KIEM_DE]: 24000000,
  [CAP_BAC.KIEM_THAN]: 30000000
};

// Tên hiển thị cấp bậc
export const CAP_BAC_LABEL = {
  [CAP_BAC.THU_SINH]: 'Thư Sinh',
  [CAP_BAC.VO_SINH]: 'Võ Sinh',
  [CAP_BAC.TIEU_HIEP]: 'Tiểu Hiệp',
  [CAP_BAC.HIEP_SI]: 'Hiệp Sĩ', 
  [CAP_BAC.KIEM_KHACH]: 'Kiếm Khách',
  [CAP_BAC.HIEP_KHACH]: 'Hiệp Khách',
  [CAP_BAC.DAI_HIEP]: 'Đại Hiệp',
  [CAP_BAC.KIEM_THANH]: 'Kiếm Thánh',
  [CAP_BAC.KIEM_DE]: 'Kiếm Đế',
  [CAP_BAC.KIEM_THAN]: 'Kiếm Thần'
};

// Thứ tự cấp bậc từ thấp đến cao
export const CAP_BAC_ORDER = [
  CAP_BAC.THU_SINH,
  CAP_BAC.VO_SINH,
  CAP_BAC.TIEU_HIEP, 
  CAP_BAC.HIEP_SI,
  CAP_BAC.KIEM_KHACH,
  CAP_BAC.HIEP_KHACH,
  CAP_BAC.DAI_HIEP,
  CAP_BAC.KIEM_THANH, 
  CAP_BAC.KIEM_DE,
  CAP_BAC.KIEM_THAN
];

/**
 * Lấy lương theo cấp bậc
 * @param {string} capBac - Mã cấp bậc 
 * @returns {number} Mức lương tương ứng
 */
export const getLuongByCapBac = (capBac) => {
  // Kiểm tra tham số đầu vào
  if (!capBac || typeof capBac !== 'string') {
    console.warn('[getLuongByCapBac] Invalid capBac:', capBac);
    return 0;
  }

  // Kiểm tra cấp bậc có hợp lệ
  if (!Object.values(CAP_BAC).includes(capBac)) {
    console.warn('[getLuongByCapBac] Unknown capBac:', capBac);
    return 0;
  }

  return LUONG_THEO_CAP_BAC[capBac];
};

/**
 * Lấy tên hiển thị của cấp bậc
 * @param {string} capBac - Mã cấp bậc
 * @returns {string} Tên hiển thị
 */
export const getTenCapBac = (capBac) => {
  // Kiểm tra tham số đầu vào
  if (!capBac || typeof capBac !== 'string') {
    console.warn('[getTenCapBac] Invalid capBac:', capBac);
    return '';
  }

  // Kiểm tra cấp bậc có hợp lệ
  if (!Object.values(CAP_BAC).includes(capBac)) {
    console.warn('[getTenCapBac] Unknown capBac:', capBac);
    return '';
  }

  return CAP_BAC_LABEL[capBac];
};

/**
 * Lấy cấp bậc kế tiếp
 * @param {string} capBac - Mã cấp bậc hiện tại
 * @returns {string|null} Mã cấp bậc kế tiếp hoặc null nếu là cấp cao nhất
 */
export const getNextCapBac = (capBac) => {
  // Kiểm tra tham số đầu vào
  if (!capBac || typeof capBac !== 'string') {
    console.warn('[getNextCapBac] Invalid capBac:', capBac);
    return null;
  }

  const index = CAP_BAC_ORDER.indexOf(capBac);
  
  // Kiểm tra cấp bậc có trong danh sách
  if (index === -1) {
    console.warn('[getNextCapBac] Unknown capBac:', capBac); 
    return null;
  }

  // Kiểm tra đã là cấp cao nhất chưa
  if (index === CAP_BAC_ORDER.length - 1) {
    return null;
  }

  return CAP_BAC_ORDER[index + 1];
};

// Export default để có thể import * as LuongCapBac
export default {
  CAP_BAC,
  LUONG_THEO_CAP_BAC,
  CAP_BAC_LABEL,
  CAP_BAC_ORDER,
  getLuongByCapBac,
  getTenCapBac,
  getNextCapBac
};