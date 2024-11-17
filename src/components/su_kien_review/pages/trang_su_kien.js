// File: src/components/su_kien_review/pages/trang_su_kien.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Box
} from '@chakra-ui/react';
import DanhSachSuKien from '../components/danh_sach_su_kien';
import FormSuKien from '../components/form_su_kien';
import TimKiem from '../components/tim_kiem';
import BoLocSuKien from '../components/bo_loc_su_kien';

const TrangSuKien = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Box width="100%">
          <Heading mb={8}>Quản lý sự kiện review</Heading>
          <VStack spacing={6}>
            <Box width="100%">
              <TimKiem />
            </Box>
            <Box width="100%">
              <BoLocSuKien />
            </Box>
            <Box width="100%">
              <FormSuKien />
            </Box>
            <Box width="100%">
              <DanhSachSuKien />
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default TrangSuKien;
