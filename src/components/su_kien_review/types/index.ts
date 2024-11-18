// src/components/su_kien_review/types/index.ts

export interface ThanhVien {
  id: string;
  ten: string;
}

export interface NguoiLienHe {
  hoTen: string;
  chucVu: string;
  soDienThoai: string;
  ghiChu?: string;
}

export interface Link {
  url: string;
  ghiChu?: string;
}

export interface Media {
  type: 'image' | 'youtube';
  url: string;
  caption?: string;
}

export interface SuKien {
  id: string;
  tenSuKien: string;
  donViToChuc: string;
  ngayToChuc: string;
  gioToChuc: string;
  ngayKetThuc: string;
  gioKetThuc: string;
  diaDiem: string;
  thanhVienThamGia: string[];
  nguoiLienHe: NguoiLienHe[];
  links: Link[];
  media: Media[];
  ghiChu?: string;
  trangThai: 'CHUA_DIEN_RA' | 'DANG_DIEN_RA' | 'HOAN_THANH' | 'HUY_BO';
  ngayTao?: string;
  nguoiTao?: string;
  ngayCapNhat?: string;
}

export interface SuKienState {
  danhSach: SuKien[];
  searchTerm: string;
  trangThai: string;
  suKienHienTai: SuKien | null;
  loading: boolean;
  error: string | null;
}