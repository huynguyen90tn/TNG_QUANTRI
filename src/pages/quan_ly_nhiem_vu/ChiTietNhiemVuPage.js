// src/pages/quan_ly_chi_tiet/QuanLyChiTietPage.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  SimpleGrid,
  Icon,
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCode, FaDatabase, FaBug, FaChartLine } from 'react-icons/fa';

const QuanLyChiTietPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handlePasswordSubmit = () => {
    if (password === 'codetng') {
      setIsAuthenticated(true);
      onClose();
      toast({
        title: 'Xác thực thành công',
        status: 'success',
        duration: 2000,
      });
    } else {
      toast({
        title: 'Mật khẩu không đúng',
        status: 'error',
        duration: 2000,
      });
    }
  };

  const features = [
    {
      title: 'Tính năng',
      icon: FaCode,
      path: '/quan-ly-nhiem-vu-chi-tiet',
      color: 'pink.500',
    },
    {
      title: 'Backend',
      icon: FaDatabase,
      path: '/quan-ly-nhiem-vu-chi-tiet/backend',
      color: 'orange.500',
    },
    {
      title: 'Kiểm thử', 
      icon: FaBug,
      path: '/quan-ly-nhiem-vu-chi-tiet/kiem-thu',
      color: 'red.500',
    },
    {
      title: 'Thống kê',
      icon: FaChartLine,
      path: '/quan-ly-nhiem-vu-chi-tiet/thong-ke',
      color: 'cyan.500', 
    }
  ];

  if (!isAuthenticated) {
    return (
      <Container maxW="xl" py={10}>
        <VStack spacing={6}>
          <Icon as={FaLock} w={12} h={12} color="gray.500" />
          <Text fontSize="xl">
            Vui lòng nhập mật khẩu để truy cập nội dung quản lý chi tiết
          </Text>
          <Button colorScheme="blue" onClick={onOpen}>
            Nhập mật khẩu
          </Button>
          
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Xác thực truy cập</ModalHeader>
              <ModalBody>
                <FormControl>
                  <FormLabel>Mật khẩu</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Hủy
                </Button>
                <Button colorScheme="blue" onClick={handlePasswordSubmit}>
                  Xác nhận
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8}>
        <Text fontSize="2xl" fontWeight="bold">
          Quản lý chi tiết
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} width="100%">
          {features.map((feature) => (
            <Card
              key={feature.path}
              cursor="pointer"
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.2s"
              onClick={() => navigate(feature.path)}
            >
              <CardBody>
                <VStack spacing={4}>
                  <Icon as={feature.icon} w={8} h={8} color={feature.color} />
                  <Text fontWeight="medium">{feature.title}</Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default QuanLyChiTietPage;