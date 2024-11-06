// File: src/routes/tai_san_routes.js
// Link tham khảo: https://reactrouter.com/web/api/Route 
// Nhánh: main

import React from 'react';
import { lazy } from 'react';
import { FaBoxOpen } from 'react-icons/fa';

const QuanLyTaiSanPage = lazy(() => import('../modules/quan_ly_tai_san/pages/quan_ly_tai_san_page'));

/**
 * @typedef {Object} RouteItem
 * @property {string} path - Đường dẫn route
 * @property {React.ComponentType} component - Component để render
 * @property {string[]} roles - Các role được phép truy cập
 * @property {string} title - Tiêu đề của route
 * @property {React.ComponentType} icon - Icon component
 * @property {RouteItem[]} [items] - Các route con
 */

export const taiSanRoutes = [
  {
    path: '/quan-ly-tai-san',
    component: QuanLyTaiSanPage,
    roles: ['admin-tong', 'admin-con', 'member', 'ky-thuat'],
    title: 'Quản lý tài sản',
    icon: FaBoxOpen,
    items: [
      {
        path: '',
        title: 'Danh sách tài sản',
        roles: ['admin-tong', 'admin-con', 'member', 'ky-thuat']
      },
      {
        path: 'them-moi',
        title: 'Thêm mới',
        roles: ['admin-tong', 'admin-con']
      },
      {
        path: 'cap-phat', 
        title: 'Cấp phát',
        roles: ['admin-tong', 'admin-con']
      },
      {
        path: 'bao-tri',
        title: 'Bảo trì',
        roles: ['admin-tong', 'ky-thuat']
      },
      {
        path: 'kiem-ke',
        title: 'Kiểm kê',
        roles: ['admin-tong', 'admin-con']
      }
    ]
  }
];

export default taiSanRoutes;