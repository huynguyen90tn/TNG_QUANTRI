// src/modules/quan_ly_thanh_vien/hooks/use_thanh_vien.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  themThanhVien,
  capNhatThanhVien,
  capNhatTrangThaiThanhVien,
  xoaThanhVien,
  layDanhSachThanhVien,
  capNhatBoLoc,
  apDungBoLoc,
  datLaiBoLoc,
  datLaiLoi,
  datLaiThongBao,
} from '../store/thanh_vien_slice';

export const useThanhVien = () => {
  const dispatch = useDispatch();
  const thanhVienState = useSelector((state) => state.thanhVien) || {
    danhSach: [],
    danhSachLoc: [],
    dangTai: false,
    loi: null,
    thongBao: null,
    boLoc: {
      tuKhoa: '',
      phongBan: '',
      chucVu: '',
      trangThai: '',
    },
  };

  const {
    danhSach,
    danhSachLoc,
    dangTai,
    loi,
    thongBao,
    boLoc,
  } = thanhVienState;

  // Thêm hàm layDanhSach
  const layDanhSach = useCallback(async () => {
    try {
      await dispatch(layDanhSachThanhVien()).unwrap();
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thành viên:', error);
    }
  }, [dispatch]);

  const themMoi = useCallback(async (data) => {
    try {
      await dispatch(themThanhVien(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const capNhat = useCallback(async (id, data) => {
    try {
      await dispatch(capNhatThanhVien({ id, data })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const capNhatTrangThai = useCallback(async (id, trangThai) => {
    try {
      await dispatch(capNhatTrangThaiThanhVien({ id, trangThai })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const xoa = useCallback(async (id) => {
    try {
      await dispatch(xoaThanhVien(id)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const locDanhSach = useCallback((boLocMoi) => {
    dispatch(capNhatBoLoc(boLocMoi));
    dispatch(apDungBoLoc());
  }, [dispatch]);

  const datLaiDanhSach = useCallback(() => {
    dispatch(datLaiBoLoc());
  }, [dispatch]);

  const dongThongBao = useCallback(() => {
    dispatch(datLaiThongBao());
  }, [dispatch]);

  const dongLoi = useCallback(() => {
    dispatch(datLaiLoi());
  }, [dispatch]);

  return {
    danhSach,
    danhSachLoc,
    dangTai,
    loi,
    thongBao,
    boLoc,
    layDanhSach, // Thêm hàm này vào return
    themMoi,
    capNhat,
    capNhatTrangThai,
    xoa,
    locDanhSach,
    datLaiDanhSach,
    dongThongBao,
    dongLoi,
  };
};

export default useThanhVien;