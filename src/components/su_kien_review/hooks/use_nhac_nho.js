// src/components/su_kien_review/hooks/use_nhac_nho.js
import { useState, useCallback } from 'react';

export const useNhacNho = () => {
  const [thongBaoNhacNho, setThongBaoNhacNho] = useState('');

  const kiemTraNhacNho = useCallback((suKiens) => {
    const bayGio = new Date();
    const suKienSapDienRa = suKiens.find(suKien => {
      const ngayToChuc = new Date(suKien.ngayToChuc);
      const khoangCach = ngayToChuc.getTime() - bayGio.getTime();
      const soPhutConLai = Math.floor(khoangCach / (1000 * 60));
      
      // Thông báo trước 30 phút
      return soPhutConLai > 0 && soPhutConLai <= 30;
    });

    if (suKienSapDienRa) {
      setThongBaoNhacNho(`Sự kiện "${suKienSapDienRa.tenSuKien}" sẽ diễn ra trong vòng 30 phút nữa!`);
    } else {
      setThongBaoNhacNho('');
    }
  }, []);

  return {
    thongBaoNhacNho,
    kiemTraNhacNho
  };
};