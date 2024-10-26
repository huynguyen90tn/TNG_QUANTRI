 
// src/components/bao_cao/hooks/useBaoCao.js
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { baoCaoApi } from '../../../services/api/bao_cao_api';
import {
  setBaoCao,
  setDanhSach,
  setLoading,
  setPhanTrang,
  resetState
} from '../store/bao_cao_slice';

export const useBaoCao = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [dangXuLy, setDangXuLy] = useState(false);

  const {
    danhSach,
    loading,
    phanTrang,
    boLoc,
    sapXep,
    baoCaoHienTai
  } = useSelector((state) => state.baoCao);

  const loadDanhSach = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await baoCaoApi.layDanhSach(boLoc, sapXep, {
        trang: phanTrang.trang,
        soLuong: phanTrang.soLuong
      });

      dispatch(setDanhSach(response.data));
      dispatch(setPhanTrang({
        ...phanTrang,
        tongSo: Math.ceil(response.total / phanTrang.soLuong)
      }));
    } catch (error) {
      toast({
        title: 'Lỗi tải danh sách',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, boLoc, sapXep, phanTrang, toast]);

  const taoBaoCao = async (data) => {
    try {
      setDangXuLy(true);
      const baoCaoMoi = await baoCaoApi.taoMoi(data);
      toast({
        title: 'Tạo báo cáo thành công',
        status: 'success',
        duration: 3000
      });
      await loadDanhSach();
      return baoCaoMoi;
    } catch (error) {
      toast({
        title: 'Lỗi khi tạo báo cáo',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  };

  const capNhatBaoCao = async (id, data) => {
    try {
      setDangXuLy(true);
      const baoCaoCapNhat = await baoCaoApi.capNhat(id, data);
      toast({
        title: 'Cập nhật báo cáo thành công',
        status: 'success',
        duration: 3000
      });
      await loadDanhSach();
      return baoCaoCapNhat;
    } catch (error) {
      toast({
        title: 'Lỗi khi cập nhật báo cáo',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  };

  const xoaBaoCao = async (id) => {
    try {
      setDangXuLy(true);
      await baoCaoApi.xoa(id);
      toast({
        title: 'Xóa báo cáo thành công',
        status: 'success',
        duration: 3000
      });
      await loadDanhSach();
    } catch (error) {
      toast({
        title: 'Lỗi khi xóa báo cáo',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  };

  const duyetBaoCao = async (id, ghiChu = '', nguoiDuyet) => {
    try {
      setDangXuLy(true);
      await baoCaoApi.duyetBaoCao(id, ghiChu, nguoiDuyet);
      toast({
        title: 'Duyệt báo cáo thành công',
        status: 'success',
        duration: 3000
      });
      await loadDanhSach();
    } catch (error) {
      toast({
        title: 'Lỗi khi duyệt báo cáo',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  };

  const tuChoiBaoCao = async (id, ghiChu = '', nguoiDuyet) => {
    try {
      setDangXuLy(true);
      await baoCaoApi.tuChoiBaoCao(id, ghiChu, nguoiDuyet);
      toast({
        title: 'Từ chối báo cáo thành công',
        status: 'success',
        duration: 3000
      });
      await loadDanhSach();
    } catch (error) {
      toast({
        title: 'Lỗi khi từ chối báo cáo',
        description: error.message,
        status: 'error',
        duration: 3000
      });
      throw error;
    } finally {
      setDangXuLy(false);
    }
  };

  const resetBoLoc = () => {
    dispatch(resetState());
  };

  return {
    // State
    danhSach,
    loading,
    dangXuLy,
    phanTrang,
    boLoc,
    sapXep,
    baoCaoHienTai,

    // Actions
    loadDanhSach,
    taoBaoCao,
    capNhatBaoCao,
    xoaBaoCao,
    duyetBaoCao,
    tuChoiBaoCao,
    resetBoLoc,
    
    // Dispatchers
    setBaoCao: (baoCao) => dispatch(setBaoCao(baoCao)),
    setPhanTrang: (phanTrang) => dispatch(setPhanTrang(phanTrang)),
  };
};