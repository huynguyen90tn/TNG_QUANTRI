// File: src/pages/dashboard/AdminConDashboard.js
// Link tham khảo: https://firebase.google.com/docs/auth/web/manage-users
// Link tham khảo: https://firebase.google.com/docs/firestore/query-data/get-data

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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Wrap,
  WrapItem,
  Stack,
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
  FaBell,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { getTasks } from "../../services/api/taskApi";
import { getAllUsers } from "../../services/api/userApi";

const AdminConDashboard = () => {
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

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const shadowColor = useColorModeValue(
    "rgba(0, 0, 0, 0.1)",
    "rgba(255, 255, 255, 0.1)"
  );

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

  const StatCard = ({ title, value, icon, change, color }) => (
    <Card
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      shadow="lg"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
    >
      <CardBody>
        <Stat>
          <Flex justify="space-between" align="center" mb={4}>
            <Box>
              <StatLabel fontSize="sm" color={secondaryTextColor}>
                {title}
              </StatLabel>
              <StatNumber fontSize="2xl" fontWeight="bold" color={textColor}>
                {loading ? <Skeleton height="1.5rem" width="4rem" /> : value}
              </StatNumber>
            </Box>
            <IconButton
              aria-label={title}
              icon={icon}
              fontSize="24px"
              color={`${color}.400`}
              variant="ghost"
              isRound
              size="lg"
            />
          </Flex>
          <StatHelpText mb={0}>
            <StatArrow type={change > 0 ? "increase" : "decrease"} />
            {Math.abs(change)}% so với tháng trước
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );

  const ActionButton = ({ icon, label, onClick, colorScheme }) => (
    <Button
      leftIcon={icon}
      onClick={onClick}
      colorScheme={colorScheme}
      size="lg"
      width="full"
      rounded="xl"
      shadow="md"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      px={6}
      py={7}
      _hover={{
        transform: "translateY(-2px)",
        shadow: "lg",
        bg: `${colorScheme}.500`,
      }}
      transition="all 0.2s"
      fontSize="md"
      fontWeight="semibold"
    >
      {label}
    </Button>
  );

  const quickActions = [
    {
      icon: <FaCalendarCheck />,
      label: "Quản lý điểm danh",
      path: "/admin-con/diem-danh",
      colorScheme: "blue",
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
      colorScheme: "green",
    },
    {
      icon: <FaUserFriends />,
      label: "Quản lý thành viên",
      path: "/quan-ly-thanh-vien",
      colorScheme: "orange",
    },
    {
      icon: <FaFileAlt />,
      label: "Báo cáo",
      path: "/bao-cao-ngay",
      colorScheme: "teal",
    },
    {
      icon: <FaCalendarAlt />,
      label: "Quản lý nghỉ phép",
      path: "/quan-ly-nghi-phep",
      colorScheme: "pink",
    },
    {
      icon: <FaUserPlus />,
      label: "Tạo tài khoản thành viên",
      path: "/admin-con/tao-thanh-vien",
      colorScheme: "cyan",
    },
  ];

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box
        bg={cardBg}
        boxShadow={`0 2px 4px ${shadowColor}`}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Container maxW="1600px" py={4}>
          <Flex justify="space-between" align="center">
            <Stack spacing={1}>
              <Heading size="lg" color={textColor}>
                Bảng điều khiển
              </Heading>
              <Text color={secondaryTextColor}>
                Xin chào, {user?.displayName || "Admin"}
              </Text>
            </Stack>

            <HStack spacing={4}>
              <IconButton
                aria-label="Thông báo"
                icon={<FaBell />}
                variant="ghost"
                fontSize="20px"
              />
              <IconButton
                aria-label="Cài đặt"
                icon={<FaCog />}
                variant="ghost"
                fontSize="20px"
              />
              <Menu>
                <MenuButton>
                  <Avatar
                    size="md"
                    src={user?.avatar}
                    name={user?.displayName}
                    cursor="pointer"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    icon={<FaUserFriends />}
                    onClick={() => navigate("/ho-so")}
                  >
                    Hồ sơ
                  </MenuItem>
                  <MenuItem 
                    icon={<FaCog />}
                    onClick={() => navigate("/cai-dat")}
                  >
                    Cài đặt
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    icon={<FaSignOutAlt />}
                    onClick={handleSignOut}
                    color="red.500"
                  >
                    Đăng xuất
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="1600px" py={8}>
        {/* Thống kê */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={6}
          mb={8}
        >
          <StatCard
            title="Tổng thành viên"
            value={stats.totalUsers}
            icon={<FaUsers />}
            change={5.2}
            color="blue"
          />
          <StatCard
            title="Dự án"
            value={stats.totalProjects}
            icon={<FaProjectDiagram />}
            change={2.1}
            color="purple"
          />
          <StatCard
            title="Nhiệm vụ"
            value={stats.totalTasks}
            icon={<FaTasks />}
            change={-1.5}
            color="orange"
          />
          <StatCard
            title="Hoàn thành"
            value={stats.completedTasks}
            icon={<FaChartLine />}
            change={3.7}
            color="green"
          />
        </SimpleGrid>

        {/* Các nút điều hướng nhanh */}
        <Wrap spacing={6}>
          {quickActions.map((action, index) => (
            <WrapItem key={index} flex="1" minW="300px">
              <ActionButton
                icon={action.icon}
                label={action.label}
                onClick={() => navigate(action.path)}
                colorScheme={action.colorScheme}
              />
            </WrapItem>
          ))}
        </Wrap>
      </Container>
    </Box>
  );
};

export default AdminConDashboard;