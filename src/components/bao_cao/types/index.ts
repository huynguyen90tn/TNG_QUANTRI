// src/components/bao_cao/types/index.ts
export interface BaoCao {
    id: string;
    tieuDe: string;
    noiDung: string;
    loaiBaoCao: string;
    phanHe: string;
    duAnId?: string;
    duAnInfo?: {
      id: string;
      ten: string;
      maDuAn: string;
    };
    nhiemVuId?: string;
    nhiemVuInfo?: {
      id: string;
      ten: string;
      maNhiemVu: string; 
    };
    nguoiTao: string;
    nguoiTaoInfo?: {
      id: string;
      ten: string;
      email: string;
    };
    nguoiDuyet?: string;
    ngayTao: string;
    ngayCapNhat?: string;
    trangThai: string;
    ghiChu?: string;
    fileDinhKem?: Array<{
      id: string;
      ten: string;
      url: string;
      loai: string;
    }>;
    links?: Array<{
      url: string;
      moTa: string;
    }>;
  }
  
  export interface BoLoc {
    tuKhoa: string;
    loaiBaoCao: string;
    phanHe: string;
    trangThai: string;
    tuNgay?: string;
    denNgay?: string;
    nguoiTao?: string;
  }
  
  export interface PhanTrang {
    trang: number;
    soLuong: number;
    tongSo: number;
  }
  
  export type SapXep = {
    truong: 'ngayTao' | 'ngayCapNhat' | 'trangThai';
    huong: 'asc' | 'desc';
  };