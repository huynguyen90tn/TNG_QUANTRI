import React, { useState } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  Box,
  Image,
  Input,
  Button,
  FormControl,
  useToast,
  SimpleGrid,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUnlock, FaListAlt, FaCodeBranch, FaBug, FaChartPie } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const QuanLyChiTietPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const features = [
    {
      title: 'Tính năng',
      icon: FaListAlt,
      path: '/quan-ly-chi-tiet/tinh-nang',
      color: 'pink.500',
      description: 'Quản lý chi tiết tính năng và module',
    },
    {
      title: 'Backend',
      icon: FaCodeBranch,
      path: '/quan-ly-chi-tiet/backend',
      color: 'orange.500',
      description: 'Quản lý API và cơ sở dữ liệu',
    },
    {
      title: 'Kiểm thử',
      icon: FaBug,
      path: '/quan-ly-chi-tiet/kiem-thu',
      color: 'red.500',
      description: 'Quản lý testing và debug',
    },
    {
      title: 'Thống kê',
      icon: FaChartPie,
      path: '/quan-ly-chi-tiet/thong-ke',
      color: 'cyan.500',
      description: 'Xem báo cáo và phân tích',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  const handlePasswordSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (password === 'codetng') {
        setIsAuthenticated(true);
        toast({
          title: 'Xác thực thành công',
          description: 'Chào mừng bạn đến với khu vực quản lý chi tiết',
          status: 'success',
          duration: 2000,
        });
      } else {
        toast({
          title: 'Mật khẩu không đúng',
          description: 'Vui lòng thử lại',
          status: 'error',
          duration: 2000,
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <Container maxW="container.md" py={8}>
        <MotionCard
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          bg={bgColor}
          p={8}
        >
          <VStack spacing={8}>
            <Box boxSize={{ base: '100px', md: '150px' }}>
              <Image
                src="/images/LOGOTNG.png"
                alt="TNG Logo"
                objectFit="contain"
              />
            </Box>

            <VStack spacing={4} align="center" w="100%">
              <Icon as={FaLock} w={8} h={8} color="blue.500" />
              <Heading size="lg">Khu Vực Bảo Mật</Heading>
              <Text color={textColor} textAlign="center">
                &quot;Code không chỉ là công việc, đó là nghệ thuật của sự hoàn hảo&quot;
              </Text>
              <Badge colorScheme="blue" p={2} borderRadius="md">
                Vui lòng nhập mật khẩu để tiếp tục
              </Badge>
            </VStack>

            <FormControl>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                size="lg"
                textAlign="center"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
            </FormControl>

            <Button
              colorScheme="blue"
              size="lg"
              width="full"
              onClick={handlePasswordSubmit}
              isLoading={isLoading}
              loadingText="Đang xác thực..."
              leftIcon={<FaUnlock />}
            >
              Xác nhận
            </Button>
          </VStack>
        </MotionCard>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <MotionCard
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          w="100%"
          bg={bgColor}
        >
          <CardHeader>
            <VStack spacing={4}>
              <Box boxSize={{ base: '100px', md: '120px' }}>
                <Image
                  src="/images/LOGOTNG.png"
                  alt="TNG Logo"
                  objectFit="contain"
                />
              </Box>
              <Heading size="lg">Quản Lý Chi Tiết</Heading>
            </VStack>
          </CardHeader>

          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {features.map((feature) => (
                <MotionCard
                  key={feature.path}
                  variants={itemVariants}
                  cursor="pointer"
                  onClick={() => navigate(feature.path)}
                  borderWidth="1px"
                  borderColor={borderColor}
                  _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <VStack spacing={4} align="center">
                      <Icon as={feature.icon} w={8} h={8} color={feature.color} />
                      <Heading size="md">{feature.title}</Heading>
                      <Text color={textColor} fontSize="sm" textAlign="center">
                        {feature.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </CardBody>
        </MotionCard>
      </VStack>
    </Container>
  );
};

export default QuanLyChiTietPage;
