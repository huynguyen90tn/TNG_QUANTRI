import React from 'react';
import { Box, VStack, Link, Icon, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaHome, FaUsers, FaProjectDiagram, FaCog } from 'react-icons/fa';

const MenuItem = ({ icon, children, to }) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      w="full"
      p={3}
      borderRadius="md"
      _hover={{ bg: 'gray.700' }}
      display="flex"
      alignItems="center"
    >
      <Icon as={icon} boxSize={5} color="blue.400" mr={3} />
      <Text color="white">{children}</Text>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <Box w="240px" bg="gray.800" p={4} color="white">
      <VStack spacing={4} align="stretch">
        <MenuItem icon={FaHome} to="/dashboard">Dashboard</MenuItem>
        <MenuItem icon={FaUsers} to="/members">Quản lý thành viên</MenuItem>
        <MenuItem icon={FaProjectDiagram} to="/projects">Quản lý dự án</MenuItem>
        <MenuItem icon={FaCog} to="/settings">Cài đặt</MenuItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;