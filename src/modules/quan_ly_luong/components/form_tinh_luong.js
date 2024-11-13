// File: src/modules/quan_ly_luong/components/form_tinh_luong.js
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
  AlertIcon
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useLuong } from '../hooks/use_luong';
import { formatCurrency, formatNumber, parseFormattedNumber } from '../../../utils/format';
import { db } from '../../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LUONG_THEO_CAP_BAC, CAP_BAC_LABEL } from '../constants/loai_luong';

const initPhuCap = {
  anUong: 0,
  diLai: 0,
  dienThoai: 0,
  khac: 0
};

const initBaoHiem = {
  bhyt: 0,
  bhxh: 0,
  bhtn: 0,
  dongBaoHiem: false
};

const ThuongPhatItem = ({ items, title, onAdd, onDelete, onChangeAmount, onChangeReason }) => (
  <Card>
    <CardHeader>
      <HStack justify="space-between">
        <Text fontWeight="bold">{title}</Text>
        <IconButton
          aria-label={`Thêm ${title}`}
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

export const FormTinhLuong = ({
  isOpen,
  onClose,
  thanhVien = null,
  onSubmit: handleSubmitExternal
}) => {
  const toast = useToast();
  const { tinhToanLuong } = useLuong();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    memberCode: '',
    level: '',
    department: '',
    luongCoBan: 0,
    phuCap: { ...initPhuCap },
    baoHiem: { ...initBaoHiem }
  });

  const [thuongList, setThuongList] = useState([]);
  const [phatList, setPhatList] = useState([]);
  const [dongBaoHiem, setDongBaoHiem] = useState(false);
  const [dongThue, setDongThue] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        userId: '',
        userName: '',
        memberCode: '',
        level: '',
        department: '',
        luongCoBan: 0,
        phuCap: { ...initPhuCap },
        baoHiem: { ...initBaoHiem }
      });
      setThuongList([]);
      setPhatList([]);
      setDongBaoHiem(false);
      setDongThue(false);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const loadThanhVienInfo = async () => {
      if (!thanhVien?.id) return;

      try {
        const docRef = doc(db, "members", thanhVien.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            userId: thanhVien.id,
            userName: data.fullName || '',  
            memberCode: data.memberCode || '',
            level: data.level || 'THU_SINH',
            department: data.department || '',
            luongCoBan: LUONG_THEO_CAP_BAC[data.level] || 0
          }));
        }
      } catch (err) {
        setError('Không thể tải thông tin thành viên');
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin thành viên', 
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    };

    loadThanhVienInfo();
  }, [thanhVien, toast]);

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
        [field]: value
      }; 
    });
  }, []);

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
        newList[index][field] = parseFormattedNumber(value);
      } else {
        newList[index][field] = value;
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
        newList[index][field] = parseFormattedNumber(value);
      } else {
        newList[index][field] = value;
      }
      return newList;
    });
  }, []);

  const tongThuong = thuongList.reduce((sum, item) => sum + (item.amount || 0), 0);
  const tongPhat = phatList.reduce((sum, item) => sum + (item.amount || 0), 0);

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
    dongThue
  );

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!formData.userId || !formData.userName || !formData.memberCode) {
        throw new Error('Vui lòng chọn thành viên');
      }

      const luongData = {
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
          reason: item.reason
        })),
        phatList: phatList.map(item => ({
          amount: Number(item.amount) || 0,
          reason: item.reason
        })),
        dongThue,
        kyLuong: {
          thang: new Date().getMonth() + 1,
          nam: new Date().getFullYear()
        },
        trangThai: 'CHO_DUYET'
      };

      await handleSubmitExternal(luongData);
      toast({
        title: 'Thành công',
        description: 'Đã tạo bảng lương mới',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onClose();

    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể tạo bảng lương',
        status: 'error',
        duration: 3000,
        isClosable: true  
      });
    } finally {
      setLoading(false);
    }
  }, [
    formData,
    tongThuNhap,
    thueTNCN,
    baoHiem,
    thucLinh,
    dongBaoHiem,
    dongThue,
    thuongList,
    phatList,
    handleSubmitExternal,
    onClose,
    toast
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Tính Lương</ModalHeader>
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
                    <FormLabel mb='0'>Đóng bảo hiểm</FormLabel>
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
              loadingText="Đang xử lý..."
              disabled={!formData.userId || !formData.userName || loading}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

FormTinhLuong.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  thanhVien: PropTypes.shape({
    id: PropTypes.string,
    memberCode: PropTypes.string,
    level: PropTypes.string,
    department: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired
};

FormTinhLuong.defaultProps = {
  thanhVien: null
};

export default FormTinhLuong;