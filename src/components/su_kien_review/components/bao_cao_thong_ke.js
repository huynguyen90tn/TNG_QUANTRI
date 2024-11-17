// src/components/su_kien_review/components/bao_cao_thong_ke.js
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Text,
  Heading
} from '@chakra-ui/react';

const BaoCaoThongKe = () => {
  const suKiens = useSelector(state => state.suKien.danhSach);

  const thongKe = useMemo(() => {
    return {
      tongSo: suKiens.length,
      daHoanThanh: suKiens.filter(sk => sk.trangThai === 'HOAN_THANH').length,
      dangDienRa: suKiens.filter(sk => sk.trangThai === 'DANG_DIEN_RA').length,
      chuaDienRa: suKiens.filter(sk => sk.trangThai === 'CHUA_DIEN_RA').length,
    };
  }, [suKiens]);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Báo cáo thống kê sự kiện</Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box p={4} bg="blue.100" borderRadius="lg">
            <Text fontWeight="bold">Tổng số sự kiện</Text>
            <Text fontSize="2xl">{thongKe.tongSo}</Text>
          </Box>
          <Box p={4} bg="green.100" borderRadius="lg">
            <Text fontWeight="bold">Đã hoàn thành</Text>
            <Text fontSize="2xl">{thongKe.daHoanThanh}</Text>
          </Box>
          <Box p={4} bg="yellow.100" borderRadius="lg">
            <Text fontWeight="bold">Đang diễn ra</Text>
            <Text fontSize="2xl">{thongKe.dangDienRa}</Text>
          </Box>
          <Box p={4} bg="gray.100" borderRadius="lg">
            <Text fontWeight="bold">Chưa diễn ra</Text>
            <Text fontSize="2xl">{thongKe.chuaDienRa}</Text>
          </Box>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

export default BaoCaoThongKe;