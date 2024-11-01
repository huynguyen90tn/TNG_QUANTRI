import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  VStack,
  HStack,
  Spinner,
  useToast,
  Box,
  Text,
  Heading,
  Badge,
  Divider,
  Icon,
  Link,
  Button,
  useColorModeValue,
  Card,
  CardBody,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  CalendarIcon,
  TimeIcon,
  LinkIcon,
  InfoIcon,
  CheckIcon,
  WarningIcon,
  ArrowBackIcon,
} from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { baoCaoApi } from '../../../services/api/bao_cao_api';
import { getUser } from '../../../services/api/userApi';
import { TRANG_THAI_BAO_CAO } from '../constants/trang_thai';
import { LOAI_BAO_CAO, PHAN_HE } from '../constants/loai_bao_cao';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const ChiTietBaoCao = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [baoCao, setBaoCao] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme colors
  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const textColor = useColorModeValue('gray.100', 'gray.50');
  const borderColor = useColorModeValue('gray.700', 'gray.600');
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const accentColor = useColorModeValue('blue.400', 'blue.300');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
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

  const loadBaoCao = useCallback(async () => {
    if (!reportId) {
      navigate('/bao-cao-ngay');
      return;
    }

    try {
      const data = await baoCaoApi.layChiTiet(reportId);
      
      const [nguoiTaoInfo, nguoiDuyetInfo, nguoiNhanInfo] = await Promise.all([
        data.nguoiTao ? getUser(data.nguoiTao) : null,
        data.nguoiDuyet ? getUser(data.nguoiDuyet) : null,
        data.nguoiNhan ? getUser(data.nguoiNhan) : null
      ]);

      const enrichedData = {
        ...data,
        nguoiTaoInfo: nguoiTaoInfo ? {
          ten: nguoiTaoInfo.fullName,
          email: nguoiTaoInfo.email,
          maSo: nguoiTaoInfo.memberCode,
          avatar: nguoiTaoInfo.avatar,
          department: nguoiTaoInfo.department
        } : null,
        nguoiDuyetInfo: nguoiDuyetInfo ? {
          ten: nguoiDuyetInfo.fullName,
          email: nguoiDuyetInfo.email,
          maSo: nguoiDuyetInfo.memberCode,
          avatar: nguoiDuyetInfo.avatar
        } : null,
        nguoiNhanInfo: nguoiNhanInfo ? {
          ten: nguoiNhanInfo.fullName,
          email: nguoiNhanInfo.email,
          maSo: nguoiNhanInfo.memberCode,
          avatar: nguoiNhanInfo.avatar
        } : null
      };

      setBaoCao(enrichedData);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải báo cáo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/bao-cao-ngay');
    } finally {
      setLoading(false);
    }
  }, [reportId, navigate, toast]);

  useEffect(() => {
    loadBaoCao();
  }, [loadBaoCao]);

  const handleClose = () => {
    navigate('/bao-cao-ngay');
  };

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.600"
          color={accentColor}
          size="xl"
        />
      </Container>
    );
  }

  if (!baoCao) {
    return null;
  }

  const trangThai = TRANG_THAI_BAO_CAO[baoCao.trangThai];
  const loaiBaoCao = LOAI_BAO_CAO.find(l => l.id === baoCao.loaiBaoCao);
  const phanHe = PHAN_HE.find(p => p.id === baoCao.phanHe);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      minH="100vh"
      bg={bgColor}
      color={textColor}
      py={8}
    >
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between" wrap="wrap" spacing={4}>
            <Button
              leftIcon={<ArrowBackIcon />}
              onClick={handleClose}
              variant="ghost"
              color={accentColor}
              _hover={{ bg: 'gray.700' }}
            >
              Quay lại
            </Button>
            <Badge
              colorScheme={trangThai?.color}
              p={2}
              borderRadius="md"
              fontSize="md"
            >
              {trangThai?.icon} {trangThai?.label}
            </Badge>
          </HStack>

          {/* Main Content */}
          <MotionCard
            variants={itemVariants}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="xl"
          >
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Tiêu đề và thông tin cơ bản */}
                <Box>
                  <Heading size="lg" mb={4} color={textColor}>
                    {baoCao.tieuDe}
                  </Heading>
                  <HStack spacing={4} wrap="wrap">
                    <Badge colorScheme="blue">
                      {loaiBaoCao?.icon} {loaiBaoCao?.label}
                    </Badge>
                    <Badge colorScheme="purple">
                      {phanHe?.name}
                    </Badge>
                    <Text fontSize="sm" color="gray.400">
                      ID: {baoCao.reportId}
                    </Text>
                  </HStack>
                </Box>

                <Divider borderColor={borderColor} />

                {/* Grid layout for user info */}
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                  gap={6}
                >
                  {/* Người tạo */}
                  <GridItem>
                    <Card bg="gray.700" borderRadius="lg">
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <Text color="gray.400">Người tạo báo cáo</Text>
                          <HStack>
                            <Icon as={InfoIcon} color={accentColor} />
                            <Text fontWeight="bold">{baoCao.nguoiTaoInfo?.ten}</Text>
                          </HStack>
                          <Text fontSize="sm">Mã số: {baoCao.nguoiTaoInfo?.maSo}</Text>
                          <Text fontSize="sm">Email: {baoCao.nguoiTaoInfo?.email}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>

                  {/* Người nhận */}
                  <GridItem>
                    <Card bg="gray.700" borderRadius="lg">
                      <CardBody>
                        <VStack align="start" spacing={2}>
                          <Text color="gray.400">Người nhận báo cáo</Text>
                          <HStack>
                            <Icon as={InfoIcon} color={accentColor} />
                            <Text fontWeight="bold">{baoCao.nguoiNhanInfo?.ten}</Text>
                          </HStack>
                          <Text fontSize="sm">Mã số: {baoCao.nguoiNhanInfo?.maSo}</Text>
                          <Text fontSize="sm">Email: {baoCao.nguoiNhanInfo?.email}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>

                {/* Thời gian và thông tin bổ sung */}
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                  <HStack>
                    <Icon as={CalendarIcon} color={accentColor} />
                    <Text>Ngày tạo: {formatDateTime(baoCao.ngayTao)}</Text>
                  </HStack>
                  {baoCao.ngayCapNhat && (
                    <HStack>
                      <Icon as={TimeIcon} color={accentColor} />
                      <Text>Cập nhật: {formatDateTime(baoCao.ngayCapNhat)}</Text>
                    </HStack>
                  )}
                </Grid>

                {/* Nội dung báo cáo */}
                <Box
                  bg="gray.700"
                  p={6}
                  borderRadius="lg"
                  className="report-content"
                  dangerouslySetInnerHTML={{ __html: baoCao.noiDung }}
                  sx={{
                    'img': {
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 'md',
                      my: 4
                    },
                    'a': {
                      color: accentColor,
                      textDecoration: 'none',
                      _hover: {
                        textDecoration: 'underline'
                      }
                    },
                    'ul, ol': {
                      paddingLeft: '2rem',
                      my: 4
                    }
                  }}
                />

                {/* Link báo cáo */}
                {baoCao.linkBaoCao && (
                  <Link
                    href={baoCao.linkBaoCao}
                    isExternal
                    color={accentColor}
                    display="inline-flex"
                    alignItems="center"
                  >
                    <LinkIcon mr={2} />
                    Link báo cáo đính kèm
                  </Link>
                )}

                {/* Thông tin duyệt */}
                {baoCao.nguoiDuyetInfo && (
                  <Box bg="gray.700" p={4} borderRadius="lg">
                    <HStack spacing={4}>
                      <Icon
                        as={baoCao.trangThai === 'da_duyet' ? CheckIcon : WarningIcon}
                        color={baoCao.trangThai === 'da_duyet' ? 'green.400' : 'yellow.400'}
                      />
                      <VStack align="start" spacing={1}>
                        <Text>Người duyệt: {baoCao.nguoiDuyetInfo.ten}</Text>
                        {baoCao.ghiChu && (
                          <Text fontSize="sm" color="gray.400">
                            Ghi chú: {baoCao.ghiChu}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </MotionCard>
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default ChiTietBaoCao;