// File: src/modules/quan_ly_tai_chinh/components/thong_ke/thong_ke_nguon_thu.js
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
  Heading
} from '@chakra-ui/react';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { dinhDangTien } from '../../utils/dinh_dang_tien';
import { LOAI_NGUON_THU, TEN_LOAI_NGUON_THU } from '../../constants/loai_nguon_thu';

const ThongKeNguonThu = () => {
  const { nguonThu } = useTaiChinh();

  const thongKeTheoLoai = Object.values(LOAI_NGUON_THU).reduce((acc, loai) => {
    const nguonThuTheoLoai = nguonThu.filter(item => item.loaiThu === loai);
    const tongTien = nguonThuTheoLoai.reduce((sum, item) => sum + item.soTien, 0);
    
    const thangNay = nguonThuTheoLoai.filter(item => {
      const ngayThu = new Date(item.ngayThu);
      const thangHienTai = new Date().getMonth();
      return ngayThu.getMonth() === thangHienTai;
    }).reduce((sum, item) => sum + item.soTien, 0);

    const thangTruoc = nguonThuTheoLoai.filter(item => {
      const ngayThu = new Date(item.ngayThu);
      const thangTruoc = new Date().getMonth() - 1;
      return ngayThu.getMonth() === thangTruoc;
    }).reduce((sum, item) => sum + item.soTien, 0);

    const phanTramThayDoi = thangTruoc ? ((thangNay - thangTruoc) / thangTruoc) * 100 : 0;

    acc[loai] = {
      tongTien,
      thangNay,
      thangTruoc,
      phanTramThayDoi
    };
    return acc;
  }, {});

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Thống Kê Nguồn Thu</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {Object.entries(thongKeTheoLoai).map(([loai, thongKe]) => (
          <Stat
            key={loai}
            p={4}
            borderRadius="lg"
            border="1px"
            borderColor="gray.200"
          >
            <StatLabel>{TEN_LOAI_NGUON_THU[loai]}</StatLabel>
            <StatNumber>{dinhDangTien(thongKe.tongTien)}</StatNumber>
            <StatHelpText>
              <StatArrow 
                type={thongKe.phanTramThayDoi >= 0 ? 'increase' : 'decrease'} 
              />
              {Math.abs(thongKe.phanTramThayDoi).toFixed(1)}%
            </StatHelpText>
          </Stat>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ThongKeNguonThu;


