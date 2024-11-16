 
// File: src/modules/quan_ly_tai_chinh/components/bao_cao/bao_cao_chi_tieu.js
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
  useColorModeValue
} from '@chakra-ui/react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { useChiTieu } from '../../hooks/use_chi_tieu';
import { dinhDangTien } from '../../utils/dinh_dang_tien';
import { LOAI_CHI_TIEU, TEN_LOAI_CHI_TIEU } from '../../constants/loai_chi_tieu';

const BaoCaoChiTieu = () => {
  const { thongKeChiTieu, layThongKeChiTieu } = useChiTieu();
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    layThongKeChiTieu();
  }, [layThongKeChiTieu]);

  const duLieuBieuDo = Object.entries(thongKeChiTieu.theoLoai || {}).map(([loai, data]) => ({
    name: TEN_LOAI_CHI_TIEU[loai],
    soTien: data.tongTien,
    soLuong: data.soLuongGiaoDich
  }));

  return (
    <VStack spacing={6} align="stretch">
      <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
        <Heading size="md" mb={4}>Tổng quan chi tiêu</Heading>
        <StatGroup>
          <Stat>
            <StatLabel>Tổng chi tiêu</StatLabel>
            <StatNumber>{dinhDangTien(thongKeChiTieu.tongTien || 0)}</StatNumber>
            <StatHelpText>
              <StatArrow type={thongKeChiTieu.phanTramThayDoi >= 0 ? 'increase' : 'decrease'} />
              {Math.abs(thongKeChiTieu.phanTramThayDoi || 0).toFixed(1)}%
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>Số lượng giao dịch</StatLabel>
            <StatNumber>{thongKeChiTieu.soLuongGiaoDich || 0}</StatNumber>
            <StatHelpText>
              Trung bình: {dinhDangTien(
                (thongKeChiTieu.tongTien || 0) / (thongKeChiTieu.soLuongGiaoDich || 1)
              )}
            </StatHelpText>
          </Stat>
        </StatGroup>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm" height="400px">
          <Heading size="md" mb={4}>Phân bố chi tiêu theo loại</Heading>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={duLieuBieuDo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => dinhDangTien(value)} />
              <Legend />
              <Bar dataKey="soTien" name="Số tiền" fill="#F56565" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>Chi tiết theo loại chi tiêu</Heading>
          <SimpleGrid columns={1} spacing={4}>
            {Object.entries(thongKeChiTieu.theoLoai || {}).map(([loai, data]) => (
              <Box 
                key={loai}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
              >
                <VStack align="stretch">
                  <Heading size="sm">{TEN_LOAI_CHI_TIEU[loai]}</Heading>
                  <SimpleGrid columns={2} gap={4}>
                    <Stat size="sm">
                      <StatLabel>Số tiền</StatLabel>
                      <StatNumber>{dinhDangTien(data.tongTien)}</StatNumber>
                    </Stat>
                    <Stat size="sm">
                      <StatLabel>Số giao dịch</StatLabel>
                      <StatNumber>{data.soLuongGiaoDich}</StatNumber>
                    </Stat>
                  </SimpleGrid>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default BaoCaoChiTieu;