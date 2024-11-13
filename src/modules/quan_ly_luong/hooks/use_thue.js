// File: src/modules/quan_ly_luong/hooks/use_thue.js
// Link tham khảo: https://react.dev/learn/reusing-logic-with-custom-hooks
// Nhánh: main

import { useState, useCallback } from 'react';
import { MUC_THUE, BAO_HIEM } from '../constants/loai_luong';

export const useThue = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tinhThueNam = useCallback((thuNhapNam) => {
    try {
      setLoading(true);
      setError(null);

      let thuNhapChiuThue = thuNhapNam;
      let thuePhaiNop = 0;
      let mucTruocDo = 0;

      for (const { muc, tiLe } of MUC_THUE) {
        const phanThuNhap = Math.min(thuNhapChiuThue, muc - mucTruocDo);
        if (phanThuNhap <= 0) break;

        thuePhaiNop += phanThuNhap * tiLe;
        thuNhapChiuThue -= phanThuNhap;
        mucTruocDo = muc;
      }

      // Chi tiết tính thuế theo từng mức
      const chiTietThue = MUC_THUE.map(({ muc, tiLe }) => {
        const phanThuNhap = Math.min(thuNhapNam, muc) - mucTruocDo;
        const thueTheoMuc = phanThuNhap > 0 ? phanThuNhap * tiLe : 0;
        mucTruocDo = muc;

        return {
          mucThue: muc,
          tiLe,
          phanThuNhap: phanThuNhap > 0 ? phanThuNhap : 0,
          thueTheoMuc
        };
      });

      return {
        thuNhapNam,
        thuePhaiNop,
        chiTietThue,
        thuNhapSauThue: thuNhapNam - thuePhaiNop
      };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const tinhThueThang = useCallback((thuNhapThang) => {
    const thuNhapNam = thuNhapThang * 12;
    const ketQuaThueNam = tinhThueNam(thuNhapNam);
    
    return {
      ...ketQuaThueNam,
      thuePhaiNopThang: Math.round(ketQuaThueNam.thuePhaiNop / 12),
      thuNhapSauThueThang: thuNhapThang - Math.round(ketQuaThueNam.thuePhaiNop / 12)
    };
  }, [tinhThueNam]);

  const tinhBaoHiem = useCallback((luongCoBan) => {
    const bhyt = luongCoBan * BAO_HIEM.BHYT;
    const bhxh = luongCoBan * BAO_HIEM.BHXH;
    const bhtn = luongCoBan * BAO_HIEM.BHTN;

    // Tính phần công ty đóng
    const bhytCongTy = luongCoBan * 0.03; // 3%
    const bhxhCongTy = luongCoBan * 0.175; // 17.5%
    const bhtnCongTy = luongCoBan * 0.01; // 1%

    return {
      nhanVien: {
        bhyt,
        bhxh,
        bhtn,
        tong: bhyt + bhxh + bhtn
      },
      congTy: {
        bhyt: bhytCongTy,
        bhxh: bhxhCongTy,
        bhtn: bhtnCongTy,
        tong: bhytCongTy + bhxhCongTy + bhtnCongTy
      },
      tong: {
        bhyt: bhyt + bhytCongTy,
        bhxh: bhxh + bhxhCongTy,
        bhtn: bhtn + bhtnCongTy,
        tongCong: (bhyt + bhxh + bhtn) + (bhytCongTy + bhxhCongTy + bhtnCongTy)
      }
    };
  }, []);

  const tinhThuNhapRong = useCallback((luongCoBan, phuCap = 0, thuong = 0) => {
    const tongThuNhap = luongCoBan + phuCap + thuong;
    const baoHiem = tinhBaoHiem(luongCoBan);
    const thue = tinhThueThang(tongThuNhap);

    return {
      tongThuNhap,
      baoHiem: baoHiem.nhanVien,
      thue: thue.thuePhaiNopThang,
      thuNhapRong: tongThuNhap - baoHiem.nhanVien.tong - thue.thuePhaiNopThang,
      chiTiet: {
        baoHiem,
        thue
      }
    };
  }, [tinhBaoHiem, tinhThueThang]);

  return {
    loading,
    error,
    tinhThueNam,
    tinhThueThang,
    tinhBaoHiem,
    tinhThuNhapRong
  };
};

export default useThue;