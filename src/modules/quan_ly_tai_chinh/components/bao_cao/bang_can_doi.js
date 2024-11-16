// File: src/modules/quan_ly_tai_chinh/components/bao_cao/bang_can_doi.js
// Link tham khảo: https://chakra-ui.com/docs/components/simple-grid
// Nhánh: main

import React, { useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue
} from '@chakra-ui/react';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { dinhDangTien } from '../../utils/dinh_dang_tien';

const BangCanDoi = () => {
  const { 
    nguonThu,
    chiTieu, 
    tonKho,
    layTongQuanTaiChinh,
    dangTaiDuLieu 
  } = useTaiChinh();
  
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    layTongQuanTaiChinh();
  }, [layTongQuanTaiChinh]);

  const tongThu = nguonThu.reduce((sum, item) => sum + item.soTien, 0);
  const tongChi = chiTieu.reduce((sum, item) => sum + item.soTien, 0);
  const phanTramThayDoi = ((tongThu - tongChi) / tongThu * 100) || 0;

  return (
    <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat>
          <StatLabel>Tổng thu</StatLabel>
          <StatNumber color="green.500">{dinhDangTien(tongThu)}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Tổng chi</StatLabel>
          <StatNumber color="red.500">{dinhDangTien(tongChi)}</StatNumber>
        </Stat>

        <Stat>
          <StatLabel>Số dư</StatLabel>
          <StatNumber color={tonKho >= 0 ? 'green.500' : 'red.500'}>
            {dinhDangTien(tonKho)}
          </StatNumber>
          <StatHelpText>
            <StatArrow type={phanTramThayDoi >= 0 ? 'increase' : 'decrease'} />
            {Math.abs(phanTramThayDoi).toFixed(2)}%
          </StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default BangCanDoi;