// src/components/su_kien_review/components/thong_bao_nhac_nho.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNhacNho } from '../hooks/use_nhac_nho';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ThongBaoNhacNho = () => {
  const suKiens = useSelector(state => state.suKien.danhSach);
  const { thongBaoNhacNho, kiemTraNhacNho } = useNhacNho();

  useEffect(() => {
    const interval = setInterval(() => {
      kiemTraNhacNho(suKiens);
    }, 60000); // Kiểm tra mỗi phút

    return () => clearInterval(interval);
  }, [suKiens, kiemTraNhacNho]);

  if (!thongBaoNhacNho) return null;

  return (
    <Alert>
      <AlertDescription>
        {thongBaoNhacNho}
      </AlertDescription>
    </Alert>
  );
}
export default ThongBaoNhacNho;