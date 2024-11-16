// File: src/modules/quan_ly_tai_chinh/components/thong_ke/thong_ke_chi_tieu.js
// Link tham khảo: https://chakra-ui.com/docs/components/stat
// Nhánh: main

import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Progress
} from '@chakra-ui/react';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { dinhDangTien } from '../../utils/dinh_dang_tien';
import { LOAI_CHI_TIEU, TEN_LOAI_CHI_TIEU } from '../../constants/loai_chi_tieu';
import { tinhPhanTramThayDoi } from '../../utils/tinh_toan_tai_chinh';

const ThongKeChiTieu = () => {
  const { chiTieu = [] } = useTaiChinh() || {};

  const tongChiTieu = chiTieu.reduce((sum, item) => sum + (item.soTien || 0), 0);

  const thongKeTheoLoai = LOAI_CHI_TIEU ? Object.values(LOAI_CHI_TIEU).reduce((acc, loai) => {
    const chiTieuTheoLoai = chiTieu.filter(item => item.loaiChi === loai) || [];
    const tongTien = chiTieuTheoLoai.reduce((sum, item) => sum + (item.soTien || 0), 0);
    const phanTram = tongChiTieu ? (tongTien / tongChiTieu) * 100 : 0;

    const thangNay = chiTieuTheoLoai
      .filter(item => {
        const ngayChi = new Date(item.ngayChi);
        return ngayChi.getMonth() === new Date().getMonth();
      })
      .reduce((sum, item) => sum + (item.soTien || 0), 0);

    const thangTruoc = chiTieuTheoLoai
      .filter(item => {
        const ngayChi = new Date(item.ngayChi);
        return ngayChi.getMonth() === new Date().getMonth() - 1;
      })
      .reduce((sum, item) => sum + (item.soTien || 0), 0);

    acc[loai] = {
      tongTien,
      phanTram,
      thangNay,
      thangTruoc,
      phanTramThayDoi: tinhPhanTramThayDoi(thangTruoc, thangNay)
    };

    return acc;
  }, {}) : {};

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Thống Kê Chi Tiêu</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={4}>
        {Object.entries(thongKeTheoLoai).map(([loai, thongKe]) => (
          <Box 
            key={loai}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Stat>
              <StatLabel>{TEN_LOAI_CHI_TIEU?.[loai] || loai}</StatLabel>
              <StatNumber>{dinhDangTien(thongKe.tongTien)}</StatNumber>
              <StatHelpText>
                <StatArrow 
                  type={thongKe.phanTramThayDoi >= 0 ? 'increase' : 'decrease'} 
                />
                {Math.abs(thongKe.phanTramThayDoi).toFixed(1)}% so với tháng trước
              </StatHelpText>
              <Progress 
                value={thongKe.phanTram} 
                size="sm" 
                colorScheme="blue" 
                mt={2}
              />
            </Stat>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ThongKeChiTieu;