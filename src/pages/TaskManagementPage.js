import React from "react";
import { Box, Container } from "@chakra-ui/react";
import TaskManagement from "../components/tasks/TaskManagement"; 
import { useNavigate, useParams } from "react-router-dom";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";

// Theme config
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "whiteAlpha.900",
      },
    },
  },
  colors: {
    gray: {
      900: "#1a202c",
      800: "#2d3748", 
      700: "#4a5568",
    },
  },
});

const TaskManagementPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  return (
    <ChakraProvider theme={theme}>
      <Container maxW="7xl" py={5}>
        <Box p={4}>
          <TaskManagement projectId={projectId} />
        </Box>
      </Container>
    </ChakraProvider>
  );
};

export default TaskManagementPage;