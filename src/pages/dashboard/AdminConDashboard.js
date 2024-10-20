import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

const AdminConDashboard = () => {
  return (
    <Box maxW="container.xl" mx="auto" mt={8}>
      <Heading mb={6}>Dashboard Admin Con</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Thành viên trong phòng ban</StatLabel>
          <StatNumber>100</StatNumber>
          <StatHelpText>Tăng 2 thành viên so với tháng trước</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Dự án đang quản lý</StatLabel>
          <StatNumber>10</StatNumber>
          <StatHelpText>Tăng 1 dự án so với tháng trước</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Hiệu suất làm việc</StatLabel>
          <StatNumber>85%</StatNumber>
          <StatHelpText>Tăng 5% so với tháng trước</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default AdminConDashboard;