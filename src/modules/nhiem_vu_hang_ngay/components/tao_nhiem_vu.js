// File: src/modules/nhiem_vu_hang_ngay/components/tao_nhiem_vu.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast
} from '@chakra-ui/react';
import { LOAI_NHIEM_VU, TEN_LOAI_NHIEM_VU } from '../constants/loai_nhiem_vu';
import { taoNhiemVuAsync } from '../store/nhiem_vu_slice';

const TaoNhiemVu = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [formData, setFormData] = useState({
    tieuDe: '',
    moTa: '',
    loaiNhiemVu: LOAI_NHIEM_VU.LIKE,
    duongDan: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(taoNhiemVuAsync(formData)).unwrap();
      toast({
        title: 'Tạo nhiệm vụ thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        tieuDe: '',
        moTa: '',
        loaiNhiemVu: LOAI_NHIEM_VU.LIKE,
        duongDan: ''
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Tiêu đề</FormLabel>
            <Input
              name="tieuDe"
              value={formData.tieuDe}
              onChange={handleChange}
              placeholder="Nhập tiêu đề nhiệm vụ"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mô tả</FormLabel>
            <Input
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              placeholder="Nhập mô tả nhiệm vụ"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Loại nhiệm vụ</FormLabel>
            <Select
              name="loaiNhiemVu"
              value={formData.loaiNhiemVu}
              onChange={handleChange}
            >
              {Object.entries(TEN_LOAI_NHIEM_VU).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Đường dẫn</FormLabel>
            <Input
              name="duongDan"
              value={formData.duongDan}
              onChange={handleChange}
              placeholder="Nhập đường dẫn cần thực hiện nhiệm vụ"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
          >
            Tạo nhiệm vụ
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TaoNhiemVu;
