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
  Grid,
  GridItem
} from "@chakra-ui/react";
import {
  FaUsers,
  FaProjectDiagram,
  FaUserPlus,
  FaCalendarCheck,
  FaTasks,
  FaListAlt,
  FaFileAlt,
  FaUserFriends,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaThumbsUp,
  FaBoxes,
  FaVideo 
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { getTasks } from "../../services/api/taskApi";
import { getAllUsers } from "../../services/api/userApi";
import { layDanhSachNhiemVu } from "../../modules/nhiem_vu_hang_ngay/services/nhiem_vu_service";

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
    dailyTasksCreated: 0,
    dailyTasksCompleted: 0
  });

  // Theme colors
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
      
      // Get current date for daily tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [usersResponse, tasksResponse, dailyTasks] = await Promise.all([
        getAllUsers(),
        getTasks(),
        layDanhSachNhiemVu(today)
      ]);

      const completedTasks = tasksResponse.data.filter(
        (task) => task.progress === 100
      ).length;

      const dailyTasksStats = dailyTasks.reduce((acc, task) => {
        acc.created++;
        if (task.trangThai === 'hoan_thanh') {
          acc.completed++;
        }
        return acc;
      }, { created: 0, completed: 0 });

      setStats({
        totalUsers: usersResponse.data.length,
        totalProjects: usersResponse.data.reduce(
          (acc, user) => acc + (user.projects?.length || 0),
          0
        ),
        totalTasks: tasksResponse.data.length,
        completedTasks,
        dailyTasksCreated: dailyTasksStats.created,
        dailyTasksCompleted: dailyTasksStats.completed
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

  const handleSignOut = useCallback(async () => {
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
  }, [signOut, navigate, toast]);

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
          {change && (
            <StatHelpText mb={0}>
              <StatArrow type={change > 0 ? "increase" : "decrease"} />
              {Math.abs(change)}% so với tháng trước
            </StatHelpText>
          )}
        </Stat>
      </CardBody>
    </Card>
  );

  const ActionButton = ({ icon, label, count, onClick, colorScheme }) => (
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
      justifyContent="space-between"
      px={6}
      py={7}
      _hover={{
        transform: "translateY(-2px)",
        shadow: "lg",
      }}
      transition="all 0.2s"
    >
      <Text fontSize="md" fontWeight="semibold">{label}</Text>
      {count && (
        <Badge 
          ml={2} 
          colorScheme={colorScheme} 
          variant="solid" 
          borderRadius="full"
          px={3}
        >
          {count}
        </Badge>
      )}
    </Button>
  );

  const quickActions = [
    {
      icon: <FaThumbsUp />,
      label: "Nhiệm vụ hằng ngày",
      path: "/nhiem-vu-hang-ngay",
      colorScheme: "blue",
      count: stats.dailyTasksCreated
    },
    {
      icon: <FaCalendarCheck />,
      label: "Quản lý điểm danh",
      path: "/admin-con/diem-danh",
      colorScheme: "teal"
    },
    {
      icon: <FaProjectDiagram />,
      label: "Quản lý dự án",
      path: "/quan-ly-du-an",
      colorScheme: "purple",
      count: stats.totalProjects
    },
    {
      icon: <FaListAlt />,
      label: "Quản lý nhiệm vụ",
      path: "/quan-ly-nhiem-vu",
      colorScheme: "green",
      count: stats.totalTasks
    },
    {
      icon: <FaUserFriends />,
      label: "Quản lý thành viên",
      path: "/quan-ly-thanh-vien",
      colorScheme: "orange",
      count: stats.totalUsers
    },
    {
      icon: <FaBoxes />,
      label: "Quản lý tài sản",
      path: "/quan-ly-tai-san",
      colorScheme: "red"
    },
    {
      icon: <FaFileAlt />,
      label: "Báo cáo",
      path: "/bao-cao-ngay",
      colorScheme: "cyan"
    },
    {
      icon: <FaCalendarAlt />,
      label: "Quản lý nghỉ phép",
      path: "/quan-ly-nghi-phep",
      colorScheme: "pink"
    },
    {
      icon: <FaUserPlus />,
      label: "Tạo tài khoản thành viên", 
      path: "/admin-con/tao-thanh-vien",
      colorScheme: "yellow"
    },
    {
      icon: <FaVideo />,
      label: "Review sự kiện",
      path: "/review-su-kien",
      colorScheme: "facebook"
    }
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
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={textColor}>
                Bảng điều khiển Admin
              </Heading>
              <Text color={secondaryTextColor}>
                Xin chào, {user?.displayName}
              </Text>
            </VStack>

            <HStack spacing={4}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaBell />}
                  variant="ghost"
                  fontSize="20px"
                  position="relative"
                >
                  {stats.dailyTasksCreated > 0 && (
                    <Badge
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      colorScheme="red"
                      borderRadius="full"
                    >
                      {stats.dailyTasksCreated}
                    </Badge>
                  )}
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    Nhiệm vụ hằng ngày mới ({stats.dailyTasksCreated})
                  </MenuItem>
                  <MenuItem>
                    Đã hoàn thành ({stats.dailyTasksCompleted})
                  </MenuItem>
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton>
                  <Avatar
                    size="md"
                    src={user?.avatar}
                    name={user?.displayName}
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaUserFriends />}>
                    Hồ sơ
                  </MenuItem>
                  <MenuItem icon={<FaCog />}>
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
        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatCard
            title="Thành viên"
            value={stats.totalUsers}
            icon={<FaUsers />}
            change={5.2}
            color="blue"
          />
          <StatCard
            title="Nhiệm vụ hằng ngày"
            value={`${stats.dailyTasksCompleted}/${stats.dailyTasksCreated}`}
            icon={<FaThumbsUp />}
            color="pink"
          />
          <StatCard
            title="Nhiệm vụ dự án"
            value={`${stats.completedTasks}/${stats.totalTasks}`}
            icon={<FaTasks />}
            change={3.7}
            color="green"
          />
          <StatCard
            title="Dự án"
            value={stats.totalProjects}
            icon={<FaProjectDiagram />}
            change={2.1}
            color="purple"
          />
        </SimpleGrid>

        {/* Quick Actions Grid */}
        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={6}
          autoFlow="row dense"
        >
          {quickActions.map((action, index) => (
            <GridItem key={index}>
              <ActionButton
                icon={action.icon}
                label={action.label}
                count={action.count}
                onClick={() => navigate(action.path)}
                colorScheme={action.colorScheme}
              />
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminConDashboard;