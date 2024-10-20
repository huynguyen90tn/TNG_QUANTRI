import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';

const MemberDashboard = () => {
  return (
    <Box maxW="container.xl" mx="auto" mt={8}>
      <Heading mb={6}>Dashboard Thành Viên</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Dự án đang tham gia</StatLabel>
          <StatNumber>3</StatNumber>
          <StatHelpText>1 dự án mới trong tháng này</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Nhiệm vụ hoàn thành</StatLabel>
          <StatNumber>25</StatNumber>
          <StatHelpText>Tăng 5 nhiệm vụ so với tháng trước</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Điểm thưởng</StatLabel>
          <StatNumber>150</StatNumber>
          <StatHelpText>Tăng 30 điểm so với tháng trước</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default MemberDashboard;