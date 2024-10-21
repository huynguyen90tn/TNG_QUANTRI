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
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaTasks, FaProjectDiagram, FaAward, FaChartLine, FaHome, FaCog, FaBell } from 'react-icons/fa';
import { Pie, Bar, ResponsiveContainer, PieChart, BarChart, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const MotionBox = motion(Box);

const taskData = [
  { name: 'Đã hoàn thành', value: 30 },
  { name: 'Đang thực hiện', value: 15 },
  { name: 'Chưa bắt đầu', value: 5 },
];

const projectData = [
  { name: 'Dự án A', value: 40 },
  { name: 'Dự án B', value: 30 },
  { name: 'Dự án C', value: 20 },
  { name: 'Dự án D', value: 10 },
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

const MemberDashboard = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  const handleProjectManagement = () => {
    navigate('/quan-ly-du-an');
  };

  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* Main content */}
      <Box flex={1} p={8}>
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Heading size="lg" color={textColor}>Dashboard Thành viên</Heading>
          <HStack>
            <Button leftIcon={<FaBell />} colorScheme="blue" variant="ghost">
              Thông báo
            </Button>
            <Menu>
              <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
                <Avatar size="sm" src="https://bit.ly/dan-abramov" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => {}}>Thông tin cá nhân</MenuItem>
                <MenuItem onClick={() => {}}>Cài đặt tài khoản</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
          <StatCard icon={FaTasks} label="Nhiệm vụ hoàn thành" value="30" color="blue.500" />
          <StatCard icon={FaProjectDiagram} label="Dự án tham gia" value="4" color="green.500" />
          <StatCard icon={FaAward} label="Điểm thưởng" value="150" color="purple.500" />
          <StatCard icon={FaChartLine} label="Hiệu suất" value="85%" color="orange.500" />
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          <MotionBox
            whileHover={{ scale: 1.02 }}
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            rounded="xl"
            shadow="xl"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Heading size="md" mb={4}>Phân bổ nhiệm vụ</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskData.map((entry, index) => (
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
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            rounded="xl"
            shadow="xl"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Heading size="md" mb={4}>Đóng góp theo dự án</Heading>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </MotionBox>
        </SimpleGrid>

        <Button mt={8} colorScheme="blue" onClick={handleProjectManagement}>
          Xem dự án
        </Button>
      </Box>
    </Flex>
  );
};

export default MemberDashboard;