// File: src\pages\dashboard\MemberDashboard.js
import React, { useState } from 'react';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FaUserClock, FaHistory, FaProjectDiagram } from 'react-icons/fa';
import AttendanceForm from '../../components/attendance/AttendanceForm';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  const handleOpenAttendance = () => setIsAttendanceOpen(true);
  const handleCloseAttendance = () => setIsAttendanceOpen(false);

  const thongKe = [
    {
      icon: FaUserClock,
      label: 'Số ngày đi làm trong tháng',
      value: '22/23',
      color: 'blue.500'
    },
    {
      icon: FaProjectDiagram,
      label: 'Dự án đang tham gia',
      value: '4',
      color: 'green.500'
    }
  ];

  return (
    <Container maxW="1400px">
      <Box minH="100vh" bg={bgColor} p={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg">Bảng Điều Khiển Thành Viên</Heading>
            <Text color="gray.500">Chúc bạn một ngày làm việc hiệu quả!</Text>
          </Box>

          <Flex gap={4} align="center">
            <Button
              leftIcon={<FaUserClock />}
              colorScheme="blue"
              onClick={handleOpenAttendance}
            >
              Điểm danh
            </Button>

            <Menu>
              <MenuButton>
                <Avatar size="sm" />
              </MenuButton>
              <MenuList>
                <MenuItem>Thông tin cá nhân</MenuItem>
                <MenuItem color="red.500">Đăng xuất</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {/* Thống kê */}
        <Grid 
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} 
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

        {/* Các nút chức năng */}
        <Flex gap={4}>
          <Button
            leftIcon={<FaHistory />}
            colorScheme="blue"
            onClick={() => navigate('/member/lich-su-diem-danh')}
            size="lg"
          >
            Xem lịch sử điểm danh
          </Button>

          <Button
            leftIcon={<FaProjectDiagram />}
            colorScheme="green"
            onClick={() => navigate('/quan-ly-du-an')}
            size="lg"
          >
            Quản lý dự án
          </Button>
        </Flex>

        {/* Modal Điểm danh */}
        <Modal isOpen={isAttendanceOpen} onClose={handleCloseAttendance} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Điểm Danh</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <AttendanceForm onClose={handleCloseAttendance} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
};

export default MemberDashboard;