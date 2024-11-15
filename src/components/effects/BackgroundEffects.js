import React from "react";
import { Box, keyframes } from "@chakra-ui/react";

const float = keyframes`
  0% { transform: translateY(0px) }
  50% { transform: translateY(-20px) }
  100% { transform: translateY(0px) }
`;

const glow = keyframes`
  0% { opacity: 0.5 }
  50% { opacity: 1 }
  100% { opacity: 0.5 }
`;

const BackgroundEffects = () => {
  return (
    <Box position="absolute" inset={0} pointerEvents="none">
      {/* Floating Lights */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          width="100px"
          height="100px"
          borderRadius="full"
          bg="whiteAlpha.100"
          filter="blur(40px)"
          animation={`${float} ${3 + i}s infinite`}
          top={`${20 + i * 15}%`}
          left={`${10 + i * 20}%`}
        />
      ))}

      {/* Glowing Lines */}
      <Box
        position="absolute"
        top="20%"
        left="0"
        right="0"
        height="1px"
        bgGradient="linear(to-r, transparent, blue.400, transparent)"
        animation={`${glow} 3s infinite`}
      />
      <Box
        position="absolute"
        bottom="20%"
        left="0"
        right="0"
        height="1px"
        bgGradient="linear(to-r, transparent, purple.400, transparent)"
        animation={`${glow} 3s infinite`}
      />

      {/* Vertical Lines */}
      <Box
        position="absolute"
        top="0"
        bottom="0"
        left="30%"
        width="1px"
        bgGradient="linear(to-b, transparent, blue.400, transparent)"
        animation={`${glow} 4s infinite`}
      />
      <Box
        position="absolute"
        top="0"
        bottom="0"
        right="30%"
        width="1px"
        bgGradient="linear(to-b, transparent, purple.400, transparent)"
        animation={`${glow} 4s infinite`}
      />

      {/* Radial Gradient Overlay */}
      <Box
        position="absolute"
        inset={0}
        bg="radial-gradient(circle at center, transparent 0%, blackAlpha.300 100%)"
      />
    </Box>
  );
};

export default BackgroundEffects;