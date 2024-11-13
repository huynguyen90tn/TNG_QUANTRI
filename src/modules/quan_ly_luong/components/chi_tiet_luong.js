// File: src/modules/quan_ly_luong/components/chi_tiet_luong.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay, 
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Divider,
  Badge,
  Box,
  SimpleGrid,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardHeader,
  CardBody
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis, 
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatCurrency } from '../../../utils/format';
import {
  TRANG_THAI_LABEL,
  PHONG_BAN_LABEL, 
  CAP_BAC_LABEL
} from '../constants/loai_luong';

const ThongTinThuongPhat = ({ items, title }) => (
  <Card mb={4}>
    <CardHeader>
      <Text fontWeight="bold">{title}</Text>  
    </CardHeader>
    <CardBody>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Số tiền</Th>
            <Th>Lý do</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => (
            <Tr key={index}>
              <Td>{formatCurrency(item.amount)}</Td>
              <Td>{item.reason}</Td>
            </Tr>
          ))}
          {items.length > 0 && (
            <Tr fontWeight="bold">
              <Td>Tổng cộng</Td>  
              <Td>{formatCurrency(items.reduce((sum, item) => sum + item.amount, 0))}</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </CardBody>
  </Card>
);

ThongTinThuongPhat.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      reason: PropTypes.string.isRequired
    })
  ).isRequired,
  title: PropTypes.string.isRequired
};

const ChiTietLuong = ({ isOpen, onClose, data }) => {
  const tongThuNhap = useMemo(() => {
    if (!data) return 0;
    
    return (
      data.luongCoBan +
      Object.values(data.phuCap || {}).reduce((a, b) => a + b, 0) +
      (data.thuongList?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0) -
      (data.phatList?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0)
    );
  }, [data]);

  const tongKhauTru = useMemo(() => {
    if (!data) return 0;

    return (
      (data.dongThue ? data.thueTNCN : 0) +
      (data.baoHiem?.dongBaoHiem
        ? Object.values(data.baoHiem)
            .filter((val) => typeof val === 'number')
            .reduce((a, b) => a + b, 0)
        : 0)
    );
  }, [data]);

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent maxWidth="900px">
        <ModalHeader>Chi Tiết Bảng Lương</ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Thông tin cơ bản */}
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text fontSize="lg" fontWeight="bold">{data.userName}</Text>
                <Text color="gray.500">{PHONG_BAN_LABEL[data.department]}</Text>
                <Text color="gray.500">
                  {CAP_BAC_LABEL[data.level]} - {formatCurrency(data.luongCoBan)}
                </Text>
              </Box>
              <Box textAlign="right">
                <Badge
                  colorScheme={
                    data.trangThai === 'da_thanh_toan'
                      ? 'green'
                      : data.trangThai === 'cho_duyet'
                      ? 'yellow'
                      : 'blue'
                  }
                  fontSize="sm"
                  px={2}
                  py={1}
                  borderRadius="lg"
                >
                  {TRANG_THAI_LABEL[data.trangThai]}
                </Badge>
                <Text color="gray.500" mt={2}>
                  Mã NV: {data.memberCode}
                </Text>
              </Box>
            </SimpleGrid>

            <Divider />

            {/* Thưởng/Phạt */}
            {data.thuongList?.length > 0 && (
              <ThongTinThuongPhat items={data.thuongList} title="Thưởng" />
            )}

            {data.phatList?.length > 0 && (
              <ThongTinThuongPhat items={data.phatList} title="Trừ lương" />
            )}

            {/* Phụ cấp */}
            <Box>
              <Text fontWeight="medium" mb={3}>Phụ cấp:</Text>
              <SimpleGrid columns={2} spacing={4}>
                {Object.entries(data.phuCap || {}).map(([key, value]) => (
                  <HStack key={key} justify="space-between">
                    <Text>
                      {key === 'anUong'
                        ? 'Ăn uống'
                        : key === 'diLai'
                        ? 'Đi lại'  
                        : key === 'dienThoai'
                        ? 'Điện thoại'
                        : 'Khác'}
                    </Text>
                    <Text>{formatCurrency(value)}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Bảo hiểm */}  
            <Card>
              <CardHeader>
                <HStack justify="space-between">
                  <Text fontWeight="medium">Đóng bảo hiểm</Text>
                  <Switch isChecked={data.baoHiem?.dongBaoHiem} isReadOnly />
                </HStack>
              </CardHeader>
              {data.baoHiem?.dongBaoHiem && (
                <CardBody>
                  <VStack spacing={3}>
                    <HStack justify="space-between" w="full">
                      <Text>BHYT (1.5%):</Text>
                      <Text>{formatCurrency(data.baoHiem.bhyt)}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text>BHXH (8%):</Text>
                      <Text>{formatCurrency(data.baoHiem.bhxh)}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text>BHTN (1%):</Text>
                      <Text>{formatCurrency(data.baoHiem.bhtn)}</Text>
                    </HStack>
                    <Divider />
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">Tổng bảo hiểm:</Text>
                      <Text fontWeight="bold">
                        {formatCurrency(
                          Object.values(data.baoHiem)
                            .filter((val) => typeof val === 'number')
                            .reduce((a, b) => a + b, 0)
                        )}
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              )}
            </Card>

            {/* Thuế TNCN */}
            <HStack justify="space-between">
              <Text>Đóng thuế TNCN</Text>
              <Switch isChecked={data.dongThue} isReadOnly />
            </HStack>

            <Divider />

            {/* Tổng kết */}
            <SimpleGrid columns={2} spacing={4}>
              <Box
                p={4}
                bg="blue.50"
                _dark={{ bg: 'blue.900' }}
                borderRadius="lg"
              >
                <Text color="blue.600" _dark={{ color: 'blue.200' }} mb={2}>
                  Tổng thu nhập
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  {formatCurrency(tongThuNhap)}
                </Text>
              </Box>

              <Box
                p={4}
                bg="red.50"
                _dark={{ bg: 'red.900' }}
                borderRadius="lg"
              >
                <Text color="red.600" _dark={{ color: 'red.200' }} mb={2}>
                  Tổng khấu trừ
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  {formatCurrency(tongKhauTru)} 
                </Text>
              </Box>
            </SimpleGrid>

            <Box
              p={4}
              bg="green.50"
              _dark={{ bg: 'green.900' }}
              borderRadius="lg"
            >
              <Text color="green.600" _dark={{ color: 'green.200' }} mb={2}>
                Thực lĩnh
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {formatCurrency(data.thucLinh)}
              </Text>
            </Box>

            {/* Lịch sử lương */}
            <Box>
              <Text fontWeight="medium" mb={3}>
                Biểu đồ lương 6 tháng gần nhất
              </Text>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.lichSuLuong?.slice(-6) || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="kyLuong"
                      tickFormatter={(value) => `${value.thang}/${value.nam}`}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(value) =>
                        `Tháng ${value.thang}/${value.nam}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="luongCoBan"
                      stroke="#3182ce"
                      name="Lương cơ bản"
                    />
                    <Line
                      type="monotone"
                      dataKey="thucLinh"
                      stroke="#38a169"
                      name="Thực lĩnh"  
                    />
                    <Line
                      type="monotone"
                      dataKey="luongThuong"
                      stroke="#dd6b20"
                      name="Thưởng"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            {/* Thông tin thời gian */}
            <Box>
              <Text fontSize="sm" color="gray.500">
                Kỳ lương: Tháng {data.kyLuong.thang}/{data.kyLuong.nam}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Ngày tạo: {format(new Date(data.ngayTao), 'dd/MM/yyyy', { locale: vi })}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Ngày cập nhật: {format(new Date(data.ngayCapNhat), 'dd/MM/yyyy', { locale: vi })}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

ChiTietLuong.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    userName: PropTypes.string,
    department: PropTypes.string,
    level: PropTypes.string, 
    memberCode: PropTypes.string,
    luongCoBan: PropTypes.number,
    trangThai: PropTypes.string,
    thuongList: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number,
        reason: PropTypes.string
      })
    ),
    phatList: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number,
        reason: PropTypes.string
      })
    ),
    phuCap: PropTypes.object,
    baoHiem: PropTypes.object,
    dongThue: PropTypes.bool,
    thueTNCN: PropTypes.number,
    thucLinh: PropTypes.number,
    kyLuong: PropTypes.shape({
      thang: PropTypes.number,
      nam: PropTypes.number
    }),
    ngayTao: PropTypes.string,
    ngayCapNhat: PropTypes.string,
    lichSuLuong: PropTypes.arrayOf(PropTypes.object)
  })
};

export default ChiTietLuong;