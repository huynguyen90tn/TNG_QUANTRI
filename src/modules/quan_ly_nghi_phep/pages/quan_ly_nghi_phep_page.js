// File: src/modules/quan_ly_nghi_phep/pages/quan_ly_nghi_phep_page.js
import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  useDisclosure,
  useColorModeValue,
  Text,
  Flex,
  Icon,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaHome, FaChevronRight } from 'react-icons/fa';
import DanhSachDonNghiPhep from '../components/danh_sach_don_nghi_phep';
import FormTaoDonNghiPhep from '../components/form_tao_don_nghi_phep';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const QuanLyNghiPhepPage = () => {
  const {
    isOpen: isOpenForm,
    onOpen: onOpenForm,
    onClose: onCloseForm
  } = useDisclosure();

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <MotionBox
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Breadcrumb */}
          <Breadcrumb
            mb={6}
            spacing="8px"
            separator={<Icon as={FaChevronRight} color={textColor} />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Icon as={FaHome} mr={2} />
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Quản lý nghỉ phép</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header */}
          <MotionFlex
            justify="space-between"
            align="center"
            mb={8}
            variants={itemVariants}
          >
            <VStack align="start" spacing={2}>
              <Flex align="center">
                <Icon 
                  as={FaCalendarAlt} 
                  w={8} 
                  h={8} 
                  color={headingColor}
                  mr={3}
                />
                <Heading size="lg" color={headingColor}>
                  Quản lý đơn xin nghỉ phép
                </Heading>
              </Flex>
              <Text color={textColor}>
                Quản lý và theo dõi các đơn xin nghỉ phép của bạn
              </Text>
            </VStack>
          </MotionFlex>

          {/* Main Content */}
          <MotionBox
            bg={cardBg}
            shadow="xl"
            rounded="2xl"
            p={6}
            borderWidth="1px"
            borderColor={borderColor}
            variants={itemVariants}
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "2xl",
              background: "linear-gradient(45deg, transparent 98%, blue.500 100%)",
              zIndex: -1,
            }}
            transition="all 0.3s"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "2xl",
              borderColor: "blue.500",
            }}
          >
            <DanhSachDonNghiPhep />
          </MotionBox>

          <FormTaoDonNghiPhep
            isOpen={isOpenForm}
            onClose={onCloseForm}
          />
        </MotionBox>
      </Container>
    </Box>
  );
};

export default QuanLyNghiPhepPage;