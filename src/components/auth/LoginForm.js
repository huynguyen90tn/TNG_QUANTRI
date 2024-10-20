import React, { useState } from 'react';
import { VStack, Input, Button, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'master-admin') {
        navigate('/admin-tong');
      } else if (user.role === 'admin') {
        navigate('/admin-con');
      } else {
        navigate('/member');
      }
    } catch (error) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel color="gray.700">Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            bg="white"
            color="black"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel color="gray.700">Mật khẩu</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="white"
            color="black"
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          Đăng nhập
        </Button>
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </form>
  );
};

export default LoginForm;