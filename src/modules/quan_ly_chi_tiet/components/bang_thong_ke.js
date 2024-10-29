import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';

const BangThongKe = () => {
  return (
    <Box p={4}>
      <SimpleGrid columns={3} spacing={10}>
        <Stat>
          <StatLabel>Tổng số task</StatLabel>
          <StatNumber>100</StatNumber>
          <StatHelpText>Cập nhật mới nhất</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default BangThongKe;