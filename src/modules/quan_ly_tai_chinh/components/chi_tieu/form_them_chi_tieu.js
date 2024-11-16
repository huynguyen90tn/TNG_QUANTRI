// File: src/modules/quan_ly_tai_chinh/components/chi_tieu/form_them_chi_tieu.js

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl, 
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  VStack,
  useToast,
  Text,
  FormErrorMessage,
  useColorModeValue
} from '@chakra-ui/react';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { LOAI_CHI_TIEU, TEN_LOAI_CHI_TIEU } from '../../constants/loai_chi_tieu';
import { dinhDangTien } from '../../utils/dinh_dang_tien';

const FormThemChiTieu = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaiChiTieu, setLoaiChiTieu] = useState('');
  const [soTien, setSoTien] = useState('');
  const [ngayChi, setNgayChi] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [errors, setErrors] = useState({});
  const { themMoiChiTieu } = useTaiChinh();

  const bgColor = useColorModeValue('gray.800', 'gray.700');
  const borderColor = useColorModeValue('gray.600', 'gray.500');
  const textColor = useColorModeValue('gray.100', 'gray.200');

  const validateForm = () => {
    const newErrors = {};
    
    if (!loaiChiTieu) {
      newErrors.loaiChiTieu = 'Vui lòng chọn loại chi tiêu';
    }
    
    if (!soTien || parseFloat(soTien.replace(/,/g, '')) <= 0) {
      newErrors.soTien = 'Vui lòng nhập số tiền hợp lệ';
    }
    
    if (!ngayChi) {
      newErrors.ngayChi = 'Vui lòng chọn ngày chi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSoTienChange = (value) => {
    const number = value.replace(/[^\d]/g, '');
    const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setSoTien(formatted);
    if (errors.soTien) {
      setErrors(prev => ({...prev, soTien: ''}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const chiTieuData = {
        loaiChi: loaiChiTieu,
        soTien: parseFloat(soTien.replace(/,/g, '')),
        ngayChi,
        ghiChu,
        trangThai: 'CHO_DUYET',
        ngayTao: new Date().toISOString()
      };

      await themMoiChiTieu(chiTieuData);

      toast({
        title: 'Thành công',
        description: 'Thêm chi tiêu mới thành công',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      // Reset form
      setLoaiChiTieu('');
      setSoTien('');
      setNgayChi('');
      setGhiChu('');
      setErrors({});
      e.target.reset();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      as="form" 
      onSubmit={handleSubmit}
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <VStack spacing={4}>
        <FormControl isRequired isInvalid={errors.loaiChiTieu}>
          <FormLabel color={textColor}>Loại chi tiêu</FormLabel>
          <Select
            value={loaiChiTieu}
            onChange={(e) => setLoaiChiTieu(e.target.value)}
            placeholder="Chọn loại chi tiêu"
            bg="gray.700"
            borderColor={borderColor}
            color={textColor}
            _hover={{ borderColor: 'gray.500' }}
            _focus={{ borderColor: 'blue.300' }}
          >
            {Object.entries(TEN_LOAI_CHI_TIEU).map(([key, label]) => (
              <option key={key} value={key} style={{background: '#2D3748'}}>
                {label}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.loaiChiTieu}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={errors.soTien}>
          <FormLabel color={textColor}>Số tiền</FormLabel>
          <NumberInput>
            <NumberInputField
              value={soTien}
              onChange={(e) => handleSoTienChange(e.target.value)}
              placeholder="Nhập số tiền"
              bg="gray.700"
              borderColor={borderColor}
              color={textColor}
              _hover={{ borderColor: 'gray.500' }}
              _focus={{ borderColor: 'blue.300' }}
            />
          </NumberInput>
          {soTien && (
            <Text mt={1} fontSize="sm" color="gray.400">
              {dinhDangTien(parseFloat(soTien.replace(/,/g, '')))} đồng
            </Text>
          )}
          <FormErrorMessage>{errors.soTien}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={errors.ngayChi}>
          <FormLabel color={textColor}>Ngày chi</FormLabel>
          <Input
            type="date"
            value={ngayChi}
            onChange={(e) => setNgayChi(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            bg="gray.700"
            borderColor={borderColor}
            color={textColor}
            _hover={{ borderColor: 'gray.500' }}
            _focus={{ borderColor: 'blue.300' }}
          />
          <FormErrorMessage>{errors.ngayChi}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel color={textColor}>Ghi chú</FormLabel>
          <Textarea
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            placeholder="Nhập ghi chú"
            resize="vertical"
            minH="100px"
            bg="gray.700"
            borderColor={borderColor}
            color={textColor}
            _hover={{ borderColor: 'gray.500' }}
            _focus={{ borderColor: 'blue.300' }}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isSubmitting}
          loadingText="Đang xử lý"
          w="100%"
          size="lg"
          fontSize="md"
          h="48px"
        >
          Thêm chi tiêu
        </Button>
      </VStack>
    </Box>
  );
};

export default FormThemChiTieu;