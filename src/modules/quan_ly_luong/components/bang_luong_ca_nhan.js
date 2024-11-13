// File: src/modules/quan_ly_luong/components/bang_luong_ca_nhan.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardHeader,
  CardBody,
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
  Button
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
  FiFilter
} from 'react-icons/fi';
import { useLuong } from '../hooks/use_luong';
import { formatCurrency } from '../../../utils/format';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

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

const COLORS = ['#3182ce', '#38a169', '#805ad5', '#e53e3e', '#dd6b20'];

export const BangLuongCaNhan = ({ userId }) => {
  const { luongHienTai, layLuongCaNhan, loading } = useLuong();
  
  // State cho filter và giá trị hiện tại
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const [currentFilter, setCurrentFilter] = useState({
    month: new Date().getMonth() + 1, 
    year: new Date().getFullYear()
  });

  // Theme colors 
  const bgCard = useColorModeValue('gray.800', 'gray.700');
  const textColor = useColorModeValue('gray.100', 'gray.200');
  const borderColor = useColorModeValue('gray.700', 'gray.600');

  useEffect(() => {
    if (userId) {
      layLuongCaNhan(userId, currentFilter.month, currentFilter.year);
    }
  }, [userId, layLuongCaNhan, currentFilter]);

  // Tính tổng từ danh sách
  const { tongThuong, tongTruLuong, tongPhuCap } = useMemo(() => {
    if (!luongHienTai) return { tongThuong: 0, tongTruLuong: 0, tongPhuCap: 0 };
    
    const tongThuong = luongHienTai.thuongList?.reduce((total, item) => 
      total + (item.amount || 0), 0) || 0;

    const tongTruLuong = luongHienTai.phatList?.reduce((total, item) =>
      total + (item.amount || 0), 0) || 0;

    const tongPhuCap = Object.values(luongHienTai.phuCap || {}).reduce((a, b) => a + b, 0);

    return { tongThuong, tongTruLuong, tongPhuCap };
  }, [luongHienTai]);

  // Tính toán tổng thu nhập và khấu trừ
  const tongThuNhap = useMemo(() => {
    if (!luongHienTai) return 0;
    return luongHienTai.luongCoBan + tongThuong + tongPhuCap;
  }, [luongHienTai, tongThuong, tongPhuCap]);

  const tongKhauTru = useMemo(() => {
    if (!luongHienTai) return 0;
    return luongHienTai.thueTNCN +
      Object.values(luongHienTai.baoHiem || {})
        .filter(value => typeof value === 'number')
        .reduce((a, b) => a + b, 0) +
      tongTruLuong;
  }, [luongHienTai, tongTruLuong]);

  const pieChartData = useMemo(() => {
    if (!luongHienTai) return [];
    
    return [
      { name: 'Lương cơ bản', value: luongHienTai.luongCoBan || 0 },
      { name: 'Thưởng', value: tongThuong },
      { name: 'Phụ cấp', value: tongPhuCap },
      { name: 'Khấu trừ', value: -(tongKhauTru - tongTruLuong) },
      { name: 'Trừ lương', value: -tongTruLuong }
    ];
  }, [luongHienTai, tongThuong, tongPhuCap, tongKhauTru, tongTruLuong]);

  // Xử lý khi áp dụng filter
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
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" bg={bgCard} p={4} borderRadius="lg">
        <VStack align="start" spacing={1}>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Bảng Lương Tháng {currentFilter.month}/{currentFilter.year}
          </Text>
          <Text fontSize="sm" color="gray.400">
            Cập nhật: {formatSafeTime(luongHienTai.ngayCapNhat)}
          </Text>
        </VStack>
        
        <HStack spacing={4}>
          <Select
            w="120px"
            value={filter.month}
            onChange={(e) => setFilter(prev => ({
              ...prev,
              month: parseInt(e.target.value)
            }))}
            bg="gray.700"
            color={textColor}
            borderColor={borderColor}
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
            onChange={(e) => setFilter(prev => ({
              ...prev,
              year: parseInt(e.target.value)
            }))}
            bg="gray.700"
            color={textColor}
            borderColor={borderColor}
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
            colorScheme="blue"
            onClick={handleApplyFilter}
          >
            Áp dụng
          </Button>
        </HStack>
      </HStack><SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card bg={bgCard} borderColor={borderColor} color={textColor}>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">
                <Icon as={FiDollarSign} mr={2} color="blue.400" />
                Lương Cơ Bản
              </StatLabel>
              <StatNumber fontSize="2xl">
                {formatCurrency(luongHienTai.luongCoBan || 0)}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgCard} borderColor={borderColor} color={textColor}>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">
                <Icon as={FiTrendingUp} mr={2} color="green.400" />
                Tổng Thu Nhập
              </StatLabel>
              <StatNumber fontSize="2xl">
                {formatCurrency(tongThuNhap)}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={bgCard} borderColor={borderColor} color={textColor}>
          <CardBody>
            <Stat>
              <StatLabel fontSize="lg">
                <Icon as={FiDollarSign} mr={2} color="purple.400" />
                Thực Lĩnh
              </StatLabel>
              <StatNumber fontSize="2xl" color="green.400">
                {formatCurrency(luongHienTai.thucLinh || 0)}
              </StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={{ base: 3, lg: 1 }}>
          <Card bg={bgCard} borderColor={borderColor} color={textColor}>
            <CardHeader>
              <HStack>
                <Icon as={FiTrendingUp} color="green.400" />
                <Text fontSize="lg" fontWeight="medium">Chi Tiết Thưởng</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {luongHienTai.thuongList?.length > 0 ? (
                  <List spacing={3}>
                    {luongHienTai.thuongList.map((item, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <HStack>
                            <ListIcon as={FiCheckCircle} color="green.400" />
                            <VStack align="start" spacing={0}>
                              <Text>{item.reason}</Text>
                              <Text fontSize="xs" color="gray.400">
                                {formatSafeDate(item.ngayTao)} - {item.nguoiTao || 'N/A'}
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
                
                <Divider borderColor={borderColor} />

                <HStack justify="space-between" color="green.400" fontWeight="bold">
                  <Text>Tổng thưởng</Text>
                  <Text>{formatCurrency(tongThuong)}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 3, lg: 1 }}>
          <Card bg={bgCard} borderColor={borderColor} color={textColor}>
            <CardHeader>
              <HStack>
                <Icon as={FiTrendingDown} color="red.400" />
                <Text fontSize="lg" fontWeight="medium">Chi Tiết Trừ Lương</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {luongHienTai.phatList?.length > 0 ? (
                  <List spacing={3}>
                    {luongHienTai.phatList.map((item, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <HStack>
                            <ListIcon as={FiAlertCircle} color="red.400" />
                            <VStack align="start" spacing={0}>
                              <Text>{item.reason}</Text>
                              <Text fontSize="xs" color="gray.400">
                                {formatSafeDate(item.ngayTao)} - {item.nguoiTao || 'N/A'}
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

                <Divider borderColor={borderColor} />

                <HStack justify="space-between" color="red.400" fontWeight="bold">
                  <Text>Tổng trừ lương</Text>
                  <Text>-{formatCurrency(tongTruLuong)}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem colSpan={{ base: 3, lg: 1 }}>
          <Card bg={bgCard} borderColor={borderColor} color={textColor}>
            <CardHeader>
              <HStack>
                <Icon as={FiDollarSign} color="purple.400" />
                <Text fontSize="lg" fontWeight="medium">Chi Tiết Phụ Cấp</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Table variant="simple" size="sm">
                  <Tbody>
                    <Tr>
                      <Td borderColor={borderColor}>Ăn uống</Td>
                      <Td borderColor={borderColor} isNumeric>
                        {formatCurrency(luongHienTai.phuCap?.anUong || 0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td borderColor={borderColor}>Đi lại</Td>
                      <Td borderColor={borderColor} isNumeric>
                        {formatCurrency(luongHienTai.phuCap?.diLai || 0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td borderColor={borderColor}>Điện thoại</Td>
                      <Td borderColor={borderColor} isNumeric>
                        {formatCurrency(luongHienTai.phuCap?.dienThoai || 0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td borderColor={borderColor}>Khác</Td>
                      <Td borderColor={borderColor} isNumeric>
                        {formatCurrency(luongHienTai.phuCap?.khac || 0)}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>

                <Divider borderColor={borderColor} />

                <HStack justify="space-between" color="purple.400" fontWeight="bold">
                  <Text>Tổng phụ cấp</Text>
                  <Text>{formatCurrency(tongPhuCap)}</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Card bg={bgCard} borderColor={borderColor} color={textColor}>
        <CardHeader>
          <HStack>
            <Icon as={FiTrendingDown} color="red.400" />
            <Text fontSize="lg" fontWeight="medium">
              Các Khoản Khấu Trừ
            </Text>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium">Bảo hiểm:</Text>
            <Table variant="simple" size="sm">
              <Tbody>
                <Tr>
                  <Td borderColor={borderColor}>
                    <HStack>
                      <Text>BHYT (1.5%)</Text>
                      <Tooltip label="Bảo hiểm y tế" placement="right">
                        <Icon as={FiInfo} color="blue.400" />
                      </Tooltip>
                    </HStack>
                  </Td>
                  <Td borderColor={borderColor} isNumeric>
                    {formatCurrency(luongHienTai.baoHiem?.bhyt || 0)}
                  </Td>
                </Tr>
                <Tr>
                  <Td borderColor={borderColor}>
                    <HStack>
                      <Text>BHXH (8%)</Text>
                      <Tooltip label="Bảo hiểm xã hội" placement="right">
                        <Icon as={FiInfo} color="blue.400" />
                      </Tooltip>
                    </HStack>
                  </Td>
                  <Td borderColor={borderColor} isNumeric>
                    {formatCurrency(luongHienTai.baoHiem?.bhxh || 0)}
                  </Td>
                </Tr>
                <Tr>
                  <Td borderColor={borderColor}>
                    <HStack>
                      <Text>BHTN (1%)</Text>
                      <Tooltip label="Bảo hiểm thất nghiệp" placement="right">
                        <Icon as={FiInfo} color="blue.400" />
                      </Tooltip>
                    </HStack>
                  </Td>
                  <Td borderColor={borderColor} isNumeric>
                    {formatCurrency(luongHienTai.baoHiem?.bhtn || 0)}
                  </Td>
                </Tr>
              </Tbody>
            </Table>

            <Divider borderColor={borderColor} />

            <HStack justify="space-between">
              <Text>Thuế TNCN</Text>
              <Text fontWeight="medium">
                {formatCurrency(luongHienTai.thueTNCN || 0)}
              </Text>
            </HStack>

            <Divider borderColor={borderColor} />

            <HStack justify="space-between" color="red.400" fontWeight="bold">
              <Text>Tổng khấu trừ</Text>
              <Text>{formatCurrency(tongKhauTru)}</Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6}>
        <Card bg={bgCard} borderColor={borderColor} color={textColor}>
          <CardHeader>
            <HStack>
              <Icon as={FiTrendingUp} color="blue.400" />
              <Text fontSize="lg" fontWeight="medium">
                Biểu Đồ Thu Nhập
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => entry.name}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ 
                      backgroundColor: bgCard, 
                      borderColor: borderColor,
                      color: textColor
                    }}
                    formatter={(value) => formatCurrency(Math.abs(value))}
                  />
                  <Legend
                    wrapperStyle={{ color: textColor }}
                    formatter={(value) => value}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card bg={bgCard} borderColor={borderColor} color={textColor}>
          <CardHeader>
            <HStack>
              <Icon as={FiTrendingUp} color="purple.400" />
              <Text fontSize="lg" fontWeight="medium">
                Thống Kê Thu Nhập
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4} w="100%">
                {pieChartData.map((item, index) => (
                  <Stat key={index}>
                    <StatLabel color={item.value < 0 ? 'red.400' : 'green.400'}>
                      {item.name}
                    </StatLabel>
                    <StatNumber>
                      {formatCurrency(Math.abs(item.value))}
                    </StatNumber>
                  </Stat>
                ))}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Thông tin & trạng thái */}
      <Card bg={bgCard} borderColor={borderColor} color={textColor}>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <HStack>
              <Icon as={FiClock} color="blue.400" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.400">Kỳ lương</Text>
                <Text>Tháng {currentFilter.month}/{currentFilter.year}</Text>
              </VStack>
            </HStack>

            <HStack>
              <Icon as={FiUser} color="purple.400" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.400">Người duyệt</Text>
                <Text>{luongHienTai.nguoiDuyet || '---'}</Text>
              </VStack>
            </HStack>

            <HStack>
              <Icon as={FiFile} color="green.400" />
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.400">Trạng thái</Text>
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
        </CardBody>
      </Card>
    </VStack>
  );
};

BangLuongCaNhan.propTypes = {
  userId: PropTypes.string.isRequired
};

export default BangLuongCaNhan;