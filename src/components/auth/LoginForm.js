import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LoginForm = ({ title, onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const formBackground = useColorModeValue('gray.100', 'gray.700');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      w="full"
      maxW="md"
      p={8}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
      bg={formBackground}
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="flex-start" w="full">
          <Heading>{title}</Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Mật khẩu</FormLabel>
            <Input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
            loadingText="Đang đăng nhập..."
          >
            Đăng nhập
          </Button>
          <Text fontSize="sm">
            Quên mật khẩu? <Button variant="link">Nhấn vào đây</Button>
          </Text>
        </VStack>
      </form>
    </MotionBox>
  );
};

export default LoginForm;