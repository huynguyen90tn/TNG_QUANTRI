import React from "react";
import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Animation cho hiệu ứng ánh sáng
const shimmer = keyframes`
  0% { opacity: 0.3 }
  50% { opacity: 0.5 }
  100% { opacity: 0.3 }
`;

const HomeBackground = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      overflow="hidden"
      zIndex={-1}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <source src="/assets/videos/videonen.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bgGradient="linear(to-r, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4))"
        zIndex={0}
        pointerEvents="none"
      />

      {/* Light Effects */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={1}
        pointerEvents="none"
      >
        {/* Top Light Bar */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="1px"
          bgGradient="linear(to-r, transparent, blue.400, transparent)"
          sx={{ animation: `${shimmer} 3s infinite` }}
        />

        {/* Bottom Light Bar */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="1px"
          bgGradient="linear(to-r, transparent, purple.400, transparent)"
          sx={{ animation: `${shimmer} 3s infinite` }}
        />

        {/* Left Light Bar */}
        <Box
          position="absolute"
          top={0}
          left={0}
          width="1px"
          height="100%"
          bgGradient="linear(to-b, transparent, blue.400, transparent)"
          sx={{ animation: `${shimmer} 3s infinite` }}
        />

        {/* Right Light Bar */}
        <Box
          position="absolute"
          top={0}
          right={0}
          width="1px"
          height="100%"
          bgGradient="linear(to-b, transparent, purple.400, transparent)"
          sx={{ animation: `${shimmer} 3s infinite` }}
        />
      </Box>

      {/* Additional Ambient Light */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bgGradient="radial(circle at 50% 50%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3))"
        zIndex={2}
        pointerEvents="none"
      />
    </Box>
  );
};

export default HomeBackground;