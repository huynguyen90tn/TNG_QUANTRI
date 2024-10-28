// src/modules/quan_ly_chi_tiet/components/them_nhiem_vu.js

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
  FormErrorMessage,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useNhiemVu } from '../hooks/use_nhiem_vu';

const ThemNhiemVuModal = ({ isOpen, onClose, duAnId, nhiemVuHienTai }) => {
  const toast = useToast();
  const { themNhiemVu, capNhatNhiemVu, isSubmitting } = useNhiemVu();
  const isEditing = Boolean(nhiemVuHienTai);

  // Định nghĩa các trạng thái nhiệm vụ
  const TRANG_THAI_NHIEM_VU = ['Mới', 'Đang thực hiện', 'Hoàn thành'];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      tenNhiemVu: '',
      moTa: '',
      nguoiPhuTrach: '',
      trangThai: 'Mới',
      tienDo: 0,
      deadline: '',
      ghiChu: ''
    }
  });

  useEffect(() => {
    if (nhiemVuHienTai) {
      reset({
        tenNhiemVu: nhiemVuHienTai.tenNhiemVu,
        moTa: nhiemVuHienTai.moTa,
        nguoiPhuTrach: nhiemVuHienTai.nguoiPhuTrach,
        trangThai: nhiemVuHienTai.trangThai,
        tienDo: nhiemVuHienTai.tienDo,
        deadline: nhiemVuHienTai.deadline.split('T')[0],
        ghiChu: nhiemVuHienTai.ghiChu || ''
      });
    }
  }, [nhiemVuHienTai, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const nhiemVuData = {
        ...data,
        duAnId,
        tienDo: Number(data.tienDo)
      };

      if (isEditing) {
        await capNhatNhiemVu(nhiemVuHienTai.id, nhiemVuData);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật nhiệm vụ',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await themNhiemVu(nhiemVuData);
        toast({
          title: 'Thành công',
          description: 'Đã thêm nhiệm vụ mới',
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

  const watchTrangThai = watch('trangThai');
  const isHoanThanh = watchTrangThai === 'Hoàn thành';

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
            {isEditing ? 'Chỉnh sửa nhiệm vụ' : 'Thêm nhiệm vụ mới'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={errors.tenNhiemVu}>
                <FormLabel>Tên nhiệm vụ</FormLabel>
                <Input
                  {...register('tenNhiemVu', {
                    required: 'Vui lòng nhập tên nhiệm vụ',
                    minLength: {
                      value: 3,
                      message: 'Tên nhiệm vụ phải có ít nhất 3 ký tự'
                    }
                  })}
                  placeholder="Nhập tên nhiệm vụ"
                />
                <FormErrorMessage>
                  {errors.tenNhiemVu?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Textarea
                  {...register('moTa')}
                  placeholder="Nhập mô tả nhiệm vụ"
                  rows={4}
                />
              </FormControl>

              <FormControl isRequired isInvalid={errors.nguoiPhuTrach}>
                <FormLabel>Người phụ trách</FormLabel>
                <Input
                  {...register('nguoiPhuTrach', {
                    required: 'Vui lòng nhập người phụ trách'
                  })}
                  placeholder="Nhập tên người phụ trách"
                />
                <FormErrorMessage>
                  {errors.nguoiPhuTrach?.message}
                </FormErrorMessage>
              </FormControl>

              <HStack w="full" align="start" spacing={4}>
                <FormControl isRequired isInvalid={errors.trangThai}>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    {...register('trangThai', {
                      required: 'Vui lòng chọn trạng thái'
                    })}
                  >
                    {TRANG_THAI_NHIEM_VU.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errors.trangThai?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={errors.tienDo}>
                  <FormLabel>Tiến độ (%)</FormLabel>
                  <Controller
                    name="tienDo"
                    control={control}
                    rules={{
                      required: 'Vui lòng nhập tiến độ',
                      min: {
                        value: 0,
                        message: 'Tiến độ tối thiểu là 0%'
                      },
                      max: {
                        value: 100,
                        message: 'Tiến độ tối đa là 100%'
                      }
                    }}
                    render={({ field }) => (
                      <NumberInput
                        {...field}
                        min={0}
                        max={100}
                        value={isHoanThanh ? 100 : field.value}
                        isReadOnly={isHoanThanh}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>
                    {errors.tienDo?.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isRequired isInvalid={errors.deadline}>
                <FormLabel>Deadline</FormLabel>
                <Input
                  type="date"
                  {...register('deadline', {
                    required: 'Vui lòng chọn deadline'
                  })}
                />
                <FormErrorMessage>
                  {errors.deadline?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Ghi chú</FormLabel>
                <Textarea
                  {...register('ghiChu')}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows={3}
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

export default ThemNhiemVuModal;
