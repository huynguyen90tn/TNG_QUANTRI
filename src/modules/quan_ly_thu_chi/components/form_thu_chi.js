// File: src/modules/quan_ly_thu_chi/components/form_thu_chi.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import { db } from '../../../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const formatCurrency = (value) => {
  // Loại bỏ tất cả ký tự không phải số
  const number = value.replace(/[^\d]/g, '');
  
  // Thêm dấu phẩy ngăn cách hàng nghìn
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseCurrency = (value) => {
  // Chuyển đổi chuỗi có dấu phẩy thành số
  return parseInt(value.replace(/,/g, ''), 10);
};

const FormThuChi = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    loai: 'thu',
    soTien: '',
    moTa: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'soTien') {
      setFormData(prev => ({
        ...prev,
        [name]: formatCurrency(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const thuChiRef = collection(db, 'thu_chi');
      const thuChiData = {
        loai: formData.loai,
        soTien: parseCurrency(formData.soTien) || 0,
        moTa: formData.moTa,
        nguoiTao: user.id,
        ngayTao: Timestamp.now(),
        ngayCapNhat: Timestamp.now()
      };
      
      await addDoc(thuChiRef, thuChiData);
      
      toast({
        title: 'Thành công',
        description: 'Đã thêm khoản thu chi mới',
        status: 'success',
        duration: 2000
      });

      await onSuccess?.();
      onClose();
      
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, user.id, onClose, onSuccess, toast]);

  const handleClose = () => {
    setFormData({
      loai: 'thu',
      soTien: '',
      moTa: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <form onSubmit={handleSubmit}>
          <ModalHeader>Thêm khoản thu chi</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Loại</FormLabel>
                <Select 
                  name="loai"
                  value={formData.loai}
                  onChange={handleChange}
                  bg="gray.700"
                >
                  <option value="thu">Thu</option>
                  <option value="chi">Chi</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Số tiền</FormLabel>
                <Input
                  name="soTien"
                  value={formData.soTien}
                  onChange={handleChange}
                  placeholder="Nhập số tiền..."
                  bg="gray.700"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Mô tả</FormLabel>
                <Input
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                  placeholder="Nhập mô tả..."
                  bg="gray.700"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Hủy
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
            >
              Lưu
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default FormThuChi;