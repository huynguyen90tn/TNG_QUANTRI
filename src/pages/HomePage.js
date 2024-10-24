import React from "react";
import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
import HomeBackground from "../components/HomeBackground";
import LoginForm from "../components/auth/LoginForm";

const HomePage = () => {
  return (
    <Box
      position="relative"
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <HomeBackground />
      <Container maxWidth="container.sm" position="relative" zIndex={1}>
        <VStack
          spacing={4}
          p={8}
          bg="white"
          boxShadow="xl"
          borderRadius="md"
          align="stretch"
          opacity={0.8}
        >
          <Heading as="h1" size="xl" textAlign="center" color="blue.500">
            TNG Company
          </Heading>
          <Text fontSize="lg" textAlign="center" color="gray.700">
            Công ty Công nghệ, truyền thông và trí tuệ nhân tạo
          </Text>
          <LoginForm />
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;
