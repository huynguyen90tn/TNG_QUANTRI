import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Text,
  Heading,
  useColorModeValue,
  VStack,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaUsers, FaProjectDiagram, FaMoneyBillWave, FaChartPie, FaChevronDown } from 'react-icons/fa';
import { Pie, Bar, ResponsiveContainer, PieChart, BarChart, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const MotionBox = motion(Box);

const memberData = [
  { name: 'Thành viên mới', value: 400 },
  { name: 'Thành viên cũ', value: 300 },
  { name: 'Thành viên không hoạt động', value: 300 },
];

const projectData = [
  { name: 'Dự án A', value: 400 },
  { name: 'Dự án B', value: 300 },
  { name: 'Dự án C', value: 200 },
  { name: 'Dự án D', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ icon, label, value, color }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Stat
      px={4}
      py={5}
      shadow="xl"
      border="1px solid"
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded="lg"
      bg={useColorModeValue('white', 'gray.700')}
    >
      <Flex justifyContent="space-between">
        <Box pl={2}>
          <StatLabel fontWeight="medium" isTruncated color={useColorModeValue('gray.500', 'gray.400')}>
            {label}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="medium" color={color}>
            {value}
          </StatNumber>
        </Box>
        <Box my="auto" color={color} alignContent="center">
          <Icon as={icon} w={8} h={8} />
        </Box>
      </Flex>
    </Stat>
  </MotionBox>
);

const AdminTongDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBg = useColorModeValue('white', 'gray.700');

  const handleRegisterMember = () => {
    navigate('/tao-thanh-vien');
  };

  const handleRegisterAdmin = () => {
    navigate('/tao-quan-tri');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        boxShadow="md"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            TNG Admin
          </Heading>
        </Flex>

        <HStack spacing={4}>
          <Menu>
            <MenuButton as={Button} rightIcon={<FaChevronDown />}>
              Thao tác
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleRegisterMember}>Đăng ký Thành viên</MenuItem>
              <MenuItem onClick={handleRegisterAdmin}>Đăng ký Quản trị</MenuItem>
            </MenuList>
          </Menu>
          <Button colorScheme="blue" onClick={handleLogout}>Đăng xuất</Button>
        </HStack>
      </Flex>

      <Box p={8}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl" mb={6}>
            Dashboard Admin Tổng
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <StatCard icon={FaUsers} label="Tổng số thành viên" value="1,000" color="blue.500" />
            <StatCard icon={FaProjectDiagram} label="Số lượng dự án" value="50" color="green.500" />
            <StatCard icon={FaMoneyBillWave} label="Tổng doanh thu" value="$500,000" color="purple.500" />
            <StatCard icon={FaChartPie} label="KPI đạt được" value="85%" color="orange.500" />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <MotionBox
              bg={boxBg}
              p={6}
              borderRadius="lg"
              boxShadow="xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
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
              bg={boxBg}
              p={6}
              borderRadius="lg"
              boxShadow="xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading size="md" mb={4}>Doanh thu theo dự án</Heading>
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
        </VStack>
      </Box>
    </Box>
  );
};

export default AdminTongDashboard;