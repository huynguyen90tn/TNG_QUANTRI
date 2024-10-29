// src/modules/quan_ly_chi_tiet/components/them_du_an.js

import React, { useEffect } from 'react';
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
  Textarea,
  VStack,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useDuAn } from '../hooks/use_du_an';

const ThemDuAnModal = ({ isOpen, onClose, duAnHienTai }) => {
  const toast = useToast();
  const { themDuAn, capNhatDuAn, isSubmitting } = useDuAn();
  const isEditing = Boolean(duAnHienTai);

  // Định nghĩa các trạng thái dự án
  const TRANG_THAI_DU_AN = ['Chuẩn bị', 'Đang thực hiện', 'Hoàn thành', 'Đã kết thúc'];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      tenDuAn: '',
      moTa: '',
      phongBan: '',
      trangThai: 'Chuẩn bị',
      ngayBatDau: '',
      ngayKetThuc: ''
    }
  });

  useEffect(() => {
    if (duAnHienTai) {
      reset({
        tenDuAn: duAnHienTai.tenDuAn,
        moTa: duAnHienTai.moTa,
        phongBan: duAnHienTai.phongBan,
        trangThai: duAnHienTai.trangThai,
        ngayBatDau: duAnHienTai.ngayBatDau.split('T')[0],
        ngayKetThuc: duAnHienTai.ngayKetThuc.split('T')[0]
      });
    }
  }, [duAnHienTai, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await capNhatDuAn(duAnHienTai.id, data);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật dự án',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await themDuAn(data);
        toast({
          title: 'Thành công',
          description: 'Đã thêm dự án mới',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      handleClose();
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {isEditing ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={errors.tenDuAn}>
                <FormLabel>Tên dự án</FormLabel>
                <Input
                  {...register('tenDuAn', {
                    required: 'Vui lòng nhập tên dự án',
                    minLength: {
                      value: 3,
                      message: 'Tên dự án phải có ít nhất 3 ký tự'
                    }
                  })}
                  placeholder="Nhập tên dự án"
                />
                <FormErrorMessage>
                  {errors.tenDuAn?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Textarea
                  {...register('moTa')}
                  placeholder="Nhập mô tả dự án"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired isInvalid={errors.phongBan}>
                <FormLabel>Phòng ban</FormLabel>
                <Select
                  {...register('phongBan', {
                    required: 'Vui lòng chọn phòng ban'
                  })}
                >
                  <option value="">Chọn phòng ban</option>
                  <option value="Phòng Frontend">Phòng Frontend</option>
                  <option value="Phòng Backend">Phòng Backend</option>
                  <option value="Phòng Testing">Phòng Testing</option>
                </Select>
                <FormErrorMessage>
                  {errors.phongBan?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.trangThai}>
                <FormLabel>Trạng thái</FormLabel>
                <Select
                  {...register('trangThai', {
                    required: 'Vui lòng chọn trạng thái'
                  })}
                >
                  {TRANG_THAI_DU_AN.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.trangThai?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.ngayBatDau}>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <Input
                  type="date"
                  {...register('ngayBatDau', {
                    required: 'Vui lòng chọn ngày bắt đầu'
                  })}
                />
                <FormErrorMessage>
                  {errors.ngayBatDau?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.ngayKetThuc}>
                <FormLabel>Ngày kết thúc</FormLabel>
                <Input
                  type="date"
                  {...register('ngayKetThuc', {
                    required: 'Vui lòng chọn ngày kết thúc',
                    validate: value => {
                      const ngayBatDau = new Date(document.getElementsByName('ngayBatDau')[0].value);
                      const ngayKetThuc = new Date(value);
                      return ngayKetThuc > ngayBatDau || 'Ngày kết thúc phải sau ngày bắt đầu';
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.ngayKetThuc?.message}
                </FormErrorMessage>
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
              isLoading={isSubmitting}
              loadingText="Đang xử lý..."
            >
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ThemDuAnModal;
