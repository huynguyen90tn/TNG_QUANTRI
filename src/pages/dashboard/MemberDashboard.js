// File: src/pages/dashboard/MemberDashboard.js
// Link tham khảo: https://chakra-ui.com/docs
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  FaUserFriends, // Icon cho Quản lý thành viên
  FaMoneyCheckAlt // Icon cho Quản lý lương
} from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import AttendanceForm from "../../components/attendance/AttendanceForm";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

const MemberDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, signOut } = useAuth();
  const { isOpen: isAttendanceOpen, onOpen: openAttendance, onClose: closeAttendance } = useDisclosure();

  const [memberData, setMemberData] = useState(null);
  const [notificationCount] = useState(3);

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const shadowColor = useColorModeValue(
    "rgba(0, 0, 0, 0.1)",
    "rgba(255, 255, 255, 0.1)"
  );
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
      }
    };

    fetchMemberData();
  }, [user?.id, toast]);

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
    {
      icon: FaBoxOpen,
      label: "Quản lý tài sản",
      path: "/quan-ly-tai-san",
      colorScheme: "teal",
      description: "Quản lý tài sản được cấp phát",
    },
    {
      icon: FaUserFriends,
      label: "Quản lý thành viên",
      path: "/quan-ly-thanh-vien",
      colorScheme: "cyan",
      description: "Quản lý danh sách thành viên",
    },
    {
      icon: FaMoneyCheckAlt,
      label: "Quản lý lương",
      path: "/quan-ly-luong",
      colorScheme: "yellow",
      description: "Quản lý lương nhân viên"
    }
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

  return (
    <Box minH="100vh" bg={bgColor}>
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
              <Button
                leftIcon={<FaUserClock />}
                colorScheme="blue"
                onClick={openAttendance}
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
                  <Avatar
                    size="md"
                    name={memberData?.fullName || user?.fullName}
                    src={memberData?.avatarUrl || user?.avatarUrl}
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
      </Box>

      <Container maxW="1400px" py={8}>
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
                {...feature}
                onClick={() => navigate(feature.path)}
              />
            ))}
          </SimpleGrid>
        </VStack>

        <Modal
          isOpen={isAttendanceOpen}
          onClose={closeAttendance}
          size="xl"
          isCentered
          motionPreset="slideInBottom"
        >
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent bg={cardBg}>
            <ModalHeader borderBottomWidth="1px">Điểm Danh</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <AttendanceForm onClose={closeAttendance} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default MemberDashboard;
