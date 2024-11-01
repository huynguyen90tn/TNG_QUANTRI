// src/components/bao_cao/components/danh_sach_chua_bao_cao.js
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Text,
  Flex,
  Icon,
  Badge,
  Avatar,
  Button,
  useColorModeValue,
  useToast,
  Spinner,
  IconButton,
  Tooltip,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  Divider,
  SimpleGrid
} from '@chakra-ui/react';
import {
  WarningIcon,
  TimeIcon,
  CalendarIcon,
  CheckIcon,
  BellIcon,
  EmailIcon,
} from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserClock, 
  FaExclamationTriangle, 
  FaRegCalendarCheck,
  FaUserTimes,
  FaRegClock,
  FaUsers,
  FaBuilding,
  FaIdBadge,
} from 'react-icons/fa';
import { baoCaoApi } from '../../../services/api/bao_cao_api';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const DanhSachChuaBaoCao = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tabIndex, setTabIndex] = useState(0);
  const [danhSach, setDanhSach] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dangGuiNhacNho, setDangGuiNhacNho] = useState(false);
  const toast = useToast();

  // Theme colors
  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const borderColor = useColorModeValue('gray.600', 'gray.700');
  const textColor = useColorModeValue('gray.100', 'gray.50');
  const accentColor = useColorModeValue('red.400', 'red.300');
  const warningColor = useColorModeValue('yellow.400', 'yellow.300');

  const isAfterDeadline = () => {
    const now = new Date();
    return now.getHours() >= 18;
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await baoCaoApi.getNguoiChuaBaoCao({
          date: selectedDate,
          type: tabIndex === 0 ? 'daily' : 'monthly'
        });
        setDanhSach(result);
      } catch (error) {
        toast({
          title: 'Lỗi tải dữ liệu',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedDate, tabIndex, toast]);

  const handleGuiNhacNho = async (userId) => {
    setDangGuiNhacNho(true);
    try {
      await baoCaoApi.guiNhacNho([userId]);
      toast({
        title: 'Đã gửi nhắc nhở',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Lỗi gửi nhắc nhở',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setDangGuiNhacNho(false);
    }
  };

  const handleGuiNhacNhoTatCa = async () => {
    setDangGuiNhacNho(true);
    try {
      const userIds = danhSach.map(user => user.id);
      await baoCaoApi.guiNhacNho(userIds);
      toast({
        title: 'Đã gửi nhắc nhở cho tất cả',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Lỗi gửi nhắc nhở',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setDangGuiNhacNho(false);
    }
  };

  const renderUserCard = (user) => (
    <MotionCard
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <HStack spacing={4}>
            <Avatar 
              name={user.fullName} 
              src={user.avatar}
              size="md"
            />
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold" color={textColor} fontSize="lg">
                {user.fullName}
              </Text>
              <HStack spacing={2}>
                <Icon as={FaBuilding} color={warningColor} />
                <Text fontSize="sm" color={textColor}>
                  {user.department}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Icon as={FaIdBadge} color={warningColor} />
                <Text fontSize="sm" color={textColor}>
                  {user.memberCode}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <Flex justify="end" align="center">
            <HStack spacing={3}>
              <Tooltip label="Gửi email nhắc nhở">
                <IconButton
                  icon={<EmailIcon />}
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => handleGuiNhacNho(user.id)}
                  isLoading={dangGuiNhacNho}
                  aria-label="Send reminder"
                />
              </Tooltip>
              <Badge 
                colorScheme="red"
                p={2}
                borderRadius="md"
                display="flex"
                alignItems="center"
              >
                <Icon as={FaRegClock} mr={2} />
                Chưa báo cáo
              </Badge>
            </HStack>
          </Flex>
        </SimpleGrid>
      </CardBody>
    </MotionCard>
  );

  return (
    <MotionCard
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader borderBottomWidth="1px" borderColor={borderColor}>
        <HStack justify="space-between" wrap="wrap">
          <HStack>
            <Icon 
              as={FaExclamationTriangle}
              color={isAfterDeadline() ? accentColor : warningColor}
              boxSize={6}
            />
            <Heading size="md" color={textColor}>
              Danh sách chưa báo cáo
            </Heading>
          </HStack>

          {isAfterDeadline() && (
            <Badge
              colorScheme="red"
              p={2}
              display="flex"
              alignItems="center"
            >
              <TimeIcon mr={2} />
              Đã quá hạn báo cáo (18:00)
            </Badge>
          )}
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack spacing={6} align="stretch">
          <Tabs 
            variant="soft-rounded" 
            colorScheme="blue"
            onChange={setTabIndex}
            isFitted
          >
            <TabList>
              <Tab>
                <Icon as={FaUserClock} mr={2} />
                Theo ngày
              </Tab>
              <Tab>
                <Icon as={FaRegCalendarCheck} mr={2} />
                Theo tháng
              </Tab>
            </TabList>

            <TabPanels mt={4}>
              <TabPanel p={0}>
                <HStack spacing={4} mb={6}>
                  <Input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    bg={cardBg}
                    color={textColor}
                    borderColor={borderColor}
                    w="auto"
                  />
                  <Text color={textColor}>
                    <Icon as={FaRegClock} mr={2} />
                    Deadline: 18:00
                  </Text>
                </HStack>
              </TabPanel>

              <TabPanel p={0}>
                <HStack spacing={4} mb={6}>
                  <Icon as={CalendarIcon} color={accentColor} />
                  <Text color={textColor}>
                    Tháng {selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
                  </Text>
                </HStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {isLoading ? (
            <Flex justify="center" py={8}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.600"
                color={accentColor}
                size="xl"
              />
            </Flex>
          ) : danhSach.length === 0 ? (
            <Flex direction="column" align="center" py={8} gap={4}>
              <Icon as={CheckIcon} color="green.400" boxSize={10} />
              <Text color={textColor} fontSize="lg">
                Tất cả thành viên đã báo cáo
              </Text>
            </Flex>
          ) : (
            <AnimatePresence>
              <VStack spacing={4}>
                {danhSach.map((user) => (
                  <MotionBox
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {renderUserCard(user)}
                  </MotionBox>
                ))}
              </VStack>

              <Flex justify="end" mt={6}>
                <Button
                  leftIcon={<BellIcon />}
                  colorScheme="blue"
                  onClick={handleGuiNhacNhoTatCa}
                  isLoading={dangGuiNhacNho}
                  loadingText="Đang gửi..."
                >
                  Nhắc nhở tất cả ({danhSach.length})
                </Button>
              </Flex>
            </AnimatePresence>
          )}
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

export default DanhSachChuaBaoCao;