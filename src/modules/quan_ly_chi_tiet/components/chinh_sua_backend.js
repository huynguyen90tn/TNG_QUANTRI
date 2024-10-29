import React from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button
} from '@chakra-ui/react';

const ChinhSuaBackend = () => {
  return (
    <Box p={4}>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>API Endpoint</FormLabel>
          <Input placeholder="/api/example" />
        </FormControl>
        <Button colorScheme="blue">Cập nhật</Button>
      </VStack>
    </Box>
  );
};

export default ChinhSuaBackend;