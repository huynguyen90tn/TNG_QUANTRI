// File: src/modules/quan_ly_luong/middleware/salary.js

import { createListenerMiddleware } from '@reduxjs/toolkit';
import { layDanhSachLuong } from '../store/luong_slice';

export const salaryMiddleware = createListenerMiddleware();

// Sync lại data sau khi tạo/cập nhật
salaryMiddleware.startListening({
  actionCreator: layDanhSachLuong.fulfilled,
  effect: async (action, listenerApi) => {
    // Refresh danh sách
    await listenerApi.dispatch(layDanhSachLuong());
  }
});

export default salaryMiddleware;