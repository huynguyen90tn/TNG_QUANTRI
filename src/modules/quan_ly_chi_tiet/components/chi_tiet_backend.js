import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text
} from '@chakra-ui/react';

const ChiTietBackend = () => {
  return (
    <Box p={4}>
      <VStack align="start" spacing={4}>
        <Heading size="lg">Chi tiết Backend</Heading>
        <Text>Nội dung chi tiết API</Text>
      </VStack>
    </Box>
  );
};

export default ChiTietBackend;