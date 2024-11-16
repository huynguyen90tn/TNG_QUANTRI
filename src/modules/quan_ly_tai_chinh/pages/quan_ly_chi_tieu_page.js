 
// File: src/modules/quan_ly_tai_chinh/pages/quan_ly_chi_tieu_page.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import FormThemChiTieu from '../components/chi_tieu/form_them_chi_tieu';
import DanhSachChiTieu from '../components/chi_tieu/danh_sach_chi_tieu';
import ThongKeChiTieu from '../components/thong_ke/thong_ke_chi_tieu';
import BoLocChiTieu from '../components/bo_loc/bo_loc_chi_tieu';
import { useTaiChinh } from '../hooks/use_tai_chinh';

const QuanLyChiTieuPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { layDanhSachChiTieu } = useTaiChinh();

  useEffect(() => {
    layDanhSachChiTieu();
  }, [layDanhSachChiTieu]);

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={6}>Quản Lý Chi Tiêu</Heading>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab>Danh Sách</Tab>
          <Tab>Thêm Mới</Tab>
          <Tab>Thống Kê</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <SimpleGrid columns={1} spacing={6}>
              <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
                <BoLocChiTieu />
              </Box>
              <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
                <DanhSachChiTieu />
              </Box>
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
              <FormThemChiTieu />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
              <ThongKeChiTieu />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default QuanLyChiTieuPage;