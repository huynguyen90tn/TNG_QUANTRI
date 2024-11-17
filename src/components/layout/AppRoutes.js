// File: src/components/layout/AppRoutes.js
// Link tham khảo: https://reactrouter.com/web/guides/quick-start
// Nhánh: main

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Center, Spinner } from '@chakra-ui/react';
import { SuKienReviewRoutes } from '../../routes/su_kien_review_routes';
import { ThuChiRoutes } from '../../routes/thu_chi_routes';
import { ThanhVienRoutes } from '../../routes/thanh_vien_routes';

const LoadingSpinner = () => (
  <Center h="100vh">
    <Spinner size="xl" />
  </Center>
);

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* ... các routes khác ... */}
      {SuKienReviewRoutes()}
      {ThuChiRoutes()}
      {ThanhVienRoutes()}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;