 
// File: src/modules/quan_ly_tai_chinh/components/bao_cao/bieu_do_tai_chinh.js
// Link tham khảo: https://recharts.org/en-US/api
// Nhánh: main

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Heading } from '@chakra-ui/react';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { TEN_LOAI_NGUON_THU } from '../../constants/loai_nguon_thu';
import { TEN_LOAI_CHI_TIEU } from '../../constants/loai_chi_tieu';

const BieuDoTaiChinh = () => {
  const { nguonThu, chiTieu } = useTaiChinh();

  const duLieuBieuDo = nguonThu.reduce((acc, item) => {
    const thang = new Date(item.ngayThu).toLocaleDateString('vi-VN', { month: 'long' });
    if (!acc[thang]) {
      acc[thang] = { thang, tongThu: 0, tongChi: 0 };
    }
    acc[thang].tongThu += item.soTien;
    return acc;
  }, {});

  chiTieu.forEach(item => {
    const thang = new Date(item.ngayChi).toLocaleDateString('vi-VN', { month: 'long' });
    if (!duLieuBieuDo[thang]) {
      duLieuBieuDo[thang] = { thang, tongThu: 0, tongChi: 0 };
    }
    duLieuBieuDo[thang].tongChi += item.soTien;
  });

  const duLieuDaXuLy = Object.values(duLieuBieuDo).sort((a, b) => {
    return new Date(a.thang) - new Date(b.thang);
  });

  return (
    <Box p={4} h="400px">
      <Heading size="md" mb={4}>Biểu Đồ Thu Chi Theo Tháng</Heading>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={duLieuDaXuLy}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="thang" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="tongThu" name="Thu nhập" fill="#48BB78" />
          <Bar dataKey="tongChi" name="Chi tiêu" fill="#F56565" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BieuDoTaiChinh;
