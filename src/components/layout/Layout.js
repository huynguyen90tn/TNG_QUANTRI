import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <Flex minHeight="100vh">
      <Sidebar />
      <Box flex={1}>
        <Header />
        <Box as="main" p={4}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;