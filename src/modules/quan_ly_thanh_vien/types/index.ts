// src/modules/quan_ly_thanh_vien/types/index.ts
export interface ThanhVien {
    id: string;
    email: string;
    hoTen: string;
    role: 'admin-tong' | 'admin-con' | 'member';
    phongBan: string;
    anhDaiDien: string;
    trangThai: keyof typeof TRANG_THAI_THANH_VIEN;
    soDienThoai: string;
    chucVu: string;
    ngayTao: Date;
    ngayCapNhat: Date;
  }
  
  export interface BoLocThanhVien {
    tuKhoa: string;
    phongBan: string;
    chucVu: string;
    trangThai: string;
  }