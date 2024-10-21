import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';

const CreateUserForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const { createUser } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(email, password, role);
      toast({
        title: "Tạo tài khoản thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEmail('');
      setPassword('');
      setRole('member');
    } catch (error) {
      toast({
        title: "Lỗi khi tạo tài khoản",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="400px" margin="auto">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Mật khẩu</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Vai trò</FormLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="member">Thành viên</option>
              <option value="admin-con">Admin Con</option>
              <option value="admin-tong">Admin Tổng</option>
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue">Tạo tài khoản</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateUserForm;