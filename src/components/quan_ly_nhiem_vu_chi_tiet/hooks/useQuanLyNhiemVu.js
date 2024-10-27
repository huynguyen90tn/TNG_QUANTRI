// src/components/quan_ly_nhiem_vu_chi_tiet/hooks/useQuanLyNhiemVu.js
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import {
  fetchTinhNangList,
  createTinhNang,
  updateTinhNang,
  deleteTinhNang,
  fetchBackendList,
  createBackend,
  updateBackend,
  deleteBackend,
  fetchKiemThuList,
  createKiemThu,
  updateKiemThu,
  deleteKiemThu,
  fetchProject
} from '../store/nhiem_vu_slice';

export const useQuanLyNhiemVu = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    tinhNangList,
    backendList,
    kiemThuList,
    selectedItem,
    projectInfo
  } = useSelector((state) => state.nhiemVu);

  // Project Functions
  const getProject = useCallback(async (projectId) => {
    try {
      setLoading(true);
      const result = await dispatch(fetchProject(projectId)).unwrap();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Tính năng Functions
  const fetchTinhNang = useCallback(async (projectId) => {
    try {
      setLoading(true);
      await dispatch(fetchTinhNangList(projectId)).unwrap();
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách tính năng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const themTinhNang = useCallback(async (data) => {
    try {
      setLoading(true);
      const result = await dispatch(createTinhNang(data)).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã thêm tính năng mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return result;
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm tính năng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const capNhatTinhNang = useCallback(async (id, data) => {
    try {
      setLoading(true);
      const result = await dispatch(updateTinhNang({ id, ...data })).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật tính năng',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return result;
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật tính năng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const xoaTinhNang = useCallback(async (id) => {
    try {
      setLoading(true);
      await dispatch(deleteTinhNang(id)).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã xóa tính năng',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tính năng',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  // Backend Functions
  const fetchBackend = useCallback(async (projectId) => {
    try {
      setLoading(true);
      await dispatch(fetchBackendList(projectId)).unwrap();
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách backend',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const themBackend = useCallback(async (data) => {
    try {
      setLoading(true);
      const result = await dispatch(createBackend(data)).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã thêm backend mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  // Kiểm thử Functions
  const fetchKiemThu = useCallback(async (projectId) => {
    try {
      setLoading(true);
      await dispatch(fetchKiemThuList(projectId)).unwrap();
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách kiểm thử',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  const themKiemThu = useCallback(async (data) => {
    try {
      setLoading(true);
      const result = await dispatch(createKiemThu(data)).unwrap();
      toast({
        title: 'Thành công',
        description: 'Đã thêm kiểm thử mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch, toast]);

  return {
    // State
    loading,
    error,
    tinhNangList,
    backendList,
    kiemThuList,
    selectedItem,
    projectInfo,

    // Project Functions
    getProject,

    // Tính năng Functions
    fetchTinhNang,
    themTinhNang,
    capNhatTinhNang,
    xoaTinhNang,

    // Backend Functions
    fetchBackend,
    themBackend,

    // Kiểm thử Functions
    fetchKiemThu,
    themKiemThu,
  };
};