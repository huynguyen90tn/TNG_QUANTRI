// src/modules/quan_ly_thanh_vien/components/them_thanh_vien.js
import React from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { PHONG_BAN, PHONG_BAN_LABEL } from '../constants/trang_thai_thanh_vien';
import { useThanhVien } from '../hooks/use_thanh_vien';

const ThemThanhVien = ({ isOpen, onClose }) => {
  const { themMoi } = useThanhVien();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const thanhVienMoi = {
        ...data,
        trangThai: 'DANG_CONG_TAC',
        ngayTao: new Date().toISOString(),
      };

      const ketQua = await themMoi(thanhVienMoi);
      if (ketQua) {
        toast({
          title: 'Thành công',
          description: 'Thêm thành viên mới thành công',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        reset();
        onClose();
      }
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thêm thành viên mới</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ',
                    },
                  })}
                />
              </FormControl>

              <FormControl isInvalid={errors.hoTen}>
                <FormLabel>Họ tên</FormLabel>
                <Input
                  {...register('hoTen', {
                    required: 'Họ tên là bắt buộc',
                    minLength: {
                      value: 2,
                      message: 'Họ tên phải có ít nhất 2 ký tự',
                    },
                  })}
                />
              </FormControl>

              <FormControl isInvalid={errors.phongBan}>
                <FormLabel>Phòng ban</FormLabel>
                <Select
                  {...register('phongBan', {
                    required: 'Phòng ban là bắt buộc',
                  })}
                >
                  <option value="">Chọn phòng ban</option>
                  {Object.entries(PHONG_BAN).map(([key, value]) => (
                    <option key={key} value={value}>
                      {PHONG_BAN_LABEL[value]}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isInvalid={errors.chucVu}>
                <FormLabel>Chức vụ</FormLabel>
                <Input
                  {...register('chucVu', {
                    required: 'Chức vụ là bắt buộc',
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  {...register('soDienThoai', {
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: 'Số điện thoại không hợp lệ',
                    },
                  })}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
            >
              Thêm
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ThemThanhVien;