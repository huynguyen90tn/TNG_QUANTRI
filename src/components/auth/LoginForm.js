import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  VStack,
  Input,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
  Image,
  useToast,
  Container,
  FormControl,
  FormErrorMessage,
  ScaleFade,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Custom animations
const shimmer = keyframes`
  0% { opacity: 0.3; transform: translateX(-100%) }
  100% { opacity: 0.7; transform: translateX(100%) }
`;

const glow = keyframes`
  0%, 100% { opacity: 0.5; filter: drop-shadow(0 0 20px rgba(66, 153, 225, 0.5)) }
  50% { opacity: 1; filter: drop-shadow(0 0 30px rgba(66, 153, 225, 0.8)) }
`;

const MotionBox = motion(Box);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Mouse follow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email là bắt buộc";
    if (!password) newErrors.password = "Mật khẩu là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = await login(email, password);
      
      toast({
        title: "Đăng nhập thành công!",
        description: "Đang chuyển hướng...",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });

      setTimeout(() => {
        if (user.role === "admin-tong") {
          navigate("/admin-tong");
        } else if (user.role === "admin-con") {
          navigate("/admin-con");
        } else {
          navigate("/member");
        }
      }, 1000);

    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Vui lòng kiểm tra lại thông tin đăng nhập",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formBackground = useColorModeValue("rgba(255, 255, 255, 0.05)", "rgba(26, 32, 44, 0.05)");
  const inputBg = useColorModeValue("rgba(255, 255, 255, 0.08)", "rgba(45, 55, 72, 0.3)");
  const borderColor = useColorModeValue("whiteAlpha.300", "whiteAlpha.200");

  return (
    <Container maxW="container.xl" h="100vh" position="relative" zIndex={10}>
      <Flex h="full" align="center" justify="flex-end">
        <ScaleFade in={true} initialScale={0.9}>
          <MotionBox
            ref={containerRef}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            bg={formBackground}
            p={8}
            borderRadius="xl"
            boxShadow="dark-lg"
            w={{ base: "90vw", md: "450px" }}
            backdropFilter="blur(20px)"
            borderWidth="1px"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: "absolute",
              top: "0",
              left: "-100%",
              width: "200%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              animation: `${shimmer} 3s infinite linear`,
            }}
          >
            {/* Interactive light effect */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              pointerEvents="none"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(66, 153, 225, 0.15) 0%, transparent 60%)`
              }}
              transition="background 0.2s"
            />

            <VStack spacing={6} align="stretch" position="relative">
              {/* Logo & Title */}
              <VStack spacing={4}>
                <Image
                  src="/images/LOGOTNG.png"
                  alt="TNG Logo"
                  w="120px"
                  mx="auto"
                  dropShadow="lg"
                  sx={{
                    animation: `${glow} 3s infinite ease-in-out`,
                    filter: "drop-shadow(0 0 10px rgba(66, 153, 225, 0.3))"
                  }}
                />
                <Heading
                  size="lg"
                  textAlign="center"
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  bgClip="text"
                  filter="drop-shadow(0 0 10px rgba(66, 153, 225, 0.3))"
                >
                  TNG Company Management
                </Heading>
                <Text
                  fontSize="md"
                  color="whiteAlpha.900"
                  textAlign="center"
                >
                  Kết nối an toàn, quản lý hiệu quả
                </Text>
              </VStack>

              {/* Login Form */}
              <form onSubmit={handleLogin}>
                <VStack spacing={4}>
                  <FormControl isInvalid={errors.email}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaUser} color="blue.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        bg={inputBg}
                        borderColor={borderColor}
                        color="white"
                        _hover={{ borderColor: "blue.400" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                        }}
                        _placeholder={{ color: "whiteAlpha.600" }}
                        transition="all 0.2s"
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.password}>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FaLock} color="blue.400" />
                      </InputLeftElement>
                      <Input
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        bg={inputBg}
                        borderColor={borderColor}
                        color="white"
                        _hover={{ borderColor: "blue.400" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                        }}
                        _placeholder={{ color: "whiteAlpha.600" }}
                        transition="all 0.2s"
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    w="full"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="Đang đăng nhập..."
                    bgGradient="linear(to-r, blue.400, purple.500)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(to-r, blue.500, purple.600)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 20px -10px rgba(66, 153, 225, 0.5)",
                    }}
                    _active={{
                      bgGradient: "linear(to-r, blue.600, purple.700)",
                      transform: "translateY(0)",
                    }}
                    transition="all 0.2s"
                  >
                    Đăng nhập
                  </Button>
                </VStack>
              </form>
            </VStack>
          </MotionBox>
        </ScaleFade>
      </Flex>
    </Container>
  );
};

export default LoginForm;