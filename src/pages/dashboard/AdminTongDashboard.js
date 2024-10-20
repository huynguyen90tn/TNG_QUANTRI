import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import AnimatedBox from '../../components/common/AnimatedBox';

const DashboardStat = ({ label, number, helpText }) => (
  <Stat>
    <StatLabel>{label}</StatLabel>
    <StatNumber>{number}</StatNumber>
    <StatHelpText>{helpText}</StatHelpText>
  </Stat>
);

const AdminTongDashboard = () => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box flex={1}>
        <Header />
        <AnimatedBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          p={8}
        >
          <Heading mb={6}>Tổng quan Admin Tổng</Heading>
          <SimpleGrid columns={3} spacing={10}>
            <DashboardStat label="Tổng số dự án" number="42" helpText="Tăng 10% so với tháng trước" />
            <DashboardStat label="Nhân viên hoạt động" number="156" helpText="Tăng 5% so với tháng trước" />
            <DashboardStat label="Doanh thu" number="1.2M" helpText="Tăng 15% so với tháng trước" />
          </SimpleGrid>
        </AnimatedBox>
      </Box>
    </Box>
  );
};

export default AdminTongDashboard;