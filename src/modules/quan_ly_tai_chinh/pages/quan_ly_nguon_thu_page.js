 
// File: src/modules/quan_ly_tai_chinh/pages/quan_ly_nguon_thu_page.js
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
import FormThemNguonThu from '../components/nguon_thu/form_them_nguon_thu';
import DanhSachNguonThu from '../components/nguon_thu/danh_sach_nguon_thu';
import ThongKeNguonThu from '../components/thong_ke/thong_ke_nguon_thu';
import BoLocNguonThu from '../components/bo_loc/bo_loc_nguon_thu';
import { useTaiChinh } from '../hooks/use_tai_chinh';

const QuanLyNguonThuPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { layDanhSachNguonThu } = useTaiChinh();

  useEffect(() => {
    layDanhSachNguonThu();
  }, [layDanhSachNguonThu]);

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={6}>Quản Lý Nguồn Thu</Heading>

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
                <BoLocNguonThu />
              </Box>
              <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
                <DanhSachNguonThu />
              </Box>
            </SimpleGrid>
          </TabPanel>

          <TabPanel>
            <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
              <FormThemNguonThu />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box p={4} bg={bgColor} borderRadius="lg" shadow="sm">
              <ThongKeNguonThu />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default QuanLyNguonThuPage;