import React, { useState, useEffect, useCallback } from "react";
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
  Tooltip,
  Card,
  CardBody,
  Badge,
} from "@chakra-ui/react";
import {
  FaUserClock,
  FaHistory,
  FaProjectDiagram,
  FaTasks,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaLock,
  FaListAlt,
  FaCode,
  FaEye,
  FaChartPie,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import { getTasksByAssignee } from "../../services/api/taskApi";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });

  // Theme colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const loadTaskStats = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const response = await getTasksByAssignee(user.uid);
      const tasks = response.data;
      const now = new Date();

      setTaskStats({
        total: tasks.length,
        completed: tasks.filter((task) => task.status === "completed").length,
        inProgress: tasks.filter((task) => task.status === "in-progress").length,
        overdue: tasks.filter(
          (task) =>
            task.status !== "completed" &&
            task.deadline &&
            new Date(task.deadline) < now
        ).length,
      });
    } catch (error) {
      toast({
        title: "Lỗi tải thông tin nhiệm vụ",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user?.uid, toast]);

  useEffect(() => {
    loadTaskStats();
  }, [loadTaskStats]);

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

  const StatCard = ({ icon, label, value, color, percentage }) => (
    <Card
      p={6}
      bg={cardBg}
      rounded="xl"
      shadow="md"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardBody>
        <Flex align="center">
          <Icon as={icon} w={8} h={8} color={color} />
          <Box ml={4}>
            <Text color={textColor} fontSize="sm" fontWeight="medium">
              {label}
            </Text>
            <Heading size="lg" mt={1}>
              {value}
            </Heading>
            {percentage && (
              <Text color={textColor} fontSize="sm" mt={1}>
                {percentage}% tổng số
              </Text>
            )}
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );

  const FeatureButton = ({ icon, label, onClick, colorScheme, tooltipText, isProtected }) => (
    <Tooltip label={tooltipText} hasArrow placement="top">
      <Button
        leftIcon={
          <HStack spacing={2}>
            <Icon as={icon} />
            {isProtected && <Icon as={FaLock} w={3} h={3} />}
          </HStack>
        }
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
          bg: hoverBg,
        }}
      >
        {label}
      </Button>
    </Tooltip>
  );

  const mainFeatures = [
    {
      icon: FaHistory,
      label: "Lịch sử điểm danh",
      path: "/member/lich-su-diem-danh",
      colorScheme: "blue",
      tooltip: "Xem lịch sử điểm danh của bạn",
    },
    {
      icon: FaProjectDiagram,
      label: "Quản lý dự án",
      path: "/quan-ly-du-an",
      colorScheme: "green",
      tooltip: "Quản lý các dự án của bạn",
    },
    {
      icon: FaTasks,
      label: "Quản lý nhiệm vụ",
      path: "/quan-ly-nhiem-vu",
      colorScheme: "purple",
      tooltip: "Quản lý nhiệm vụ được giao",
    },
    {
      icon: FaChartBar,
      label: "Báo cáo",
      path: "/bao-cao-ngay",
      colorScheme: "teal",
      tooltip: "Xem và tạo báo cáo",
    },
  ];

  const detailFeatures = [
    {
      icon: FaCode,
      label: "Quản lý chi tiết code",
      path: "/quan-ly-chi-tiet",
      colorScheme: "pink",
      tooltip: "Quản lý chi tiết code (Yêu cầu mật khẩu)",
      isProtected: true,
    },
  ];

  const ViewDetailButton = () => (
    <Button
      leftIcon={<FaEye />}
      colorScheme="blue"
      variant="solid"
      onClick={() => navigate("/quan-ly-chi-tiet")}
      size="md"
      ml={2}
    >
      Xem
    </Button>
  );

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
                <MenuItem 
                  icon={<FaUserClock />} 
                  onClick={() => navigate("/member/lich-su-diem-danh")}
                >
                  Lịch sử điểm danh
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

        {/* Thống kê */}
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 4 }} 
          spacing={6} 
          mb={8}
        >
          <StatCard
            icon={FaTasks}
            label="Tổng số nhiệm vụ"
            value={taskStats.total}
            color="blue.500"
          />
          <StatCard
            icon={FaClipboardList}
            label="Đang thực hiện"
            value={taskStats.inProgress}
            color="orange.500"
            percentage={((taskStats.inProgress / taskStats.total) * 100).toFixed(1)}
          />
          <StatCard
            icon={FaProjectDiagram}
            label="Đã hoàn thành"
            value={taskStats.completed}
            color="green.500"
            percentage={((taskStats.completed / taskStats.total) * 100).toFixed(1)}
          />
          <StatCard
            icon={FaChartPie}
            label="Quá hạn"
            value={taskStats.overdue}
            color="red.500"
            percentage={((taskStats.overdue / taskStats.total) * 100).toFixed(1)}
          />
        </SimpleGrid>

        <Divider my={6} />

        {/* Các nút chức năng chính */}
        <VStack spacing={6} align="stretch">
          <Heading size="md">Chức năng chính</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            {mainFeatures.map((feature) => (
              <FeatureButton
                key={feature.path}
                icon={feature.icon}
                label={feature.label}
                onClick={() => navigate(feature.path)}
                colorScheme={feature.colorScheme}
                tooltipText={feature.tooltip}
              />
            ))}
          </SimpleGrid>
        </VStack>

        <Divider my={6} />

        {/* Quản lý chi tiết code */}
        <VStack spacing={6} align="stretch">
          <HStack>
            <Heading size="md">Quản lý chi tiết code</Heading>
            <Badge colorScheme="blue" variant="subtle">
              Bảo mật
            </Badge>
            <ViewDetailButton />
          </HStack>
          <SimpleGrid columns={{ base: 1 }} spacing={4}>
            {detailFeatures.map((feature) => (
              <FeatureButton
                key={feature.path}
                icon={feature.icon}
                label={feature.label}
                onClick={() => navigate(feature.path)}
                colorScheme={feature.colorScheme}
                tooltipText={feature.tooltip}
                isProtected={feature.isProtected}
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
          motionPreset="slideInBottom"
        >
          <ModalOverlay 
            bg="blackAlpha.300"
            backdropFilter="blur(10px)"
          />
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