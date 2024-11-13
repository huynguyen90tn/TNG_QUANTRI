 
// File: src/modules/quan_ly_luong/components/thuong_phat.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  useToast,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, MoreVerticalIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PHONG_BAN } from '../constants/loai_luong';
import { useAuth } from '../../../hooks/useAuth';
import { formatCurrency } from '../../../utils/format';

const LOAI_THUONG_PHAT = {
  THUONG: 'thuong',
  PHAT: 'phat'
};

const LY_DO_THUONG = [
  'Hoàn thành xuất sắc công việc',
  'Đóng góp ý tưởng mới',
  'Làm thêm giờ',
  'Thưởng dự án',
  'Thưởng định kỳ',
  'Khác'
];

const LY_DO_PHAT = [
  'Đi muộn',
  'Vi phạm nội quy',
  'Không hoàn thành công việc',
  'Gây mất đoàn kết',
  'Khác'
];

const defaultThuongPhat = {
  userId: '',
  userName: '',
  phongBan: '',
  loai: LOAI_THUONG_PHAT.THUONG,
  soTien: 0,
  lyDo: '',
  ghiChu: '',
  ngayTao: new Date(),
  nguoiTao: '',
  trangThai: 'cho_duyet'
};

export const ThuongPhat = ({ userId, userName }) => {
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [danhSachThuongPhat, setDanhSachThuongPhat] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState(defaultThuongPhat);
  const [filter, setFilter] = useState({
    loai: 'all',
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear()
  });

  const bgCard = useColorModeValue('white', 'gray.800');
  const isAdmin = ['admin-tong', 'admin-con'].includes(user?.role);

  useEffect(() => {
    // TODO: Fetch dữ liệu từ API
    const mockData = [
      {
        id: '1',
        userId: '123',
        userName: 'Nguyễn Văn A',
        phongBan: 'thien-minh-duong',
        loai: LOAI_THUONG_PHAT.THUONG,
        soTien: 1000000,
        lyDo: 'Hoàn thành xuất sắc công việc',
        ghiChu: 'Dự án ABC',
        ngayTao: new Date(),
        nguoiTao: 'Admin',
        trangThai: 'da_duyet'
      },
      // Thêm mock data khác nếu cần
    ];
    setDanhSachThuongPhat(mockData);
  }, []);

  const handleOpenForm = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData(item);
    } else {
      setSelectedItem(null);
      setFormData({
        ...defaultThuongPhat,
        userId: userId || '',
        userName: userName || '',
        nguoiTao: user?.id || ''
      });
    }
    onOpen();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const newData = {
        ...formData,
        ngayTao: new Date(),
        nguoiTao: user?.id
      };

      if (selectedItem) {
        // Cập nhật
        setDanhSachThuongPhat(prev =>
          prev.map(item =>
            item.id === selectedItem.id ? { ...item, ...newData } : item
          )
        );
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật thông tin thưởng/phạt',
          status: 'success',
          duration: 3000
        });
      } else {
        // Thêm mới
        setDanhSachThuongPhat(prev => [
          ...prev,
          { ...newData, id: Date.now().toString() }
        ]);
        toast({
          title: 'Thành công',
          description: 'Đã thêm thưởng/phạt mới',
          status: 'success',
          duration: 3000
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  const handleDelete = (id) => {
    try {
      setDanhSachThuongPhat(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Thành công',
        description: 'Đã xóa thưởng/phạt',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  const filteredData = danhSachThuongPhat.filter(item => {
    const itemDate = new Date(item.ngayTao);
    const matchMonth = filter.thang === 'all' || itemDate.getMonth() + 1 === filter.thang;
    const matchYear = itemDate.getFullYear() === filter.nam;
    const matchType = filter.loai === 'all' || item.loai === filter.loai;
    return matchMonth && matchYear && matchType;
  });

  const tongThuong = filteredData
    .filter(item => item.loai === LOAI_THUONG_PHAT.THUONG && item.trangThai === 'da_duyet')
    .reduce((sum, item) => sum + item.soTien, 0);

  const tongPhat = filteredData
    .filter(item => item.loai === LOAI_THUONG_PHAT.PHAT && item.trangThai === 'da_duyet')
    .reduce((sum, item) => sum + item.soTien, 0);

  return (
    <Box bg={bgCard} borderRadius="lg" p={4}>
      <VStack spacing={4} align="stretch">
        {/* Phần header và filter */}
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold">Quản Lý Thưởng Phạt</Text>
          {isAdmin && (
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => handleOpenForm()}
            >
              Thêm mới
            </Button>
          )}
        </Flex>

        <HStack spacing={4}>
          <Select
            value={filter.loai}
            onChange={(e) => setFilter(prev => ({ ...prev, loai: e.target.value }))}
            w="200px"
          >
            <option value="all">Tất cả</option>
            <option value={LOAI_THUONG_PHAT.THUONG}>Thưởng</option>
            <option value={LOAI_THUONG_PHAT.PHAT}>Phạt</option>
          </Select>

          <Select
            value={filter.thang}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              thang: e.target.value === 'all' ? 'all' : Number(e.target.value) 
            }))}
            w="150px"
          >
            <option value="all">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </Select>

          <Select
            value={filter.nam}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              nam: Number(e.target.value) 
            }))}
            w="150px"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>Năm {year}</option>;
            })}
          </Select>
        </HStack>

        {/* Bảng dữ liệu */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Ngày</Th>
              <Th>Người nhận</Th>
              <Th>Loại</Th>
              <Th>Lý do</Th>
              <Th isNumeric>Số tiền</Th>
              <Th>Trạng thái</Th>
              <Th>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredData.map((item) => (
              <Tr key={item.id}>
                <Td>
                  {format(new Date(item.ngayTao), 'dd/MM/yyyy', { locale: vi })}
                </Td>
                <Td>{item.userName}</Td>
                <Td>
                  <Badge
                    colorScheme={item.loai === LOAI_THUONG_PHAT.THUONG ? 'green' : 'red'}
                  >
                    {item.loai === LOAI_THUONG_PHAT.THUONG ? 'Thưởng' : 'Phạt'}
                  </Badge>
                </Td>
                <Td>{item.lyDo}</Td>
                <Td isNumeric>
                  <Text
                    color={item.loai === LOAI_THUONG_PHAT.THUONG ? 'green.500' : 'red.500'}
                  >
                    {formatCurrency(item.soTien)}
                  </Text>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      item.trangThai === 'da_duyet'
                        ? 'green'
                        : item.trangThai === 'tu_choi'
                        ? 'red'
                        : 'yellow'
                    }
                  >
                    {item.trangThai === 'da_duyet'
                      ? 'Đã duyệt'
                      : item.trangThai === 'tu_choi'
                      ? 'Từ chối'
                      : 'Chờ duyệt'}
                  </Badge>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<MoreVerticalIcon />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem icon={<EditIcon />} onClick={() => handleOpenForm(item)}>
                        Chỉnh sửa
                      </MenuItem>
                      <MenuItem 
                        icon={<DeleteIcon />} 
                        onClick={() => handleDelete(item.id)}
                        color="red.500"
                      >
                        Xóa
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Thống kê */}
        <HStack justify="flex-end" spacing={6}>
          <Box>
            <Text fontWeight="medium">Tổng thưởng:</Text>
            <Text color="green.500" fontSize="lg" fontWeight="bold">
              {formatCurrency(tongThuong)}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium">Tổng phạt:</Text>
            <Text color="red.500" fontSize="lg" fontWeight="bold">
              {formatCurrency(tongPhat)}
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium">Thực nhận:</Text>
            <Text 
              fontSize="lg" 
              fontWeight="bold"
              color={tongThuong - tongPhat >= 0 ? 'green.500' : 'red.500'}
            >
              {formatCurrency(tongThuong - tongPhat)}
            </Text>
          </Box>
        </HStack>
      </VStack>

      {/* Modal form */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedItem ? 'Cập nhật thưởng/phạt' : 'Thêm mới thưởng/phạt'}
            </ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Loại</FormLabel>
                  <Select
                    value={formData.loai}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      loai: e.target.value
                    }))}
                  >
                    <option value={LOAI_THUONG_PHAT.THUONG}>Thưởng</option>
                    <option value={LOAI_THUONG_PHAT.PHAT}>Phạt</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Lý do</FormLabel>
                  <Select
                    value={formData.lyDo}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      lyDo: e.target.value
                    }))}
                  >
                    <option value="">Chọn lý do</option>
                    {formData.loai === LOAI_THUONG_PHAT.THUONG ? (
                      LY_DO_THUONG.map(lyDo => (
                        <option key={lyDo} value={lyDo}>{lyDo}</option>
                      ))
                    ) : (
                      LY_DO_PHAT.map(lyDo => (
                        <option key={lyDo} value={lyDo}>{lyDo}</option>
                      ))
                    )}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Số tiền</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.soTien}
                    onChange={(valueString) => setFormData(prev => ({
                      ...prev,
                      soTien: Number(valueString)
                    }))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Ghi chú</FormLabel>
                  <Textarea
                    value={formData.ghiChu}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ghiChu: e.target.value
                    }))}
                    placeholder="Nhập ghi chú nếu cần..."
                  />
                </FormControl>

                {isAdmin && (
                  <FormControl>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      value={formData.trangThai}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        trangThai: e.target.value
                      }))}
                    >
                      <option value="cho_duyet">Chờ duyệt</option>
                      <option value="da_duyet">Đã duyệt</option>
                      <option value="tu_choi">Từ chối</option>
                    </Select>
                  </FormControl>
                )}

                {formData.trangThai === 'tu_choi' && (
                  <FormControl>
                    <FormLabel>Lý do từ chối</FormLabel>
                    <Textarea
                      value={formData.lyDoTuChoi}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        lyDoTuChoi: e.target.value
                      }))}
                      placeholder="Nhập lý do từ chối..."
                    />
                  </FormControl>
                )}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Hủy
              </Button>
              <Button 
                colorScheme="blue" 
                type="submit"
                isLoading={false} // TODO: Add loading state when integrating with API
              >
                {selectedItem ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Thêm PropTypes
ThuongPhat.propTypes = {
  userId: PropTypes.string,
  userName: PropTypes.string
};

export default ThuongPhat;