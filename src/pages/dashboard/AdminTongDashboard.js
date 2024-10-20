import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Icon } from '@chakra-ui/react';
import { FaUsers, FaProjectDiagram, FaMoneyBillWave } from 'react-icons/fa';

const AdminTongDashboard = () => {
  return (
    <Box maxW="container.xl" mx="auto" mt={8}>
      <Heading mb={6} color="white">Dashboard Admin Tổng</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat
          p={4}
          bg="gray.800"
          borderRadius="lg"
          boxShadow="md"
          border="1px"
          borderColor="gray.700"
        >
          <StatLabel color="gray.400">Tổng số thành viên</StatLabel>
          <StatNumber color="white" fontSize="3xl">
            <Icon as={FaUsers} color="blue.400" mr={2} />
            1,000
          </StatNumber>
          <StatHelpText color="green.400">Tăng 5% so với tháng trước</StatHelpText>
        </Stat>
        <Stat
          p={4}
          bg="gray.800"
          borderRadius="lg"
          boxShadow="md"
          border="1px"
          borderColor="gray.700"
        >
          <StatLabel color="gray.400">Dự án đang hoạt động</StatLabel>
          <StatNumber color="white" fontSize="3xl">
            <Icon as={FaProjectDiagram} color="purple.400" mr={2} />
            50
          </StatNumber>
          <StatHelpText color="green.400">Tăng 2 dự án so với tháng trước</StatHelpText>
        </Stat>
        <Stat
          p={4}
          bg="gray.800"
          borderRadius="lg"
          boxShadow="md"
          border="1px"
          borderColor="gray.700"
        >
          <StatLabel color="gray.400">Doanh thu tháng này</StatLabel>
          <StatNumber color="white" fontSize="3xl">
            <Icon as={FaMoneyBillWave} color="green.400" mr={2} />
            $500,000
          </StatNumber>
          <StatHelpText color="green.400">Tăng 10% so với tháng trước</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default AdminTongDashboard;