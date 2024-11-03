// File: src/modules/quan_ly_nghi_phep/components/danh_sach_don_nghi_phep.js
// Link tham khảo: https://chakra-ui.com/docs/components/table
// Link tham khảo: https://chakra-ui.com/docs/components/button

import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  useDisclosure,
  Badge,
  IconButton,
  Tooltip,
  Text,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, AddIcon } from '@chakra-ui/icons';
import { useAuth } from '../../../hooks/useAuth';
import nghiPhepService from '../services/nghi_phep_service';
import { 
  TRANG_THAI_LABEL, 
  TRANG_THAI_COLOR, 
  LOAI_NGHI_PHEP_LABEL 
} from '../constants/trang_thai_don';
import ChiTietDonNghiPhep from './chi_tiet_don_nghi_phep';
import FormTaoDonNghiPhep from './form_tao_don_nghi_phep';
import BoLocDonNghiPhep from './bo_loc_don_nghi_phep';

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const DanhSachDonNghiPhep = () => {
  const { user } = useAuth();
  const [danhSachDon, setDanhSachDon] = useState([]);
  const [selectedDon, setSelectedDon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState({});
  const toast = useToast();

  const { 
    isOpen: isOpenDetail, 
    onOpen: onOpenDetail, 
    onClose: onCloseDetail 
  } = useDisclosure();

  const { 
    isOpen: isOpenForm, 
    onOpen: onOpenForm, 
    onClose: onCloseForm 
  } = useDisclosure();

  const textColor = useColorModeValue('gray.600', 'gray.300');
  const tableBgColor = useColorModeValue('white', 'gray.800');

  const loadDanhSachDon = useCallback(async (filters = {}) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const queryFilters = { ...filters };
      
      if (user.role !== 'admin-tong') {
        queryFilters.userId = user.id;
      }

      const data = await nghiPhepService.layDanhSach(queryFilters);
      setDanhSachDon(data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách đơn nghỉ phép',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const handleFilter = useCallback((filters) => {
    setCurrentFilters(filters);
  }, []);

  const handleViewDetail = useCallback((don) => {
    setSelectedDon(don);
    onOpenDetail();
  }, [onOpenDetail]);

  const handleCreateSuccess = useCallback((newDon) => {
    setDanhSachDon(prev => [newDon, ...prev]);
    onCloseForm();
    toast({
      title: 'Thành công',
      description: 'Tạo đơn nghỉ phép thành công',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  }, [onCloseForm, toast]);

  const handleUpdateStatus = useCallback((updatedDon) => {
    setDanhSachDon(prev =>
      prev.map(don => don.id === updatedDon.id ? updatedDon : don)
    );
    onCloseDetail();
  }, [onCloseDetail]);

  useEffect(() => {
    if (user) {
      loadDanhSachDon(currentFilters);
    }
  }, [user, loadDanhSachDon, currentFilters]);

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <Box p={4}>
          <Text>Đang tải dữ liệu...</Text>
        </Box>
      );
    }

    if (danhSachDon.length === 0) {
      return (
        <Box p={4}>
          <Text>Chưa có đơn nghỉ phép nào</Text>
        </Box>
      );
    }

    return (
      <Table variant="simple" bg={tableBgColor}>
        <Thead>
          <Tr>
            <Th>Mã đơn</Th>
            <Th>Người xin nghỉ</Th>
            <Th>Loại nghỉ phép</Th>
            <Th>Thời gian</Th>
            <Th>Số ngày</Th>
            <Th>Trạng thái</Th>
            <Th>Thao tác</Th>
          </Tr>
        </Thead>
        <Tbody>
          {danhSachDon.map((don) => (
            <Tr key={don.id}>
              <Td>{don.requestId}</Td>
              <Td>
                <Box>
                  <Text fontWeight="medium">{don.userName}</Text>
                  <Text fontSize="sm" color={textColor}>{don.userEmail}</Text>
                </Box>
              </Td>
              <Td>{LOAI_NGHI_PHEP_LABEL[don.leaveType]}</Td>
              <Td>
                <Box>
                  <Text>Từ: {formatDate(don.startDate)}</Text>
                  <Text>Đến: {formatDate(don.endDate)}</Text>
                </Box>
              </Td>
              <Td>{don.totalDays} ngày</Td>
              <Td>
                <Badge colorScheme={TRANG_THAI_COLOR[don.status]}>
                  {TRANG_THAI_LABEL[don.status]}
                </Badge>
              </Td>
              <Td>
                <Tooltip label="Xem chi tiết" hasArrow>
                  <IconButton
                    icon={<ViewIcon />}
                    onClick={() => handleViewDetail(don)}
                    variant="ghost"
                    aria-label="Xem chi tiết"
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Danh sách đơn nghỉ phép
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={onOpenForm}
          isDisabled={user?.role !== 'member'}
          aria-label="Tạo đơn xin nghỉ mới"
        >
          Tạo đơn xin nghỉ
        </Button>
      </HStack>

      <BoLocDonNghiPhep 
        onFilter={handleFilter}
        isLoading={isLoading}
      />

      {renderTableContent()}

      {selectedDon && (
        <ChiTietDonNghiPhep
          isOpen={isOpenDetail}
          onClose={onCloseDetail}
          donNghiPhep={selectedDon}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      <FormTaoDonNghiPhep
        isOpen={isOpenForm}
        onClose={onCloseForm}
        onSuccess={handleCreateSuccess}
      />
    </Box>
  );
};

export default DanhSachDonNghiPhep;