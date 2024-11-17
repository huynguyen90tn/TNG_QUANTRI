// File: src/routes/su_kien_review_routes.js
// Link tham khảo: https://reactrouter.com/web/guides/quick-start
// Nhánh: main

import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import TrangSuKien from '../components/su_kien_review/pages/trang_su_kien';
import ChiTietSuKien from '../components/su_kien_review/components/chi_tiet_su_kien';
import BaoCaoThongKe from '../components/su_kien_review/components/bao_cao_thong_ke';
import { Box } from '@chakra-ui/react';
import ProtectedRoute from '../utils/ProtectedRoute';

const SHARED_ROLES = ['admin-tong', 'admin-con', 'member', 'ky_thuat'];

export const SuKienReviewRoutes = () => {
  return [
    <Route
      key="review-su-kien-main"
      path="/review-su-kien"
      element={
        <ProtectedRoute requiredRole={SHARED_ROLES}>
          <Layout>
            <Box p={4}>
              <TrangSuKien />
            </Box>
          </Layout>
        </ProtectedRoute>
      }
    />,
    <Route
      key="review-su-kien-detail"
      path="/review-su-kien/:id"
      element={
        <ProtectedRoute requiredRole={SHARED_ROLES}>
          <Layout>
            <Box p={4}>
              <ChiTietSuKien />
            </Box>
          </Layout>
        </ProtectedRoute>
      }
    />,
    <Route
      key="review-su-kien-report"
      path="/review-su-kien/bao-cao"
      element={
        <ProtectedRoute requiredRole={SHARED_ROLES}>
          <Layout>
            <Box p={4}>
              <BaoCaoThongKe />
            </Box>
          </Layout>
        </ProtectedRoute>
      }
    />
  ];
};
