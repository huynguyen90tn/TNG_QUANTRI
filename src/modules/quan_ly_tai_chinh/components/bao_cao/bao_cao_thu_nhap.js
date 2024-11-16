 
// File: src/modules/quan_ly_tai_chinh/components/bao_cao/bao_cao_thu_nhap.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  StatGroup,
  StatHelpText,
  useColorModeValue,
  Progress
} from '@chakra-ui/react';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { useNguonThu } from '../../hooks/use_nguon_thu';
import { dinhDangTien } from '../../utils/dinh_dang_tien';
import { TEN_LOAI_NGUON_THU } from '../../constants/loai_nguon_thu';

const BaoCaoThuNhap = () => {
  const { thongKeNguonThu, layThongKeNguonThu } = useNguonThu();
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    layThongKeNguonThu();
  }, [layThongKeNguonThu]);

  const tongThu = thongKeNguonThu.tongTien || 0;
  const duLieuBieuDo = thongKeNguonThu.theoThang?.map(item => ({
    thang: item.thang,
    tongThu: item.tongTien,
    soLuong: item.soLuongGiaoDich
  })) || [];

  return (
    <VStack spacing={6} align="stretch">
      <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
        <Heading size="md" mb={4}>Tổng quan thu nhập</Heading>
        <StatGroup>
          <Stat>
            <StatLabel>Tổng thu nhập</StatLabel>
            <StatNumber>{dinhDangTien(tongThu)}</StatNumber>
            <StatHelpText>
              <StatArrow type={thongKeNguonThu.phanTramThayDoi >= 0 ? 'increase' : 'decrease'} />
              {Math.abs(thongKeNguonThu.phanTramThayDoi || 0).toFixed(1)}%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Số nguồn thu</StatLabel>
            <StatNumber>{thongKeNguonThu.soLuongGiaoDich || 0}</StatNumber>
            <StatHelpText>
              Trung bình: {dinhDangTien(tongThu / (thongKeNguonThu.soLuongGiaoDich || 1))}
            </StatHelpText>
          </Stat>
        </StatGroup>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm" height="400px">
          <Heading size="md" mb={4}>Biến động thu nhập</Heading>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={duLieuBieuDo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="thang" />
              <YAxis />
              <Tooltip formatter={(value) => dinhDangTien(value)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tongThu" 
                name="Thu nhập" 
                stroke="#48BB78" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>Phân bố theo nguồn thu</Heading>
          <VStack spacing={4} align="stretch">
            {Object.entries(thongKeNguonThu.theoLoai || {}).map(([loai, data]) => {
              const phanTram = (data.tongTien / tongThu) * 100;
              return (
                <Box key={loai}>
                  <SimpleGrid columns={2} mb={2}>
                    <StatLabel>{TEN_LOAI_NGUON_THU[loai]}</StatLabel>
                    <StatLabel textAlign="right">
                      {dinhDangTien(data.tongTien)} ({phanTram.toFixed(1)}%)
                    </StatLabel>
                  </SimpleGrid>
                  <Progress
                    value={phanTram}
                    colorScheme="green"
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
              );
            })}
          </VStack>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default BaoCaoThuNhap;
