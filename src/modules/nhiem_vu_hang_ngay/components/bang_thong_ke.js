// File: src/modules/nhiem_vu_hang_ngay/components/bang_thong_ke.js
// Link tham khảo: https://recharts.org/
// Link tham khảo: https://chakra-ui.com/docs 

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Heading,
  Select,
  Avatar,
  Badge,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Tag,
  TagLabel,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import { layDanhSachNhiemVuAsync } from '../store/nhiem_vu_slice';
import { getAllUsers } from '../../../services/api/userApi';

const FILTER_OPTIONS = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year'
};

const BangThongKe = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const [filterType, setFilterType] = useState(FILTER_OPTIONS.DAY);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Lấy dữ liệu từ Redux store
  const { danhSachNhiemVu = [] } = useSelector(state => state.nhiemVu || { danhSachNhiemVu: [] });

  // Load users và nhiệm vụ
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date(selectedDate);
        if (filterType === FILTER_OPTIONS.MONTH) {
          endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
        } else if (filterType === FILTER_OPTIONS.YEAR) {
          endDate = new Date(startDate.getFullYear(), 11, 31);
        }
        endDate.setHours(23, 59, 59, 999);

        const [usersResponse] = await Promise.all([
          getAllUsers(),
          dispatch(layDanhSachNhiemVuAsync({ startDate, endDate })).unwrap()
        ]);

        setUsers(usersResponse.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu. Vui lòng thử lại sau.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch, filterType, selectedDate, toast]);

  const memberUsers = useMemo(() => {
    return users.filter(u => u?.role === 'member');
  }, [users]);

  const thongKe = useMemo(() => {
    if (!danhSachNhiemVu.length || !memberUsers.length) {
      return {
        tongNhiemVu: 0,
        thongKeTheoNguoi: new Map(),
        nguoiHoanThanh: [],
        nguoiKhongLam: [],
        chartData: []
      };
    }

    const result = {
      tongNhiemVu: danhSachNhiemVu.length,
      thongKeTheoNguoi: new Map(),
      nguoiHoanThanh: [],
      nguoiKhongLam: [],
      chartData: []
    };

    // Khởi tạo thống kê cho tất cả users
    memberUsers.forEach(user => {
      result.thongKeTheoNguoi.set(user.id, {
        user,
        daHoanThanh: 0,
        chuaHoanThanh: 0,
        tyLe: 0
      });
    });

    // Xử lý từng nhiệm vụ
    danhSachNhiemVu.forEach(nhiemVu => {
      memberUsers.forEach(user => {
        const userStats = result.thongKeTheoNguoi.get(user.id);
        const isCompleted = nhiemVu.danhSachHoanThanh?.some(item => item.userId === user.id);
        
        if (isCompleted) {
          userStats.daHoanThanh++;
        } else {
          userStats.chuaHoanThanh++;
        }
      });
    });

    // Tính tỷ lệ và phân loại
    result.thongKeTheoNguoi.forEach((stats) => {
      const total = stats.daHoanThanh + stats.chuaHoanThanh;
      stats.tyLe = total > 0 ? ((stats.daHoanThanh / total) * 100).toFixed(1) : 0;
      
      const userInfo = {
        ...stats.user,
        tyLe: stats.tyLe,
        daHoanThanh: stats.daHoanThanh,
        chuaHoanThanh: stats.chuaHoanThanh
      };

      if (parseFloat(stats.tyLe) >= 50) {
        result.nguoiHoanThanh.push(userInfo);
      } else {
        result.nguoiKhongLam.push(userInfo);
      }

      result.chartData.push({
        name: stats.user.displayName || stats.user.email,
        hoanthanh: stats.daHoanThanh,
        chuahoanthanh: stats.chuaHoanThanh
      });
    });

    return result;
  }, [danhSachNhiemVu, memberUsers]);

  const handleFilterChange = useCallback((event) => {
    setFilterType(event.target.value);
  }, []);

  const handleDateChange = useCallback((event) => {
    setSelectedDate(event.target.value);
  }, []);

  const CustomTooltip = useCallback(({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card bg="white" p={3} shadow="lg">
          <Text fontWeight="bold">{label}</Text>
          {payload.map((entry, index) => (
            <Text key={index} color={entry.color}>
              {entry.name}: {entry.value}
            </Text>
          ))}
        </Card>
      );
    }
    return null;
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Đang tải dữ liệu...</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl>
              <FormLabel>Xem theo</FormLabel>
              <Select value={filterType} onChange={handleFilterChange}>
                <option value={FILTER_OPTIONS.DAY}>Theo ngày</option>
                <option value={FILTER_OPTIONS.MONTH}>Theo tháng</option>
                <option value={FILTER_OPTIONS.YEAR}>Theo năm</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl>
              <FormLabel>
                {filterType === FILTER_OPTIONS.DAY ? 'Chọn ngày' : 
                 filterType === FILTER_OPTIONS.MONTH ? 'Chọn tháng' : 'Chọn năm'}
              </FormLabel>
              <Input
                type={
                  filterType === FILTER_OPTIONS.DAY ? 'date' :
                  filterType === FILTER_OPTIONS.MONTH ? 'month' : 'number'
                }
                value={selectedDate}
                onChange={handleDateChange}
                min={filterType === FILTER_OPTIONS.YEAR ? '2020' : undefined}
                max={filterType === FILTER_OPTIONS.YEAR ? '2100' : undefined}
              />
            </FormControl>
          </GridItem>
        </Grid>

        {/* Card hiển thị số liệu tổng quan */}
        <Card>
          <CardHeader>
            <Heading size="md">Thống kê tổng quan</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              <GridItem>
                <VStack align="start">
                  <Text color="gray.500">Tổng nhiệm vụ</Text>
                  <Heading size="lg">{thongKe.tongNhiemVu}</Heading>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="start">
                  <Text color="gray.500">Đã hoàn thành</Text>
                  <Heading size="lg" color="green.500">
                    {thongKe.nguoiHoanThanh.length} <Text as="span" fontSize="md">người</Text>
                  </Heading>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="start">
                  <Text color="gray.500">Chưa hoàn thành</Text>
                  <Heading size="lg" color="red.500">
                    {thongKe.nguoiKhongLam.length} <Text as="span" fontSize="md">người</Text>
                  </Heading>
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Thống kê theo người dùng */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Thống kê theo người dùng</Heading>
              <Button colorScheme="blue" onClick={onOpen}>
                Xem danh sách hoàn thành ({thongKe.nguoiHoanThanh.length})
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={thongKe.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="hoanthanh"
                  name="Đã hoàn thành"
                  fill="#48BB78"
                  stackId="a"
                />
                <Bar
                  dataKey="chuahoanthanh"
                  name="Chưa hoàn thành"
                  fill="#F56565"
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Modal danh sách người hoàn thành */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Danh sách người hoàn thành nhiệm vụ</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Thành viên</Th>
                    <Th isNumeric>Hoàn thành</Th>
                    <Th isNumeric>Chưa hoàn thành</Th>
                    <Th isNumeric>Tỷ lệ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {thongKe.nguoiHoanThanh.map(user => (
                    <Tr key={user.id}>
                      <Td>
                        <HStack>
                          <Avatar
                            size="sm"
                            name={user.displayName || user.email}
                            src={user.photoURL}
                          />
                          <Text>{user.displayName || user.email}</Text>
                        </HStack>
                      </Td>
                      <Td isNumeric>{user.daHoanThanh}</Td>
                      <Td isNumeric>{user.chuaHoanThanh}</Td>
                      <Td isNumeric>
                        <Badge colorScheme="green">{user.tyLe}%</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Danh sách người không hoàn thành nhiệm vụ */}
        <Card>
          <CardHeader>
            <Heading size="md">Danh sách người không hoàn thành nhiệm vụ</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
              {thongKe.nguoiKhongLam.map(user => (
                <Card key={user.id} variant="outline">
                  <CardBody>
                    <HStack spacing={4}>
                      <Avatar
                        size="md"
                        name={user.displayName || user.email}
                        src={user.photoURL}
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">
                          {user.displayName || user.email}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {user.email}
                        </Text>
                        <HStack>
                          <Tag colorScheme="green">
                            <TagLabel>Hoàn thành: {user.daHoanThanh}</TagLabel>
                          </Tag>
                          <Tag colorScheme="red">
                            <TagLabel>Chưa hoàn thành: {user.chuaHoanThanh}</TagLabel>
                          </Tag>
                        </HStack>
                        <Badge
                          colorScheme="red"fontSize="sm"
                          >
                            Tỷ lệ: {user.tyLe}%
                          </Badge>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </CardBody>
          </Card>
  
          {/* Card thống kê cụ thể */}
          <Card>
            <CardHeader>
              <Heading size="md">Chi tiết thống kê</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Chỉ số</Th>
                    <Th isNumeric>Số lượng</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Tổng số nhiệm vụ</Td>
                    <Td isNumeric>{thongKe.tongNhiemVu}</Td>
                  </Tr>
                  <Tr>
                    <Td>Số người hoàn thành</Td>
                    <Td isNumeric>{thongKe.nguoiHoanThanh.length}</Td>
                  </Tr>
                  <Tr>
                    <Td>Số người chưa hoàn thành</Td>
                    <Td isNumeric>{thongKe.nguoiKhongLam.length}</Td>
                  </Tr>
                  <Tr>
                    <Td>Tổng số thành viên</Td>
                    <Td isNumeric>{memberUsers.length}</Td>
                  </Tr>
                  <Tr>
                    <Td>Tỷ lệ hoàn thành</Td>
                    <Td isNumeric>
                      <Badge 
                        colorScheme={thongKe.nguoiHoanThanh.length/memberUsers.length >= 0.5 ? "green" : "red"}
                      >
                        {((thongKe.nguoiHoanThanh.length/memberUsers.length) * 100).toFixed(1)}%
                      </Badge>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    );
  };
  
  export default BangThongKe;