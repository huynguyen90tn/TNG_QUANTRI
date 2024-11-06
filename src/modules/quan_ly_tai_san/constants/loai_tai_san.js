// File: src/modules/quan_ly_tai_san/constants/loai_tai_san.js
// Nhánh: main

// Định nghĩa loại tài sản
export const LOAI_TAI_SAN = {
  THIET_BI: 'thiet_bi',
  PHAN_MEM: 'phan_mem',
  VAT_TU: 'vat_tu',
  CONG_CU: 'cong_cu'
};

// Tên hiển thị cho loại tài sản
export const TEN_LOAI_TAI_SAN = {
  [LOAI_TAI_SAN.THIET_BI]: 'Thiết bị',
  [LOAI_TAI_SAN.PHAN_MEM]: 'Phần mềm',
  [LOAI_TAI_SAN.VAT_TU]: 'Vật tư',
  [LOAI_TAI_SAN.CONG_CU]: 'Công cụ, dụng cụ'
};

// Định nghĩa nhóm tài sản
export const NHOM_TAI_SAN = {
  // Nhóm thiết bị
  MAY_TINH: 'may_tinh',
  LAPTOP: 'laptop',
  THIET_BI_MANG: 'thiet_bi_mang',
  THIET_BI_VAN_PHONG: 'thiet_bi_van_phong',
  THIET_BI_DIEN_TU: 'thiet_bi_dien_tu',
  
  // Nhóm phần mềm
  PHAN_MEM_HE_THONG: 'phan_mem_he_thong',
  PHAN_MEM_UNG_DUNG: 'phan_mem_ung_dung',
  BAN_QUYEN: 'ban_quyen',
  
  // Nhóm vật tư
  VAT_TU_VAN_PHONG: 'vat_tu_van_phong',
  VAT_TU_DIEN_TU: 'vat_tu_dien_tu',
  LINH_KIEN: 'linh_kien',
  
  // Nhóm công cụ
  DUNG_CU_VAN_PHONG: 'dung_cu_van_phong',
  DUNG_CU_LAP_RAP: 'dung_cu_lap_rap',
  DUNG_CU_SUA_CHUA: 'dung_cu_sua_chua'
};

// Tên hiển thị cho nhóm tài sản
export const TEN_NHOM_TAI_SAN = {
  // Tên nhóm thiết bị
  [NHOM_TAI_SAN.MAY_TINH]: 'Máy tính để bàn',
  [NHOM_TAI_SAN.LAPTOP]: 'Laptop',
  [NHOM_TAI_SAN.THIET_BI_MANG]: 'Thiết bị mạng',
  [NHOM_TAI_SAN.THIET_BI_VAN_PHONG]: 'Thiết bị văn phòng',
  [NHOM_TAI_SAN.THIET_BI_DIEN_TU]: 'Thiết bị điện tử',
  
  // Tên nhóm phần mềm
  [NHOM_TAI_SAN.PHAN_MEM_HE_THONG]: 'Phần mềm hệ thống',
  [NHOM_TAI_SAN.PHAN_MEM_UNG_DUNG]: 'Phần mềm ứng dụng',
  [NHOM_TAI_SAN.BAN_QUYEN]: 'Bản quyền phần mềm',
  
  // Tên nhóm vật tư
  [NHOM_TAI_SAN.VAT_TU_VAN_PHONG]: 'Vật tư văn phòng',
  [NHOM_TAI_SAN.VAT_TU_DIEN_TU]: 'Vật tư điện tử',
  [NHOM_TAI_SAN.LINH_KIEN]: 'Linh kiện máy tính',
  
  // Tên nhóm công cụ
  [NHOM_TAI_SAN.DUNG_CU_VAN_PHONG]: 'Dụng cụ văn phòng',
  [NHOM_TAI_SAN.DUNG_CU_LAP_RAP]: 'Dụng cụ lắp ráp',
  [NHOM_TAI_SAN.DUNG_CU_SUA_CHUA]: 'Dụng cụ sửa chữa'
};

// Map loại tài sản với các nhóm tương ứng
export const NHOM_THEO_LOAI = {
  [LOAI_TAI_SAN.THIET_BI]: [
    NHOM_TAI_SAN.MAY_TINH,
    NHOM_TAI_SAN.LAPTOP,
    NHOM_TAI_SAN.THIET_BI_MANG,
    NHOM_TAI_SAN.THIET_BI_VAN_PHONG,
    NHOM_TAI_SAN.THIET_BI_DIEN_TU
  ],
  [LOAI_TAI_SAN.PHAN_MEM]: [
    NHOM_TAI_SAN.PHAN_MEM_HE_THONG,
    NHOM_TAI_SAN.PHAN_MEM_UNG_DUNG,
    NHOM_TAI_SAN.BAN_QUYEN
  ],
  [LOAI_TAI_SAN.VAT_TU]: [
    NHOM_TAI_SAN.VAT_TU_VAN_PHONG,
    NHOM_TAI_SAN.VAT_TU_DIEN_TU,
    NHOM_TAI_SAN.LINH_KIEN
  ],
  [LOAI_TAI_SAN.CONG_CU]: [
    NHOM_TAI_SAN.DUNG_CU_VAN_PHONG,
    NHOM_TAI_SAN.DUNG_CU_LAP_RAP,
    NHOM_TAI_SAN.DUNG_CU_SUA_CHUA
  ]
};

// Trạng thái tài sản
export const TRANG_THAI_TAI_SAN = {
  DANG_SU_DUNG: 'dang_su_dung',
  KHONG_SU_DUNG: 'khong_su_dung',
  HONG: 'hong',
  THANH_LY: 'thanh_ly',
  BAO_HANH: 'bao_hanh',
  BAO_TRI: 'bao_tri'
};

// Tên hiển thị trạng thái
export const TEN_TRANG_THAI = {
  [TRANG_THAI_TAI_SAN.DANG_SU_DUNG]: 'Đang sử dụng',
  [TRANG_THAI_TAI_SAN.KHONG_SU_DUNG]: 'Không sử dụng',
  [TRANG_THAI_TAI_SAN.HONG]: 'Hỏng',
  [TRANG_THAI_TAI_SAN.THANH_LY]: 'Thanh lý',
  [TRANG_THAI_TAI_SAN.BAO_HANH]: 'Đang bảo hành',
  [TRANG_THAI_TAI_SAN.BAO_TRI]: 'Đang bảo trì'
};