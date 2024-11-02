// src/pages/dashboard/AdminTongDashboard.js
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Button,
  HStack,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Container,
  Card,
  CardBody,
  IconButton,
  VStack,
  Badge,
  Divider,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaProjectDiagram,
  FaUserPlus,
  FaCalendarCheck,
  FaTasks,
  FaChartLine,
  FaListAlt,
  FaFileAlt,
  FaUserFriends, // Icon mới cho quản lý thành viên
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { getTasks } from "../../services/api/taskApi";
import { getAllUsers } from "../../services/api/userApi";

const AdminTongDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.600", "gray.200");

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersResponse, tasksResponse] = await Promise.all([
        getAllUsers(),
        getTasks(),
      ]);

      const completedTasks = tasksResponse.data.filter(
        (task) => task.progress === 100,
      ).length;

      setStats({
        totalUsers: usersResponse.data.length,
        totalProjects: usersResponse.data.reduce(
          (acc, user) => acc + (user.projects?.length || 0),
          0,
        ),
        totalTasks: tasksResponse.data.length,
        completedTasks,
      });
    } catch (error) {
      toast({
        title: "Lỗi tải dữ liệu",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

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

  const DashboardCard = ({ title, value, icon, color }) => (
    <Card bg={cardBg} shadow="lg" borderWidth="1px" borderColor={borderColor}>
      <CardBody>
        <VStack align="start" spacing={4}>
          <Flex align="center" width="100%" justify="space-between">
            <IconButton
              aria-label={title}
              icon={icon}
              fontSize="20px"
              color={`${color}.500`}
              variant="ghost"
              isRound
            />
            <Text fontSize="2xl" fontWeight="bold">
              {loading ? <Skeleton height="1.5rem" width="4rem" /> : value}
            </Text>
          </Flex>
          <Text color={textColor} fontSize="sm">
            {title}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );

  const QuickActionButton = ({ icon, label, onClick, colorScheme }) => (
    <Button
      leftIcon={icon}
      onClick={onClick}
      colorScheme={colorScheme}
      size="lg"
      width="full"
      justifyContent="start"
      px={8}
      py={6}
      shadow="md"
      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
      transition="all 0.2s"
    >
      {label}
    </Button>
  );

  return (
    <Container maxW="1600px" p={4}>
      <Box minH="100vh" bg={bgColor}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg">Dashboard Quản Trị</Heading>
            <Text color={textColor}>
              Xin chào, {user?.displayName || "Admin"}
            </Text>
          </Box>

          <HStack spacing={4}>
            <Badge colorScheme="green" p={2} borderRadius="full">
              Admin Tổng
            </Badge>
            <Menu>
              <MenuButton
                as={Avatar}
                cursor="pointer"
                size="sm"
                src={user?.photoURL}
                name={user?.displayName}
              />
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
          </HStack>
        </Flex>

        {/* Thống kê */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <DashboardCard
            title="Tổng thành viên"
            value={stats.totalUsers}
            icon={<FaUsers />}
            color="blue"
          />
          <DashboardCard
            title="Dự án"
            value={stats.totalProjects}
            icon={<FaProjectDiagram />}
            color="green"
          />
          <DashboardCard
            title="Nhiệm vụ"
            value={stats.totalTasks}
            icon={<FaTasks />}
            color="purple"
          />
          <DashboardCard
            title="Hoàn thành"
            value={stats.completedTasks}
            icon={<FaChartLine />}
            color="orange"
          />
        </SimpleGrid>

        {/* Các nút điều hướng nhanh */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 6 }} spacing={6} mb={8}>
          <QuickActionButton
            icon={<FaUserPlus />}
            label="Tạo tài khoản quản trị"
            onClick={() => navigate("/tao-quan-tri")}
            colorScheme="blue"
          />
          <QuickActionButton
            icon={<FaCalendarCheck />}
            label="Quản lý điểm danh"
            onClick={() => navigate("/admin-tong/diem-danh")}
            colorScheme="green"
          />
          <QuickActionButton
            icon={<FaProjectDiagram />}
            label="Quản lý dự án"
            onClick={() => navigate("/quan-ly-du-an")}
            colorScheme="purple"
          />
          <QuickActionButton
            icon={<FaListAlt />}
            label="Quản lý nhiệm vụ"
            onClick={() => navigate("/quan-ly-nhiem-vu")}
            colorScheme="orange"
          />
          <QuickActionButton
            icon={<FaUserFriends />}
            label="Quản lý thành viên"
            onClick={() => navigate("/quan-ly-thanh-vien")}
            colorScheme="cyan"
          />
          <QuickActionButton
            icon={<FaFileAlt />}
            label="Báo cáo"
            onClick={() => navigate("/bao-cao-ngay")}
            colorScheme="teal"
          />
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default AdminTongDashboard;