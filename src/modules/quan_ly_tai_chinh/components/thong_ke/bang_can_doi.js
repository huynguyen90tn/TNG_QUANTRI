 
// File: src/modules/quan_ly_tai_chinh/components/bao_cao/bang_can_doi.js
// Link tham khảo: https://chakra-ui.com/docs/components/table
// Nhánh: main

import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Heading,
  Flex,
  Badge
} from '@chakra-ui/react';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { dinhDangTien } from '../../utils/dinh_dang_tien';

const BangCanDoi = () => {
  const { nguonThu, chiTieu, tonKho } = useTaiChinh();

  const tongThu = nguonThu.reduce((sum, item) => sum + item.soTien, 0);
  const tongChi = chiTieu.reduce((sum, item) => sum + item.soTien, 0);
  const canDoi = tongThu - tongChi;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Bảng Cân Đối Tài Chính</Heading>
      
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Hạng Mục</Th>
            <Th isNumeric>Số Tiền (VNĐ)</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Tổng thu</Td>
            <Td isNumeric color="green.500">{dinhDangTien(tongThu)}</Td>
          </Tr>
          <Tr>
            <Td>Tổng chi</Td>
            <Td isNumeric color="red.500">{dinhDangTien(tongChi)}</Td>
          </Tr>
          <Tr fontWeight="bold">
            <Td>Cân đối</Td>
            <Td isNumeric color={canDoi >= 0 ? 'green.500' : 'red.500'}>
              {dinhDangTien(canDoi)}
            </Td>
          </Tr>
          <Tr>
            <Td>Tồn kho</Td>
            <Td isNumeric>{dinhDangTien(tonKho)}</Td>
          </Tr>
        </Tbody>
      </Table>
      
      <Flex mt={4} justifyContent="flex-end">
        <Badge 
          colorScheme={canDoi >= 0 ? 'green' : 'red'}
          p={2}
          borderRadius="md"
        >
          <Text>
            {canDoi >= 0 ? 'Dương' : 'Âm'}: {dinhDangTien(Math.abs(canDoi))}
          </Text>
        </Badge>
      </Flex>
    </Box>
  );
};

export default BangCanDoi;
