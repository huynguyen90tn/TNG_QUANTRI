 
// File: src/modules/quan_ly_tai_chinh/types/index.ts
// Link tham khảo: https://www.typescriptlang.org/docs/handbook/interfaces.html
// Nhánh: main

import { Timestamp } from 'firebase/firestore';

export interface NguonThu {
  id?: string;
  loaiThu: LoaiNguonThu;
  soTien: number;
  ngayThu: Date | Timestamp | string;
  trangThai: TrangThai;
  ghiChu?: string;
  nguoiTao: string;
  nguoiCapNhat?: string;
  ngayTao: Date | Timestamp;
  ngayCapNhat?: Date | Timestamp;
  taiLieuDinhKem?: TaiLieuDinhKem[];
}

export interface ChiTieu {
  id?: string;
  loaiChi: LoaiChiTieu;
  soTien: number;
  ngayChi: Date | Timestamp | string;
  trangThai: TrangThai;
  ghiChu?: string;
  nguoiTao: string;
  nguoiCapNhat?: string;
  ngayTao: Date | Timestamp;
  ngayCapNhat?: Date | Timestamp;
  taiLieuDinhKem?: TaiLieuDinhKem[];
}

export type LoaiNguonThu = 'GAME' | 'MARKETING' | 'PHAN_MEM' | 'WEB' | 'KHAC';

export type LoaiChiTieu = 'THUONG_XUYEN' | 'ONLINE' | 'MUA_SAM' | 'KHAC';

export type TrangThai = 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI' | 'DA_HUY';

export interface TaiLieuDinhKem {
  id?: string;
  tenTaiLieu: string;
  duongDan: string;
  loaiTaiLieu: string;
  kichThuoc: number;
  ngayTao: Date | Timestamp;
}

export interface BoLoc {
  tuNgay?: string | null;
  denNgay?: string | null;
  loaiThu?: LoaiNguonThu | 'TAT_CA';
  loaiChi?: LoaiChiTieu | 'TAT_CA';
  trangThai?: TrangThai | 'TAT_CA';
  mucTienTu?: number | null;
  mucTienDen?: number | null;
}

export interface PhanTrang {
  trang: number;
  soLuong: number;
  tongSo: number;
}

export interface ThongKeNguonThu {
  tongTien: number;
  soLuongGiaoDich: number;
  phanTramThayDoi: number;
  theoLoai: {
    [key in LoaiNguonThu]?: {
      tongTien: number;
      soLuongGiaoDich: number;
      phanTram: number;
    };
  };
  theoThang: Array<{
    thang: string;
    tongTien: number;
    soLuongGiaoDich: number;
  }>;
}

export interface ThongKeChiTieu {
  tongTien: number;
  soLuongGiaoDich: number;
  phanTramThayDoi: number;
  theoLoai: {
    [key in LoaiChiTieu]?: {
      tongTien: number;
      soLuongGiaoDich: number;
      phanTram: number;
    };
  };
  theoThang: Array<{
    thang: string;
    tongTien: number;
    soLuongGiaoDich: number;
  }>;
}

export interface TongQuanTaiChinh {
  tongThu: number;
  tongChi: number;
  canDoi: number;
  tonQuy: number;
  tonQuyKhaDung: number;
  phanTramThayDoiThu: number;
  phanTramThayDoiChi: number;
  chenhLechCanDoi: number;
  duLieuBieuDo: Array<{
    thang: string;
    tongThu: number;
    tongChi: number;
  }>;
  topNguonThu: Array<{
    tenNguonThu: string;
    loaiThu: LoaiNguonThu;
    soTien: number;
  }>;
  topChiTieu: Array<{
    tenChiTieu: string;
    loaiChi: LoaiChiTieu;
    soTien: number;
  }>;
  duKienThu: number;
  duKienChi: number;
  soThangDuBao: number;
  khuyenNghi: Array<{
    tieuDe: string;
    noiDung: string;
    mucDo: 'CAO' | 'TRUNG_BINH' | 'THAP';
  }>;
}

export interface ResponseData<T> {
  danhSach: T[];
  tongSo: number;
  trang: number;
  soLuong: number;
}

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: 'success' | 'error';
};

// Action Types
export interface CapNhatBoLocAction {
  type: 'capNhatBoLoc';
  payload: Partial<BoLoc>;
}

export interface CapNhatPhanTrangAction {
  type: 'capNhatPhanTrang';
  payload: Partial<PhanTrang>;
}

export interface ThemNguonThuAction {
  type: 'themNguonThu';
  payload: NguonThu;
}

export interface CapNhatNguonThuAction {
  type: 'capNhatNguonThu';
  payload: NguonThu;
}

export interface XoaNguonThuAction {
  type: 'xoaNguonThu';
  payload: string;
}

export interface ThemChiTieuAction {
  type: 'themChiTieu';
  payload: ChiTieu;
}

export interface CapNhatChiTieuAction {
  type: 'capNhatChiTieu';
  payload: ChiTieu;
}

export interface XoaChiTieuAction {
  type: 'xoaChiTieu';
  payload: string;
}

export type TaiChinhAction =
  | CapNhatBoLocAction
  | CapNhatPhanTrangAction
  | ThemNguonThuAction
  | CapNhatNguonThuAction
  | XoaNguonThuAction
  | ThemChiTieuAction
  | CapNhatChiTieuAction
  | XoaChiTieuAction;

export interface TaiChinhState {
  nguonThu: NguonThu[];
  chiTieu: ChiTieu[];
  boLoc: BoLoc;
  phanTrang: PhanTrang;
  tonKho: number;
  dangTaiDuLieu: boolean;
  loi: string | null;
}