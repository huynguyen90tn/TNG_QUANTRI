// src/components/quan_ly_nhiem_vu_chi_tiet/components/bang_tong_hop.js
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Box,
  Text,
  Progress,
  Spinner,
  useToast,
  VStack,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { fetchTongHopList } from '../store/nhiem_vu_slice';

const BieuDoTienDo = ({ data }) => {
  if (!data?.length) return null;

  return (
    <Box height="400px" width="100%">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
            formatter={(value) => [`${value}%`, '']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="tinhNang"
            name="Tính năng"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="backend"
            name="Backend"
            stroke="#82ca9d"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="kiemThu"
            name="Kiểm thử"
            stroke="#ffc658"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

BieuDoTienDo.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      tinhNang: PropTypes.number.isRequired,
      backend: PropTypes.number.isRequired,
      kiemThu: PropTypes.number.isRequired,
    })
  ),
};

const BangTongHop = ({ projectId }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [timeRange, setTimeRange] = useState('month');
  const [chartData, setChartData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });

  const tongHopList = useSelector((state) => state.nhiemVu?.tongHopList || []);
  const loading = useSelector((state) => state.nhiemVu?.loading || false);
  const error = useSelector((state) => state.nhiemVu?.error);

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchTongHopList(projectId)).unwrap();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: error || "Không thể tải dữ liệu tổng hợp",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dispatch, projectId, toast, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (tongHopList?.length) {
      // Transform data for chart
      const transformedData = tongHopList.map(item => ({
        date: item.ngayCapNhat,
        tinhNang: item.tienDoTinhNang || 0,
        backend: item.tienDoBackend || 0,
        kiemThu: item.tienDoKiemThu || 0,
      }));

      // Filter data based on time range
      const now = new Date();
      const filteredData = transformedData.filter(item => {
        const itemDate = new Date(item.date);
        const diffTime = Math.abs(now - itemDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (timeRange) {
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'quarter':
            return diffDays <= 90;
          default:
            return true;
        }
      });

      setChartData(filteredData);

      // Calculate summary statistics
      const stats = {
        totalTasks: tongHopList.length,
        completedTasks: tongHopList.filter(task => 
          task.trangThaiCode === 'Hoàn tất' && 
          task.trangThaiBackend === 'Hoàn tất' && 
          task.trangThaiKiemThu === 'Hoàn tất'
        ).length,
        inProgressTasks: tongHopList.filter(task => 
          task.trangThaiCode === 'Đang thực hiện' || 
          task.trangThaiBackend === 'Đang thực hiện' || 
          task.trangThaiKiemThu === 'Đang thực hiện'
        ).length,
        overdueTasks: tongHopList.filter(task => 
          new Date(task.deadline) < now && 
          task.tienDoTongThe < 100
        ).length,
      };

      setSummaryStats(stats);
    }
  }, [tongHopList, timeRange]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <VStack spacing={6} width="100%">
      {/* Summary Statistics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} width="100%">
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Tổng số nhiệm vụ</StatLabel>
              <StatNumber>{summaryStats.totalTasks}</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Đã hoàn thành</StatLabel>
              <StatNumber>{summaryStats.completedTasks}</StatNumber>
              <StatHelpText>
                {((summaryStats.completedTasks / summaryStats.totalTasks) * 100 || 0).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Đang thực hiện</StatLabel>
              <StatNumber>{summaryStats.inProgressTasks}</StatNumber>
              <StatHelpText>
                {((summaryStats.inProgressTasks / summaryStats.totalTasks) * 100 || 0).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Quá hạn</StatLabel>
              <StatNumber>{summaryStats.overdueTasks}</StatNumber>
              <StatHelpText>
                {((summaryStats.overdueTasks / summaryStats.totalTasks) * 100 || 0).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Chart Section */}
      <Card width="100%">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="md">Biểu đồ tiến độ</Heading>
            <Select
              width="200px"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="quarter">90 ngày qua</option>
            </Select>
          </Flex>
        </CardHeader>
        <CardBody>
          <BieuDoTienDo data={chartData} />
        </CardBody>
      </Card>

      {/* Table Section */}
      <Card width="100%">
        <CardHeader>
          <Heading size="md">Chi tiết tiến độ</Heading>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Tên tính năng</Th>
                  <Th>Frontend</Th>
                  <Th>Backend</Th>
                  <Th>Kiểm thử</Th>
                  <Th>Người phụ trách</Th>
                  <Th>Ngày cập nhật</Th>
                  <Th>Tiến độ</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tongHopList.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.tenTinhNang}</Td>
                    <Td>
                      <Badge colorScheme={item.trangThaiCode === 'Hoàn tất' ? 'green' : 'yellow'}>
                        {item.trangThaiCode}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={item.trangThaiBackend === 'Hoàn tất' ? 'green' : 'yellow'}>
                        {item.trangThaiBackend}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={item.trangThaiKiemThu === 'Hoàn tất' ? 'green' : 'yellow'}>
                        {item.trangThaiKiemThu}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{item.nguoiPhuTrach}</Text>
                        <Text fontSize="sm" color="gray.500">{item.email}</Text>
                      </VStack>
                    </Td>
                    <Td>{new Date(item.ngayCapNhat).toLocaleDateString('vi-VN')}</Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Progress
                          value={item.tienDoTongThe}
                          size="sm"
                          width="100%"
                          colorScheme={item.tienDoTongThe === 100 ? 'green' : 'blue'}
                        />
                        <Text fontSize="sm">{item.tienDoTongThe}%</Text>
                      </VStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
};

BangTongHop.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default BangTongHop;