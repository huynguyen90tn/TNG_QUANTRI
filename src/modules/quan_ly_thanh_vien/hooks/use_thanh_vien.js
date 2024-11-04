// File: src/modules/quan_ly_thanh_vien/hooks/use_thanh_vien.js
// Link tham khảo: https://redux-toolkit.js.org/api/createAsyncThunk
// Link tham khảo: https://firebase.google.com/docs/firestore/manage-data/add-data
// Link tham khảo: https://firebase.google.com/docs/reference/js/firestore_.timestamp

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
      const action = await dispatch(layDanhSachThanhVien()).unwrap();
      // Xử lý timestamps trong dữ liệu trả về
      if (Array.isArray(action.payload)) {
        action.payload.forEach(item => {
          if (item.createdAt) {
            item.createdAt = item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt);
          }
          if (item.updatedAt) {
            item.updatedAt = item.updatedAt.toDate ? item.updatedAt.toDate() : new Date(item.updatedAt);
          }
          if (item.dateOfBirth) {
            item.dateOfBirth = item.dateOfBirth.toDate ? item.dateOfBirth.toDate() : new Date(item.dateOfBirth);
          }
          if (item.joinDate) {
            item.joinDate = item.joinDate.toDate ? item.joinDate.toDate() : new Date(item.joinDate);
          }
        });
      }
      return action;
    } catch (error) {
      dispatch(datLaiLoi(error.message));
      console.error('Lỗi khi lấy danh sách thành viên:', error);
      throw error;
    }
  }, [dispatch]);

  const themMoi = useCallback(async (data) => {
    try {
      // Chuyển đổi các trường ngày tháng sang timestamp trước khi lưu
      const processedData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        joinDate: data.joinDate ? new Date(data.joinDate) : null,
      };

      const ketQua = await dispatch(themThanhVien(processedData)).unwrap();
      dispatch(datLaiThongBao('Thêm thành viên thành công'));
      return ketQua;
    } catch (error) {
      dispatch(datLaiLoi(error.message));
      return false;
    }
  }, [dispatch]);

  const capNhat = useCallback(async (id, data) => {
    try {
      // Chuyển đổi các trường ngày tháng sang timestamp trước khi cập nhật
      const processedData = {
        ...data,
        updatedAt: new Date(),
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        joinDate: data.joinDate ? new Date(data.joinDate) : null,
      };

      await thanhVienService.capNhatThanhVien(id, processedData);
      const ketQua = await dispatch(capNhatThanhVien({ id, data: processedData })).unwrap();
      dispatch(datLaiThongBao('Cập nhật thành viên thành công'));
      await layDanhSach();
      return ketQua;
    } catch (error) {
      dispatch(datLaiLoi(error.message));
      return false;
    }
  }, [dispatch, layDanhSach]);

  const capNhatTrangThai = useCallback(async (id, trangThai) => {
    try {
      const ketQua = await dispatch(capNhatTrangThaiThanhVien({ 
        id, 
        trangThai,
        updatedAt: new Date()
      })).unwrap();
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
    capNhatThongTin,
    capNhatTrangThai,
    xoa,
    locDanhSach,
    datLaiDanhSach,
    dongThongBao,
    dongLoi,
  };
};

export default useThanhVien;