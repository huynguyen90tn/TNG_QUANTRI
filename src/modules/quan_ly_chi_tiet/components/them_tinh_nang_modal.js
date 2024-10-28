// src/modules/quan_ly_chi_tiet/components/them_tinh_nang_modal.js

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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Box
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useTinhNang } from '../hooks/use_tinh_nang';
import { LOAI_KIEM_THU } from '../constants/loai_kiem_thu';

const ThemTinhNangModal = ({
  isOpen,
  onClose,
  nhiemVuId,
  tinhNangHienTai,
  phanHeActive = 'frontend'
}) => {
  const toast = useToast();
  const { themTinhNang, capNhatTinhNang, isSubmitting } = useTinhNang();
  const isEditing = Boolean(tinhNangHienTai);

  // Định nghĩa các trạng thái cho từng phân hệ
  const TRANG_THAI_PHAN_HE = {
    frontend: ['Mới', 'Đang thực hiện', 'Hoàn thành'],
    backend: ['Mới', 'Đang thực hiện', 'Hoàn thành'],
    kiemThu: ['Mới', 'Đang thực hiện', 'Hoàn thành']
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      tenTinhNang: '',
      moTa: '',
      frontend: {
        nguoiPhuTrach: '',
        trangThai: 'Mới',
        tienDo: 0,
        ghiChu: ''
      },
      backend: {
        nguoiPhuTrach: '',
        trangThai: 'Mới',
        tienDo: 0,
        ghiChu: '',
        apiEndpoints: ['']
      },
      kiemThu: {
        nguoiPhuTrach: '',
        trangThai: 'Mới',
        tienDo: 0,
        ghiChu: '',
        loaiTest: []
      }
    }
  });

  useEffect(() => {
    if (tinhNangHienTai) {
      reset({
        tenTinhNang: tinhNangHienTai.tenTinhNang,
        moTa: tinhNangHienTai.moTa,
        frontend: {
          ...tinhNangHienTai.frontend
        },
        backend: {
          ...tinhNangHienTai.backend,
          apiEndpoints: tinhNangHienTai.backend.apiEndpoints || ['']
        },
        kiemThu: {
          ...tinhNangHienTai.kiemThu,
          loaiTest: tinhNangHienTai.kiemThu.loaiTest || []
        }
      });
    }
  }, [tinhNangHienTai, reset]);

  const watchLoaiTest = watch('kiemThu.loaiTest', []);
  const watchTrangThai = {
    frontend: watch('frontend.trangThai'),
    backend: watch('backend.trangThai'),
    kiemThu: watch('kiemThu.trangThai')
  };

  useEffect(() => {
    Object.entries(watchTrangThai).forEach(([phanHe, trangThai]) => {
      if (trangThai === 'Hoàn thành') {
        setValue(`${phanHe}.tienDo`, 100);
      }
    });
  }, [watchTrangThai, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const tinhNangData = {
        ...data,
        nhiemVuId
      };

      if (isEditing) {
        await capNhatTinhNang(tinhNangHienTai.id, tinhNangData);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật tính năng',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      } else {
        await themTinhNang(tinhNangData);
        toast({
          title: 'Thành công',
          description: 'Đã thêm tính năng mới',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      }
      handleClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleLoaiTestChange = (loaiTest) => {
    const currentLoaiTest = watchLoaiTest;
    const newLoaiTest = currentLoaiTest.includes(loaiTest)
      ? currentLoaiTest.filter((item) => item !== loaiTest)
      : [...currentLoaiTest, loaiTest];
    setValue('kiemThu.loaiTest', newLoaiTest);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {isEditing ? 'Chỉnh sửa tính năng' : 'Thêm tính năng mới'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={errors.tenTinhNang}>
                <FormLabel>Tên tính năng</FormLabel>
                <Input
                  {...register('tenTinhNang', {
                    required: 'Vui lòng nhập tên tính năng',
                    minLength: {
                      value: 3,
                      message: 'Tên tính năng phải có ít nhất 3 ký tự'
                    }
                  })}
                  placeholder="Nhập tên tính năng"
                />
                <FormErrorMessage>
                  {errors.tenTinhNang?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Mô tả</FormLabel>
                <Textarea
                  {...register('moTa')}
                  placeholder="Nhập mô tả tính năng"
                  rows={4}
                />
              </FormControl>

              <Tabs defaultIndex={['frontend', 'backend', 'kiemThu'].indexOf(phanHeActive)}>
                <TabList>
                  <Tab>Frontend</Tab>
                  <Tab>Backend</Tab>
                  <Tab>Kiểm thử</Tab>
                </TabList>

                <TabPanels>
                  {/* Frontend Panel */}
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired isInvalid={errors?.frontend?.nguoiPhuTrach}>
                        <FormLabel>Người phụ trách</FormLabel>
                        <Input
                          {...register('frontend.nguoiPhuTrach', {
                            required: 'Vui lòng nhập người phụ trách'
                          })}
                          placeholder="Nhập tên người phụ trách"
                        />
                        <FormErrorMessage>
                          {errors?.frontend?.nguoiPhuTrach?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <HStack w="full" spacing={4}>
                        <FormControl isRequired isInvalid={errors?.frontend?.trangThai}>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            {...register('frontend.trangThai', {
                              required: 'Vui lòng chọn trạng thái'
                            })}
                          >
                            {TRANG_THAI_PHAN_HE.frontend.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>
                            {errors?.frontend?.trangThai?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={errors?.frontend?.tienDo}>
                          <FormLabel>Tiến độ (%)</FormLabel>
                          <Controller
                            name="frontend.tienDo"
                            control={control}
                            rules={{
                              required: 'Vui lòng nhập tiến độ',
                              min: { value: 0, message: 'Tiến độ tối thiểu là 0%' },
                              max: { value: 100, message: 'Tiến độ tối đa là 100%' }
                            }}
                            render={({ field }) => (
                              <NumberInput
                                {...field}
                                min={0}
                                max={100}
                                value={field.value}
                                onChange={(value) => field.onChange(Number(value))}
                                isReadOnly={watchTrangThai.frontend === 'Hoàn thành'}
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
                            {errors?.frontend?.tienDo?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Ghi chú</FormLabel>
                        <Textarea
                          {...register('frontend.ghiChu')}
                          placeholder="Nhập ghi chú (nếu có)"
                          rows={3}
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>

                  {/* Backend Panel */}
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired isInvalid={errors?.backend?.nguoiPhuTrach}>
                        <FormLabel>Người phụ trách</FormLabel>
                        <Input
                          {...register('backend.nguoiPhuTrach', {
                            required: 'Vui lòng nhập người phụ trách'
                          })}
                          placeholder="Nhập tên người phụ trách"
                        />
                        <FormErrorMessage>
                          {errors?.backend?.nguoiPhuTrach?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <HStack w="full" spacing={4}>
                        <FormControl isRequired isInvalid={errors?.backend?.trangThai}>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            {...register('backend.trangThai', {
                              required: 'Vui lòng chọn trạng thái'
                            })}
                          >
                            {TRANG_THAI_PHAN_HE.backend.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>
                            {errors?.backend?.trangThai?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={errors?.backend?.tienDo}>
                          <FormLabel>Tiến độ (%)</FormLabel>
                          <Controller
                            name="backend.tienDo"
                            control={control}
                            rules={{
                              required: 'Vui lòng nhập tiến độ',
                              min: { value: 0, message: 'Tiến độ tối thiểu là 0%' },
                              max: { value: 100, message: 'Tiến độ tối đa là 100%' }
                            }}
                            render={({ field }) => (
                              <NumberInput
                                {...field}
                                min={0}
                                max={100}
                                value={field.value}
                                onChange={(value) => field.onChange(Number(value))}
                                isReadOnly={watchTrangThai.backend === 'Hoàn thành'}
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
                            {errors?.backend?.tienDo?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>API Endpoints</FormLabel>
                        <Controller
                          name="backend.apiEndpoints"
                          control={control}
                          render={({ field }) => (
                            <VStack align="start" spacing={2}>
                              {field.value.map((endpoint, index) => (
                                <HStack key={index} w="full">
                                  <Input
                                    value={endpoint}
                                    onChange={(e) => {
                                      const newEndpoints = [...field.value];
                                      newEndpoints[index] = e.target.value;
                                      field.onChange(newEndpoints);
                                    }}
                                    placeholder="Ví dụ: /api/users"
                                  />
                                  <Button
                                    onClick={() => {
                                      const newEndpoints = field.value.filter((_, i) => i !== index);
                                      field.onChange(newEndpoints);
                                    }}
                                    colorScheme="red"
                                    size="sm"
                                  >
                                    Xóa
                                  </Button>
                                </HStack>
                              ))}
                              <Button
                                onClick={() => field.onChange([...field.value, ''])}
                                size="sm"
                              >
                                Thêm API endpoint
                              </Button>
                            </VStack>
                          )}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Ghi chú</FormLabel>
                        <Textarea
                          {...register('backend.ghiChu')}
                          placeholder="Nhập ghi chú (nếu có)"
                          rows={3}
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>

                  {/* Kiểm thử Panel */}
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired isInvalid={errors?.kiemThu?.nguoiPhuTrach}>
                        <FormLabel>Người kiểm thử</FormLabel>
                        <Input
                          {...register('kiemThu.nguoiPhuTrach', {
                            required: 'Vui lòng nhập người kiểm thử'
                          })}
                          placeholder="Nhập tên người kiểm thử"
                        />
                        <FormErrorMessage>
                          {errors?.kiemThu?.nguoiPhuTrach?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <HStack w="full" spacing={4}>
                        <FormControl isRequired isInvalid={errors?.kiemThu?.trangThai}>
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            {...register('kiemThu.trangThai', {
                              required: 'Vui lòng chọn trạng thái'
                            })}
                          >
                            {TRANG_THAI_PHAN_HE.kiemThu.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>
                            {errors?.kiemThu?.trangThai?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={errors?.kiemThu?.tienDo}>
                          <FormLabel>Tiến độ (%)</FormLabel>
                          <Controller
                            name="kiemThu.tienDo"
                            control={control}
                            rules={{
                              required: 'Vui lòng nhập tiến độ',
                              min: { value: 0, message: 'Tiến độ tối thiểu là 0%' },
                              max: { value: 100, message: 'Tiến độ tối đa là 100%' }
                            }}
                            render={({ field }) => (
                              <NumberInput
                                {...field}
                                min={0}
                                max={100}
                                value={field.value}
                                onChange={(value) => field.onChange(Number(value))}
                                isReadOnly={watchTrangThai.kiemThu === 'Hoàn thành'}
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
                            {errors?.kiemThu?.tienDo?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Loại kiểm thử</FormLabel>
                        <VStack align="start" spacing={2}>
                          {Object.entries(LOAI_KIEM_THU).map(([key, value]) => (
                            <Checkbox
                              key={key}
                              isChecked={watchLoaiTest.includes(key)}
                              onChange={() => handleLoaiTestChange(key)}
                            >
                              {value}
                            </Checkbox>
                          ))}
                        </VStack>
                        {watchTrangThai.kiemThu === 'Hoàn thành' && watchLoaiTest.length === 0 && (
                          <Box color="red.500" fontSize="sm" mt={2}>
                            Vui lòng chọn ít nhất một loại kiểm thử khi hoàn thành
                          </Box>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel>Kết quả kiểm thử</FormLabel>
                        <Textarea
                          {...register('kiemThu.ketQuaTest')}
                          placeholder="Nhập kết quả kiểm thử"
                          rows={4}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Ghi chú</FormLabel>
                        <Textarea
                          {...register('kiemThu.ghiChu')}
                          placeholder="Nhập ghi chú (nếu có)"
                          rows={3}
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
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

export default ThemTinhNangModal;
