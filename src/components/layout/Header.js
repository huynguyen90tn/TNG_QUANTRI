import React from 'react';
import { Flex, Heading, Button } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Flex as="header" align="center" justify="space-between" wrap="wrap" padding="1.5rem" bg="teal.500" color="white">
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={'-.1rem'}>
          TNG Company Management
        </Heading>
      </Flex>

      <Button onClick={handleLogout} colorScheme="teal" variant="outline">
        Đăng xuất
      </Button>
    </Flex>
  );
};

export default Header;