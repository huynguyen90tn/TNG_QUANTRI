// File: src/components/su_kien_review/hooks/use_su_kien.js
// Link tham khảo: https://redux.js.org/tutorials/fundamentals/part-6-async-logic
// Nhánh: main
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  themSuKien,
  xoaSuKien,
  capNhatSuKien,
  setSearchTerm,
  setTrangThai,
  setSuKienHienTai,
  setLoading,
  setError,
  selectAllSuKien,
  selectSearchTerm,
  selectTrangThai,
  selectSuKienHienTai,
  selectLoading,
  selectError
} from '../store/su_kien_slice';

export const useSuKien = () => {
  const dispatch = useDispatch();

  const suKiens = useSelector(selectAllSuKien);
  const searchTerm = useSelector(selectSearchTerm);
  const trangThai = useSelector(selectTrangThai);
  const suKienHienTai = useSelector(selectSuKienHienTai);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const themSuKienHandler = useCallback((suKien) => {
    dispatch(setLoading(true));
    try {
      dispatch(themSuKien(suKien));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const xoaSuKienHandler = useCallback((id) => {
    dispatch(setLoading(true));
    try {
      dispatch(xoaSuKien(id));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const capNhatSuKienHandler = useCallback((suKien) => {
    dispatch(setLoading(true));
    try {
      dispatch(capNhatSuKien(suKien));
      dispatch(setError(null));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const timKiem = useCallback((term) => {
    dispatch(setSearchTerm(term));
  }, [dispatch]);

  const chonTrangThai = useCallback((trangThai) => {
    dispatch(setTrangThai(trangThai));
  }, [dispatch]);

  const chonSuKien = useCallback((suKien) => {
    dispatch(setSuKienHienTai(suKien));
  }, [dispatch]);

  return {
    suKiens,
    searchTerm,
    trangThai,
    suKienHienTai,
    loading,
    error,
    themSuKien: themSuKienHandler,
    xoaSuKien: xoaSuKienHandler,
    capNhatSuKien: capNhatSuKienHandler,
    timKiem,
    chonTrangThai,
    chonSuKien
  };
};
