// File: src/modules/quan_ly_luong/pages/quan_ly_luong_page.js
// Link tham khảo: https://chakra-ui.com/docs/components/tabs
// Nhánh: main

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Container,
  Heading,
  VStack
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import { BangLuongCaNhan } from '../components/bang_luong_ca_nhan';
import BangLuongTong from '../components/bang_luong_tong';
import { BieuDoLuong } from '../components/bieu_do_luong';
import { ROLES } from '../../../constants/roles';

const QuanLyLuongPage = () => {
  const { user } = useAuth();
  const isAdmin = [ROLES.ADMIN_TONG, ROLES.ADMIN_CON].includes(user?.role);

  return (
    <Container maxW="container.xl" py={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={4}>
          Quản Lý Lương
        </Heading>

        <Box>
          <Tabs 
            variant="enclosed" 
            colorScheme="blue" 
            defaultIndex={isAdmin ? 0 : 1}
            isLazy
          >
            <TabList>
              {isAdmin && (
                <Tab fontWeight="medium" _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
                  Quản Lý Lương
                </Tab>
              )}
              <Tab fontWeight="medium" _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
                Lương Của Tôi
              </Tab>
              {isAdmin && (
                <Tab fontWeight="medium" _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
                  Thống Kê
                </Tab>
              )}
            </TabList>

            <TabPanels>
              {isAdmin && (
                <TabPanel px={0}>
                  <BangLuongTong />
                </TabPanel>
              )}
              <TabPanel px={0}>
                <BangLuongCaNhan 
                  userId={user?.id} 
                  isAdmin={isAdmin}
                />
              </TabPanel>
              {isAdmin && (
                <TabPanel px={0}>
                  <BieuDoLuong />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Container>
  );
};

QuanLyLuongPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    role: PropTypes.oneOf(Object.values(ROLES))
  })
};

QuanLyLuongPage.defaultProps = {
  user: null
};

export default QuanLyLuongPage;