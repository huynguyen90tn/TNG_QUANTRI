 
// File: src/modules/quan_ly_tai_chinh/pages/bao_cao_page.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Stack,
  Flex,
  Text
} from '@chakra-ui/react';
import BieuDoTaiChinh from '../components/bao_cao/bieu_do_tai_chinh';
import BangCanDoi from '../components/bao_cao/bang_can_doi';
import ThongKeNguonThu from '../components/thong_ke/thong_ke_nguon_thu';
import ThongKeChiTieu from '../components/thong_ke/thong_ke_chi_tieu';
import { useTaiChinh } from '../hooks/use_tai_chinh';
import { dinhDangTien } from '../utils/dinh_dang_tien';

const BaoCaoPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { tonKho, layThongKeTongQuan } = useTaiChinh();

  useEffect(() => {
    layThongKeTongQuan();
  }, [layThongKeTongQuan]);

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={6}>Báo Cáo Tài Chính</Heading>

      <Stack spacing={6}>
        <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontSize="xl" fontWeight="bold">
              Tổng Quan
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              Tồn kho: {dinhDangTien(tonKho)}
            </Text>
          </Flex>
          <BangCanDoi />
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={4}>Biểu Đồ Thu Chi</Heading>
            <BieuDoTaiChinh />
          </Box>

          <Box p={6} bg={bgColor} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={4}>Thống Kê Theo Loại</Heading>
            <Stack spacing={4}>
              <ThongKeNguonThu />
              <ThongKeChiTieu />
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
};

export default BaoCaoPage;