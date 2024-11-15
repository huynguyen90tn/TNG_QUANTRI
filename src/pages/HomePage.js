import React from "react";
import {
  Box,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";

const MotionBox = motion(Box);

const VideoBackground = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex="-1"
      overflow="hidden"
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/assets/videos/videonen.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.400"
        backdropFilter="blur(1px)"
      />
    </Box>
  );
};

const HomePage = () => {
  // Theme values
  const bgGradient = useColorModeValue(
    "linear(to-r, blackAlpha.300, blackAlpha.500)",
    "linear(to-r, blackAlpha.500, blackAlpha.700)"
  );

  return (
    <Box
      as="main"
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      {/* Background Components */}
      <VideoBackground />

      {/* Decorative Elements */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="1px"
        bgGradient="linear(to-r, transparent, blue.400, transparent)"
      />
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        h="1px"
        bgGradient="linear(to-r, transparent, purple.400, transparent)"
      />

      {/* Main Content Container */}
      <Container
        maxW="container.xl"
        h="100vh"
        position="relative"
        zIndex={1}
      >
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          h="full"
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
        >
          {/* Login Form Component */}
          <LoginForm />
        </MotionBox>
      </Container>

      {/* Additional Background Effects */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={bgGradient}
        pointerEvents="none"
      />
    </Box>
  );
};

export default HomePage;