import React from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminTongLogin = () => {
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (email, password) => {
    try {
      await login(email, password, 'adminTong');
      toast({
        title: "Đăng nhập thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/admin-tong/dashboard');
    } catch (error) {
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
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <LoginForm title="Đăng nhập Admin Tổng" onSubmit={handleSubmit} />
    </Flex>
  );
};

export default AdminTongLogin;