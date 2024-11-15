// File: src/modules/quan_ly_luong/components/form_cap_nhat_luong.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
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
  VStack,
  HStack,
  Button,
  Text,
  useToast,
  Divider,
  Switch,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  Tooltip,
  Box
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import { FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useLuong } from '../hooks/use_luong';
import { formatCurrency, formatNumber, parseFormattedNumber } from '../../../utils/format';
import { db } from '../../../services/firebase';
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { CAP_BAC_LABEL } from '../constants/loai_luong';

// Khởi tạo state mặc định
const defaultKhauTru = {
  nghiPhepKhongPhep: 0,
  chiTiet: []
};

const defaultPhuCap = {
  anUong: 0,
  diLai: 0,
  dienThoai: 0,
  khac: 0
};

const initFormData = {
  memberCode: '',
  level: '',
  department: '',
  luongCoBan: 0,
  phuCap: { ...defaultPhuCap },
  khauTru: { ...defaultKhauTru }
};

// Component modal chi tiết khấu trừ
const ChiTietKhauTruModal = ({ isOpen, onClose, chiTietKhauTru = [], luongMotNgay }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxH="80vh">
        <Box p={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="xl" fontWeight="bold">Chi Tiết Khấu Trừ</Text>
              <Text>Lương 1 ngày: {formatCurrency(luongMotNgay)}</Text>
            </HStack>

            <Box overflowY="auto" maxH="60vh">
              <Table variant="simple">
                <Thead position="sticky" top={0} bg="white" zIndex={1}>
                  <Tr>
                    <Th>Ngày</Th>
                    <Th>Thứ</Th>
                    <Th>Lý do</Th>
                    <Th isNumeric>Số tiền trừ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {chiTietKhauTru.map((item, index) => {
                    const ngay = new Date(item.date);
                    const thu = format(ngay, 'EEEE', { locale: vi });
                    return (
                      <Tr key={index}>
                        <Td>{format(ngay, 'dd/MM/yyyy')}</Td>
                        <Td textTransform="capitalize">{thu}</Td>
                        <Td>{item.type}</Td>
                        <Td isNumeric color="red.500">
                          -{formatCurrency(item.amount)}
                        </Td>
                      </Tr>
                    );
                  })}
                  <Tr fontWeight="bold">
                    <Td colSpan={3}>Tổng cộng</Td>
                    <Td isNumeric color="red.500">
                      -{formatCurrency(chiTietKhauTru.reduce((sum, item) => sum + item.amount, 0))}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Button onClick={onClose} alignSelf="flex-end">
              Đóng
            </Button>
          </VStack>
        </Box>
      </ModalContent>
    </Modal>
  );
};

// Component hiển thị thưởng phạt
const ThuongPhatItem = ({ items, title, onAdd, onDelete, onChangeAmount, onChangeReason }) => (
  <Card>
    <CardHeader>
      <HStack justify="space-between">
        <Text fontWeight="bold">{title}</Text>
        <IconButton
          aria-label={`Thêm ${title.toLowerCase()}`}
          icon={<AddIcon />}
          onClick={onAdd}
          size="sm"
          colorScheme="blue" 
        />
      </HStack>
    </CardHeader>
    <CardBody>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th w="40%">Số tiền</Th>
            <Th>Lý do</Th>
            <Th w="10%"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => (
            <Tr key={index}>
              <Td>
                <Input
                  type="text"
                  value={formatNumber(item.amount)}
                  onChange={(e) => onChangeAmount(index, e.target.value)} 
                />
              </Td>
              <Td>
                <Input
                  type="text" 
                  value={item.reason}
                  onChange={(e) => onChangeReason(index, e.target.value)}
                />
              </Td>
              <Td>
                <IconButton
                  aria-label="Xóa"
                  icon={<DeleteIcon />}
                  onClick={() => onDelete(index)}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </CardBody>
  </Card>
);

// Component chính
export const FormCapNhatLuong = ({ isOpen, onClose, data }) => {
  const toast = useToast();
  const { tinhToanLuong, capNhat } = useLuong();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChiTietOpen, setIsChiTietOpen] = useState(false);
  const [dongBaoHiem, setDongBaoHiem] = useState(false);
  const [dongThue, setDongThue] = useState(false);

  const [formData, setFormData] = useState({ ...initFormData });
  const [thuongList, setThuongList] = useState([]);
  const [phatList, setPhatList] = useState([]);

  const tinhTienTruLuong = useCallback((luongCoBan) => {
    return Math.round(luongCoBan / 26);
  }, []);

  // Kiểm tra báo cáo ngày  
  const checkDailyReport = useCallback(async (email, date) => {
    try {
      if (!email) return false;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const reportQuery = query(
        collection(db, 'bao_cao'),
        where('nguoiTaoInfo.email', '==', email.toLowerCase().trim()),
        where('ngayTao', '>=', Timestamp.fromDate(startOfDay)),
        where('ngayTao', '<=', Timestamp.fromDate(endOfDay))
      );

      const snapshot = await getDocs(reportQuery);
      return !snapshot.empty;

    } catch (error) {
      console.error('Error checking daily report:', error);
      return false; 
    }
  }, []);

  // Tính toán khấu trừ
  const calculateDeductions = useCallback(async (member) => {
    if (!member?.email || !member?.luongCoBan) return null;

    const deductions = {
      totalDays: 0,
      totalAmount: 0,
      details: []
    };

    try {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const isCurrentMonth = true;
      const endDate = isCurrentMonth ? new Date() : monthEnd;

      const dailySalary = tinhTienTruLuong(member.luongCoBan);

      for (let date = new Date(monthStart); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0) continue;

        const hasReport = await checkDailyReport(member.email, date);

        if (!hasReport) {
          deductions.totalDays += 1;
          deductions.totalAmount += dailySalary;
          deductions.details.push({
            date: date.toISOString(),
            type: 'Không báo cáo ngày',
            amount: dailySalary,
            dayOfWeek
          });
        }
      }

      return deductions;
    } catch (error) {
      console.error('Error calculating deductions:', error);
      return null;
    }
  }, [checkDailyReport, tinhTienTruLuong]);

  // Reset form khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({ ...initFormData });
      setThuongList([]);
      setPhatList([]);
      setDongBaoHiem(false);
      setDongThue(false);
      setError(null);
    }
  }, [isOpen]);

  // Load dữ liệu khi mở form
  useEffect(() => {
    const loadLuongInfo = async () => {
      if (!data) return;

      try {
        setFormData({
          memberCode: data.memberCode || '',
          level: data.level || '',
          department: data.department || '',
          luongCoBan: data.luongCoBan || 0,
          phuCap: {
            anUong: data.phuCap?.anUong || 0,
            diLai: data.phuCap?.diLai || 0,
            dienThoai: data.phuCap?.dienThoai || 0,
            khac: data.phuCap?.khac || 0
          },
          khauTru: { ...defaultKhauTru }
        });

        setDongBaoHiem(data.baoHiem?.dongBaoHiem || false);
        setDongThue(data.dongThue || false);

        setThuongList(data.thuongList?.map(item => ({ ...item })) || []);
        setPhatList(data.phatList?.map(item => ({ ...item })) || []);

        const docRef = doc(db, 'users', data.userId);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const deductions = await calculateDeductions({
            email: userData.email,
            luongCoBan: data.luongCoBan
          });

          if (deductions) {
            setFormData(prev => ({
              ...prev,
              khauTru: {
                nghiPhepKhongPhep: deductions.totalAmount,
                chiTiet: deductions.details || []
              }
            }));

            if (deductions.totalAmount > 0) {
              setPhatList(prev => [
                ...prev,
                {
                  amount: deductions.totalAmount,
                  reason: `Trừ lương ${deductions.totalDays} ngày không báo cáo`
                }
              ]);
            }
          }
        }

      } catch (err) {
        setError('Không thể tải thông tin lương');
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin lương',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    };

    loadLuongInfo();
  }, [data, toast, calculateDeductions]);

  const handleAddThuong = useCallback(() => {
    setThuongList(prev => [...prev, { amount: 0, reason: '' }]);
  }, []);

  const handleDeleteThuong = useCallback((index) => {
    setThuongList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleChangeThuong = useCallback((index, field, value) => {
    setThuongList(prev => {
      const newList = [...prev];
      if (field === 'amount') {
        newList[index] = {
          ...newList[index],
          amount: parseFormattedNumber(value)  
        };
      } else {
        newList[index] = {
          ...newList[index],
          reason: value
        };
      }
      return newList;
    });
  }, []);

  const handleAddPhat = useCallback(() => {
    setPhatList(prev => [...prev, { amount: 0, reason: '' }]);
  }, []);

  const handleDeletePhat = useCallback((index) => {
    setPhatList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleChangePhat = useCallback((index, field, value) => {
    setPhatList(prev => {
      const newList = [...prev];
      if (field === 'amount') {
        newList[index] = {
          ...newList[index],
          amount: parseFormattedNumber(value)
        };
      } else {
        newList[index] = {
          ...newList[index],
          reason: value  
        };
      }
      return newList;
    });
  }, []);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: parseFormattedNumber(value)
          }
        };
      }
      return {
        ...prev,
        [field]: parseFormattedNumber(value)
      };});
    }, []);
  
    const tongThuong = thuongList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const tongPhat = phatList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  
    const {
      tongThuNhap,
      thueTNCN,
      baoHiem,
      thucLinh
    } = tinhToanLuong(
      formData.luongCoBan,
      tongThuong - tongPhat,
      formData.phuCap,
      dongBaoHiem,
      dongThue,
      // Bỏ khauTru khỏi tham số tính toán vì đã trừ trong phatList 
      { nghiPhepKhongPhep: 0, chiTiet: [] }
    );
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
  
      try {
        const updateData = {
          ...formData,
          tongThuNhap,
          thueTNCN: dongThue ? thueTNCN : 0,
          baoHiem: {
            ...baoHiem,
            dongBaoHiem
          },
          thucLinh,
          thuongList: thuongList.map(item => ({
            amount: Number(item.amount) || 0,
            reason: item.reason || ''
          })),
          phatList: phatList.map(item => ({
            amount: Number(item.amount) || 0,
            reason: item.reason || ''
          })),
          // Giữ thông tin khấu trừ để hiển thị
          khauTru: {
            nghiPhepKhongPhep: formData.khauTru.nghiPhepKhongPhep,
            chiTiet: formData.khauTru.chiTiet || []
          },
          dongThue
        };
  
        await capNhat(data.id, updateData);
  
        toast({
          title: 'Thành công', 
          description: 'Đã cập nhật bảng lương',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
  
        onClose();
  
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra');
        toast({
          title: 'Lỗi',
          description: err.message || 'Không thể cập nhật bảng lương',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Cập Nhật Lương</ModalHeader>
            <ModalCloseButton />
  
            <ModalBody>
              <VStack spacing={4}>
                {error && (
                  <Alert status="error">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}
  
                <FormControl isRequired>
                  <FormLabel>Mã thành viên</FormLabel>
                  <Input
                    value={formData.memberCode}
                    isReadOnly
                  />
                </FormControl>
  
                <FormControl isRequired>
                  <FormLabel>Cấp bậc</FormLabel>
                  <Input
                    value={`${CAP_BAC_LABEL[formData.level]} - ${formatCurrency(formData.luongCoBan)}`}
                    isReadOnly
                  />
                </FormControl>
  
                {formData.khauTru?.nghiPhepKhongPhep > 0 && (
                  <Alert status="warning">
                    <AlertIcon />
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack justify="space-between" w="full">
                        <Text>
                           Thông báo: {formData.khauTru.chiTiet.length} ngày không báo cáo
                        </Text>
                        <Button
                          leftIcon={<FiCalendar />}
                          size="sm"
                          variant="outline"
                          onClick={() => setIsChiTietOpen(true)}
                        >
                          Xem chi tiết
                        </Button>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        Lương 1 ngày: {formatCurrency(tinhTienTruLuong(formData.luongCoBan))}
                      </Text>
                    </VStack>
                  </Alert>
                )}
  
                <ThuongPhatItem
                  title="Thưởng"
                  items={thuongList}
                  onAdd={handleAddThuong}
                  onDelete={handleDeleteThuong}
                  onChangeAmount={(index, value) => handleChangeThuong(index, 'amount', value)}
                  onChangeReason={(index, value) => handleChangeThuong(index, 'reason', value)}
                />
  
                <ThuongPhatItem
                  title="Trừ lương"
                  items={phatList}
                  onAdd={handleAddPhat}
                  onDelete={handleDeletePhat}
                  onChangeAmount={(index, value) => handleChangePhat(index, 'amount', value)}
                  onChangeReason={(index, value) => handleChangePhat(index, 'reason', value)}
                />
  
                <FormControl>
                  <FormLabel>Phụ cấp</FormLabel>
                  <VStack spacing={3}>
                    <HStack spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Ăn uống</FormLabel>
                        <Input
                          type="text"
                          value={formatNumber(formData.phuCap.anUong)}
                          onChange={(e) => handleChange('phuCap.anUong', e.target.value)}
                        />
                      </FormControl>
  
                      <FormControl>
                        <FormLabel>Đi lại</FormLabel>
                        <Input
                          type="text"
                          value={formatNumber(formData.phuCap.diLai)}
                          onChange={(e) => handleChange('phuCap.diLai', e.target.value)}
                        />
                      </FormControl>
                    </HStack>
  
                    <HStack spacing={4} w="full">
                      <FormControl>
                        <FormLabel>Điện thoại</FormLabel>
                        <Input
                          type="text"
                          value={formatNumber(formData.phuCap.dienThoai)}
                          onChange={(e) => handleChange('phuCap.dienThoai', e.target.value)}
                        />
                      </FormControl>
  
                      <FormControl>
                        <FormLabel>Khác</FormLabel>
                        <Input
                          type="text"
                          value={formatNumber(formData.phuCap.khac)}
                          onChange={(e) => handleChange('phuCap.khac', e.target.value)}
                        />
                      </FormControl>
                    </HStack>
                  </VStack>
                </FormControl>
  
                <Card>
                  <CardHeader>
                    <FormControl display='flex' alignItems='center'>
                      <FormLabel mb='0'>
                        <HStack>
                          <Text>Đóng bảo hiểm</Text>
                          <Tooltip
                            label="BHXH (8%), BHYT (1.5%), BHTN (1%)"
                            placement="right"
                          >
                            <InfoIcon />
                          </Tooltip>
                        </HStack>
                      </FormLabel>
                      <Switch
                        isChecked={dongBaoHiem}
                        onChange={(e) => setDongBaoHiem(e.target.checked)}
                      />
                    </FormControl>
                  </CardHeader>
                  {dongBaoHiem && (
                    <CardBody>
                      <VStack spacing={3}>
                        <HStack justify="space-between" w="full">
                          <Text>BHYT (1.5%):</Text>
                          <Text>{formatCurrency(baoHiem.bhyt)}</Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text>BHXH (8%):</Text>
                          <Text>{formatCurrency(baoHiem.bhxh)}</Text>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text>BHTN (1%):</Text>
                          <Text>{formatCurrency(baoHiem.bhtn)}</Text>
                        </HStack>
                        <Divider />
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="bold">Tổng bảo hiểm:</Text>
                          <Text fontWeight="bold">
                            {formatCurrency(baoHiem.bhyt + baoHiem.bhxh + baoHiem.bhtn)}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  )}
                </Card>
  
                <FormControl display='flex' alignItems='center'>
                  <FormLabel mb='0'>Đóng thuế TNCN</FormLabel>
                  <Switch
                    isChecked={dongThue}
                    onChange={(e) => setDongThue(e.target.checked)}
                  />
                </FormControl>
  
                <Divider />
  
                <VStack spacing={2} align="stretch" w="full">
                  <HStack justify="space-between">
                    <Text>Tổng thu nhập:</Text>
                    <Text fontWeight="medium">{formatCurrency(tongThuNhap)}</Text>
                  </HStack>
  
                  {dongThue && (
                    <HStack justify="space-between">
                      <Text>Thuế TNCN:</Text>
                      <Text>{formatCurrency(thueTNCN)}</Text>
                    </HStack>
                  )}
  
                  {dongBaoHiem && (
                    <HStack justify="space-between">
                      <Text>Tổng bảo hiểm:</Text>
                      <Text color="red.500">
                        {formatCurrency(baoHiem.bhyt + baoHiem.bhxh + baoHiem.bhtn)}
                      </Text>
                    </HStack>
                  )}
  
                  <Divider />
  
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Thực lĩnh:</Text>
                    <Text fontWeight="bold" color="green.500">
                      {formatCurrency(thucLinh)}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </ModalBody>
  
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Hủy
              </Button>
              <Button
                colorScheme="blue"
                type="submit" 
                isLoading={loading}
                loadingText="Đang cập nhật..."
                disabled={!formData.memberCode || loading}
              >
                Cập nhật
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
  
        <ChiTietKhauTruModal
          isOpen={isChiTietOpen}
          onClose={() => setIsChiTietOpen(false)}
          chiTietKhauTru={formData?.khauTru?.chiTiet || []}
          luongMotNgay={tinhTienTruLuong(formData.luongCoBan)}
        />
      </Modal>
    );
  };
  
  FormCapNhatLuong.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    data: PropTypes.shape({
      id: PropTypes.string,
      userId: PropTypes.string,
      memberCode: PropTypes.string,
      userName: PropTypes.string,
      level: PropTypes.string,
      luongCoBan: PropTypes.number,
      luongThuong: PropTypes.number,
      phuCap: PropTypes.shape({
        anUong: PropTypes.number,
        diLai: PropTypes.number, 
        dienThoai: PropTypes.number,
        khac: PropTypes.number
      }),
      baoHiem: PropTypes.shape({
        bhyt: PropTypes.number,
        bhxh: PropTypes.number,
        bhtn: PropTypes.number, 
        dongBaoHiem: PropTypes.bool
      }),
      thueTNCN: PropTypes.number,
      thucLinh: PropTypes.number,
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
      dongThue: PropTypes.bool
    })
  };
  
  FormCapNhatLuong.defaultProps = {
    data: null
  };
  
  export default FormCapNhatLuong;