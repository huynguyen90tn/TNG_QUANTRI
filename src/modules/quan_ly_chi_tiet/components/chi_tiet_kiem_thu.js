import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Card,
  CardHeader,
  CardBody
} from '@chakra-ui/react';

const ChiTietKiemThu = () => {
  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardHeader>
            <Heading size="lg">Chi tiết kiểm thử</Heading>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={4}>
              <HStack>
                <Text fontWeight="bold">Tính năng:</Text>
                <Text>Login System</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Loại test:</Text>
                <Badge colorScheme="blue">Unit Test</Badge>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Trạng thái:</Text>
                <Badge colorScheme="green">Hoàn thành</Badge>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Người thực hiện:</Text>
                <Text>John Doe</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Kết quả test cases</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Test Case</Th>
                  <Th>Mô tả</Th>
                  <Th>Kết quả</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>TC001</Td>
                  <Td>Đăng nhập thành công</Td>
                  <Td><Badge colorScheme="green">Pass</Badge></Td>
                </Tr>
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default ChiTietKiemThu;