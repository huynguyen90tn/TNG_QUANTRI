import React from 'react';
import { Box, VStack, Text, Icon } from '@chakra-ui/react';
import { FaHome, FaUsers, FaProjectDiagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AnimatedBox from '../common/AnimatedBox';

const SidebarItem = ({ icon, children, to }) => (
  <Box
    as={Link}
    to={to}
    display="flex"
    alignItems="center"
    p={3}
    borderRadius="md"
    _hover={{ bg: 'gray.700' }}
    w="full"
  >
    <Icon as={icon} mr={3} />
    <Text>{children}</Text>
  </Box>
);

const Sidebar = () => {
  return (
    <AnimatedBox
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      exit={{ x: -250 }}
      transition={{ duration: 0.5 }}
      w="250px"
      h="100vh"
      bg="gray.800"
      color="white"
      p={5}
    >
      <VStack spacing={4} align="stretch">
        <SidebarItem icon={FaHome} to="/dashboard">Tổng quan</SidebarItem>
        <SidebarItem icon={FaUsers} to="/users">Người dùng</SidebarItem>
        <SidebarItem icon={FaProjectDiagram} to="/projects">Dự án</SidebarItem>
      </VStack>
    </AnimatedBox>
  );
};

export default Sidebar;