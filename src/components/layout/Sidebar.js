import React from 'react';
import { Box, VStack, Text, Flex, Icon, Link, Drawer, DrawerContent, useDisclosure, useColorModeValue } from '@chakra-ui/react';
import { FiHome, FiUsers, FiFolder, FiSettings, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Đã điều chỉnh đường dẫn

const MenuItem = ({ icon, children, to, isActive }) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'blue.400' : 'transparent'}
        color={isActive ? 'white' : 'gray.400'}
        _hover={{
          bg: 'blue.400',
          color: 'white',
        }}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

const SidebarContent = ({ onClose, ...rest }) => {
  const location = useLocation();
  return (
    <Box
      bg={useColorModeValue('gray.900', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.700', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="blue.400">
          Logo
        </Text>
      </Flex>
      <VStack spacing={0} align="stretch">
        <Box bg="blue.500" p={4}>
          <Text color="white" fontWeight="bold" fontSize="lg">Admin Tổng</Text>
        </Box>
        <MenuItem icon={FiHome} to="/admin-tong" isActive={location.pathname === '/admin-tong'}>
          Dashboard
        </MenuItem>
        <MenuItem icon={FiUsers} to="/quan-ly-thanh-vien" isActive={location.pathname === '/quan-ly-thanh-vien'}>
          Quản lý thành viên
        </MenuItem>
        <MenuItem icon={FiFolder} to="/quan-ly-du-an" isActive={location.pathname === '/quan-ly-du-an'}>
          Quản lý dự án
        </MenuItem>
        <MenuItem icon={FiSettings} to="/cai-dat" isActive={location.pathname === '/cai-dat'}>
          Cài đặt
        </MenuItem>
        <Box flex={1} />
        <MenuItem icon={FiLogOut} to="/logout">
          Đăng xuất
        </MenuItem>
      </VStack>
    </Box>
  );
};

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  // Chỉ hiển thị sidebar nếu người dùng là admin tổng
  if (!user || user.role !== 'admin-tong') {
    return null;
  }

  return (
    <Box>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Sidebar;