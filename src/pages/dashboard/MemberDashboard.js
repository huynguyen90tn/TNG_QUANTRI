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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Divider,
  VStack,
  Badge,
} from "@chakra-ui/react";
import {
  FaUserClock,
  FaHistory,
  FaProjectDiagram,
  FaTasks,
  FaClipboardList,
  FaChartBar,
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
  });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const loadTaskStats = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const response = await getTasksByAssignee(user.uid);
      const tasks = response.data;

      setTaskStats({
        total: tasks.length,
        completed: tasks.filter((task) => task.status === "completed").length,
        inProgress: tasks.filter((task) => task.status === "in-progress")
          .length,
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
            <Heading size="lg">Bảng Điều Khiển Thành Viên</Heading>
            <Text color={textColor}>Chúc bạn một ngày làm việc hiệu quả!</Text>
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
                <Avatar
                  size="sm"
                  name={user?.displayName}
                  src={user?.photoURL}
                />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate("/ho-so")}>
                  Thông tin cá nhân
                </MenuItem>
                <MenuItem onClick={handleSignOut} color="red.500">
                  Đăng xuất
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {/* Thống kê */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
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
            label="Nhiệm vụ đang thực hiện"
            value={taskStats.inProgress}
            color="orange.500"
          />
          <StatCard
            icon={FaProjectDiagram}
            label="Nhiệm vụ đã hoàn thành"
            value={taskStats.completed}
            color="green.500"
          />
        </Grid>

        <Divider my={6} />

        {/* Các nút chức năng */}
        <VStack spacing={4} align="stretch">
          <Heading size="md" mb={4}>
            Chức năng chính
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <Button
              leftIcon={<FaHistory />}
              colorScheme="blue"
              onClick={() => navigate("/member/lich-su-diem-danh")}
              size="lg"
              variant="outline"
            >
              Xem lịch sử điểm danh
            </Button>

            <Button
              leftIcon={<FaProjectDiagram />}
              colorScheme="green"
              onClick={() => navigate("/quan-ly-du-an")}
              size="lg"
              variant="outline"
            >
              Quản lý dự án
            </Button>

            <Button
              leftIcon={<FaTasks />}
              colorScheme="purple"
              onClick={() => navigate("/quan-ly-nhiem-vu")}
              size="lg"
              variant="outline"
            >
              Quản lý nhiệm vụ
            </Button>

            <Button
              leftIcon={<FaChartBar />}
              colorScheme="teal"
              onClick={() => navigate("/bao-cao-ngay")}
              size="lg"
              variant="outline"
            >
              Báo cáo
            </Button>
          </Grid>
        </VStack>

        {/* Modal Điểm danh */}
        <Modal
          isOpen={isAttendanceOpen}
          onClose={handleCloseAttendance}
          size="xl"
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