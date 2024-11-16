// File: src/modules/quan_ly_tai_chinh/components/common/loading_overlay.js
// Link tham khảo: https://chakra-ui.com/docs/components/spinner
// Nhánh: main

import React from 'react';
import {
  Flex,
  Spinner,
  Text,
  useColorModeValue,
  Box
} from '@chakra-ui/react';

const LoadingOverlay = ({ message = 'Đang tải...' }) => {
  const bgColor = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');
  
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={bgColor}
      zIndex={9999}
    >
      <Flex
        height="100%"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text mt={4} fontSize="lg">
          {message}
        </Text>
      </Flex>
    </Box>
  );
};

export default LoadingOverlay;
