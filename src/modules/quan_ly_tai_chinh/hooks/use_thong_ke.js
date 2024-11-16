 
// File: src/modules/quan_ly_tai_chinh/hooks/use_thong_ke.js
// Link tham khảo: https://react.dev/reference/react
// Nhánh: main

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import {
  datThongKeTheoThang,
  datThongKeTheoLoai,
  capNhatTongQuanTaiChinh,
  datDuLieuBieuDo,
  datDangTaiDuLieu,
  datLoi
} from '../store/thong_ke_slice';
import { layThangHienTai } from '../utils/xu_ly_ngay';

export const useThongKe = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [dangXuLy, setDangXuLy] = useState(false);

  const {
    thongKeTheoThang,
    thongKeTheoLoai,
    tongQuanTaiChinh,
    bieuDo,
    dangTaiDuLieu,
    loi
  } = useSelector(state => state.thongKe);

  const layThongKeNguonThu = useCallback(async (thang = layThangHienTai()) => {
    try {
      setDangXuLy(true);
      dispatch(datDangTaiDuLieu(true));

      const thongKe = await Promise.all([
        thongKeService.layThongKeNguonThuTheoThang(thang),
        thongKeService.layThongKeNguonThuTheoLoai(thang)
      ]);

      dispatch(datThongKeTheoThang({
        nguonThu: thongKe[0]
      }));
      
      dispatch(datThongKeTheoLoai({
        nguonThu: thongKe[1]
      }));

      return thongKe;
    } catch (error) {
      toast({
        title: 'Lỗi khi lấy thống kê nguồn thu',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      dispatch(datLoi(error.message));
    } finally {
      setDangXuLy(false);
      dispatch(datDangTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const layThongKeChiTieu = useCallback(async (thang = layThangHienTai()) => {
    try {
      setDangXuLy(true);
      dispatch(datDangTaiDuLieu(true));

      const thongKe = await Promise.all([
        thongKeService.layThongKeChiTieuTheoThang(thang),
        thongKeService.layThongKeChiTieuTheoLoai(thang)
      ]);

      dispatch(datThongKeTheoThang({
        chiTieu: thongKe[0]
      }));
      
      dispatch(datThongKeTheoLoai({
        chiTieu: thongKe[1]
      }));

      return thongKe;
    } catch (error) {
      toast({
        title: 'Lỗi khi lấy thống kê chi tiêu',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      dispatch(datLoi(error.message));
    } finally {
      setDangXuLy(false);
      dispatch(datDangTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const layTongQuanTaiChinh = useCallback(async () => {
    try {
      setDangXuLy(true);
      dispatch(datDangTaiDuLieu(true));

      const tongQuan = await thongKeService.layTongQuanTaiChinh();
      dispatch(capNhatTongQuanTaiChinh(tongQuan));

      // Cập nhật dữ liệu biểu đồ
      const duLieuBieuDo = {
        duLieuTheoThang: await thongKeService.layDuLieuBieuDoTheoThang(),
        duLieuTheoLoai: await thongKeService.layDuLieuBieuDoTheoLoai()
      };
      dispatch(datDuLieuBieuDo(duLieuBieuDo));

      return {
        tongQuan,
        bieuDo: duLieuBieuDo
      };
    } catch (error) {
      toast({
        title: 'Lỗi khi lấy tổng quan tài chính',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      dispatch(datLoi(error.message));
    } finally {
      setDangXuLy(false);
      dispatch(datDangTaiDuLieu(false));
    }
  }, [dispatch, toast]);

  const xuatBaoCaoThongKe = useCallback(async (thang) => {
    try {
      setDangXuLy(true);
      const duLieuBaoCao = {
        thongKeNguonThu: thongKeTheoThang.nguonThu?.[thang] || [],
        thongKeChiTieu: thongKeTheoThang.chiTieu?.[thang] || [],
        tongQuanTaiChinh,
        bieuDo
      };

      const xuatFile = await thongKeService.xuatBaoCaoThongKe(duLieuBaoCao);
      
      toast({
        title: 'Xuất báo cáo thành công',
        status: 'success',
        duration: 3000
      });

      return xuatFile;
    } catch (error) {
      toast({
        title: 'Lỗi khi xuất báo cáo',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  }, [thongKeTheoThang, tongQuanTaiChinh, bieuDo, toast]);

  return {
    // State
    thongKeTheoThang,
    thongKeTheoLoai,
    tongQuanTaiChinh,
    bieuDo,
    dangTaiDuLieu,
    dangXuLy,
    loi,

    // Actions
    layThongKeNguonThu,
    layThongKeChiTieu,
    layTongQuanTaiChinh,
    xuatBaoCaoThongKe,

    // Utils
    tinhTongNguonThu: useCallback((thang) => {
      return thongKeTheoThang.nguonThu?.[thang]?.reduce((sum, item) => sum + item.soTien, 0) || 0;
    }, [thongKeTheoThang]),

    tinhTongChiTieu: useCallback((thang) => {
      return thongKeTheoThang.chiTieu?.[thang]?.reduce((sum, item) => sum + item.soTien, 0) || 0;
    }, [thongKeTheoThang]),

    tinhCanDoiTheoThang: useCallback((thang) => {
      const tongThu = thongKeTheoThang.nguonThu?.[thang]?.reduce((sum, item) => sum + item.soTien, 0) || 0;
      const tongChi = thongKeTheoThang.chiTieu?.[thang]?.reduce((sum, item) => sum + item.soTien, 0) || 0;
      return tongThu - tongChi;
    }, [thongKeTheoThang])
  };
};

// Thêm một số hooks utility

// Hook xử lý phân trang
export const usePhanTrang = (soLuongMacDinh = 10) => {
  const [trang, setTrang] = useState(1);
  const [soLuong, setSoLuong] = useState(soLuongMacDinh);
  const [tongSo, setTongSo] = useState(0);

  const capNhatPhanTrang = useCallback(({ trang: trangMoi, soLuong: soLuongMoi, tongSo: tongSoMoi }) => {
    if (trangMoi !== undefined) setTrang(trangMoi);
    if (soLuongMoi !== undefined) setSoLuong(soLuongMoi);
    if (tongSoMoi !== undefined) setTongSo(tongSoMoi);
  }, []);

  return {
    trang,
    soLuong,
    tongSo,
    tongSoTrang: Math.ceil(tongSo / soLuong),
    capNhatPhanTrang,
    setTrang,
    setSoLuong
  };
};

// Hook xử lý bộ lọc
export const useBoLoc = (boLocMacDinh = {}) => {
  const [boLoc, setBoLoc] = useState(boLocMacDinh);

  const capNhatBoLoc = useCallback((boLocMoi) => {
    setBoLoc(boLocCu => ({
      ...boLocCu,
      ...boLocMoi
    }));
  }, []);

  const xoaBoLoc = useCallback(() => {
    setBoLoc(boLocMacDinh);
  }, [boLocMacDinh]);

  return {
    boLoc,
    capNhatBoLoc,
    xoaBoLoc
  };
};

// Hook xử lý loading và error
export const useTrangThai = () => {
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(false);
  const [loi, setLoi] = useState(null);

  const xuLyLoi = useCallback((error) => {
    setLoi(error.message);
    setDangTaiDuLieu(false);
  }, []);

  const batDauTaiDuLieu = useCallback(() => {
    setDangTaiDuLieu(true);
    setLoi(null);
  }, []);

  const ketThucTaiDuLieu = useCallback(() => {
    setDangTaiDuLieu(false);
  }, []);

  return {
    dangTaiDuLieu,
    loi,
    xuLyLoi,
    batDauTaiDuLieu,
    ketThucTaiDuLieu,
    setLoi
  };
};