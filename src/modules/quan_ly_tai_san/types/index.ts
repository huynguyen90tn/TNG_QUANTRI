// File: src/types/tai_san.ts
// Link tham khảo: https://www.typescriptlang.org/docs/handbook/interfaces.html
// Nhánh: main

export interface TaiSan {
  id: string;
  ma: string;
  ten: string;
  moTa?: string;
  loaiTaiSan: 'thiet_bi' | 'phan_mem' | 'giay_phep' | 'khac';
  nhomTaiSan: string;
  phongBan: string;
  trangThai: 'cho_cap_phat' | 'da_cap_phat' | 'dang_bao_tri' | 'hong' | 'mat' | 'thanh_ly';
  giaTriMua: number;
  ngayMua: Date;
  hanBaoHanh?: Date;
  nguoiQuanLy?: string;
  nguoiSuDung?: string;
  ghiChu?: string;
  anhTaiSan?: string[];
  thongSoKyThuat?: Record<string, any>;
  ngayTao: Date;
  ngayCapNhat: Date;
}

export interface TaiSanFilter {
  loaiTaiSan?: string;
  nhomTaiSan?: string; 
  trangThai?: string;
  phongBan?: string;
  nguoiQuanLy?: string;
  nguoiSuDung?: string;
  tuNgay?: Date;
  denNgay?: Date;
  tuGia?: number;
  denGia?: number;
  searchText?: string;
}

export interface TaiSanPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BaoTri {
  id: string;
  taiSanId: string;
  ngayBatDau: Date;
  ngayKetThuc?: Date;
  noiDung: string;
  chiPhi?: number;
  nguoiThucHien: string;
  ketQua?: string;
  trangThai: 'dang_thuc_hien' | 'da_hoan_thanh' | 'da_huy';
  ghiChu?: string;
  anhBaoTri?: string[];
  ngayTao: Date;
  ngayCapNhat: Date;
}

export interface KiemKe {
  id: string;
  taiSanId: string;
  ngayKiemKe: Date;
  nguoiKiemKe: string;
  tinhTrang: 'binh_thuong' | 'hu_hong' | 'mat';
  ghiChu?: string;
  anhKiemKe?: string[];
  ketQua: string;
  ngayTao: Date;
  ngayCapNhat: Date;
}