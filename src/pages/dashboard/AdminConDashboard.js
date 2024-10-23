// File: H:\3 NGHIEN CUU\12 TNG WEB\tng-company-management\src\pages\dashboard\AdminConDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Icon,
  Button,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ButtonGroup,
} from '@chakra-ui/react';
import { FaUsers, FaProjectDiagram, FaClock, FaUserPlus, FaListAlt } from 'react-icons/fa';

const AdminConDashboard = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const thongKe = [
    {
      icon: FaUsers,
      label: 'Tổng số thành viên',
      value: '450',
      color: 'blue.500'
    },
    {
      icon: FaProjectDiagram,
      label: 'Dự án đang thực hiện',
      value: '8',
      color: 'green.500'
    },
    {
      icon: FaClock,
      label: 'Đi làm hôm nay',
      value: '42',
      color: 'purple.500'
    }
  ];

  return (
    <Container maxW="1400px">
      <Box minH="100vh" bg={bgColor} p={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg">Bảng Điều Khiển Quản Trị</Heading>
            <Text color="gray.500">Quản lý và theo dõi hoạt động hệ thống</Text>
          </Box>

          <Menu>
            <MenuButton>
              <Avatar size="sm" />
            </MenuButton>
            <MenuList>
              <MenuItem>Hồ sơ</MenuItem>
              <MenuItem>Cài đặt</MenuItem>
              <MenuItem color="red.500">Đăng xuất</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {/* Thống kê */}
        <Grid 
          templateColumns={{ 
            base: '1fr', 
            md: 'repeat(2, 1fr)', 
            lg: 'repeat(3, 1fr)' 
          }} 
          gap={6} 
          mb={8}
        >
          {thongKe.map((item, index) => (
            <Box 
              key={index}
              p={6} 
              bg={cardBg} 
              rounded="xl" 
              shadow="md"
              transition="transform 0.2s"
              _hover={{ transform: 'translateY(-2px)' }}
            >
              <Flex align="center">
                <Icon as={item.icon} w={8} h={8} color={item.color} mr={4} />
                <Box>
                  <Text color="gray.500">{item.label}</Text>
                  <Heading size="lg">{item.value}</Heading>
                </Box>
              </Flex>
            </Box>
          ))}
        </Grid>

        {/* Các nút chức năng chính */}
        <ButtonGroup spacing={4}>
          <Button
            leftIcon={<FaUserPlus />}
            colorScheme="green"
            onClick={() => navigate('/admin-con/tao-thanh-vien')}
            size="lg"
          >
            Tạo tài khoản thành viên
          </Button>

          <Button
            leftIcon={<FaListAlt />}
            colorScheme="blue"
            onClick={() => navigate('/admin-con/diem-danh')}
            size="lg"
          >
            Xem điểm danh
          </Button>

          <Button
            leftIcon={<FaProjectDiagram />}
            colorScheme="purple"
            onClick={() => navigate('/quan-ly-du-an')}
            size="lg"
          >
            Quản lý dự án
          </Button>
        </ButtonGroup>
      </Box>
    </Container>
  );
};

export default AdminConDashboard;