import React from 'react';
import { Box, Flex, Heading, Button, useColorMode } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import AnimatedBox from '../common/AnimatedBox';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();

  return (
    <AnimatedBox
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      transition={{ duration: 0.5 }}
      as="header"
      bg="gray.800"
      color="white"
      p={4}
    >
      <Flex justify="space-between" align="center">
        <Heading size="lg">TNG Company</Heading>
        <Flex>
          <Button onClick={toggleColorMode} mr={4}>
            {colorMode === 'light' ? <FaMoon /> : <FaSun />}
          </Button>
          <Button onClick={() => dispatch(logout())}>Đăng xuất</Button>
        </Flex>
      </Flex>
    </AnimatedBox>
  );
};

export default Header;