import React from "react";
import { Box } from "@chakra-ui/react";

const HomeBackground = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bgImage="url('/images/background.jpg')"
      bgSize="cover"
      bgPosition="center"
      filter="blur(5px)"
      zIndex={-1}
    />
  );
};

export default HomeBackground;
