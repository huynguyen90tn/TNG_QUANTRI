// File: src/pages/dashboard/MemberDashboard.js
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Flex,
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
  useToast,
  Divider,
  VStack,
  SimpleGrid,
  HStack,
} from "@chakra-ui/react";
import {
  FaUserClock,
  FaHistory,
  FaProjectDiagram,
  FaTasks,
  FaChartBar,
  FaCog,
  FaLock,
  FaUsers,
  FaCalendarAlt, // Icon cho nghỉ phép
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import AttendanceForm from "../../components/attendance/AttendanceForm";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const handleOpenAttendance = () => setIsAttendanceOpen(true);
  const handleCloseAttendance = () => setIsAttendanceOpen(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      toast({
        title: "Lỗi đăng xuất",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const FeatureButton = useCallback(({ icon, label, onClick, colorScheme }) => (
    <Button
      leftIcon={<Icon as={icon} />}
      colorScheme={colorScheme}
      onClick={onClick}
      size="lg"
      variant="outline"
      w="full"
      h="16"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-2px)",
        shadow: "md",
      }}
    >
      {label}
    </Button>
  ), []);

  const mainFeatures = [
    {
      icon: FaHistory,
      label: "Lịch sử điểm danh",
      path: "/member/lich-su-diem-danh",
      colorScheme: "blue",
    },
    {
      icon: FaProjectDiagram,
      label: "Quản lý dự án",
      path: "/quan-ly-du-an",
      colorScheme: "green",
    },
    {
      icon: FaTasks,
      label: "Quản lý nhiệm vụ",
      path: "/quan-ly-nhiem-vu",
      colorScheme: "purple",
    },
    {
      icon: FaChartBar,
      label: "Báo cáo",
      path: "/bao-cao-ngay",
      colorScheme: "teal", 
    },
    {
      icon: FaUsers,
      label: "Danh sách thành viên",
      path: "/quan-ly-thanh-vien",
      colorScheme: "cyan",
    },
    {
      icon: FaCalendarAlt,
      label: "Quản lý nghỉ phép",
      path: "/quan-ly-nghi-phep",
      colorScheme: "pink",
    }
  ];

  return (
    <Container maxW="1400px">
      <Box minH="100vh" bg={bgColor} p={8}>
        {/* Header */}
        <Flex 
          justify="space-between" 
          align="center" 
          mb={8}
          flexWrap={{ base: "wrap", md: "nowrap" }}
          gap={4}
        >
          <Box>
            <Heading size="lg">Bảng Điều Khiển Thành Viên</Heading>
            <Text color={textColor} mt={2}>
              Chúc bạn một ngày làm việc hiệu quả!
            </Text>
          </Box>

          <HStack spacing={4}>
            <Button
              leftIcon={<FaUserClock />}
              colorScheme="blue"
              onClick={handleOpenAttendance}
              size={{ base: "md", md: "lg" }}
              shadow="md"
              _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
            >
              Điểm danh
            </Button>

            <Menu>
              <MenuButton>
                <Avatar
                  size="md"
                  name={user?.displayName}
                  src={user?.photoURL}
                  cursor="pointer"
                  border="2px solid"
                  borderColor="blue.500"
                />
              </MenuButton>
              <MenuList shadow="lg">
                <MenuItem 
                  icon={<FaCog />} 
                  onClick={() => navigate("/ho-so")}
                >
                  Thông tin cá nhân
                </MenuItem>
                <Divider />
                <MenuItem 
                  icon={<FaLock />} 
                  onClick={handleSignOut} 
                  color="red.500"
                >
                  Đăng xuất
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        <Divider my={6} />

        {/* Các nút chức năng chính */}
        <VStack spacing={6} align="stretch">
          <Heading size="md">Chức năng chính</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {mainFeatures.map((feature) => (
              <FeatureButton
                key={feature.path}
                icon={feature.icon}
                label={feature.label}
                onClick={() => navigate(feature.path)}
                colorScheme={feature.colorScheme}
              />
            ))}
          </SimpleGrid>
        </VStack>

        {/* Modal Điểm danh */}
        <Modal
          isOpen={isAttendanceOpen}
          onClose={handleCloseAttendance}
          size="xl"
          isCentered
        >
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