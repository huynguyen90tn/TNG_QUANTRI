
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Button,
  HStack,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Text,
  Container,
} from '@chakra-ui/react';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaChartPie, 
  FaUserPlus,
  FaCalendarCheck,
  FaRegClock 
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  PieChart, 
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const statsData = [
  { id: 1, label: 'Tổng thành viên', value: '1,000', icon: FaUsers, change: 12, color: 'blue' },
  { id: 2, label: 'Dự án đang chạy', value: '50', icon: FaProjectDiagram, change: 8, color: 'green' },
  { id: 3, label: 'Tỷ lệ đi muộn', value: '15%', icon: FaRegClock, change: -5, color: 'orange' },
  { id: 4, label: 'KPI đạt được', value: '85%', icon: FaChartPie, change: 15, color: 'purple' },
];

const attendanceData = [
  { name: 'Đúng giờ', value: 850, color: '#38A169' },
  { name: 'Đi muộn', value: 150, color: '#E53E3E' },
];

const projectData = [
  { name: 'Q1', completed: 40, ongoing: 20 },
  { name: 'Q2', completed: 50, ongoing: 30 },
  { name: 'Q3', completed: 45, ongoing: 25 },
  { name: 'Q4', completed: 60, ongoing: 15 },
];

const StatCard = ({ label, value, icon, change, color }) => (
  <Box
    bg="white"
    p={6}
    rounded="xl"
    shadow="lg"
    _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
    transition="all 0.3s"
  >
    <Stat>
      <Flex align="center" mb={2}>
        <Icon as={icon} w={6} h={6} color={`${color}.500`} />
        <StatLabel ml={2}>{label}</StatLabel>
      </Flex>
      <StatNumber fontSize="2xl">{value}</StatNumber>
      <StatHelpText>
        <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
        {Math.abs(change)}%
      </StatHelpText>
    </Stat>
  </Box>
);

const AdminTongDashboard = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Container maxW="1600px" p={4}>
      <Box minH="100vh" bg={bgColor}>
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading size="lg">Dashboard Quản trị</Heading>
            <Text color="gray.500">Tổng quan hệ thống</Text>
          </Box>
          
          <HStack>
            <Button
              leftIcon={<FaUserPlus />}
              colorScheme="blue"
              onClick={() => navigate('/tao-quan-tri')}
            >
              Tạo tài khoản quản trị
            </Button>
            <Menu>
              <MenuButton as={Avatar} cursor="pointer" size="sm" />
              <MenuList>
                <MenuItem>Hồ sơ</MenuItem>
                <MenuItem>Cài đặt</MenuItem>
                <MenuItem color="red.500">Đăng xuất</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {statsData.map(stat => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
          <Box bg="white" p={6} rounded="xl" shadow="lg" height="400px">
            <Heading size="md" mb={6}>Thống kê điểm danh</Heading>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box bg="white" p={6} rounded="xl" shadow="lg" height="400px">
            <Heading size="md" mb={6}>Tiến độ dự án</Heading>
            <ResponsiveContainer>
              <BarChart data={projectData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#38A169" name="Hoàn thành" />
                <Bar dataKey="ongoing" fill="#4299E1" name="Đang thực hiện" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>

        <Flex justify="flex-end" gap={4}>
          <Button
            leftIcon={<FaCalendarCheck />}
            colorScheme="green"
            onClick={() => navigate('/admin-tong/diem-danh')}
          >
            Xem chi tiết điểm danh
          </Button>
          <Button
            leftIcon={<FaProjectDiagram />}
            colorScheme="blue"
            onClick={() => navigate('/quan-ly-du-an')}
          >
            Quản lý dự án
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default AdminTongDashboard;
