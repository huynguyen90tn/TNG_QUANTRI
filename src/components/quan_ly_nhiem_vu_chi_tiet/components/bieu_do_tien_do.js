// src/components/quan_ly_nhiem_vu_chi_tiet/components/bieu_do_tien_do.js
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from 'recharts';
import {
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Select,
  HStack,
  VStack,
} from '@chakra-ui/react';

const BieuDoTienDo = ({ data }) => {
  const [viewType, setViewType] = React.useState('line');
  const [timeRange, setTimeRange] = React.useState('month');

  // Xử lý dữ liệu theo khoảng thời gian
  const processData = React.useMemo(() => {
    if (!data) return [];
    
    switch (timeRange) {
      case 'week':
        return data.slice(-7);
      case 'month':
        return data.slice(-30);
      case 'quarter':
        return data.slice(-90);
      default:
        return data;
    }
  }, [data, timeRange]);

  // Tùy chọn chung cho biểu đồ
  const chartConfig = {
    width: '100%',
    height: 400,
    margin: { top: 10, right: 30, left: 0, bottom: 0 },
  };

  // Component biểu đồ đường
  const LineChartComponent = () => (
    <ResponsiveContainer {...chartConfig}>
      <LineChart data={processData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="tinhNang" 
          name="Tính năng" 
          stroke="#8884d8" 
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="backend" 
          name="Backend" 
          stroke="#82ca9d" 
          strokeWidth={2}
        />
        <Line 
          type="monotone" 
          dataKey="kiemThu" 
          name="Kiểm thử" 
          stroke="#ffc658" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  // Component biểu đồ vùng
  const AreaChartComponent = () => (
    <ResponsiveContainer {...chartConfig}>
      <AreaChart data={processData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="tinhNang" 
          name="Tính năng"
          stackId="1" 
          stroke="#8884d8" 
          fill="#8884d8" 
        />
        <Area 
          type="monotone" 
          dataKey="backend" 
          name="Backend"
          stackId="1" 
          stroke="#82ca9d" 
          fill="#82ca9d" 
        />
        <Area 
          type="monotone" 
          dataKey="kiemThu" 
          name="Kiểm thử"
          stackId="1" 
          stroke="#ffc658" 
          fill="#ffc658" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  // Component biểu đồ cột
  const BarChartComponent = () => (
    <ResponsiveContainer {...chartConfig}>
      <BarChart data={processData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="tinhNang" name="Tính năng" fill="#8884d8" />
        <Bar dataKey="backend" name="Backend" fill="#82ca9d" />
        <Bar dataKey="kiemThu" name="Kiểm thử" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold">
            Biểu đồ tiến độ nhiệm vụ
          </Text>
          <HStack spacing={4}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              width="150px"
            >
              <option value="week">7 ngày</option>
              <option value="month">30 ngày</option>
              <option value="quarter">90 ngày</option>
            </Select>
          </HStack>
        </HStack>

        <Tabs onChange={(index) => {
          setViewType(['line', 'area', 'bar'][index]);
        }}>
          <TabList>
            <Tab>Đường</Tab>
            <Tab>Vùng</Tab>
            <Tab>Cột</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <LineChartComponent />
            </TabPanel>
            <TabPanel>
              <AreaChartComponent />
            </TabPanel>
            <TabPanel>
              <BarChartComponent />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default BieuDoTienDo;