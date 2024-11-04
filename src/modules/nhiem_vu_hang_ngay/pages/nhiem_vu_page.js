// File: src/modules/nhiem_vu_hang_ngay/pages/nhiem_vu_page.js
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Heading
} from '@chakra-ui/react';
import TaoNhiemVu from '../components/tao_nhiem_vu';
import DanhSachNhiemVu from '../components/danh_sach_nhiem_vu';
import BangThongKe from '../components/bang_thong_ke';

const NhiemVuPage = () => {
  const { user } = useAuth();
  const isAdminCon = user?.role === 'admin-con';

  return (
    <Container maxW="container.xl" py={5}>
      <Heading mb={5}>Quản lý nhiệm vụ hằng ngày</Heading>

      <Tabs>
        <TabList>
          <Tab>Danh sách nhiệm vụ</Tab>
          {isAdminCon && <Tab>Tạo nhiệm vụ mới</Tab>}
          <Tab>Thống kê</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <DanhSachNhiemVu />
          </TabPanel>
          
          {isAdminCon && (
            <TabPanel>
              <TaoNhiemVu />
            </TabPanel>
          )}
          
          <TabPanel>
            <BangThongKe />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default NhiemVuPage;