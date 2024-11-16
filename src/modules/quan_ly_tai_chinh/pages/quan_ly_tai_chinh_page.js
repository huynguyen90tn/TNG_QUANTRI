 
// File: src/modules/quan_ly_tai_chinh/pages/quan_ly_tai_chinh_page.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue
} from '@chakra-ui/react';
import FormThemNguonThu from '../components/nguon_thu/form_them_nguon_thu';
import FormThemChiTieu from '../components/chi_tieu/form_them_chi_tieu';
import DanhSachNguonThu from '../components/nguon_thu/danh_sach_nguon_thu';
import DanhSachChiTieu from '../components/chi_tieu/danh_sach_chi_tieu';
import BangCanDoi from '../components/bao_cao/bang_can_doi';
import BieuDoTaiChinh from '../components/bao_cao/bieu_do_tai_chinh';
import ThongKeNguonThu from '../components/thong_ke/thong_ke_nguon_thu';
import ThongKeChiTieu from '../components/thong_ke/thong_ke_chi_tieu';

const QuanLyTaiChinhPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={6}>Quản Lý Tài Chính</Heading>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab>Tổng Quan</Tab>
          <Tab>Nguồn Thu</Tab>
          <Tab>Chi Tiêu</Tab>
          <Tab>Báo Cáo</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <BangCanDoi />
              </Box>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <BieuDoTaiChinh />
              </Box>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <ThongKeNguonThu />
              </Box>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <ThongKeChiTieu />
              </Box>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={6}>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <FormThemNguonThu />
              </Box>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <DanhSachNguonThu />
              </Box>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={6}>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <FormThemChiTieu />
              </Box>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <DanhSachChiTieu />
              </Box>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid templateColumns="1fr" gap={6}>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <BieuDoTaiChinh />
              </Box>
              <Box bg={bgColor} p={4} borderRadius="lg" borderWidth={1} borderColor={borderColor}>
                <BangCanDoi />
              </Box>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default QuanLyTaiChinhPage;
