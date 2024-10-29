import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';

const BangKiemThu = () => {
  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tính năng</Th>
            <Th>Loại test</Th>
            <Th>Trạng thái</Th>
            <Th>Người thực hiện</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Login</Td>
            <Td>Unit Test</Td>
            <Td>Đã hoàn thành</Td>
            <Td>John Doe</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default BangKiemThu;