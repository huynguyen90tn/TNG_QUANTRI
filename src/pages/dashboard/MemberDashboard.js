// File: src/pages/dashboard/MemberDashboard.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { keyframes } from "@emotion/react";
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
  IconButton,
  AvatarBadge,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FaUserClock,
  FaHistory,
  FaProjectDiagram,
  FaTasks,
  FaChartBar,
  FaCog,
  FaLock,
  FaCalendarAlt,
  FaBell,
  FaCheckCircle,
  FaUserAlt,
  FaRegCalendarCheck,
  FaBoxOpen,
  FaThumbsUp,
  FaUserFriends,
  FaMoneyCheckAlt,
  FaVideo
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

// Custom Animations
const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(66, 153, 225, 0.2); }
  50% { box-shadow: 0 0 20px rgba(66, 153, 225, 0.6); }
  100% { box-shadow: 0 0 5px rgba(66, 153, 225, 0.2); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionCard = motion(Card);

// Motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const hoverVariants = {
  hover: {
    y: -8,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};const MemberDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const { isOpen: isAttendanceOpen, onOpen: openAttendance, onClose: closeAttendance } = useDisclosure();

  const [memberData, setMemberData] = useState(null);
  const [notificationCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced theme values for better visual effects
  const bgGradient = useColorModeValue(
    "linear-gradient(180deg, #f7fafc 0%, #edf2f7 100%)",
    "linear-gradient(180deg, #1a202c 0%, #2d3748 100%)"
  );
  
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(26, 32, 44, 0.8)"
  );

  const glowColor = useColorModeValue(
    "rgba(66, 153, 225, 0.4)",
    "rgba(88, 103, 221, 0.4)"
  );

  const borderColor = useColorModeValue(
    "rgba(226, 232, 240, 0.8)",
    "rgba(45, 55, 72, 0.8)"
  );

  const textColor = useColorModeValue("gray.700", "white");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const avatarBorderColor = useColorModeValue("blue.500", "blue.400");

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        if (user?.id) {
          const memberDoc = await getDoc(doc(db, "members", user.id));
          if (memberDoc.exists()) {
            setMemberData(memberDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin thành viên",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [user?.id, toast]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate("/");
      toast({
        title: "Đăng xuất thành công",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
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

  const mainFeatures = useMemo(() => [
    {
      icon: FaThumbsUp,
      label: "Nhiệm vụ hằng ngày",
      path: "/nhiem-vu-hang-ngay",
      colorScheme: "blue",
      description: "Like, share và tương tác",
      gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)"
    },
    {
      icon: FaHistory,
      label: "Lịch sử điểm danh",
      path: "/member/lich-su-diem-danh",
      colorScheme: "cyan",
      description: "Xem lịch sử chấm công",
      gradient: "linear-gradient(135deg, #67E8F9 0%, #06B6D4 100%)"
    },
    {
      icon: FaProjectDiagram,
      label: "Quản lý dự án",
      path: "/quan-ly-du-an",
      colorScheme: "purple",
      description: "Dự án đang tham gia",
      gradient: "linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 100%)"
    },
    {
      icon: FaTasks,
      label: "Nhiệm vụ dự án",
      path: "/quan-ly-nhiem-vu",
      colorScheme: "orange",
      description: "Công việc cần thực hiện",
      gradient: "linear-gradient(135deg, #FDBA74 0%, #F97316 100%)"
    },
    {
      icon: FaChartBar,
      label: "Báo cáo công việc",
      path: "/bao-cao-ngay",
      colorScheme: "green",
      description: "Báo cáo tiến độ hằng ngày",
      gradient: "linear-gradient(135deg, #86EFAC 0%, #22C55E 100%)"
    },
    {
      icon: FaCalendarAlt,
      label: "Đơn xin nghỉ phép",
      path: "/quan-ly-nghi-phep",
      colorScheme: "pink",
      description: "Tạo đơn xin nghỉ phép",
      gradient: "linear-gradient(135deg, #FDA4AF 0%, #EC4899 100%)"
    },
    {
      icon: FaBoxOpen,
      label: "Quản lý tài sản",
      path: "/quan-ly-tai-san",
      colorScheme: "teal",
      description: "Quản lý tài sản được cấp phát",
      gradient: "linear-gradient(135deg, #5EEAD4 0%, #14B8A6 100%)"
    },
    {
      icon: FaUserFriends,
      label: "Quản lý thành viên",
      path: "/quan-ly-thanh-vien",
      colorScheme: "cyan",
      description: "Quản lý danh sách thành viên",
      gradient: "linear-gradient(135deg, #67E8F9 0%, #06B6D4 100%)"
    },
    {
      icon: FaMoneyCheckAlt,
      label: "Quản lý lương",
      path: "/quan-ly-luong",
      colorScheme: "yellow",
      description: "Quản lý lương nhân viên",
      gradient: "linear-gradient(135deg, #FDE047 0%, #EAB308 100%)"
    },
    {
      icon: FaVideo,
      label: "Review sự kiện",
      path: "/review-su-kien",
      colorScheme: "facebook",
      description: "Xem và quản lý các sự kiện",
      gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)"
    },
  ], []);

  const FeatureCard = useCallback(({ icon, label, description, onClick, colorScheme, gradient, index }) => (
    <MotionCard
      variants={itemVariants}
      whileHover="hover"
      whileTap="tap"
      custom={index}
      layout
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      cursor="pointer"
      onClick={onClick}
      position="relative"
      backdropFilter="blur(10px)"
      transition={{ duration: 0.2 }}
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: gradient,
        opacity: 0,
        transition: "opacity 0.3s",
        zIndex: 0
      }}
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: `0 20px 25px -5px ${glowColor}`,
        _before: {
          opacity: 0.1
        }
      }}
    >
      <CardBody position="relative" zIndex={1}>
        <VStack spacing={4}>
          <MotionBox
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <Icon
              as={icon}
              boxSize={10}
              color={`${colorScheme}.500`}
              filter={`drop-shadow(0 0 8px ${glowColor})`}
            />
          </MotionBox>
          
          <VStack spacing={2}>
            <Heading
              size="md"
              color={textColor}
              textAlign="center"
              fontWeight="bold"
            >
              {label}
            </Heading>
            <Text
              fontSize="sm"
              color={subTextColor}
              textAlign="center"
            >
              {description}
            </Text>
          </VStack>
        </VStack>
      </CardBody>
    </MotionCard>
  ), [cardBg, borderColor, glowColor, textColor, subTextColor]);

  return (
    <AnimatePresence>
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        minH="100vh"
        bgGradient={bgGradient}
      >
        {/* Header Section */}
        <MotionBox
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          bg={cardBg}
          backdropFilter="blur(10px)"
          boxShadow={`0 4px 20px ${glowColor}`}
          position="sticky"
          top={0}
          zIndex={100}
        >
          <Container maxW="1400px" py={4}>
            <Flex justify="space-between" align="center">
              <HStack spacing={6}>
                <MotionBox
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar
                    size="xl"
                    name={memberData?.fullName || user?.fullName}
                    src={memberData?.avatarUrl || user?.avatarUrl}
                    boxShadow={`0 0 0 4px ${avatarBorderColor}`}
                  >
                    <AvatarBadge
                      boxSize="1.25em"
                      bg="green.500"
                      borderColor={cardBg}
                    >
                      <Icon as={FaCheckCircle} color="white" />
                    </AvatarBadge>
                  </Avatar>
                </MotionBox>

                <VStack align="start" spacing={1}>
                  <Heading size="md" color={textColor}>
                    {memberData?.fullName || user?.fullName}
                  </Heading>
                  <Badge colorScheme="blue">
                    {memberData?.department || user?.department}
                  </Badge>
                  <Badge colorScheme="green">
                    Mã TV: {memberData?.memberCode || user?.memberCode}
                  </Badge>
                </VStack>
              </HStack>

              <HStack spacing={4}>
                <MotionButton
                  leftIcon={<FaUserClock />}
                  colorScheme="blue"
                  onClick={openAttendance}
                  size="lg"
                  variant="solid"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Điểm danh
                </MotionButton>

                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaBell />}
                    variant="ghost"
                    fontSize="20px"
                    position="relative"
                  >
                    {notificationCount > 0 && (
                      <Badge
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        colorScheme="red"
                        borderRadius="full"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Thông báo nhiệm vụ mới</MenuItem>
                    <MenuItem>Lịch họp tuần</MenuItem>
                    <MenuItem>Cập nhật hệ thống</MenuItem>
                  </MenuList>
                </Menu>

                <Menu>
                  <MenuButton>
                    <MotionBox
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Avatar
                        size="md"
                        name={memberData?.fullName || user?.fullName}
                        src={memberData?.avatarUrl || user?.avatarUrl}
                        cursor="pointer"
                      />
                    </MotionBox>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FaUserAlt />} onClick={() => navigate("/ho-so")}>
                      Thông tin cá nhân
                    </MenuItem>
                    <MenuItem icon={<FaCog />} onClick={() => navigate("/cai-dat")}>
                      Cài đặt tài khoản
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
        </MotionBox>

        {/* Main Content */}
        <Container maxW="1400px" py={8}>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <VStack spacing={8} align="stretch">
              <Heading
                size="lg"
                color={textColor}
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                Chức năng chính
              </Heading>

              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                autoRows="1fr"
              >
                {mainFeatures.map((feature, index) => (
                  <FeatureCard
                    key={feature.path}
                    {...feature}
                    index={index}
                    onClick={() => navigate(feature.path)}
                  />
                ))}
              </SimpleGrid>
            </VStack>
          </MotionBox>
        </Container>

        {/* Attendance Modal */}
        <Modal
          isOpen={isAttendanceOpen}
          onClose={closeAttendance}
          size="xl"
          isCentered
          motionPreset="slideInBottom"
        >
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(10px)"
          />
          <ModalContent
            bg={cardBg}
            boxShadow={`0 0 20px ${glowColor}`}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <ModalHeader
              borderBottomWidth="1px"
              borderColor={borderColor}
            >
              Điểm Danh
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <AttendanceForm onClose={closeAttendance} />
            </ModalBody>
          </ModalContent>
        </Modal>{/* Loading State */}
        {isLoading && (
          <MotionBox
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg={cardBg}
            zIndex={9999}
            display="flex"
            alignItems="center"
            justifyContent="center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <VStack spacing={4}>
              <MotionBox
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 2
                }}
              >
                <Icon 
                  as={FaUserClock} 
                  boxSize={12} 
                  color="blue.500" 
                  filter={`drop-shadow(0 0 8px ${glowColor})`}
                />
              </MotionBox>
              <Text color={textColor} fontSize="lg">
                Đang tải dữ liệu...
              </Text>
            </VStack>
          </MotionBox>
        )}

        {/* Success Toast Animation */}
        <AnimatePresence>
          {toast && (
            <MotionBox
              position="fixed"
              top={4}
              right={4}
              zIndex={9999}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              {/* Toast content will be rendered here by Chakra UI */}
            </MotionBox>
          )}
        </AnimatePresence>

      </MotionBox>
    </AnimatePresence>
  );
};

// Enhanced button component with animations
const MotionButton = motion(Button);

export default MemberDashboard;