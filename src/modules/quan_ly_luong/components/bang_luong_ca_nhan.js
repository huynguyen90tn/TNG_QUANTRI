// File: src/modules/quan_ly_luong/components/bang_luong_ca_nhan.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Select,
  Progress,
  Divider,
  useColorModeValue,
  Table,
  Tbody,
  Tr,
  Td,
  Badge,
  Icon,
  Tooltip,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Button,
  Container,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiUser,
  FiFile,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiFilter,
  FiCalendar,
} from 'react-icons/fi';
import { useLuong } from '../hooks/use_luong';
import { formatCurrency } from '../../../utils/format';

// Biến thể animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const formatSafeTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi });
  } catch {
    return '';
  }
};

const formatSafeDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return format(date, 'dd/MM/yyyy', { locale: vi });
  } catch {
    return '';
  }
};

const COLORS = ['#4299E1', '#48BB78', '#805AD5', '#E53E3E', '#DD6B20'];

export const BangLuongCaNhan = ({ userId }) => {
  const { luongHienTai, layLuongCaNhan, loading } = useLuong();

  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [currentFilter, setCurrentFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Màu sắc cho theme
  const bgGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );
  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (userId) {
      layLuongCaNhan(userId, currentFilter.month, currentFilter.year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, currentFilter.month, currentFilter.year]);

  const {
    tongThuong,
    tongTruLuong,
    tongPhuCap,
    tongThuNhap,
    tongKhauTru,
    chartData,
  } = useMemo(() => {
    if (!luongHienTai) {
      return {
        tongThuong: 0,
        tongTruLuong: 0,
        tongPhuCap: 0,
        tongThuNhap: 0,
        tongKhauTru: 0,
        chartData: null,
      };
    }

    const thuong =
      luongHienTai.thuongList?.reduce(
        (total, item) => total + (item.amount || 0),
        0
      ) || 0;

    const truLuong =
      luongHienTai.phatList?.reduce(
        (total, item) => total + (item.amount || 0),
        0
      ) || 0;

    const phuCap =
      Object.values(luongHienTai.phuCap || {}).reduce((a, b) => a + b, 0) || 0;

    const thuNhap = (luongHienTai.luongCoBan || 0) + thuong + phuCap;

    const khauTru =
      (luongHienTai.thueTNCN || 0) +
      Object.values(luongHienTai.baoHiem || {})
        .filter((value) => typeof value === 'number')
        .reduce((a, b) => a + b, 0) +
      truLuong +
      (luongHienTai.khauTru?.nghiPhepKhongPhep || 0);

    const data = {
      labels: ['Lương cơ bản', 'Thưởng', 'Phụ cấp', 'Khấu trừ', 'Trừ lương'],
      datasets: [
        {
          data: [
            luongHienTai.luongCoBan || 0,
            thuong,
            phuCap,
            -(khauTru - truLuong),
            -truLuong,
          ],
          backgroundColor: COLORS,
          borderWidth: 1,
        },
      ],
    };

    return {
      tongThuong: thuong,
      tongTruLuong: truLuong,
      tongPhuCap: phuCap,
      tongThuNhap: thuNhap,
      tongKhauTru: khauTru,
      chartData: data,
    };
  }, [luongHienTai]);

  const handleApplyFilter = () => {
    setCurrentFilter(filter);
  };

  if (loading) {
    return <Progress size="xs" isIndeterminate colorScheme="blue" />;
  }

  if (!luongHienTai) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Chưa có dữ liệu lương</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        {/* Phần Header */}
        <motion.div variants={itemVariants}>
          <Box
            bgGradient={bgGradient}
            p={6}
            borderRadius="xl"
            color="white"
            mb={6}
            boxShadow="xl"
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold">
                  Bảng Lương Tháng {currentFilter.month}/{currentFilter.year}
                </Text>
                <Text fontSize="sm" opacity={0.8}>
                  Cập nhật: {formatSafeTime(luongHienTai.ngayCapNhat)}
                </Text>
              </VStack>

              <HStack spacing={4}>
                <Select
                  w="120px"
                  value={filter.month}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      month: parseInt(e.target.value),
                    }))
                  }
                  bg="whiteAlpha.200"
                  color="white"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </Select>

                <Select
                  w="120px"
                  value={filter.year}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      year: parseInt(e.target.value),
                    }))
                  }
                  bg="whiteAlpha.200"
                  color="white"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        Năm {year}
                      </option>
                    );
                  })}
                </Select>

                <Button
                  leftIcon={<FiFilter />}
                  onClick={handleApplyFilter}
                  bg="whiteAlpha.200"
                  _hover={{ bg: 'whiteAlpha.300' }}
                >
                  Áp dụng
                </Button>
              </HStack>
            </HStack>
          </Box>
        </motion.div>

        {/* Kiểm tra xem chartData có dữ liệu hay không */}
        {chartData && (
          <Grid templateColumns="repeat(12, 1fr)" gap={6}>
            {/* Cột trái - Biểu đồ */}
            <GridItem colSpan={{ base: 12, lg: 5 }}>
              <motion.div variants={itemVariants}>
                <Box
                  bg={bgCard}
                  p={6}
                  borderRadius="xl"
                  boxShadow="lg"
                  position="relative"
                  overflow="hidden"
                  height="400px"
                >
                  <Text fontSize="xl" mb={4} fontWeight="bold">
                    Biểu Đồ Thu Nhập
                  </Text>

                  {/* Bạn có thể thêm biểu đồ tại đây nếu đã cài đặt chart.js và react-chartjs-2 */}
                  {/* Ví dụ:
                    <Doughnut data={chartData} options={chartOptions} />
                  */}

                  <SimpleGrid columns={2} spacing={4} mt={4}>
                    {chartData.labels.map((label, index) => (
                      <Box key={index}>
                        <HStack>
                          <Box
                            w="3"
                            h="3"
                            borderRadius="full"
                            bg={COLORS[index]}
                          />
                          <Text fontSize="sm" color={mutedColor}>
                            {label}
                          </Text>
                        </HStack>
                        <Text fontWeight="medium">
                          {formatCurrency(
                            Math.abs(chartData.datasets[0].data[index])
                          )}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </motion.div>
            </GridItem>

            {/* Cột phải - Chi tiết */}
            <GridItem colSpan={{ base: 12, lg: 7 }}>
              <motion.div variants={itemVariants}>
                <Box bg={bgCard} p={6} borderRadius="xl" boxShadow="lg">
                  <Text fontSize="xl" mb={4} fontWeight="bold">
                    Chi Tiết Khấu Trừ
                  </Text>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {/* Bảo hiểm */}
                    <Box>
                      <Text fontWeight="medium" mb={2}>
                        Bảo hiểm:
                      </Text>
                      <VStack align="stretch" spacing={2}>
                        <HStack justify="space-between">
                          <HStack>
                            <Text>BHYT (1.5%)</Text>
                            <Tooltip label="Bảo hiểm y tế">
                              <Icon as={FiInfo} color="blue.400" />
                            </Tooltip>
                          </HStack>
                          <Text>
                            {formatCurrency(luongHienTai.baoHiem?.bhyt || 0)}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <HStack>
                            <Text>BHXH (8%)</Text>
                            <Tooltip label="Bảo hiểm xã hội">
                              <Icon as={FiInfo} color="blue.400" />
                            </Tooltip>
                          </HStack>
                          <Text>
                            {formatCurrency(luongHienTai.baoHiem?.bhxh || 0)}
                          </Text>
                        </HStack>
                        <HStack justify="space-between">
                          <HStack>
                            <Text>BHTN (1%)</Text>
                            <Tooltip label="Bảo hiểm thất nghiệp">
                              <Icon as={FiInfo} color="blue.400" />
                            </Tooltip>
                          </HStack>
                          <Text>
                            {formatCurrency(luongHienTai.baoHiem?.bhtn || 0)}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>

                    {/* Khấu trừ khác */}
                    <Box>
                      <Text fontWeight="medium" mb={2}>
                        Khấu trừ khác:
                      </Text>
                      <VStack align="stretch" spacing={2}>
                        {luongHienTai.khauTru?.nghiPhepKhongPhep > 0 && (
                          <HStack justify="space-between">
                            <Text color="red.500">
                              Không báo cáo (
                              {luongHienTai.khauTru.chiTiet.length} ngày)
                            </Text>
                            <Text color="red.500">
                              -
                              {formatCurrency(
                                luongHienTai.khauTru.nghiPhepKhongPhep
                              )}
                            </Text>
                          </HStack>
                        )}

                        <HStack justify="space-between">
                          <Text>Thuế TNCN</Text>
                          <Text>
                            {formatCurrency(luongHienTai.thueTNCN || 0)}
                          </Text>
                        </HStack>
                      </VStack>
                    </Box>
                  </Grid>

                  {luongHienTai.khauTru?.nghiPhepKhongPhep > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        mt={4}
                        p={4}
                        bg="red.50"
                        _dark={{ bg: 'red.900' }}
                        borderRadius="md"
                      >
                        <HStack justify="space-between" mb={2}>
                          <HStack>
                            <Icon as={FiCalendar} color="red.500" />
                            <Text fontWeight="medium" color="red.500">
                              Chi tiết ngày không báo cáo:
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="red.500">
                            (Trừ{' '}
                            {formatCurrency(
                              luongHienTai.khauTru.nghiPhepKhongPhep /
                                luongHienTai.khauTru.chiTiet.length
                            )}{' '}
                            / ngày)
                          </Text>
                        </HStack>

                        <SimpleGrid
                          columns={{ base: 2, md: 3, lg: 4 }}
                          spacing={2}
                        >
                          {luongHienTai.khauTru.chiTiet.map((item, index) => (
                            <HStack
                              key={index}
                              p={2}
                              bg="white"
                              _dark={{ bg: 'red.800' }}
                              borderRadius="md"
                              fontSize="sm"
                            >
                              <Icon as={FiAlertCircle} color="red.500" />
                              <Text>
                                {format(new Date(item.date), 'dd/MM/yyyy')}
                              </Text>
                            </HStack>
                          ))}
                        </SimpleGrid>
                      </Box>
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            </GridItem>
          </Grid>
        )}

        {/* Phần chi tiết thu nhập */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={6}>
          <motion.div variants={itemVariants}>
            <Box bg={bgCard} boxShadow="lg" p={4} borderRadius="xl">
              <VStack align="start" spacing={1}>
                <HStack color="blue.500">
                  <Icon as={FiDollarSign} />
                  <Text fontWeight="medium">Lương Cơ Bản</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">
                  {formatCurrency(luongHienTai.luongCoBan || 0)}
                </Text>
              </VStack>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box bg={bgCard} boxShadow="lg" p={4} borderRadius="xl">
              <VStack align="start" spacing={1}>
                <HStack color="green.500">
                  <Icon as={FiTrendingUp} />
                  <Text fontWeight="medium">Tổng Thu Nhập</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">
                  {formatCurrency(tongThuNhap)}
                </Text>
              </VStack>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box bg={bgCard} boxShadow="lg" p={4} borderRadius="xl">
              <VStack align="start" spacing={1}>
                <HStack color="purple.500">
                  <Icon as={FiDollarSign} />
                  <Text fontWeight="medium">Thực Lĩnh</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {formatCurrency(luongHienTai.thucLinh || 0)}
                </Text>
              </VStack>
            </Box>
          </motion.div>
        </SimpleGrid>

        {/* Phần chi tiết thưởng, trừ lương, phụ cấp */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={6}>
          <motion.div variants={itemVariants}>
            <Box bg={bgCard} p={4} borderRadius="xl">
              <HStack>
                <Icon as={FiTrendingUp} color="green.400" />
                <Text fontSize="lg" fontWeight="medium">
                  Chi Tiết Thưởng
                </Text>
              </HStack>
              <VStack spacing={4} align="stretch" mt={4}>
                {luongHienTai.thuongList?.length > 0 ? (
                  <List spacing={3}>
                    {luongHienTai.thuongList.map((item, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <HStack>
                            <ListIcon as={FiCheckCircle} color="green.400" />
                            <VStack align="start" spacing={0}>
                              <Text>{item.reason}</Text>
                              <Text fontSize="xs" color={mutedColor}>
                                {formatSafeDate(item.ngayTao)} -{' '}
                                {item.nguoiTao || 'N/A'}
                              </Text>
                            </VStack>
                          </HStack>
                          <Text color="green.400">
                            +{formatCurrency(item.amount || 0)}
                          </Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Text>Không có khoản thưởng nào</Text>
                )}

                <Divider />

                <HStack
                  justify="space-between"
                  color="green.400"
                  fontWeight="bold"
                >
                  <Text>Tổng thưởng</Text>
                  <Text>{formatCurrency(tongThuong)}</Text>
                </HStack>
              </VStack>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box bg={bgCard} p={4} borderRadius="xl">
              <HStack>
                <Icon as={FiTrendingDown} color="red.400" />
                <Text fontSize="lg" fontWeight="medium">
                  Chi Tiết Trừ Lương
                </Text>
              </HStack>
              <VStack spacing={4} align="stretch" mt={4}>
                {luongHienTai.phatList?.length > 0 ? (
                  <List spacing={3}>
                    {luongHienTai.phatList.map((item, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <HStack>
                            <ListIcon as={FiAlertCircle} color="red.400" />
                            <VStack align="start" spacing={0}>
                              <Text>{item.reason}</Text>
                              <Text fontSize="xs" color={mutedColor}>
                                {formatSafeDate(item.ngayTao)} -{' '}
                                {item.nguoiTao || 'N/A'}
                              </Text>
                            </VStack>
                          </HStack>
                          <Text color="red.400">
                            -{formatCurrency(item.amount || 0)}
                          </Text>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Text>Không có khoản trừ lương nào</Text>
                )}

                <Divider />

                <HStack
                  justify="space-between"
                  color="red.400"
                  fontWeight="bold"
                >
                  <Text>Tổng trừ lương</Text>
                  <Text>-{formatCurrency(tongTruLuong)}</Text>
                </HStack>
              </VStack>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Box bg={bgCard} p={4} borderRadius="xl">
              <HStack>
                <Icon as={FiDollarSign} color="purple.400" />
                <Text fontSize="lg" fontWeight="medium">
                  Chi Tiết Phụ Cấp
                </Text>
              </HStack>
              <VStack spacing={4} align="stretch" mt={4}>
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Td>Ăn uống</Td>
                      <Td isNumeric>
                        {formatCurrency(luongHienTai.phuCap?.anUong || 0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Đi lại</Td>
                      <Td isNumeric>
                        {formatCurrency(luongHienTai.phuCap?.diLai || 0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Điện thoại</Td>
                      <Td isNumeric>
                        {formatCurrency(luongHienTai.phuCap?.dienThoai || 0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Khác</Td>
                      <Td isNumeric>
                        {formatCurrency(luongHienTai.phuCap?.khac || 0)}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>

                <Divider />

                <HStack
                  justify="space-between"
                  color="purple.400"
                  fontWeight="bold"
                >
                  <Text>Tổng phụ cấp</Text>
                  <Text>{formatCurrency(tongPhuCap)}</Text>
                </HStack>
              </VStack>
            </Box>
          </motion.div>
        </SimpleGrid>

        {/* Phần Footer - Trạng thái */}
        <motion.div variants={itemVariants}>
          <Box bg={bgCard} mt={6} p={4} borderRadius="xl">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <HStack>
                <Icon as={FiClock} color="blue.400" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color={mutedColor}>
                    Kỳ lương
                  </Text>
                  <Text>
                    Tháng {currentFilter.month}/{currentFilter.year}
                  </Text>
                </VStack>
              </HStack>

              <HStack>
                <Icon as={FiUser} color="purple.400" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color={mutedColor}>
                    Người duyệt
                  </Text>
                  <Text>{luongHienTai.nguoiDuyet || '---'}</Text>
                </VStack>
              </HStack>

              <HStack>
                <Icon as={FiFile} color="green.400" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color={mutedColor}>
                    Trạng thái
                  </Text>
                  <Badge
                    colorScheme={
                      luongHienTai.trangThai === 'DA_THANH_TOAN'
                        ? 'green'
                        : luongHienTai.trangThai === 'CHO_DUYET'
                        ? 'yellow'
                        : 'blue'
                    }
                  >
                    {luongHienTai.trangThai === 'DA_THANH_TOAN'
                      ? 'Đã thanh toán'
                      : luongHienTai.trangThai === 'CHO_DUYET'
                      ? 'Chờ duyệt'
                      : 'Đã duyệt'}
                  </Badge>
                </VStack>
              </HStack>
            </SimpleGrid>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

BangLuongCaNhan.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default BangLuongCaNhan;
