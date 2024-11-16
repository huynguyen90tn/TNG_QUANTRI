 
// File: src/modules/quan_ly_tai_chinh/components/nguon_thu/form_them_nguon_thu.js
// Link tham khảo: https://chakra-ui.com/docs/components/form-control
// Nhánh: main

import React from 'react';
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
  useToast
} from '@chakra-ui/react';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { LOAI_NGUON_THU, TEN_LOAI_NGUON_THU } from '../../constants/loai_nguon_thu';

const FormThemNguonThu = () => {
  const toast = useToast();
  const { themMoiNguonThu, dangXuLy } = useTaiChinh();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await themMoiNguonThu({
        loaiThu: formData.get('loaiThu'),
        soTien: parseFloat(formData.get('soTien')),
        ngayThu: formData.get('ngayThu'),
        ghiChu: formData.get('ghiChu')
      });

      e.target.reset();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} w="100%">
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Loại thu nhập</FormLabel>
          <Select name="loaiThu" placeholder="Chọn loại thu nhập">
            {Object.entries(TEN_LOAI_NGUON_THU).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Số tiền</FormLabel>
          <NumberInput min={0}>
            <NumberInputField name="soTien" placeholder="Nhập số tiền" />
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Ngày thu</FormLabel>
          <Input name="ngayThu" type="date" />
        </FormControl>

        <FormControl>
          <FormLabel>Ghi chú</FormLabel>
          <Textarea name="ghiChu" placeholder="Nhập ghi chú" />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={dangXuLy}
          loadingText="Đang xử lý"
          w="100%"
        >
          Thêm nguồn thu
        </Button>
      </VStack>
    </Box>
  );
};

export default FormThemNguonThu;