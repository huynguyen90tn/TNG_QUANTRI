// src/components/su_kien_review/components/chi_tiet_su_kien.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Link,
  VStack,
} from '@chakra-ui/react';

const ChiTietSuKien = () => {
  const { id } = useParams();
  const [suKien, setSuKien] = useState(null);
  const danhSachSuKien = useSelector(state => state.suKien.danhSach);

  useEffect(() => {
    const suKienHienTai = danhSachSuKien.find(sk => sk.id === id);
    if (suKienHienTai) {
      setSuKien(suKienHienTai);
    }
  }, [id, danhSachSuKien]);

  if (!suKien) {
    return (
      <Box p={4}>
        <Text>Không tìm thấy sự kiện</Text>
      </Box>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Chi tiết sự kiện: {suKien.tenSuKien}</Heading>
      </CardHeader>
      <CardBody>
        <VStack align="start" spacing={4}>
          <Text><strong>Ngày tổ chức:</strong> {suKien.ngayToChuc}</Text>
          {suKien.linkQuayPhim && (
            <Box>
              <strong>Link quay phim: </strong>
              <Link href={suKien.linkQuayPhim} isExternal color="blue.500">
                {suKien.linkQuayPhim}
              </Link>
            </Box>
          )}
          {suKien.linkKichBan && (
            <Box>
              <strong>Link kịch bản: </strong>
              <Link href={suKien.linkKichBan} isExternal color="blue.500">
                {suKien.linkKichBan}
              </Link>
            </Box>
          )}
          {suKien.ghiChu && (
            <Text><strong>Ghi chú:</strong> {suKien.ghiChu}</Text>
          )}
          <Text><strong>Trạng thái:</strong> {suKien.trangThai}</Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ChiTietSuKien;
