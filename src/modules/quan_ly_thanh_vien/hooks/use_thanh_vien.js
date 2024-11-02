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
import { thanhVienService } from '../services/thanh_vien_service';

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

  const layDanhSach = useCallback(async () => {
    try {
      await dispatch(layDanhSachThanhVien()).unwrap();
    } catch (error) {
      dispatch(datLaiLoi(error.message));
      console.error('Lỗi khi lấy danh sách thành viên:', error);
    }
  }, [dispatch]);

  const themMoi = useCallback(async (data) => {
    try {
      const ketQua = await dispatch(themThanhVien(data)).unwrap();
      dispatch(datLaiThongBao('Thêm thành viên thành công'));
      return ketQua;
    } catch (error) {
      dispatch(datLaiLoi(error.message));
      return false;
    }
  }, [dispatch]);

  const capNhat = useCallback(async (id, data) => {
    try {
      await thanhVienService.capNhatThanhVien(id, data);
      const ketQua = await dispatch(capNhatThanhVien({ id, data })).unwrap();
      dispatch(datLaiThongBao('Cập nhật thành viên thành công'));
      await layDanhSach(); // Tải lại danh sách sau khi cập nhật
      return ketQua;
    } catch (error) {
      dispatch(datLaiLoi(error.message));
      return false;
    }
  }, [dispatch, layDanhSach]);

  const capNhatTrangThai = useCallback(async (id, trangThai) => {
    try {
      const ketQua = await dispatch(capNhatTrangThaiThanhVien({ id, trangThai })).unwrap();
      dispatch(datLaiThongBao('Cập nhật trạng thái thành công'));
      return ketQua;
    } catch (error) {
      dispatch(datLaiLoi(error.message));
      return false;
    }
  }, [dispatch]);

  const xoa = useCallback(async (id) => {
    try {
      const ketQua = await dispatch(xoaThanhVien(id)).unwrap();
      dispatch(datLaiThongBao('Xóa thành viên thành công'));
      return ketQua;
    } catch (error) {
      dispatch(datLaiLoi(error.message));
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

  const capNhatThongTin = useCallback(async (id, data) => {
    try {
      const ketQua = await capNhat(id, data);
      if (ketQua) {
        await layDanhSach();
        return true;
      }
      return false;
    } catch (error) {
      dispatch(datLaiLoi(error.message));
      return false;
    }
  }, [capNhat, layDanhSach, dispatch]);

  useEffect(() => {
    if (loi) {
      console.error('Lỗi:', loi);
    }
  }, [loi]);

  useEffect(() => {
    if (thongBao) {
      console.log('Thông báo:', thongBao);
    }
  }, [thongBao]);

  return {
    danhSach,
    danhSachLoc,
    dangTai,
    loi,
    thongBao,
    boLoc,
    layDanhSach,
    themMoi,
    capNhat,
    capNhatThongTin, // Thêm hàm mới
    capNhatTrangThai,
    xoa,
    locDanhSach,
    datLaiDanhSach,
    dongThongBao,
    dongLoi,
  };
};

export default useThanhVien;