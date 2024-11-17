// File: src/modules/quan_ly_thu_chi/components/danh_sach_thu_chi.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Link tham khảo: https://firebase.google.com/docs/firestore
// Nhánh: main

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Stack,
  Badge,
  Flex,
  Spinner,
  useBreakpointValue,
  Text,
  Select,
  HStack,
  VStack
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { format, startOfMonth, endOfMonth, parse, isValid } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useThuChi } from '../hooks/use_thu_chi';
import FormThuChi from './form_thu_chi';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0);
};

const DanhSachThuChi = () => {
  const [tuNgay, setTuNgay] = useState(startOfMonth(new Date()));
  const [denNgay, setDenNgay] = useState(endOfMonth(new Date()));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [loaiFilter, setLoaiFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const toast = useToast();
  const cancelRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const {
    danhSachThuChi = [],
    isLoading,
    layDanhSachThuChi,
    themThuChi,
    capNhatThuChi,
    xoaThuChi
  } = useThuChi();

  useEffect(() => {
    layDanhSachThuChi();
  }, [layDanhSachThuChi]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleMonthChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    
    try {
      const selectedDate = parse(value + '-01', 'yyyy-MM-dd', new Date());
      if (isValid(selectedDate)) {
        setTuNgay(startOfMonth(selectedDate));
        setDenNgay(endOfMonth(selectedDate));
      }
    } catch (error) {
      console.error('Invalid date:', error);
    }
  }, []);

  const handleLoaiChange = useCallback((e) => {
    setLoaiFilter(e.target.value);
  }, []);

  const handleDateChange = useCallback((e, type) => {
    const date = new Date(e.target.value);
    if (isValid(date)) {
      if (type === 'from') {
        setTuNgay(date);
      } else {
        setDenNgay(date);
      }
    }
  }, []);

  const filteredData = useMemo(() => {
    return danhSachThuChi.filter(item => {
      const itemDate = new Date(item.ngayTao);
      const matchesSearch = item.moTa?.toLowerCase().includes(searchTerm.toLowerCase());
      const inDateRange = isValid(itemDate) && itemDate >= tuNgay && itemDate <= denNgay;
      const matchesLoai = loaiFilter === 'all' || item.loai === loaiFilter;
      return matchesSearch && inDateRange && matchesLoai;
    }).sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));
  }, [danhSachThuChi, searchTerm, tuNgay, denNgay, loaiFilter]);

  const { tongThu, tongChi } = useMemo(() => {
    return filteredData.reduce((acc, item) => ({
      tongThu: acc.tongThu + (item.loai === 'thu' ? Number(item.soTien) || 0 : 0),
      tongChi: acc.tongChi + (item.loai === 'chi' ? Number(item.soTien) || 0 : 0)
    }), { tongThu: 0, tongChi: 0 });
  }, [filteredData]);

  const handleDelete = useCallback(async () => {
    if (!selectedId) return;
    
    try {
      await xoaThuChi(selectedId);
      toast({
        title: 'Thành công',
        description: 'Đã xóa khoản thu chi',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      onClose();
      await layDanhSachThuChi();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa khoản thu chi',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  }, [selectedId, xoaThuChi, toast, onClose, layDanhSachThuChi]);

  const confirmDelete = useCallback((id) => {
    setSelectedId(id);
    onOpen();
  }, [onOpen]);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const openModal = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingItem(null);
  }, []);

  const handleSuccess = useCallback(async () => {
    await layDanhSachThuChi();
    closeModal();
  }, [layDanhSachThuChi, closeModal]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Stack spacing={6}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Heading size="lg" color="white">Quản lý Thu Chi</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={openModal}
            size={isMobile ? "sm" : "md"}
          >
            Thêm mới
          </Button>
        </Flex>

        <VStack spacing={4} align="stretch">
          <HStack spacing={4} wrap="wrap">
            <Box minW="200px">
              <Text mb={2} color="gray.300">Tháng</Text>
              <Input
                type="month"
                value={selectedMonth}
                onChange={handleMonthChange}
                size={isMobile ? "sm" : "md"}
                bg="gray.700"
                color="white"
              />
            </Box>
            <Box minW="150px">
              <Text mb={2} color="gray.300">Loại</Text>
              <Select
                value={loaiFilter}
                onChange={handleLoaiChange}
                size={isMobile ? "sm" : "md"}
                bg="gray.700"
                color="white"
              >
                <option value="all">Tất cả</option>
                <option value="thu">Thu</option>
                <option value="chi">Chi</option>
              </Select>
            </Box>
            <Box flex={1}>
              <Text mb={2} color="gray.300">Tìm kiếm</Text>
              <Input
                placeholder="Tìm kiếm theo mô tả..."
                value={searchTerm}
                onChange={handleSearch}
                size={isMobile ? "sm" : "md"}
                bg="gray.700"
                color="white"
              />
            </Box>
          </HStack>

          <HStack spacing={4} wrap="wrap">
            <Box minW="200px">
              <Text mb={2} color="gray.300">Từ ngày</Text>
              <Input
                type="date"
                value={format(tuNgay, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(e, 'from')}
                size={isMobile ? "sm" : "md"}
                bg="gray.700"
                color="white"
              />
            </Box>
            <Box minW="200px">
              <Text mb={2} color="gray.300">Đến ngày</Text>
              <Input
                type="date"
                value={format(denNgay, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(e, 'to')}
                size={isMobile ? "sm" : "md"}
                bg="gray.700"
                color="white"
              />
            </Box>
          </HStack>
        </VStack>

        <Stack
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          p={4}
          bg="gray.700"
          borderRadius="lg"
        >
          <Badge colorScheme="green" p={2} fontSize={isMobile ? "sm" : "md"}>
            Tổng thu: {formatCurrency(tongThu)}
          </Badge>
          <Badge colorScheme="red" p={2} fontSize={isMobile ? "sm" : "md"}>
            Tổng chi: {formatCurrency(tongChi)}
          </Badge>
        </Stack>

        <Box overflowX="auto">
          <Table variant="simple" bg="gray.800" borderRadius="lg">
            <Thead>
              <Tr>
                <Th color="gray.300">Ngày</Th>
                <Th color="gray.300">Loại</Th>
                <Th color="gray.300">Mô tả</Th>
                <Th color="gray.300" isNumeric>Số tiền</Th>
                <Th color="gray.300">Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((item) => (
                <Tr key={item.id}>
                  <Td color="white">{format(new Date(item.ngayTao), 'dd/MM/yyyy')}</Td>
                  <Td>
                    <Badge colorScheme={item.loai === 'thu' ? 'green' : 'red'}>
                      {item.loai === 'thu' ? 'Thu' : 'Chi'}
                    </Badge>
                  </Td>
                  <Td color="white">{item.moTa}</Td>
                  <Td isNumeric color="white">{formatCurrency(item.soTien)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<EditIcon />}
                        onClick={() => handleEdit(item)}
                        colorScheme="blue"
                      >
                        Sửa
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<DeleteIcon />}
                        onClick={() => confirmDelete(item.id)}
                        colorScheme="red"
                      >
                        Xóa
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {filteredData.length === 0 && (
                <Tr>
                  <Td colSpan={5} textAlign="center" color="gray.400">
                    Không có dữ liệu
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Stack>

      <FormThuChi
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
        editingItem={editingItem}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" color="white">
            <AlertDialogHeader>Xác nhận xóa</AlertDialogHeader>
            <AlertDialogBody>
              Bạn có chắc chắn muốn xóa khoản thu chi này không?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="ghost">
                Hủy
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Xóa
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default React.memo(DanhSachThuChi);