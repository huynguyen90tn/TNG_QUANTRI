// File: src/pages/dashboard/MemberDashboard.js

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
  Image,
  Wrap,
  WrapItem,
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
  FaThumbsUp,
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import AttendanceForm from "../../components/attendance/AttendanceForm";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

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

  const stats = useMemo(() => [
    {
      title: "Nhiệm vụ hằng ngày",
      value: "3/5",
      icon: FaThumbsUp,
      change: "Cần hoàn thành",
      colorScheme: "blue",
    },
    {
      title: "Nhiệm vụ dự án",
      value: "8/12", 
      icon: FaTasks,
      change: "Đang thực hiện",
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
      title: "Ngày phép còn lại",
      value: "7",
      icon: FaRegCalendarCheck,
      change: "Trong năm",
      colorScheme: "purple",
    },
  ], []);

  const mainFeatures = useMemo(() => [
    {
      icon: FaThumbsUp,
      label: "Nhiệm vụ hằng ngày",
      path: "/nhiem-vu-hang-ngay",
      colorScheme: "blue",
      description: "Like, share và tương tác",
    },
    {
      icon: FaHistory,
      label: "Lịch sử điểm danh",
      path: "/member/lich-su-diem-danh", 
      colorScheme: "cyan",
      description: "Xem lịch sử chấm công",
    },
    {
      icon: FaProjectDiagram,
      label: "Quản lý dự án",
      path: "/quan-ly-du-an",
      colorScheme: "purple",
      description: "Dự án đang tham gia",
    },
    {
      icon: FaTasks,
      label: "Nhiệm vụ dự án",
      path: "/quan-ly-nhiem-vu",
      colorScheme: "orange",
      description: "Công việc cần thực hiện",
    },
    {
      icon: FaChartBar,
      label: "Báo cáo công việc",
      path: "/bao-cao-ngay",
      colorScheme: "green", 
      description: "Báo cáo tiến độ hằng ngày",
    },
    {
      icon: FaCalendarAlt,
      label: "Đơn xin nghỉ phép",
      path: "/quan-ly-nghi-phep",
      colorScheme: "pink",
      description: "Tạo đơn xin nghỉ phép",
    },
  ], []);

  const FeatureCard = useCallback(
    ({ icon, label, description, onClick, colorScheme }) => (
      <Card
        direction="column"  
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
        h="full"
      >
        <CardBody>
          <VStack spacing={4} align="center">
            <Box
              p={4}
              borderRadius="full"
              bg={`${colorScheme}.50`}
              color={`${colorScheme}.500`}
            >
              <Icon as={icon} boxSize={8} />
            </Box>
            <VStack spacing={2}>
              <Text fontWeight="bold" fontSize="lg" color={textColor} textAlign="center">
                {label}
              </Text>
              <Text fontSize="sm" color={secondaryTextColor} textAlign="center">
                {description}
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    ),
    [cardBg, borderColor, textColor, secondaryTextColor]
  );

  const StatCard = useCallback(
    ({ title, value, icon, change, colorScheme }) => (
      <Card bg={cardBg} shadow="lg" h="full">
        <CardBody>
          <Stat>
            <StatLabel color={secondaryTextColor}>{title}</StatLabel>
            <Flex justify="space-between" align="center" mt={2}>
              <StatNumber fontSize="2xl" color={textColor}>{value}</StatNumber>
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
    [cardBg, secondaryTextColor, textColor]
  );

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
            <HStack spacing={6}>
              <Box position="relative">
                <Avatar
                  size="xl"
                  name={user?.fullName}
                  src={user?.avatarUrl}
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
                <Heading size="md" color={textColor}>
                  {user?.fullName}
                </Heading>
                <Badge colorScheme="blue">{user?.department}</Badge>
                <Badge colorScheme="green">Mã TV: {user?.memberCode}</Badge>
              </VStack>
            </HStack>

            <HStack spacing={4}>
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

              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaBell />}
                  variant="ghost"
                  fontSize="20px"
                  position="relative"
                >
                  <Badge
                    position="absolute"
                    top="-2px"
                    right="-2px"
                    colorScheme="red"
                    borderRadius="full"
                  >
                    3
                  </Badge>
                </MenuButton>
                <MenuList>
                  <MenuItem>Thông báo nhiệm vụ mới</MenuItem>
                  <MenuItem>Lịch họp tuần</MenuItem>
                  <MenuItem>Cập nhật hệ thống</MenuItem>
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton>
                  <Avatar
                    size="md"
                    name={user?.fullName}
                    src={user?.avatarUrl}
                    cursor="pointer"
                    _hover={{ transform: "scale(1.05)" }}
                    transition="all 0.2s"
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FaUserAlt />}>Thông tin cá nhân</MenuItem>
                  <MenuItem icon={<FaCog />}>Cài đặt tài khoản</MenuItem>
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
        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </SimpleGrid>

        {/* Main Features Grid */}
        <VStack spacing={8} align="stretch">
          <Heading size="lg" color={textColor}>
            Chức năng chính
          </Heading>
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={6}
            autoRows="1fr"
          >
            {mainFeatures.map((feature) => (
              <FeatureCard
                key={feature.path}
                icon={feature.icon}
                label={feature.label}
                description={feature.description}
                onClick={() => navigate(feature.path)}
                colorScheme={feature.colorScheme}
              />
            ))}
          </SimpleGrid>
        </VStack>

        {/* Điểm danh Modal */}
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