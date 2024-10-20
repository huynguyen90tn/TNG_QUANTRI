import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box bg="blue.500" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading size="md" color="white">TNG Company Management</Heading>
        {user && (
          <Button colorScheme="whiteAlpha" onClick={handleLogout}>
            Đăng xuất
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Header;