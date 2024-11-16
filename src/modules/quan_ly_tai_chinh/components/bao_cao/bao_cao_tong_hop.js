 
// File: src/modules/quan_ly_tai_chinh/components/bao_cao/bao_cao_tong_hop.js
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
  StatHelpText,
  StatArrow,
  StatGroup,
  Text,
  useColorModeValue,
  Button,
  HStack,
  Icon
} from '@chakra-ui/react';
import { 
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { FiDownload, FiMail } from 'react-icons/fi';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { dinhDangTien } from '../../utils/dinh_dang_tien';

const BaoCaoTongHop = () => {
  const { tongQuanTaiChinh, layTongQuanTaiChinh, xuatBaoCao } = useTaiChinh();
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    layTongQuanTaiChinh();
  }, [layTongQuanTaiChinh]);

  const duLieuBieuDo = tongQuanTaiChinh.duLieuBieuDo?.map(item => ({
    thang: item.thang,
    tongThu: item.tongThu,
    tongChi: item.tongChi,
    canDoi: item.tongThu - item.tongChi
  })) || [];

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Báo Cáo Tổng Hợp Tài Chính</Heading>
        <HStack>
          <Button
            leftIcon={<Icon as={FiDownload} />}
            colorScheme="blue"
            onClick={() => xuatBaoCao('PDF')}
          >
            Xuất PDF
          </Button>
          <Button
            leftIcon={<Icon as={FiMail} />}
            variant="outline"
            onClick={() => xuatBaoCao('EMAIL')}
          >
            Gửi Email
          </Button>
        </HStack>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Stat>
            <StatLabel>Tổng thu</StatLabel>
            <StatNumber color="green.500">
              {dinhDangTien(tongQuanTaiChinh.tongThu || 0)}
            </StatNumber>
            <StatHelpText>
              <StatArrow 
                type={tongQuanTaiChinh.phanTramThayDoiThu >= 0 ? 'increase' : 'decrease'} 
              />
              {Math.abs(tongQuanTaiChinh.phanTramThayDoiThu || 0).toFixed(1)}%
            </StatHelpText>
          </Stat>
        </Box>

        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Stat>
            <StatLabel>Tổng chi</StatLabel>
            <StatNumber color="red.500">
              {dinhDangTien(tongQuanTaiChinh.tongChi || 0)}
            </StatNumber>
            <StatHelpText>
              <StatArrow 
                type={tongQuanTaiChinh.phanTramThayDoiChi >= 0 ? 'increase' : 'decrease'} 
              />
              {Math.abs(tongQuanTaiChinh.phanTramThayDoiChi || 0).toFixed(1)}%
            </StatHelpText>
          </Stat>
        </Box>

        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Stat>
            <StatLabel>Cân đối</StatLabel>
            <StatNumber color={tongQuanTaiChinh.canDoi >= 0 ? 'green.500' : 'red.500'}>
              {dinhDangTien(tongQuanTaiChinh.canDoi || 0)}
            </StatNumber>
            <StatHelpText>
              So với tháng trước: {dinhDangTien(tongQuanTaiChinh.chenhLechCanDoi || 0)}
            </StatHelpText>
          </Stat>
        </Box>

        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Stat>
            <StatLabel>Tồn quỹ</StatLabel>
            <StatNumber>
              {dinhDangTien(tongQuanTaiChinh.tonQuy || 0)}
            </StatNumber>
            <StatHelpText>
              Khả dụng: {dinhDangTien(tongQuanTaiChinh.tonQuyKhaDung || 0)}
            </StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm" height="400px">
        <Heading size="md" mb={4}>Biểu đồ thu chi theo thời gian</Heading>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={duLieuBieuDo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="thang" />
            <YAxis />
            <Tooltip 
              formatter={(value) => dinhDangTien(value)}
              labelFormatter={(label) => `Tháng ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="tongThu"
              name="Thu nhập"
              stroke="#48BB78"
              fill="#48BB78"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="tongChi"
              name="Chi tiêu"
              stroke="#F56565"
              fill="#F56565"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="canDoi"
              name="Cân đối"
              stroke="#4299E1"
              fill="#4299E1"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>Top 5 nguồn thu lớn nhất</Heading>
          <VStack spacing={4} align="stretch">
            {tongQuanTaiChinh.topNguonThu?.map((item, index) => (
              <HStack key={index} justify="space-between" p={3} borderWidth="1px" borderRadius="md">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{item.tenNguonThu}</Text>
                  <Text fontSize="sm" color="gray.500">{item.loaiThu}</Text>
                </VStack>
                <Text fontWeight="bold" color="green.500">
                  {dinhDangTien(item.soTien)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>Top 5 khoản chi lớn nhất</Heading>
          <VStack spacing={4} align="stretch">
            {tongQuanTaiChinh.topChiTieu?.map((item, index) => (
              <HStack key={index} justify="space-between" p={3} borderWidth="1px" borderRadius="md">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{item.tenChiTieu}</Text>
                  <Text fontSize="sm" color="gray.500">{item.loaiChi}</Text>
                </VStack>
                <Text fontWeight="bold" color="red.500">
                  {dinhDangTien(item.soTien)}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>Dự báo tài chính</Heading>
          <SimpleGrid columns={2} spacing={4}>
            <Stat>
              <StatLabel>Dự kiến thu</StatLabel>
              <StatNumber color="green.500">
                {dinhDangTien(tongQuanTaiChinh.duKienThu || 0)}
              </StatNumber>
              <StatHelpText>
                Dựa trên {tongQuanTaiChinh.soThangDuBao || 3} tháng gần nhất
              </StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Dự kiến chi</StatLabel>
              <StatNumber color="red.500">
                {dinhDangTien(tongQuanTaiChinh.duKienChi || 0)}
              </StatNumber>
              <StatHelpText>
                Dựa trên chi tiêu định kỳ
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        </Box>

        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Heading size="md" mb={4}>Khuyến nghị</Heading>
          <VStack spacing={4} align="stretch">
            {tongQuanTaiChinh.khuyenNghi?.map((item, index) => (
              <Box 
                key={index}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                borderLeft="4px"
                borderLeftColor={
                  item.mucDo === 'CAO' ? 'red.500' :
                  item.mucDo === 'TRUNG_BINH' ? 'yellow.500' :
                  'green.500'
                }
              >
                <Text fontWeight="bold">{item.tieuDe}</Text>
                <Text fontSize="sm" mt={1}>{item.noiDung}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default BaoCaoTongHop;