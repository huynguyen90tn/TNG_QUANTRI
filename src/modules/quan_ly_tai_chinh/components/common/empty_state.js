// File: src/modules/quan_ly_tai_chinh/components/common/empty_state.js
// Link tham khảo: https://chakra-ui.com/docs/components/box
// Nhánh: main

import React from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  message = 'Không có dữ liệu',
  buttonText,
  onAction
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box
      p={8}
      borderRadius="lg"
      bg={bgColor}
      textAlign="center"
    >
      <VStack spacing={4}>
        <Icon as={FiInbox} boxSize={12} color="gray.400" />
        <Text fontSize="lg" color="gray.500">
          {message}
        </Text>
        {buttonText && onAction && (
          <Button
            colorScheme="blue"
            onClick={onAction}
          >
            {buttonText}
          </Button>
        )}
      </VStack>
    </Box>
  );
};

export default EmptyState;