// src/components/su_kien_review/types/index.ts
export interface SuKien {
    id: string;
    tenSuKien: string;
    ngayToChuc: string;
    linkQuayPhim?: string;
    linkKichBan?: string;
    ghiChu?: string;
    trangThai: 'CHUA_DIEN_RA' | 'DANG_DIEN_RA' | 'HOAN_THANH' | 'HUY_BO';
  }
  
  export interface SuKienState {
    danhSach: SuKien[];
    searchTerm: string;
    trangThai: string;
  }