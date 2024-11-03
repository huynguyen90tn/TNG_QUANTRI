// File: src/components/routing/LoadingSpinner.js
import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

export const LoadingSpinner = () => (
  <Center h="100vh">
    <Spinner 
      size="xl"
      thickness="4px"
      speed="0.65s"
      color="blue.500"
    />
  </Center>
);