// File: src/routes/thu_chi_routes.js
// Link tham khảo: https://reactrouter.com/web/guides/quick-start
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import DanhSachThuChi from '../modules/quan_ly_thu_chi/components/danh_sach_thu_chi';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner 
          size="xl" 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
        />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const SHARED_ROLES = ['admin-tong', 'admin-con', 'member', 'ky_thuat'];

export const ThuChiRoutes = () => {
  return [
    <Route
      key="thu-chi"
      path="/quan-ly-thu-chi"
      element={
        <ProtectedRoute>
          <Layout>
            <Box p={4}>
              <DanhSachThuChi />
            </Box>
          </Layout>
        </ProtectedRoute>
      }
    />
  ];
};

export default ThuChiRoutes;