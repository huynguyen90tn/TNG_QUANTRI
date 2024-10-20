import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import HomeBackground from '../components/HomeBackground';
import LoginForm from '../components/auth/LoginForm';

const HomePage = () => {
  return (
    <Box position="relative" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <HomeBackground />
      <Container maxWidth="container.sm" position="relative" zIndex={1}>
        <VStack
          spacing={4}
          p={8}
          bg="white"
          boxShadow="xl"
          borderRadius="md"
          align="stretch"
          opacity={0.9}
        >
          <Heading as="h1" size="xl" textAlign="center" color="black">
            TNG Company Management
          </Heading>
          <Text fontSize="lg" textAlign="center" color="gray.700">
            Kết nối và quản lý hiệu quả
          </Text>
          <LoginForm />
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;