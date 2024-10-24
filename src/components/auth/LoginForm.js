import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", email);
      const user = await login(email, password);
      console.log("Login successful. User role:", user.role);

      if (user.role === "admin-tong") {
        console.log("Navigating to /admin-tong");
        navigate("/admin-tong");
      } else if (user.role === "admin-con") {
        console.log("Navigating to /admin-con");
        navigate("/admin-con");
      } else {
        console.log("Navigating to /member");
        navigate("/member");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Đăng nhập thất bại",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minHeight="100vh"
      width="full"
      align="center"
      justifyContent="center"
      backgroundImage={`url('/background.jpg')`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <MotionBox
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg={useColorModeValue("white", "gray.800")}
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        width={{ base: "90%", md: "400px" }}
      >
        <VStack spacing={4} align="flex-start" w="full">
          <Image
            src="/images/LOGOTNG.png"
            alt="TNG Logo"
            width="100px"
            mx="auto"
          />
          <Heading size="xl" textAlign="center" w="full">
            TNG Company Management
          </Heading>
          <Text fontSize="md" color="gray.500" textAlign="center" w="full">
            Kết nối an toàn, quản lý hiệu quả
          </Text>
          <form onSubmit={handleLogin} style={{ width: "100%" }}>
            <VStack spacing={4} w="full">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaUser} color="gray.300" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaLock} color="gray.300" />
                </InputLeftElement>
                <Input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                mt={4}
                _hover={{ bg: "blue.500" }}
                _active={{ bg: "blue.600" }}
              >
                Đăng nhập
              </Button>
            </VStack>
          </form>
        </VStack>
      </MotionBox>
    </Flex>
  );
};

export default LoginForm;
