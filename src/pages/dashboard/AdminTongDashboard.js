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
  FaUserFriends,
  FaCalendarAlt,
  FaCheckSquare,
  FaBoxes,
  FaMoneyBillWave,
  FaVideo,
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
        (task) => task.progress === 100
      ).length;

      setStats({
        totalUsers: usersResponse.data.length,
        totalProjects: usersResponse.data.reduce(
          (acc, user) => acc + (user.projects?.length || 0),
          0
        ),
        totalTasks: tasksResponse.data.length,
        completedTasks,
      });
    } catch (error) {
      toast({
        title: "Lỗi tải dữ liệu",
        description: error.message || "Không thể tải dữ liệu dashboard",
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
        description: error.message || "Không thể đăng xuất",
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

  // Danh sách các nút điều hướng nhanh
  const quickActions = [
    {
      icon: <FaUserPlus />,
      label: "Tạo tài khoản quản trị",
      path: "/tao-quan-tri",
      colorScheme: "blue",
    },
    {
      icon: <FaUserPlus />,
      label: "Tạo tài khoản thành viên",
      path: "/admin-tong/tao-thanh-vien",
      colorScheme: "teal",
    },
    {
      icon: <FaCalendarCheck />,
      label: "Quản lý điểm danh",
      path: "/admin-tong/diem-danh",
      colorScheme: "green",
    },
    {
      icon: <FaProjectDiagram />,
      label: "Quản lý dự án",
      path: "/quan-ly-du-an",
      colorScheme: "purple",
    },
    {
      icon: <FaListAlt />,
      label: "Quản lý nhiệm vụ",
      path: "/quan-ly-nhiem-vu",
      colorScheme: "orange",
    },
    {
      icon: <FaUserFriends />,
      label: "Quản lý thành viên",
      path: "/quan-ly-thanh-vien",
      colorScheme: "cyan",
    },
    {
      icon: <FaBoxes />,
      label: "Quản lý tài sản",
      path: "/quan-ly-tai-san",
      colorScheme: "red",
    },
    {
      icon: <FaFileAlt />,
      label: "Báo cáo",
      path: "/bao-cao-ngay",
      colorScheme: "gray",
    },
    {
      icon: <FaCalendarAlt />,
      label: "Quản lý nghỉ phép",
      path: "/quan-ly-nghi-phep",
      colorScheme: "pink",
    },
    {
      icon: <FaCheckSquare />,
      label: "Nhiệm vụ ngày",
      path: "/nhiem-vu-hang-ngay",
      colorScheme: "yellow",
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Quản lý lương",
      path: "/quan-ly-luong",
      colorScheme: "linkedin",
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Quản lý tài chính",
      path: "/quan-ly-thu-chi",
      colorScheme: "green",
    },
    {
      icon: <FaVideo />,
      label: "Review sự kiện",
      path: "/review-su-kien",
      colorScheme: "facebook", 
    }
  ];

  return (
    <Container maxW="1600px" p={4}>
      <Box minH="100vh" bg={bgColor}>
        {/* Tiêu đề */}
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {quickActions.map((action, index) => (
            <QuickActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={() => navigate(action.path)}
              colorScheme={action.colorScheme}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
};

export default AdminTongDashboard;