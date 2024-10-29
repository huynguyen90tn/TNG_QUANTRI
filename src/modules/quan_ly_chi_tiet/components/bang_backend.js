import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast
} from '@chakra-ui/react';

const BangBackend = () => {
  const toast = useToast();

  return (
    <Box p={4}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>API Endpoint</Th>
            <Th>Phương thức</Th>
            <Th>Mô tả</Th>
            <Th>Trạng thái</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>/api/users</Td>
            <Td>GET</Td>
            <Td>Lấy danh sách người dùng</Td>
            <Td>Hoạt động</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default BangBackend;