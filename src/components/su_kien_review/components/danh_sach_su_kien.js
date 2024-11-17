// File: src/components/su_kien_review/components/danh_sach_su_kien.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main
import React, { useMemo, memo } from 'react';
import {
  VStack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Spinner,
  Center
} from '@chakra-ui/react';
import { useSuKien } from '../hooks/use_su_kien';
import ItemSuKien from './item_su_kien';

const DanhSachSuKien = memo(() => {
  const { suKiens, searchTerm, trangThai, loading } = useSuKien();

  const filteredSuKiens = useMemo(() => {
    return suKiens.filter(suKien => {
      const matchSearch = suKien.tenSuKien.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTrangThai = trangThai === 'TAT_CA' || suKien.trangThai === trangThai;
      return matchSearch && matchTrangThai;
    });
  }, [suKiens, searchTerm, trangThai]);

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Danh sách sự kiện</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          {filteredSuKiens.length === 0 ? (
            <Text>Không có sự kiện nào</Text>
          ) : (
            filteredSuKiens.map(suKien => (
              <ItemSuKien key={suKien.id} suKien={suKien} />
            ))
          )}
        </VStack>
      </CardBody>
    </Card>
  );
});

DanhSachSuKien.displayName = 'DanhSachSuKien';

export default DanhSachSuKien;