// src/modules/quan_ly_thanh_vien/constants/trang_thai_thanh_vien.js

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
  [PHONG_BAN.TAY_VAN_CAC]: 'Tây Văn Các',
  [PHONG_BAN.HOA_TAM_DUONG]: 'Hoa Tâm Đường', 
  [PHONG_BAN.HO_LY_SON_TRANG]: 'Hồ Ly Sơn Trang',
  [PHONG_BAN.HOA_VAN_CAC]: 'Hoa Văn Các',
  [PHONG_BAN.TINH_VAN_CAC]: 'Tinh Vân Các',
 };
 
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
  HIEP_KHACH: 'HIEP_KHACH',
  DAI_HIEP: 'DAI_HIEP',
  KIEM_THANH: 'KIEM_THANH',
  KIEM_DE: 'KIEM_DE',
  KIEM_THAN: 'KIEM_THAN',
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
 
 export const CAP_BAC_INFO = {
  [CAP_BAC.THU_SINH]: {
    moTa: 'Người học hành chăm chỉ, chưa biết đến võ thuật',
    yeuCau: 'Người mới gia nhập vào Bang',
    thoiGianYeuCau: 0,
    hoTro: 'Không hỗ trợ',
  },
  [CAP_BAC.VO_SINH]: {
    moTa: 'Học sinh võ thuật, bắt đầu học những chiêu cơ bản',
    yeuCau: 'Phải trải qua ít nhất 1 tuần làm Thư sinh. Sau khi học tập và làm bài kiểm tra, hiểu về team, chế độ, và chấp hành nền nếp',
    thoiGianYeuCau: 7,
    hoTro: '1,000,000 VNĐ/tháng (hỗ trợ ăn trưa, xăng xe)',
  },
  [CAP_BAC.TIEU_HIEP]: {
    moTa: 'Võ sinh nhỏ tuổi, bắt đầu thực hành võ thuật',
    yeuCau: 'Phải trải qua ít nhất 2 tháng làm Võ Sinh, và phải trải qua bài kiểm tra, nắm chắc được thời gian, quy định Bang', 
    thoiGianYeuCau: 60,
    hoTro: '3,000,000 VNĐ/tháng + thưởng dự án theo năng lực',
  },
  [CAP_BAC.HIEP_SI]: {
    moTa: 'Người có chút kỹ năng võ thuật, bắt đầu ra giang hồ',
    yeuCau: 'Phải trải qua ít nhất 3 tháng làm Tiểu hiệp',
    thoiGianYeuCau: 90,
    hoTro: '6,000,000 VNĐ/tháng + thưởng dự án',
  },
  [CAP_BAC.KIEM_KHACH]: {
    moTa: 'Võ giả sử dụng kiếm, có danh tiếng nhỏ',
    yeuCau: 'Phải trải qua ít nhất 4 tháng làm Hiệp sĩ, chứng minh được năng lực, có ý thức kỷ luật tốt',
    thoiGianYeuCau: 120,
    hoTro: '8,000,000 VNĐ/tháng + thưởng dự án',
  },
  [CAP_BAC.HIEP_KHACH]: {
    moTa: 'Người có võ công cao, bắt đầu được người khác kính nể',
    yeuCau: 'Phải trải qua ít nhất 6 tháng làm Kiếm khách, chứng minh được năng lực, có ý thức kỷ luật tốt, quản lý đội ngũ tốt',
    thoiGianYeuCau: 180,
    hoTro: '10,000,000 VNĐ/tháng + thưởng dự án + phụ cấp nghề nghiệp',
  },
  [CAP_BAC.DAI_HIEP]: {
    moTa: 'Võ giả có tiếng trong giang hồ, được nhiều người kính trọng',
    yeuCau: 'Phải trải qua ít nhất 9 tháng làm Hiệp khách, chứng minh được năng lực, quản lý team tốt',
    thoiGianYeuCau: 270,
    hoTro: '12,000,000 VNĐ/tháng + thưởng dự án + phụ cấp nghề nghiệp', 
  },
  [CAP_BAC.KIEM_THANH]: {
    moTa: 'Bậc thầy về kiếm thuật, không ai địch nổi',
    yeuCau: 'Phải trải qua ít nhất 12 tháng làm Đại hiệp, chứng minh được năng lực, quản lý team tốt',
    thoiGianYeuCau: 365,
    hoTro: '20,000,000 VNĐ/tháng + thưởng dự án + phụ cấp nghề nghiệp',
  },
  [CAP_BAC.KIEM_DE]: {
    moTa: 'Vị vua trong giới kiếm thuật, nắm giữ quyền lực lớn',
    yeuCau: 'Đạt thành tích xuất sắc ở cấp Kiếm Thánh',
    thoiGianYeuCau: -1,
    hoTro: 'Thỏa thuận (tối thiểu 1000 USD)',
  },
  [CAP_BAC.KIEM_THAN]: {
    moTa: 'Đạt đến cảnh giới tối thượng trong võ thuật, trở thành huyền thoại',
    yeuCau: 'Đạt thành tích xuất sắc ở cấp Kiếm Đế', 
    thoiGianYeuCau: -1,
    hoTro: 'Thỏa thuận',
  },
 };
 
 export default {
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  PHONG_BAN,
  PHONG_BAN_LABEL, 
  CHUC_VU,
  CHUC_VU_LABEL,
  CAP_BAC,
  CAP_BAC_LABEL,
  CAP_BAC_INFO
 };