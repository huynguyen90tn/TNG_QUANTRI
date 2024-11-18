// File: src/components/su_kien_review/pages/trang_su_kien.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useEffect, useState } from 'react';
import {
  Container,
  VStack,
  Box,
  Text,
  Image,
  useColorModeValue,
  ScaleFade,
  SlideFade
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { keyframes, css } from '@emotion/react';
import styled from '@emotion/styled';
import DanhSachSuKien from '../components/danh_sach_su_kien';
import FormSuKien from '../components/form_su_kien';

const floatAnimation = keyframes`
  0% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
  100% { transform: translateY(0px) scale(1); }
`;

const glowAnimation = keyframes`
  0% { filter: drop-shadow(0 0 15px rgba(66, 153, 225, 0.6)); }
  50% { filter: drop-shadow(0 0 30px rgba(66, 153, 225, 0.8)); }
  100% { filter: drop-shadow(0 0 15px rgba(66, 153, 225, 0.6)); }
`;

const particleAnimation = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(100px, -100px) rotate(360deg); opacity: 0; }
`;

const AnimatedImage = styled(Image)`
  animation: ${floatAnimation} 2s ease-in-out infinite, ${glowAnimation} 2s ease-in-out infinite;
`;

const Particle = ({ delay }) => (
  <Box
    position="absolute"
    width="10px"
    height="10px"
    borderRadius="50%"
    bgGradient="linear(to-r, blue.400, purple.500)"
    animation={`${particleAnimation} 3s ease-in-out infinite`}
    animationDelay={`${delay}s`}
    opacity={0}
  />
);

const WelcomeScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 2000);
    const timer2 = setTimeout(() => setStage(2), 4000);
    const timer3 = setTimeout(() => onComplete(), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="gray.900"
      zIndex={9999}
    >
      <ScaleFade in={stage >= 0} initialScale={0.1}>
        <AnimatedImage
          src="/images/9vWF3VqU_400x400.png"
          alt="Ton Media"
          width={stage === 0 ? "400px" : "200px"}
          transition="all 1s ease-in-out"
        />
      </ScaleFade>

      <SlideFade in={stage >= 1} offsetY={50}>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
          textAlign="center"
          mt={8}
        >
          Chào mừng bạn đến với
        </Text>
      </SlideFade>

      <SlideFade in={stage >= 2} offsetY={50}>
        <Text
          fontSize="5xl"
          fontWeight="bold"
          bgGradient="linear(to-r, blue.400, purple.500)"
          bgClip="text"
          textAlign="center"
        >
          Ton Media
        </Text>
      </SlideFade>

      {[...Array(10)].map((_, i) => (
        <Particle key={i} delay={i * 0.2} />
      ))}
    </Box>
  );
};

const EnhancedContainer = motion(Container);

const LogoHeader = () => (
  <Box
    position="relative"
    width="100%"
    display="flex"
    justifyContent="center"
    alignItems="center"
    mb={8}
    className="logo-container"
    css={css`
      &:before {
        content: '';
        position: absolute;
        inset: -20px;
        background: radial-gradient(circle at center, 
          rgba(66, 153, 225, 0.2) 0%,
          rgba(66, 153, 225, 0) 70%);
        animation: pulse 2s ease-in-out infinite;
      }
      @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.5; }
        50% { transform: scale(1.05); opacity: 0.8; }
        100% { transform: scale(0.95); opacity: 0.5; }
      }
    `}
  >
    <AnimatedImage
      src="/images/9vWF3VqU_400x400.png"
      alt="Ton Media Logo"
      width="200px"
      height="200px"
      objectFit="contain"
      filter="drop-shadow(0 0 10px rgba(66, 153, 225, 0.5))"
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: 'scale(1.1)',
        filter: 'drop-shadow(0 0 20px rgba(66, 153, 225, 0.8))'
      }}
      css={css`
        animation: ${floatAnimation} 3s ease-in-out infinite,
                   ${glowAnimation} 2s ease-in-out infinite;
      `}
    />
    
    {[...Array(8)].map((_, i) => (
      <Box
        key={i}
        position="absolute"
        width="2px"
        height="40px"
        bg="blue.400"
        transform={`rotate(${i * 45}deg)`}
        transformOrigin="center 120px"
        opacity={0.6}
        css={css`
          animation: ray-shine 1.5s ease-in-out infinite;
          animation-delay: ${i * 0.2}s;
          @keyframes ray-shine {
            0% { transform: rotate(${i * 45}deg) scale(0.5); opacity: 0.2; }
            50% { transform: rotate(${i * 45}deg) scale(1); opacity: 0.6; }
            100% { transform: rotate(${i * 45}deg) scale(0.5); opacity: 0.2; }
          }
        `}
      />
    ))}
  </Box>
);

const TrangSuKien = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  
  return (
    <>
      {showWelcome && <WelcomeScreen onComplete={() => setShowWelcome(false)} />}
      
      <EnhancedContainer
        maxW="container.xl"
        py={8}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 6 }}
        bg={bgColor}
        minH="100vh"
      >
        <VStack spacing={8}>
          <Box width="100%">
            <ScaleFade in={!showWelcome} initialScale={0.9}>
              <LogoHeader />
            </ScaleFade>

            <VStack spacing={8}>              
              <Box width="100%">
                <SlideFade in={!showWelcome} offsetY={20} delay={0.2}>
                  <FormSuKien />
                </SlideFade>
              </Box>
              
              <Box width="100%">
                <SlideFade in={!showWelcome} offsetY={20} delay={0.4}>
                  <DanhSachSuKien />
                </SlideFade>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </EnhancedContainer>
    </>
  );
};

export default TrangSuKien;