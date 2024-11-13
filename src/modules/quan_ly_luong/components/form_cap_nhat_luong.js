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
  AlertIcon
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useLuong } from '../hooks/use_luong';
import { formatCurrency, formatNumber, parseFormattedNumber } from '../../../utils/format';
import { CAP_BAC_LABEL } from '../constants/loai_luong';

const initPhuCap = {
  anUong: 0,
  diLai: 0,
  dienThoai: 0,
  khac: 0
};

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

export const FormCapNhatLuong = ({ isOpen, onClose, data }) => {
  const toast = useToast();
  const { tinhToanLuong, capNhat } = useLuong();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dongBaoHiem, setDongBaoHiem] = useState(false);
  const [dongThue, setDongThue] = useState(false);

  const [formData, setFormData] = useState({
    memberCode: '',
    level: '',
    department: '',
    luongCoBan: 0,
    phuCap: { ...initPhuCap }
  });

  // Khởi tạo state cho thưởng phạt
  const [thuongList, setThuongList] = useState([]);
  const [phatList, setPhatList] = useState([]);

  useEffect(() => {
    if (data) {
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
        }
      });
      setDongBaoHiem(data.baoHiem?.dongBaoHiem || false);
      setDongThue(data.dongThue || false);
      setThuongList(data.thuongList?.map(item => ({...item})) || []);
      setPhatList(data.phatList?.map(item => ({...item})) || []);
    }
  }, [data]);

  const handleAddThuong = useCallback(() => {
    setThuongList(prev => [...prev, {
      amount: 0,
      reason: ''
    }]);
  }, []);

  const handleAddPhat = useCallback(() => {
    setPhatList(prev => [...prev, {
      amount: 0,
      reason: ''
    }]);
  }, []);

  const handleDeleteThuong = useCallback((index) => {
    setThuongList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleDeletePhat = useCallback((index) => {
    setPhatList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleChangeThuong = useCallback((index, field, value) => {
    setThuongList(prev => {
      const newList = prev.map(item => ({...item}));
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

  const handleChangePhat = useCallback((index, field, value) => {
    setPhatList(prev => {
      const newList = prev.map(item => ({...item}));
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
      };
    });
  }, []);

  // Tính toán tổng thưởng phạt
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
    dongThue
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
                  <Text fontWeight="medium">
                    {formatCurrency(tongThuNhap)}
                  </Text>
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
    </Modal>
  );
};

FormCapNhatLuong.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
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

ThuongPhatItem.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number,
      reason: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChangeAmount: PropTypes.func.isRequired,
  onChangeReason: PropTypes.func.isRequired
};

FormCapNhatLuong.defaultProps = {
  data: null
};

export default FormCapNhatLuong;