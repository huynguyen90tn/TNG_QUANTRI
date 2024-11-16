// File: src/components/bao_cao/components/danh_sach_chua_bao_cao.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Button,
  Spinner,
  useToast,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  SimpleGrid,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent, 
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { EmailIcon, CheckIcon, CalendarIcon, WarningIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { baoCaoApi } from '../../../services/api/bao_cao_api';

const DEPARTMENTS = {
  'thien-minh-duong': 'Thiên Minh Đường',
  'tay-van-cac': 'Tây Vân Các', 
  'hoa-tam-duong': 'Họa Tam Đường',
  'ho-ly-son-trang': 'Hồ Ly Sơn trang',
  'hoa-van-cac': 'Hoa Vân Các',
  'tinh-van-cac': 'Tinh Vân Các'
};

const THU_TRONG_TUAN = [
  'Chủ nhật',
  'Thứ 2',
  'Thứ 3',
  'Thứ 4', 
  'Thứ 5',
  'Thứ 6',
  'Thứ 7'
];

const DetailModal = ({ user, isOpen, onClose }) => {
  const bgCard = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent bg={bgCard}>
        <ModalHeader>
          <HStack>
            <Avatar name={user.fullName} src={user.avatar} size="sm" />
            <VStack align="start" spacing={0}>
              <Text>{user.fullName}</Text>
              <Text fontSize="sm" color={textColor}>#{user.memberCode}</Text>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Thứ</Th>
                <Th>Ngày</Th>
              </Tr>
            </Thead>
            <Tbody>
              {user.missedDays.map((date, index) => {
                const dateObj = new Date(date);
                return (
                  <Tr key={index}>
                    <Td>{THU_TRONG_TUAN[getDay(dateObj)]}</Td>
                    <Td>{format(dateObj, 'dd/MM/yyyy')}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const ReportFilters = ({ onFilterChange, selectedDate, selectedDepartment }) => {
  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card bg={bgCard} borderColor={borderColor} mb={4}>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <HStack>
            <Icon as={CalendarIcon} />
            <Input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => onFilterChange('date', new Date(e.target.value))}
            />
          </HStack>
          
          <HStack>
            <Icon as={WarningIcon} />
            <Select
              placeholder="Chọn phân hệ"
              value={selectedDepartment}
              onChange={(e) => onFilterChange('department', e.target.value)}
            >
              <option value="all">Tất cả phân hệ</option>
              {Object.entries(DEPARTMENTS).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </Select>
          </HStack>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

const UserCard = ({ user, onSendReminder, isReminding }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Card 
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      w="100%"
    >
      <CardBody>
        <HStack spacing={4}>
          <Avatar
            size="md"
            name={user.fullName}
            src={user.avatar}
            bg="red.500"
          />
          
          <Box flex="1">
            <Text fontWeight="bold">{user.fullName}</Text>
            <Text fontSize="sm" color={textColor}>
              #{user.memberCode}
            </Text>
            <Text fontSize="sm" color={textColor}>
              {user.email}
            </Text>
            {user.department && (
              <Text fontSize="sm" color={textColor}>
                {DEPARTMENTS[user.department] || user.department}
              </Text>
            )}
          </Box>

          <Button
            leftIcon={<EmailIcon />}
            colorScheme="blue"
            variant="ghost"
            onClick={() => onSendReminder(user.id)}
            isLoading={isReminding}
            size="sm"
          >
            Nhắc nhở
          </Button>
        </HStack>
      </CardBody>
    </Card>
  );
};

const MonthlyStatistics = ({ selectedDate, selectedDepartment }) => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgCard = useColorModeValue('white', 'gray.800');

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const startDate = startOfMonth(selectedDate);
      const endDate = endOfMonth(selectedDate);
      const totalDays = eachDayOfInterval({ start: startDate, end: endDate });

      let missedReports = [];
      // Lấy dữ liệu cho từng ngày trong tháng
      for (const date of totalDays) {
        const unreportedUsers = await baoCaoApi.getNguoiChuaBaoCao({
          date,
          type: 'daily'
        });
        
        unreportedUsers.forEach(user => {
          const existingUser = missedReports.find(r => r.id === user.id);
          if (existingUser) {
            existingUser.missedDays.push(date);
          } else {
            missedReports.push({
              ...user,
              missedDays: [date]
            });
          }
        });
      }

      // Lọc theo phân hệ nếu được chọn
      if (selectedDepartment !== 'all') {
        missedReports = missedReports.filter(user => user.department === selectedDepartment);
      }

      setStatistics(missedReports);
    } catch (error) {
      toast({
        title: 'Lỗi tải thống kê',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedDepartment, toast]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (statistics.length === 0) {
    return (
      <Center py={8} px={4}>
        <VStack spacing={3}>
          <Icon as={CheckIcon} boxSize={8} color="green.500" />
          <Text align="center">
            Không có dữ liệu thiếu báo cáo trong tháng
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Card bg={bgCard}>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Thành viên</Th>
              <Th>Phân hệ</Th>
              <Th isNumeric>Số ngày thiếu</Th>
              <Th>Chi tiết</Th>
            </Tr>
          </Thead>
          <Tbody>
            {statistics.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <HStack>
                    <Avatar size="sm" name={user.fullName} src={user.avatar} />
                    <Box>
                      <Text fontWeight="bold">{user.fullName}</Text>
                      <Text fontSize="sm" color="gray.500">#{user.memberCode}</Text>
                    </Box>
                  </HStack>
                </Td>
                <Td>{DEPARTMENTS[user.department] || user.department}</Td>
                <Td isNumeric>{user.missedDays.length}</Td>
                <Td>
                  <Button
                    leftIcon={<InfoOutlineIcon />}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetail(user)}
                  >
                    Xem chi tiết
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>

      <DetailModal 
        user={selectedUser}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Card>
  );
};

const DanhSachChuaBaoCao = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [unreportedUsers, setUnreportedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReminding, setIsReminding] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const handleFilterChange = (type, value) => {
    if (type === 'date') setSelectedDate(value);
    if (type === 'department') setSelectedDepartment(value);
  };

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await baoCaoApi.getNguoiChuaBaoCao({
        date: selectedDate,
        type: 'daily'
      });

      // Lọc theo phân hệ nếu có chọn
      const filteredUsers = selectedDepartment === 'all' 
        ? response
        : response.filter(user => user.department === selectedDepartment);

      setUnreportedUsers(filteredUsers);
    } catch (error) {
      toast({
        title: 'Lỗi tải dữ liệu',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedDepartment, toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSendReminder = async (userId) => {
    try {
      setIsReminding(true);
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      await baoCaoApi.guiNhacNho([userId], {
        id: currentUser.id,
        email: currentUser.email,
        fullName: currentUser.displayName
      });

      toast({
        title: 'Đã gửi nhắc nhở',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: 'Lỗi gửi nhắc nhở',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsReminding(false);
    }
  };

  const handleSendReminderAll = async () => {
    try {
      setIsReminding(true);
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      await baoCaoApi.guiNhacNho(unreportedUsers.map(user => user.id), {
        id: currentUser.id,
        email: currentUser.email,
        fullName: currentUser.displayName
      });

      toast({
        title: 'Đã gửi nhắc nhở cho tất cả',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: 'Lỗi gửi nhắc nhở',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsReminding(false);
    }
  };

  return (
    <Box p={4}>
      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
        <Tab>Chưa báo cáo ngày</Tab>
          <Tab>Thống kê tháng</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0} pt={4}>
            <ReportFilters 
              onFilterChange={handleFilterChange}
              selectedDate={selectedDate}
              selectedDepartment={selectedDepartment}
            />

            {loading ? (
              <Center py={10}>
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : unreportedUsers.length === 0 ? (
              <Center py={8} px={4}>
                <VStack spacing={3}>
                  <Icon as={CheckIcon} boxSize={8} color="green.500" />
                  <Text align="center">
                    Tất cả đã báo cáo!
                  </Text>
                </VStack>
              </Center>
            ) : (
              <VStack spacing={4} align="stretch">
                <VStack 
                  spacing={2}
                  maxH="calc(100vh - 300px)"
                  overflowY="auto"
                >
                  {unreportedUsers.map(user => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onSendReminder={handleSendReminder}
                      isReminding={isReminding}
                    />
                  ))}
                </VStack>

                <Button
                  colorScheme="blue"
                  width="full"
                  onClick={handleSendReminderAll}
                  isLoading={isReminding}
                >
                  Nhắc nhở tất cả ({unreportedUsers.length})
                </Button>
              </VStack>
            )}
          </TabPanel>

          <TabPanel>
            <MonthlyStatistics 
              selectedDate={selectedDate}
              selectedDepartment={selectedDepartment}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DanhSachChuaBaoCao;