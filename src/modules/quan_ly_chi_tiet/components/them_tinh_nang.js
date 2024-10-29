<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from 'react';
=======
// src/modules/quan_ly_chi_tiet/components/them_tinh_nang.js

import React, { useEffect, useState } from 'react';
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
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
  IconButton,
  Box,
  Text
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useTinhNang } from '../hooks/use_tinh_nang';
<<<<<<< HEAD
import { LOAI_KIEM_THU } from '../constants/loai_kiem_thu';

const TRANG_THAI = {
  MOI: 'Mới',
  DANG_THUC_HIEN: 'Đang thực hiện', 
  HOAN_THANH: 'Hoàn thành'
};

const defaultValues = {
  tenTinhNang: '',
  moTa: '',
  frontend: {
    nguoiPhuTrach: '',
    trangThai: 'MOI',
    tienDo: 0,
    ghiChu: ''
  },
  backend: {
    nguoiPhuTrach: '',
    trangThai: 'MOI',
    tienDo: 0,
    ghiChu: '',
    apiEndpoints: ['']
  },
  kiemThu: {
    nguoiKiemThu: '',
    trangThai: 'MOI',
    tienDo: 0,
    ghiChu: '',
    loaiTest: [],
    ketQuaTest: ''
  }
};

const ThemTinhNangModal = ({
=======
// import { TRANG_THAI } from '../constants/trang_thai'; // Đã xóa
import { LOAI_KIEM_THU } from '../constants/loai_kiem_thu';

const ThemTinhNang = ({
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
  isOpen,
  onClose,
  nhiemVuId,
  tinhNangHienTai,
  phanHeActive = 'frontend'
}) => {
  const toast = useToast();
  const { themTinhNang, capNhatTinhNang, isSubmitting } = useTinhNang();
  const [activeTab, setActiveTab] = useState(
    phanHeActive === 'all' ? 0 : ['frontend', 'backend', 'kiemThu'].indexOf(phanHeActive)
  );
  const isEditing = Boolean(tinhNangHienTai);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
<<<<<<< HEAD
    defaultValues
  });

=======
    defaultValues: {
      tenTinhNang: '',
      moTa: '',
      frontend: {
        nguoiPhuTrach: '',
        trangThai: 'MOI', // Thay thế bằng giá trị mặc định
        tienDo: 0,
        ghiChu: ''
      },
      backend: {
        nguoiPhuTrach: '',
        trangThai: 'MOI', // Thay thế bằng giá trị mặc định
        tienDo: 0,
        ghiChu: '',
        apiEndpoints: ['']
      },
      kiemThu: {
        nguoiKiemThu: '',
        trangThai: 'MOI', // Thay thế bằng giá trị mặc định
        tienDo: 0,
        ghiChu: '',
        loaiTest: [],
        ketQuaTest: ''
      }
    }
  });

  // Quản lý danh sách API endpoints
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
  const {
    fields: apiFields,
    append: appendApi,
    remove: removeApi
  } = useFieldArray({
    control,
    name: 'backend.apiEndpoints'
  });

<<<<<<< HEAD
  const watchLoaiTest = watch('kiemThu.loaiTest', []);
  const watchTrangThai = {
    frontend: watch('frontend.trangThai'),
    backend: watch('backend.trangThai'),
    kiemThu: watch('kiemThu.trangThai')
  };

  useEffect(() => {
    if (tinhNangHienTai) {
      const tinhNangData = {
=======
  useEffect(() => {
    if (tinhNangHienTai) {
      reset({
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
        tenTinhNang: tinhNangHienTai.tenTinhNang,
        moTa: tinhNangHienTai.moTa,
        frontend: tinhNangHienTai.frontend,
        backend: {
          ...tinhNangHienTai.backend,
          apiEndpoints: tinhNangHienTai.backend.apiEndpoints || ['']
        },
        kiemThu: {
          ...tinhNangHienTai.kiemThu,
          loaiTest: tinhNangHienTai.kiemThu.loaiTest || [],
          ketQuaTest: tinhNangHienTai.kiemThu.ketQuaTest || ''
        }
<<<<<<< HEAD
      };
      reset(tinhNangData);
    }
  }, [tinhNangHienTai, reset]);

  const handleClose = useCallback(() => {
    reset(defaultValues);
    onClose();
  }, [reset, onClose]);

  const handleLoaiTestChange = useCallback((loaiTest) => {
    setValue('kiemThu.loaiTest', 
      watchLoaiTest.includes(loaiTest)
        ? watchLoaiTest.filter(item => item !== loaiTest)
        : [...watchLoaiTest, loaiTest]
    );
  }, [watchLoaiTest, setValue]);

  useEffect(() => {
    Object.entries(watchTrangThai).forEach(([phanHe, trangThai]) => {
      if (trangThai === 'HOAN_THANH') {
        setValue(`${phanHe}.tienDo`, 100);
      }
    });
  }, [watchTrangThai, setValue]);

  const onSubmit = async (data) => {
    try {
      if (
        data.kiemThu.trangThai === 'HOAN_THANH' &&
=======
      });
    }
  }, [tinhNangHienTai, reset]);

  const watchLoaiTest = watch('kiemThu.loaiTest', []);
  const watchTrangThai = {
    frontend: watch('frontend.trangThai'),
    backend: watch('backend.trangThai'),
    kiemThu: watch('kiemThu.trangThai')
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleLoaiTestChange = (loaiTest) => {
    const currentLoaiTest = watchLoaiTest;
    let newLoaiTest;

    if (currentLoaiTest.includes(loaiTest)) {
      newLoaiTest = currentLoaiTest.filter((item) => item !== loaiTest);
    } else {
      newLoaiTest = [...currentLoaiTest, loaiTest];
    }

    setValue('kiemThu.loaiTest', newLoaiTest);
  };

  const onSubmit = async (data) => {
    try {
      // Kiểm tra loại kiểm thử khi hoàn thành
      if (
        data.kiemThu.trangThai === 'HOAN_THANH' && // So sánh với giá trị chuỗi
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
        data.kiemThu.loaiTest.length === 0
      ) {
        throw new Error('Vui lòng chọn ít nhất một loại kiểm thử khi hoàn thành');
      }

<<<<<<< HEAD
=======
      // Lọc bỏ API endpoints rỗng
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
      const cleanData = {
        ...data,
        backend: {
          ...data.backend,
<<<<<<< HEAD
          apiEndpoints: data.backend.apiEndpoints.filter(api => api.trim() !== '')
=======
          apiEndpoints: data.backend.apiEndpoints.filter(
            (api) => api.trim() !== ''
          )
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
        }
      };

      if (isEditing) {
        await capNhatTinhNang(tinhNangHienTai.id, cleanData);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật tính năng',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      } else {
        await themTinhNang({
          ...cleanData,
          nhiemVuId
        });
        toast({
<<<<<<< HEAD
          title: 'Thành công', 
=======
          title: 'Thành công',
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
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
            {isEditing ? 'Chỉnh sửa tính năng' : 'Thêm tính năng mới'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
<<<<<<< HEAD
=======
              {/* Thông tin chung */}
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
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

              <Tabs
                isFitted
                variant="enclosed"
                index={activeTab}
                onChange={setActiveTab}
              >
                <TabList mb="1em">
                  <Tab>Frontend</Tab>
                  <Tab>Backend</Tab>
                  <Tab>Kiểm thử</Tab>
                </TabList>

                <TabPanels>
                  {/* Frontend Panel */}
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl
                        isRequired
                        isInvalid={errors.frontend?.nguoiPhuTrach}
                      >
                        <FormLabel>Người phụ trách</FormLabel>
                        <Input
                          {...register('frontend.nguoiPhuTrach', {
                            required: 'Vui lòng nhập người phụ trách'
                          })}
                          placeholder="Nhập tên người phụ trách"
                        />
                        <FormErrorMessage>
                          {errors.frontend?.nguoiPhuTrach?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <HStack w="full" align="start" spacing={4}>
                        <FormControl
                          isRequired
                          isInvalid={errors.frontend?.trangThai}
                        >
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            {...register('frontend.trangThai', {
                              required: 'Vui lòng chọn trạng thái'
                            })}
                          >
<<<<<<< HEAD
                            {Object.entries(TRANG_THAI).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
=======
                            {/* Thay thế bằng các tùy chọn trạng thái của bạn */}
                            <option value="MOI">Mới</option>
                            <option value="DANG_THUC_HIEN">Đang thực hiện</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
                          </Select>
                          <FormErrorMessage>
                            {errors.frontend?.trangThai?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isRequired
                          isInvalid={errors.frontend?.tienDo}
                        >
                          <FormLabel>Tiến độ (%)</FormLabel>
                          <Controller
                            name="frontend.tienDo"
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
<<<<<<< HEAD
                                value={
                                  watchTrangThai.frontend === 'HOAN_THANH'
                                    ? 100
                                    : field.value
                                }
                                isReadOnly={watchTrangThai.frontend === 'HOAN_THANH'}
=======
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
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
                            {errors.frontend?.tienDo?.message}
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
                      <FormControl
                        isRequired
                        isInvalid={errors.backend?.nguoiPhuTrach}
                      >
                        <FormLabel>Người phụ trách</FormLabel>
                        <Input
                          {...register('backend.nguoiPhuTrach', {
                            required: 'Vui lòng nhập người phụ trách'
                          })}
                          placeholder="Nhập tên người phụ trách"
                        />
                        <FormErrorMessage>
                          {errors.backend?.nguoiPhuTrach?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <HStack w="full" align="start" spacing={4}>
                        <FormControl
                          isRequired
                          isInvalid={errors.backend?.trangThai}
                        >
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            {...register('backend.trangThai', {
                              required: 'Vui lòng chọn trạng thái'
                            })}
                          >
<<<<<<< HEAD
                            {Object.entries(TRANG_THAI).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
=======
                            {/* Thay thế bằng các tùy chọn trạng thái của bạn */}
                            <option value="MOI">Mới</option>
                            <option value="DANG_THUC_HIEN">Đang thực hiện</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
                          </Select>
                          <FormErrorMessage>
                            {errors.backend?.trangThai?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isRequired
                          isInvalid={errors.backend?.tienDo}
                        >
                          <FormLabel>Tiến độ (%)</FormLabel>
                          <Controller
                            name="backend.tienDo"
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
<<<<<<< HEAD
                                value={
                                  watchTrangThai.backend === 'HOAN_THANH'
                                    ? 100
                                    : field.value
                                }
                                isReadOnly={watchTrangThai.backend === 'HOAN_THANH'}
=======
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
<<<<<<< HEAD
                            )}/>
                            <FormErrorMessage>
                              {errors.backend?.tienDo?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </HStack>
  
                        <FormControl>
                          <FormLabel>API Endpoints</FormLabel>
                          <VStack spacing={2} align="stretch">
                            {apiFields.map((field, index) => (
                              <HStack key={field.id}>
                                <Input
                                  {...register(`backend.apiEndpoints.${index}`)}
                                  placeholder="Ví dụ: /api/users"
                                />
                                <IconButton
                                  icon={<DeleteIcon />}
                                  onClick={() => removeApi(index)}
                                  variant="ghost"
                                  colorScheme="red"
                                  isDisabled={apiFields.length === 1}
                                  aria-label="Xóa endpoint"
                                />
                              </HStack>
                            ))}
                            <Button
                              leftIcon={<AddIcon />}
                              onClick={() => appendApi('')}
                              size="sm"
                              alignSelf="start"
                            >
                              Thêm API endpoint
                            </Button>
                          </VStack>
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
                        <FormControl
                          isRequired
                          isInvalid={errors.kiemThu?.nguoiKiemThu}
                        >
                          <FormLabel>Người kiểm thử</FormLabel>
                          <Input
                            {...register('kiemThu.nguoiKiemThu', {
                              required: 'Vui lòng nhập người kiểm thử'
                            })}
                            placeholder="Nhập tên người kiểm thử"
                          />
                          <FormErrorMessage>
                            {errors.kiemThu?.nguoiKiemThu?.message}
                          </FormErrorMessage>
                        </FormControl>
  
                        <HStack w="full" align="start" spacing={4}>
                          <FormControl
                            isRequired
                            isInvalid={errors.kiemThu?.trangThai}
                          >
                            <FormLabel>Trạng thái</FormLabel>
                            <Select
                              {...register('kiemThu.trangThai', {
                                required: 'Vui lòng chọn trạng thái'
                              })}
                            >
                              {Object.entries(TRANG_THAI).map(([key, value]) => (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>
                              {errors.kiemThu?.trangThai?.message}
                            </FormErrorMessage>
                          </FormControl>
  
                          <FormControl
                            isRequired
                            isInvalid={errors.kiemThu?.tienDo}
                          >
                            <FormLabel>Tiến độ (%)</FormLabel>
                            <Controller
                              name="kiemThu.tienDo"
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
                                  value={
                                    watchTrangThai.kiemThu === 'HOAN_THANH'
                                      ? 100  
                                      : field.value
                                  }
                                  isReadOnly={watchTrangThai.kiemThu === 'HOAN_THANH'}
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
                              {errors.kiemThu?.tienDo?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </HStack>
  
                        <FormControl>
                          <FormLabel>Loại kiểm thử</FormLabel>
                          <VStack align="start" spacing={2}>
                            {Object.entries(LOAI_KIEM_THU).map(
                              ([key, value]) => (
                                <Checkbox
                                  key={key}
                                  isChecked={watchLoaiTest.includes(key)}
                                  onChange={() => handleLoaiTestChange(key)}
                                >
                                  {value}
                                </Checkbox>
                              )
                            )}
                          </VStack>
                          {watchTrangThai.kiemThu === 'HOAN_THANH' &&
                            watchLoaiTest.length === 0 && (
                              <Text color="red.500" fontSize="sm" mt={1}>
                                Vui lòng chọn ít nhất một loại kiểm thử khi hoàn thành
                              </Text>
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
=======
                            )}
                          />
                          <FormErrorMessage>
                            {errors.backend?.tienDo?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>API Endpoints</FormLabel>
                        <VStack spacing={2} align="stretch">
                          {apiFields.map((field, index) => (
                            <HStack key={field.id}>
                              <Input
                                {...register(`backend.apiEndpoints.${index}`)}
                                placeholder="Ví dụ: /api/users"
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                onClick={() => removeApi(index)}
                                variant="ghost"
                                colorScheme="red"
                                isDisabled={apiFields.length === 1}
                              />
                            </HStack>
                          ))}
                          <Button
                            leftIcon={<AddIcon />}
                            onClick={() => appendApi('')}
                            size="sm"
                            alignSelf="start"
                          >
                            Thêm API endpoint
                          </Button>
                        </VStack>
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
                      <FormControl
                        isRequired
                        isInvalid={errors.kiemThu?.nguoiKiemThu}
                      >
                        <FormLabel>Người kiểm thử</FormLabel>
                        <Input
                          {...register('kiemThu.nguoiKiemThu', {
                            required: 'Vui lòng nhập người kiểm thử'
                          })}
                          placeholder="Nhập tên người kiểm thử"
                        />
                        <FormErrorMessage>
                          {errors.kiemThu?.nguoiKiemThu?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <HStack w="full" align="start" spacing={4}>
                        <FormControl
                          isRequired
                          isInvalid={errors.kiemThu?.trangThai}
                        >
                          <FormLabel>Trạng thái</FormLabel>
                          <Select
                            {...register('kiemThu.trangThai', {
                              required: 'Vui lòng chọn trạng thái'
                            })}
                          >
                            {/* Thay thế bằng các tùy chọn trạng thái của bạn */}
                            <option value="MOI">Mới</option>
                            <option value="DANG_THUC_HIEN">Đang thực hiện</option>
                            <option value="HOAN_THANH">Hoàn thành</option>
                          </Select>
                          <FormErrorMessage>
                            {errors.kiemThu?.trangThai?.message}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isRequired
                          isInvalid={errors.kiemThu?.tienDo}
                        >
                          <FormLabel>Tiến độ (%)</FormLabel>
                          <Controller
                            name="kiemThu.tienDo"
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
                            {errors.kiemThu?.tienDo?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Loại kiểm thử</FormLabel>
                        <VStack align="start" spacing={2}>
                          {Object.entries(LOAI_KIEM_THU).map(
                            ([key, value]) => (
                              <Checkbox
                                key={key}
                                isChecked={watchLoaiTest.includes(key)}
                                onChange={() => handleLoaiTestChange(key)}
                              >
                                {value}
                              </Checkbox>
                            )
                          )}
                        </VStack>
                        {watchTrangThai.kiemThu === 'HOAN_THANH' &&
                          watchLoaiTest.length === 0 && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              Vui lòng chọn ít nhất một loại kiểm thử khi hoàn thành
                            </Text>
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

export default ThemTinhNang;
>>>>>>> 196d2d5b368655c311d9c94154c3206ed15c18be
