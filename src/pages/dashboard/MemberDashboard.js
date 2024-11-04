// File: src/pages/dashboard/MemberDashboard.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Link tham khảo: https://firebase.google.com/docs/firestore

import React, { useState, useCallback, useMemo } from "react";
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
  Card,
  CardBody,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton,
  Tooltip,
  AvatarBadge,
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
  FaCalendarAlt,
  FaBell,
  FaCheckCircle,
  FaUserAlt,
  FaRegCalendarCheck,
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
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const shadowColor = useColorModeValue(
    "rgba(0, 0, 0, 0.1)",
    "rgba(255, 255, 255, 0.1)"
  );

  const handleOpenAttendance = useCallback(() => setIsAttendanceOpen(true), []);
  const handleCloseAttendance = useCallback(() => setIsAttendanceOpen(false), []);

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

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  }, []);

  const FeatureButton = useCallback(
    ({ icon, label, onClick, colorScheme }) => (
      <Card
        direction="row"
        overflow="hidden"
        variant="outline"
        cursor="pointer"
        onClick={onClick}
        _hover={{
          transform: "translateY(-4px)",
          shadow: "xl",
        }}
        transition="all 0.3s ease"
        bg={cardBg}
        borderColor={borderColor}
      >
        <CardBody>
          <Flex align="center" gap={4}>
            <Box
              p={3}
              borderRadius="lg"
              bg={`${colorScheme}.50`}
              color={`${colorScheme}.500`}
            >
              <Icon as={icon} boxSize={6} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="lg" color={textColor}>
                {label}
              </Text>
              <Text fontSize="sm" color={secondaryTextColor}>
                Nhấn để truy cập
              </Text>
            </VStack>
          </Flex>
        </CardBody>
      </Card>
    ),
    [cardBg, borderColor, textColor, secondaryTextColor]
  );

  const StatCard = useCallback(
    ({ title, value, icon, change, colorScheme }) => (
      <Card bg={cardBg} shadow="lg">
        <CardBody>
          <Stat>
            <StatLabel color={secondaryTextColor}>{title}</StatLabel>
            <Flex justify="space-between" align="center" mt={2}>
              <StatNumber fontSize="2xl">{value}</StatNumber>
              <Box
                p={2}
                borderRadius="lg"
                bg={`${colorScheme}.50`}
                color={`${colorScheme}.500`}
              >
                <Icon as={icon} boxSize={5} />
              </Box>
            </Flex>
            <StatHelpText>
              <Badge colorScheme={colorScheme}>{change}</Badge>
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    ),
    [cardBg, secondaryTextColor]
  );

  const stats = useMemo(() => [
    {
      title: "Dự án đang tham gia",
      value: "5",
      icon: FaProjectDiagram,
      change: "Đang hoạt động",
      colorScheme: "blue",
    },
    {
      title: "Nhiệm vụ cần hoàn thành",
      value: "12",
      icon: FaTasks,
      change: "Cần xử lý",
      colorScheme: "orange",
    },
    {
      title: "Tỷ lệ hoàn thành",
      value: "85%",
      icon: FaChartBar,
      change: "Tốt",
      colorScheme: "green",
    },
    {
      title: "Ngày nghỉ phép còn lại",
      value: "7",
      icon: FaRegCalendarCheck,
      change: "Trong năm",
      colorScheme: "purple",
    },
  ], []);

  const mainFeatures = useMemo(() => [
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
    },
  ], []);

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
        <Container maxW="1400px" py={4}>
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Box position="relative">
                <Avatar
                  size="xl"
                  name={user?.displayName}
                  src={user?.avatar}
                  boxShadow={`0 0 0 4px ${useColorModeValue(
                    "blue.500",
                    "blue.400"
                  )}`}
                >
                  <AvatarBadge
                    boxSize="1.25em"
                    bg="green.500"
                    borderColor={cardBg}
                  >
                    <Icon as={FaCheckCircle} color="white" />
                  </AvatarBadge>
                </Avatar>
              </Box>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" color={secondaryTextColor}>
                  {getGreeting()}
                </Text>
                <Heading size="md" color={textColor}>
                  {user?.displayName}
                </Heading>
                <Badge colorScheme="blue">
                  {user?.department || "Thành viên"}
                </Badge>
              </VStack>
            </HStack>

            <HStack spacing={4}>
              <Tooltip label="Điểm danh">
                <Button
                  leftIcon={<FaUserClock />}
                  colorScheme="blue"
                  onClick={handleOpenAttendance}
                  size="lg"
                  variant="solid"
                  shadow="md"
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "lg",
                  }}
                  transition="all 0.2s"
                >
                  Điểm danh
                </Button>
              </Tooltip>

              <Tooltip label="Thông báo">
                <IconButton
                  aria-label="Notifications"
                  icon={<FaBell />}
                  variant="ghost"
                  fontSize="20px"
                />
              </Tooltip>

              <Menu>
                <MenuButton>
                  <Avatar
                    size="md"
                    name={user?.displayName}
                    src={user?.avatar}
                    cursor="pointer"
                    _hover={{ transform: "scale(1.05)" }}
                    transition="all 0.2s"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaUserAlt />} onClick={() => navigate("/ho-so")}>
                    Thông tin cá nhân
                  </MenuItem>
                  <MenuItem icon={<FaCog />} onClick={() => navigate("/cai-dat")}>
                    Cài đặt
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
        </Container>
      </Box>

      <Container maxW="1400px" py={8}>
        {/* Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </SimpleGrid>

        {/* Main Features */}
        <VStack spacing={6} align="stretch">
          <Heading size="lg" color={textColor}>
            Chức năng chính
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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
          motionPreset="slideInBottom"
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent bg={cardBg}>
            <ModalHeader borderBottomWidth="1px">Điểm Danh</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <AttendanceForm onClose={handleCloseAttendance} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default MemberDashboard;