import React, { useState } from 'react';
import { Flex, useToast } from '@chakra-ui/react';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminTongLogin = () => {
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email, password) => {
    setIsLoading(true);
    try {
      const role = await login(email, password);
      if (role !== 'adminTong') {
        throw new Error('Không có quyền truy cập tài khoản Admin Tổng');
      }
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <LoginForm title="Đăng nhập Admin Tổng" onSubmit={handleSubmit} isLoading={isLoading} />
    </Flex>
  );
};

export default AdminTongLogin;