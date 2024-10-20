import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Icon,
  Text,
  Button,
  VStack,
  HStack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaUsers, FaProjectDiagram, FaMoneyBillWave, FaChartPie, FaHome, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Pie, Bar, ResponsiveContainer, PieChart, BarChart, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

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
  <Stat
    px={{ base: 2, md: 4 }}
    py={'5'}
    shadow={'xl'}
    border={'1px solid'}
    borderColor={useColorModeValue('gray.800', 'gray.500')}
    rounded={'lg'}
    bg={useColorModeValue('gray.700', 'gray.900')}
  >
    <Flex justifyContent={'space-between'}>
      <Box pl={{ base: 2, md: 4 }}>
        <StatLabel fontWeight={'medium'} isTruncated color="gray.400">
          {label}
        </StatLabel>
        <StatNumber fontSize={'2xl'} fontWeight={'medium'} color={color}>
          {value}
        </StatNumber>
      </Box>
      <Box
        my={'auto'}
        color={color}
        alignContent={'center'}
      >
        <Icon as={icon} w={8} h={8} />
      </Box>
    </Flex>
  </Stat>
);

const NavItem = ({ icon, children, to }) => (
  <Link as={RouterLink} to={to} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: 'blue.400',
        color: 'white',
      }}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: 'white',
          }}
          as={icon}
        />
      )}
      <Text fontSize="md" fontWeight="medium">{children}</Text>
    </Flex>
  </Link>
);

const Sidebar = () => {
  return (
    <Box
      bg={useColorModeValue('gray.900', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.700', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">
          Logo
        </Text>
      </Flex>
      <VStack align="stretch" spacing={0}>
        <Box bg="blue.500" p={4}>
          <Text color="white" fontWeight="bold" fontSize="lg">Admin Tổng</Text>
        </Box>
        <NavItem icon={FaHome} to="/admin-tong">Dashboard</NavItem>
        <NavItem icon={FaUsers} to="/quan-ly-thanh-vien">Quản lý thành viên</NavItem>
        <NavItem icon={FaProjectDiagram} to="/quan-ly-du-an">Quản lý dự án</NavItem>
        <NavItem icon={FaCog} to="/cai-dat">Cài đặt</NavItem>
        <Flex flex={1} />
        <NavItem icon={FaSignOutAlt} to="/logout">Đăng xuất</NavItem>
      </VStack>
    </Box>
  );
};

const AdminTongDashboard = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const textColor = useColorModeValue('gray.100', 'gray.50');

  const handleRegisterMember = () => {
    navigate('/tao-thanh-vien');
  };

  const handleRegisterAdmin = () => {
    navigate('/tao-quan-tri');
  };

  return (
    <Flex>
      <Sidebar />
      <Box ml={{ base: 0, md: 60 }} p="5" bg={bgColor} color={textColor} w="calc(100% - 240px)" minH="100vh">
        <Flex justifyContent="space-between" alignItems="center" mb={5}>
          <Heading size="lg">Dashboard Admin Tổng</Heading>
          <HStack>
            <Button leftIcon={<FaUsers />} colorScheme="blue" onClick={handleRegisterMember}>
              Đăng ký Thành viên
            </Button>
            <Button leftIcon={<FaUsers />} colorScheme="green" onClick={handleRegisterAdmin}>
              Đăng ký Quản trị
            </Button>
          </HStack>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={5}>
          <StatCard icon={FaUsers} label="Tổng số thành viên" value="1,000" color="blue.400" />
          <StatCard icon={FaProjectDiagram} label="Số lượng dự án" value="50" color="green.400" />
          <StatCard icon={FaMoneyBillWave} label="Tổng doanh thu" value="$500,000" color="purple.400" />
          <StatCard icon={FaChartPie} label="KPI đạt được" value="85%" color="orange.400" />
        </SimpleGrid>
        
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
          <Box bg={useColorModeValue('gray.700', 'gray.800')} p={5} borderRadius="lg" height="400px">
            <Heading size="md" mb={4}>Phân bổ thành viên</Heading>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={memberData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
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
          </Box>
          <Box bg={useColorModeValue('gray.700', 'gray.800')} p={5} borderRadius="lg" height="400px">
            <Heading size="md" mb={4}>Doanh thu theo dự án</Heading>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={projectData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

export default AdminTongDashboard;