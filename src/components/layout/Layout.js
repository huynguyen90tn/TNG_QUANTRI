import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";
import { useAuth } from "../../hooks/useAuth";

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <Flex minHeight="100vh" bg="gray.900" flexDirection="column">
      <Header />
      <Box flex={1} as="main" p={4}>
        {user && children}
      </Box>
    </Flex>
  );
};

export default Layout;
