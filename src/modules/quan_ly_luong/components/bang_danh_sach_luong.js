// File: src/modules/quan_ly_luong/components/bang_danh_sach_luong.js
// Link tham khảo: https://chakra-ui.com/docs/components 
// Nhánh: main

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Input,
  Select,
  HStack,
  Button,
  useToast,
  Stack,
  Alert,
  AlertIcon,
  Spinner,
  Text,
  Center
} from '@chakra-ui/react';
import { FiMoreVertical, FiDownload } from 'react-icons/fi';
import { useLuong } from '../hooks/use_luong';
import { formatCurrency } from '../../../utils/format';
import { FormCapNhatLuong } from './form_cap_nhat_luong';
import ChiTietLuong from './chi_tiet_luong';
import { CAP_BAC_LABEL } from '../constants/loai_luong';

const PHONG_BAN_OPTIONS = [
  { value: 'thien-minh-duong', label: 'Thiên Minh Đường' },
  { value: 'tay-van-cac', label: 'Tây Vân Các' },
  { value: 'hoa-tam-duong', label: 'Hoa Tâm Đường' },
  { value: 'ho-ly-son-trang', label: 'Hộ Lý Sơn Trang' },
  { value: 'hoa-van-cac', label: 'Hoa Vân Các' },
  { value: 'tinh-van-cac', label: 'Tinh Vân Các' }
];

export const BangDanhSachLuong = () => {
  const toast = useToast();
  const { danhSachLuong = [], layDanhSach, loading: apiLoading, error: apiError } = useLuong();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCapNhatOpen, setIsCapNhatOpen] = useState(false);
  const [isChiTietOpen, setIsChiTietOpen] = useState(false);
  const [selectedLuong, setSelectedLuong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const refreshData = useCallback(async () => {
    try {
      await layDanhSach();
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể tải dữ liệu',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }, [layDanhSach, toast]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        await layDanhSach();
      } catch (err) {
        setLoadError(err.message || 'Không thể tải dữ liệu');
        toast({
          title: 'Lỗi',
          description: err.message || 'Không thể tải dữ liệu',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [layDanhSach, toast]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      refreshData();
    }
  }, [selectedMonth, selectedYear, refreshData]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(danhSachLuong)) return [];

    return danhSachLuong.filter((luong) => {
      if (!luong) return false;

      const matchesSearch = !searchTerm || 
        (luong.userName && luong.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (luong.memberCode && luong.memberCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesMonth = !selectedMonth || 
        (luong.kyLuong && luong.kyLuong.thang === selectedMonth);

      const matchesYear = !selectedYear || 
        (luong.kyLuong && luong.kyLuong.nam === selectedYear);

      const matchesDepartment = !selectedDepartment || luong.department === selectedDepartment;

      return matchesSearch && matchesMonth && matchesYear && matchesDepartment;
    });
  }, [danhSachLuong, searchTerm, selectedMonth, selectedYear, selectedDepartment]);

  const handleCapNhat = useCallback((luong) => {
    setSelectedLuong(luong);
    setIsCapNhatOpen(true);
  }, []);

  const handleXemChiTiet = useCallback((luong) => {
    setSelectedLuong(luong);
    setIsChiTietOpen(true);
  }, []);

  const handleExportExcel = useCallback(() => {
    try {
      const rows = [
        [
          'Mã số',
          'Họ tên', 
          'Phòng ban',
          'Cấp bậc',
          'Tháng',
          'Năm',
          'Lương cơ bản',
          'Thưởng',
          'Phụ cấp',
          'Thuế TNCN',
          'Bảo hiểm',
          'Thực lĩnh',
          'Trạng thái'
        ].join(','),
        ...filteredData.map((luong) => [
          luong.memberCode || '',
          luong.userName || '',
          PHONG_BAN_OPTIONS.find(pb => pb.value === luong.department)?.label || '',
          CAP_BAC_LABEL[luong.level] || '',
          luong.kyLuong?.thang || '',
          luong.kyLuong?.nam || '',
          luong.luongCoBan || 0,
          luong.luongThuong || 0,
          Object.values(luong.phuCap || {}).reduce((a, b) => a + b, 0),
          luong.thueTNCN || 0,
          Object.values(luong.baoHiem || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0),
          luong.thucLinh || 0,
          luong.trangThai === 'DA_THANH_TOAN' ? 'Đã thanh toán' :
            luong.trangThai === 'CHO_DUYET' ? 'Chờ duyệt' : 'Đã duyệt'
        ].join(','))
      ].join('\n');

      const element = document.createElement('a');
      const file = new Blob([rows], { type: 'text/csv;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `bang_luong_${selectedMonth}_${selectedYear}.csv`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: 'Thành công',
        description: 'Đã xuất file thành công',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể xuất file',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }, [filteredData, selectedMonth, selectedYear, toast]);

  const handleCloseCapNhat = useCallback(() => {
    setIsCapNhatOpen(false);
    setSelectedLuong(null);
    refreshData();
  }, [refreshData]);

  const handleCloseChiTiet = useCallback(() => {
    setIsChiTietOpen(false);
    setSelectedLuong(null);
  }, []);

  if (isLoading || apiLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (loadError || apiError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Text>{loadError || apiError}</Text>
      </Alert>
    );
  }

  if (!Array.isArray(danhSachLuong)) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Text>Dữ liệu không hợp lệ</Text>
      </Alert>
    );
  }

  return (
    <Stack spacing={4}>
      <HStack spacing={4} mb={4}>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          w="150px"
        >
          <option value="">Tất cả tháng</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </Select>

        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          w="150px"
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

        <Select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          w="200px"
        >
          <option value="">Tất cả phòng ban</option>
          {PHONG_BAN_OPTIONS.map((pb) => (
            <option key={pb.value} value={pb.value}>
              {pb.label}
            </option>
          ))}
        </Select>

        <Input
          placeholder="Tìm kiếm theo tên/mã số..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          w="300px"
        />

        <Button
          leftIcon={<FiDownload />}
          colorScheme="blue"
          onClick={handleExportExcel}
          isDisabled={!filteredData.length}
        >
          Xuất File
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>MÃ SỐ</Th>
              <Th>HỌ TÊN</Th>
              <Th>PHÒNG BAN</Th>
              <Th>CẤP BẬC</Th>
              <Th isNumeric>LƯƠNG CƠ BẢN</Th>
              <Th isNumeric>THƯỞNG</Th>
              <Th isNumeric>PHỤ CẤP</Th>
              <Th isNumeric>THỰC LĨNH</Th>
              <Th>TRẠNG THÁI</Th>
              <Th>THAO TÁC</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.length > 0 ? (
              filteredData.map((luong) => (
                <Tr key={luong.id}>
                  <Td>{luong.memberCode}</Td>
                  <Td>{luong.userName}</Td>
                  <Td>
                    {PHONG_BAN_OPTIONS.find(
                      (pb) => pb.value === luong.department
                    )?.label}
                  </Td>
                  <Td>{CAP_BAC_LABEL[luong.level]}</Td>
                  <Td isNumeric>{formatCurrency(luong.luongCoBan)}</Td>
                  <Td isNumeric>{formatCurrency(luong.luongThuong)}</Td>
                  <Td isNumeric>
                    {formatCurrency(
                      Object.values(luong.phuCap || {}).reduce((a, b) => a + b, 0)
                    )}
                  </Td>
                  <Td isNumeric color="green.500" fontWeight="bold">
                    {formatCurrency(luong.thucLinh)}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        luong.trangThai === 'DA_THANH_TOAN'
                          ? 'green'
                          : luong.trangThai === 'CHO_DUYET'
                          ? 'yellow'
                          : 'blue'
                      }
                    >
                      {luong.trangThai === 'DA_THANH_TOAN'
                        ? 'Đã thanh toán'
                        : luong.trangThai === 'CHO_DUYET'
                        ? 'Chờ duyệt'
                        : 'Đã duyệt'}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                        aria-label="Thao tác"
                      />
                      <MenuList>
                        <MenuItem onClick={() => handleXemChiTiet(luong)}>
                          Xem chi tiết
                        </MenuItem>
                        <MenuItem onClick={() => handleCapNhat(luong)}>
                          Cập nhật
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={10} textAlign="center">
                  <Text>Không có dữ liệu</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <FormCapNhatLuong
        isOpen={isCapNhatOpen}
        onClose={handleCloseCapNhat}
        data={selectedLuong}
      />

<ChiTietLuong
        isOpen={isChiTietOpen}
        onClose={handleCloseChiTiet}
        data={selectedLuong}
      />
    </Stack>
  );
};

BangDanhSachLuong.propTypes = {
  danhSachLuong: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      memberCode: PropTypes.string,
      userName: PropTypes.string,
      department: PropTypes.string,
      level: PropTypes.string,
      kyLuong: PropTypes.shape({
        thang: PropTypes.number,
        nam: PropTypes.number
      }),
      luongCoBan: PropTypes.number,
      luongThuong: PropTypes.number,
      phuCap: PropTypes.object,
      thueTNCN: PropTypes.number,
      baoHiem: PropTypes.object,
      thucLinh: PropTypes.number,
      trangThai: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string
};

BangDanhSachLuong.defaultProps = {
  danhSachLuong: [],
  loading: false,
  error: null
};

export default BangDanhSachLuong;