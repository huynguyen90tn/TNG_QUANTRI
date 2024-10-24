// src/pages/dashboard/AdminConDashboard.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  VStack,
  SimpleGrid,
  Badge,
  Divider,
  useToast,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaProjectDiagram,
  FaClock,
  FaUserPlus,
  FaListAlt,
  FaTasks,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { getTasksByDepartment } from "../../services/api/taskApi";
import { getUserList } from "../../services/api/userApi";

const AdminConDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const loadDashboardData = useCallback(async () => {
    if (!user?.department) return;

    try {
      const [membersResponse, tasksResponse] = await Promise.all([
        getUserList({ role: "member", department: user.department }),
        getTasksByDepartment(user.department),
      ]);

      const tasks = tasksResponse.data;
      setStats({
        totalMembers: membersResponse.data.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter((task) => task.status === "completed")
          .length,
      });
    } catch (error) {
      toast({
        title: "Lỗi tải dữ liệu",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user?.department, toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

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

  const StatCard = ({ icon, label, value, color }) => (
    <Box
      p={6}
      bg={cardBg}
      rounded="xl"
      shadow="md"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-2px)" }}
    >
      <Flex align="center">
        <Icon as={icon} w={8} h={8} color={color} mr={4} />
        <Box>
          <Text color={textColor}>{label}</Text>
          <Heading size="lg">{value}</Heading>
        </Box>
      </Flex>
    </Box>
  );

  return (
    <Container maxW="1400px">
      <Box minH="100vh" bg={bgColor} p={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg">Bảng Điều Khiển Quản Trị</Heading>
            <Text color={textColor}>
              {user?.department} - Quản lý và theo dõi hoạt động hệ thống
            </Text>
          </Box>

          <Flex gap={4} align="center">
            <Badge colorScheme="purple" p={2} borderRadius="full">
              Admin {user?.department}
            </Badge>
            <Menu>
              <MenuButton>
                <Avatar
                  size="sm"
                  name={user?.displayName}
                  src={user?.photoURL}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate("/ho-so")}>Hồ sơ</MenuItem>
                <MenuItem onClick={() => navigate("/cai-dat")}>
                  Cài đặt
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut} color="red.500">
                  Đăng xuất
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {/* Thống kê */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
          mb={8}
        >
          <StatCard
            icon={FaUsers}
            label="Tổng số thành viên"
            value={stats.totalMembers}
            color="blue.500"
          />
          <StatCard
            icon={FaTasks}
            label="Tổng số nhiệm vụ"
            value={stats.totalTasks}
            color="purple.500"
          />
          <StatCard
            icon={FaProjectDiagram}
            label="Nhiệm vụ hoàn thành"
            value={stats.completedTasks}
            color="green.500"
          />
        </Grid>

        {/* Các nút chức năng */}
        <VStack spacing={4} align="stretch">
          <Heading size="md" mb={4}>
            Chức năng quản lý
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Button
              leftIcon={<FaUserPlus />}
              colorScheme="green"
              onClick={() => navigate("/admin-con/tao-thanh-vien")}
              size="lg"
              variant="outline"
            >
              Tạo tài khoản thành viên
            </Button>

            <Button
              leftIcon={<FaListAlt />}
              colorScheme="blue"
              onClick={() => navigate("/admin-con/diem-danh")}
              size="lg"
              variant="outline"
            >
              Xem điểm danh
            </Button>

            <Button
              leftIcon={<FaProjectDiagram />}
              colorScheme="purple"
              onClick={() => navigate("/quan-ly-du-an")}
              size="lg"
              variant="outline"
            >
              Quản lý dự án
            </Button>

            <Button
              leftIcon={<FaTasks />}
              colorScheme="orange"
              onClick={() => navigate("/quan-ly-nhiem-vu")}
              size="lg"
              variant="outline"
            >
              Quản lý nhiệm vụ
            </Button>
          </SimpleGrid>
        </VStack>
      </Box>
    </Container>
  );
};

export default AdminConDashboard;
