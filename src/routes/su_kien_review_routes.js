// File: src/routes/su_kien_review_routes.js
// Link tham khảo: https://reactrouter.com/web/guides/quick-start
// Nhánh: main

import React, { useMemo } from 'react';
import { Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TrangSuKien from '../components/su_kien_review/pages/trang_su_kien';
import ChiTietSuKien from '../components/su_kien_review/components/chi_tiet_su_kien';
import CapNhatSuKien from '../components/su_kien_review/components/cap_nhat_su_kien';
import BaoCaoThongKe from '../components/su_kien_review/components/bao_cao_thong_ke';
import { Box } from '@chakra-ui/react';
import ProtectedRoute from '../utils/ProtectedRoute';

const SHARED_ROLES = ['admin-tong', 'admin-con', 'member', 'ky_thuat'];

const RouteWrapper = ({ children }) => (
  <ProtectedRoute requiredRole={SHARED_ROLES}>
    <Layout>
      <Box p={4}>
        {children}
      </Box>
    </Layout>
  </ProtectedRoute>
);

export const SuKienReviewRoutes = () => {
  const routes = useMemo(() => [
    {
      key: 'review-su-kien-main',
      path: '/review-su-kien',
      element: (
        <RouteWrapper>
          <TrangSuKien />
        </RouteWrapper>
      )
    },
    {
      key: 'review-su-kien-detail',
      path: '/review-su-kien/:id',
      element: (
        <RouteWrapper>
          <ChiTietSuKien />
        </RouteWrapper>
      )
    },
    {
      key: 'review-su-kien-edit',
      path: '/review-su-kien/:id/edit',
      element: (
        <RouteWrapper>
          <CapNhatSuKien />
        </RouteWrapper>
      )
    },
    {
      key: 'review-su-kien-report',
      path: '/review-su-kien/bao-cao',
      element: (
        <RouteWrapper>
          <BaoCaoThongKe />
        </RouteWrapper>
      )
    }
  ], []);

  return routes.map(route => (
    <Route
      key={route.key}
      path={route.path}
      element={route.element}
    />
  ));
};

export default SuKienReviewRoutes;