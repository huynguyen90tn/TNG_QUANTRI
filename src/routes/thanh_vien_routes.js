// src/routes/thanh_vien_routes.js
import React from 'react';
import { Route } from 'react-router-dom';
import QuanLyThanhVienPage from '../modules/quan_ly_thanh_vien/pages/quan_ly_thanh_vien_page';
import Layout from '../components/layout/Layout';

// Export mặc định cần đúng cú pháp
export const ThanhVienRoutes = () => [
  <Route
    key="quan-ly-thanh-vien"
    path="/quan-ly-thanh-vien"
    element={
      <Layout>
        <QuanLyThanhVienPage />
      </Layout>
    }
  />,
];

// Nếu muốn export default thì thêm dòng này
export default ThanhVienRoutes;