import React from 'react';
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';

const ChiTietThongKe = () => {
  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Card>
          <CardHeader>
            <Heading size="lg">Chi tiết thống kê</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Stat>
                <StatLabel>Tổng số task</StatLabel>
                <StatNumber>100</StatNumber>
                <StatHelpText>Tăng 20% so với tháng trước</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Task hoàn thành</StatLabel>
                <StatNumber>75</StatNumber>
                <StatHelpText>75% tổng số task</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Task đang thực hiện</StatLabel>
                <StatNumber>25</StatNumber>
                <StatHelpText>25% tổng số task</StatHelpText>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default ChiTietThongKe;