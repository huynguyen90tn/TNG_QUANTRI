// src/modules/quan_ly_thanh_vien/pages/quan_ly_thanh_vien_page.js
import React from 'react';
import { Container, Box } from '@chakra-ui/react';
import DanhSachThanhVien from '../components/danh_sach_thanh_vien';

const QuanLyThanhVienPage = () => {
  return (
    <Container maxW="container.xl" py={5}>
      <Box bg="white" rounded="lg" shadow="base" overflow="hidden">
        <DanhSachThanhVien />
      </Box>
    </Container>
  );
};

export default QuanLyThanhVienPage;