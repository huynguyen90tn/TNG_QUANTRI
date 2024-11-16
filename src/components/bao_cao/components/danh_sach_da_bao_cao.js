// File: src/components/bao_cao/components/danh_sach_da_bao_cao.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  Text,
  Spinner,
  useToast,
  useColorModeValue,
  Card,
  CardBody,
  HStack,
  Avatar,
  Badge,
  Icon,
  Flex,
  Center,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { CheckCircleIcon, TimeIcon, CalendarIcon } from '@chakra-ui/icons';
import { format, isValid, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { getUser } from '../../../services/api/userApi';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  
  if (timestamp instanceof Timestamp) {
    return format(timestamp.toDate(), 'HH:mm', { locale: vi });
  }
  
  const date = new Date(timestamp);
  if (isValid(date)) {
    return format(date, 'HH:mm', { locale: vi });
  }
  
  return '';
};

const ReportFilters = ({ onFilterChange, selectedDate, selectedApprover }) => {
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
            <Icon as={CheckCircleIcon} />
            <Select
              placeholder="Chọn người duyệt"
              value={selectedApprover}
              onChange={(e) => onFilterChange('approver', e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="sin@tng.com">Nguyễn Đức Thuận</option>
              {/* Thêm các người duyệt khác */}
            </Select>
          </HStack>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};

const MonthlyReportSummary = ({ month = new Date() }) => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const bgCard = useColorModeValue('white', 'gray.800');

  const loadMonthlySummary = useCallback(async () => {
    try {
      setLoading(true);
      const startDate = startOfMonth(month);
      const endDate = endOfMonth(month);

      const baoCaoRef = collection(db, 'bao_cao');
      const q = query(
        baoCaoRef,
        where('ngayTao', '>=', Timestamp.fromDate(startDate)),
        where('ngayTao', '<=', Timestamp.fromDate(endDate)),
        where('trangThai', '==', 'da_duyet')
      );

      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Tổng hợp theo người dùng
      const userReports = reports.reduce((acc, report) => {
        const userId = report.nguoiTaoInfo.userId;
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            userInfo: report.nguoiTaoInfo,
            reportCount: 0,
            reports: []
          };
        }
        acc[userId].reportCount++;
        acc[userId].reports.push(report);
        return acc;
      }, {});

      // Chuyển đổi thành mảng và lấy thông tin user
      const summaryPromises = Object.values(userReports).map(async (item) => {
        const userData = await getUser(item.userId);
        return {
          ...userData,
          reportCount: item.reportCount,
          reportDates: item.reports.map(r => format(r.ngayTao.toDate(), 'dd/MM/yyyy'))
        };
      });

      const summaryData = await Promise.all(summaryPromises);
      setSummary(summaryData);

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
  }, [month, toast]);

  useEffect(() => {
    loadMonthlySummary();
  }, [loadMonthlySummary]);

  if (loading) {
    return <Spinner />;
  }

  const totalDaysInMonth = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month)
  }).length;

  return (
    <Card bg={bgCard}>
      <CardBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Thành viên</Th>
              <Th isNumeric>Số ngày đã báo cáo</Th>
              <Th isNumeric>Tỷ lệ báo cáo</Th>
              <Th>Chi tiết</Th>
            </Tr>
          </Thead>
          <Tbody>
            {summary.map((user) => (
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
                <Td isNumeric>{user.reportCount}</Td>
                <Td isNumeric>
                  {((user.reportCount / totalDaysInMonth) * 100).toFixed(1)}%
                </Td>
                <Td>
                  <Badge colorScheme={user.reportCount === totalDaysInMonth ? 'green' : 'yellow'}>
                    {user.reportCount === totalDaysInMonth ? 'Đầy đủ' : 'Chưa đủ'}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

const UserCard = ({ user, approveInfo }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Card 
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      w="100%"
    >
      <CardBody>
        <HStack spacing={4}>
          <Avatar
            size="md"
            name={user.fullName}
            src={user.avatar}
            bg="green.500"
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
                {user.department}
              </Text>
            )}
          </Box>

          <Badge
            colorScheme="green"
            display="flex"
            alignItems="center"
            px={2}
            py={1}
          >
            <Icon as={CheckCircleIcon} mr={1} />
            Đã báo cáo
          </Badge>
        </HStack>

        {approveInfo && (
          <HStack mt={3} fontSize="sm" color={textColor}>
            <Text>
              Duyệt bởi: {approveInfo.fullName}
            </Text>
            {approveInfo.time && (
              <Text>
                {formatTime(approveInfo.time)}
              </Text>
            )}
          </HStack>
        )}
      </CardBody>
    </Card>
  );
};

const DanhSachDaBaoCao = ({ ngayBaoCao = new Date() }) => {
  const [selectedDate, setSelectedDate] = useState(ngayBaoCao);
  const [selectedApprover, setSelectedApprover] = useState('all');
  const [reportedUsers, setReportedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const handleFilterChange = (type, value) => {
    if (type === 'date') setSelectedDate(value);
    if (type === 'approver') setSelectedApprover(value);
  };

  const loadReportedUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const baoCaoRef = collection(db, 'bao_cao');
      let q = query(
        baoCaoRef,
        where('ngayTao', '>=', Timestamp.fromDate(startOfDay)),
        where('ngayTao', '<=', Timestamp.fromDate(endOfDay)),
        where('trangThai', '==', 'da_duyet')
      );

      if (selectedApprover !== 'all') {
        q = query(q, where('nguoiDuyetInfo.email', '==', selectedApprover));
      }

      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const userPromises = reports.map(async (report) => {
        try {
          const userData = await getUser(report.nguoiTaoInfo.userId);
          return {
            ...userData,
            approveInfo: report.nguoiDuyetInfo ? {
              fullName: report.nguoiDuyetInfo.ten,
              time: report.ngayDuyet
            } : null
          };
        } catch (error) {
          console.error('Lỗi lấy thông tin người dùng:', error);
          return null;
        }
      });

      const users = await Promise.all(userPromises);
      setReportedUsers(users.filter(Boolean));

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
  }, [selectedDate, selectedApprover, toast]);

  useEffect(() => {
    loadReportedUsers();
  }, [loadReportedUsers]);

  return (
    <Box p={4}>
      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>Báo cáo ngày</Tab>
          <Tab>Thống kê tháng</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0} pt={4}>
            <ReportFilters 
              onFilterChange={handleFilterChange}
              selectedDate={selectedDate}
              selectedApprover={selectedApprover}
            />

            {loading ? (
              <Center py={10}>
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : reportedUsers.length === 0 ? (
              <Center py={8} px={4}>
                <VStack spacing={3}>
                  <Icon as={TimeIcon} boxSize={8} color="yellow.500" />
                  <Text align="center">
                    Chưa có báo cáo nào được duyệt
                  </Text>
                </VStack>
              </Center>
            ) : (
              <VStack spacing={4} align="stretch" maxH="calc(100vh - 300px)" overflowY="auto">
                {reportedUsers.map((user) => (
                  <UserCard 
                    key={user.id}
                    user={user}
                    approveInfo={user.approveInfo}
                  />
                ))}

                <Flex justify="flex-end" mt={4}>
                  <Badge colorScheme="green">
                    Tổng số: {reportedUsers.length}
                  </Badge>
                </Flex>
              </VStack>
            )}
          </TabPanel>

          <TabPanel>
            <MonthlyReportSummary month={selectedDate} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DanhSachDaBaoCao;