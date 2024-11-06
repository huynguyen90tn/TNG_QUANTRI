 
// File: src/modules/quan_ly_tai_san/pages/quan_ly_tai_san_page.js
// Link tham khảo: https://chakra-ui.com/docs
// Nhánh: main

import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Container,
  Heading,
  Text,
  useMediaQuery
} from '@chakra-ui/react';
import DanhSachTaiSan from '../components/danh_sach_tai_san';
import ThemTaiSan from '../components/them_tai_san';
import CapPhatTaiSan from '../components/cap_phat_tai_san';
import BaoTriTaiSan from '../components/bao_tri_tai_san';
import KiemKeTaiSan from '../components/kiem_ke_tai_san';
import { useAuth } from '../../../hooks/useAuth';

const TAB_TITLES = {
  DANH_SACH: 'Danh sách tài sản',
  THEM_MOI: 'Thêm mới tài sản',
  CAP_PHAT: 'Cấp phát tài sản',
  BAO_TRI: 'Bảo trì tài sản',
  KIEM_KE: 'Kiểm kê tài sản',
};

const QuanLyTaiSanPage = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const bgColor = useColorModeValue('gray.900', 'gray.800');
  const borderColor = useColorModeValue('whiteAlpha.200', 'whiteAlpha.100');
  const textColor = useColorModeValue('white', 'gray.100');

  const isAdmin = user?.role === 'admin-tong' || user?.role === 'admin-con';
  const isAdminTong = user?.role === 'admin-tong';

  // Filter tabs based on user role
  const getAvailableTabs = () => {
    const tabs = [
      { id: 0, title: TAB_TITLES.DANH_SACH }
    ];

    if (isAdmin) {
      tabs.push(
        { id: 1, title: TAB_TITLES.THEM_MOI },
        { id: 2, title: TAB_TITLES.CAP_PHAT }
      );
    }

    if (isAdminTong || user?.role === 'ky_thuat') {
      tabs.push({ id: 3, title: TAB_TITLES.BAO_TRI });
    }

    if (isAdmin) {
      tabs.push({ id: 4, title: TAB_TITLES.KIEM_KE });
    }

    return tabs;
  };

  const availableTabs = getAvailableTabs();

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Heading size="lg" color={textColor} mb={2}>
          Quản lý tài sản
        </Heading>
        <Text color="whiteAlpha.600">
          Quản lý danh sách tài sản, cấp phát, bảo trì và kiểm kê
        </Text>
      </Box>

      <Box 
        bg={bgColor}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
        shadow="lg"
      >
        <Tabs
          variant="soft-rounded"
          colorScheme="blue"
          onChange={setSelectedTab}
          defaultIndex={0}
          p={4}
          isLazy
        >
          <TabList
            mb={4}
            gap={2}
            overflowX="auto"
            overflowY="hidden"
            css={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.16) transparent',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.16)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(255, 255, 255, 0.24)',
              },
            }}
          >
            {availableTabs.map((tab) => (
              <Tab
                key={tab.id}
                fontSize={isLargerThan768 ? 'md' : 'sm'}
                px={isLargerThan768 ? 6 : 3}
                py={isLargerThan768 ? 3 : 2}
                color="whiteAlpha.700"
                _selected={{
                  color: 'white',
                  bg: 'blue.500',
                }}
                _hover={{
                  color: 'white',
                }}
                whiteSpace="nowrap"
              >
                {tab.title}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            <TabPanel p={0}>
              <DanhSachTaiSan />
            </TabPanel>

            {isAdmin && (
              <TabPanel p={0}>
                <ThemTaiSan onSuccess={() => setSelectedTab(0)} />
              </TabPanel>
            )}

            {isAdmin && (
              <TabPanel p={0}>
                <CapPhatTaiSan />
              </TabPanel>
            )}

            {(isAdminTong || user?.role === 'ky_thuat') && (
              <TabPanel p={0}>
                <BaoTriTaiSan />
              </TabPanel>
            )}

            {isAdmin && (
              <TabPanel p={0}>
                <KiemKeTaiSan />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default QuanLyTaiSanPage;