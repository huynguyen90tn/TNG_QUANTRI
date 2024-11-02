// src/modules/quan_ly_chi_tiet/components/bao_cao_thong_ke.js
import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardHeader,
  CardBody,
  Badge
} from '@chakra-ui/react';

const BaoCaoThongKe = () => {
  return (
    <Box padding={4}>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardHeader>
            <Heading size="lg">Báo cáo thống kê</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Dự án</Th>
                  <Th>Số task</Th>
                  <Th>Hoàn thành</Th>
                  <Th>Tiến độ</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Dự án A</Td>
                  <Td>50</Td>
                  <Td>35</Td>
                  <Td>
                    <Badge colorScheme="green">70%</Badge>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Dự án B</Td>
                  <Td>30</Td>
                  <Td>25</Td>
                  <Td>
                    <Badge colorScheme="green">83%</Badge>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default BaoCaoThongKe;