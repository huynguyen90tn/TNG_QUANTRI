import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Button,
  VStack,
  HStack,
  useColorModeValue,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaUsers, FaProjectDiagram, FaMoneyBillWave, FaChartPie, FaBell } from 'react-icons/fa';
import { Pie, ResponsiveContainer, PieChart, Cell, Tooltip, Legend } from 'recharts';

const MotionBox = motion(Box);

const memberData = [
  { name: 'Đang hoạt động', value: 300 },
  { name: 'Tạm nghỉ', value: 50 },
  { name: 'Mới gia nhập', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ icon, label, value, color }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    bg={useColorModeValue('white', 'gray.700')}
    p={5}
    rounded="xl"
    shadow="xl"
    borderWidth="1px"
    borderColor={useColorModeValue('gray.200', 'gray.700')}
  >
    <Stat>
      <Flex alignItems="center">
        <Icon as={icon} w={10} h={10} color={color} mr={4} />
        <Box>
          <StatLabel fontWeight="medium" isTruncated>
            {label}
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold">
            {value}
          </StatNumber>
        </Box>
      </Flex>
    </Stat>
  </MotionBox>
);

const AdminConDashboard = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const boxBg = useColorModeValue('white', 'gray.700');

  const handleProjectManagement = () => {
    navigate('/quan-ly-du-an');
  };

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Main content */}
      <Box flex={1} p={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Heading size="lg" color={textColor}>Dashboard Admin Con</Heading>
          <HStack>
            <Button leftIcon={<FaBell />} colorScheme="blue" variant="ghost">
              Thông báo
            </Button>
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                <Avatar size="sm" src="https://bit.ly/dan-abramov" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => {}}>Hồ sơ</MenuItem>
                <MenuItem onClick={() => {}}>Cài đặt tài khoản</MenuItem>
                <MenuItem onClick={() => {}}>Đăng xuất</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
          <StatCard icon={FaUsers} label="Tổng số thành viên" value="450" color="blue.500" />
          <StatCard icon={FaProjectDiagram} label="Dự án đang thực hiện" value="8" color="green.500" />
          <StatCard icon={FaMoneyBillWave} label="Ngân sách quản lý" value="$200,000" color="purple.500" />
          <StatCard icon={FaChartPie} label="Hiệu suất team" value="92%" color="orange.500" />
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <MotionBox
            whileHover={{ scale: 1.02 }}
            bg={boxBg}
            p={6}
            rounded="xl"
            shadow="xl"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Heading size="md" mb={4}>Phân bổ thành viên</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={memberData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {memberData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </MotionBox>

          <MotionBox
            whileHover={{ scale: 1.02 }}
            bg={boxBg}
            p={6}
            rounded="xl"
            shadow="xl"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Heading size="md" mb={4}>Tiến độ dự án</Heading>
            <VStack spacing={4} align="stretch">
              <Box>
                <Flex justify="space-between">
                  <Text>Dự án A</Text>
                  <Text>75%</Text>
                </Flex>
                <Progress colorScheme="green" size="sm" value={75} />
              </Box>
              <Box>
                <Flex justify="space-between">
                  <Text>Dự án B</Text>
                  <Text>45%</Text>
                </Flex>
                <Progress colorScheme="yellow" size="sm" value={45} />
              </Box>
              <Box>
                <Flex justify="space-between">
                  <Text>Dự án C</Text>
                  <Text>90%</Text>
                </Flex>
                <Progress colorScheme="blue" size="sm" value={90} />
              </Box>
            </VStack>
          </MotionBox>
        </SimpleGrid>

        <Box mt={8}>
          <Heading size="md" mb={4}>Nhiệm vụ gần đây</Heading>
          <Box bg={boxBg} rounded="xl" shadow="md" overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nhiệm vụ</Th>
                  <Th>Người phụ trách</Th>
                  <Th>Deadline</Th>
                  <Th>Trạng thái</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Thiết kế giao diện</Td>
                  <Td>John Doe</Td>
                  <Td>20/10/2023</Td>
                  <Td><Badge colorScheme="green">Hoàn thành</Badge></Td>
                </Tr>
                <Tr>
                  <Td>Phát triển backend</Td>
                  <Td>Jane Smith</Td>
                  <Td>25/10/2023</Td>
                  <Td><Badge colorScheme="yellow">Đang thực hiện</Badge></Td>
                </Tr>
                <Tr>
                  <Td>Kiểm thử hệ thống</Td>
                  <Td>Bob Johnson</Td>
                  <Td>30/10/2023</Td>
                  <Td><Badge colorScheme="red">Chưa bắt đầu</Badge></Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>

        <Button mt={8} colorScheme="blue" onClick={handleProjectManagement}>
          Quản lý dự án
        </Button>
      </Box>
    </Flex>
  );
};

export default AdminConDashboard;