// src/components/bao_cao/components/form_bao_cao.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  VStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  Card,
  CardBody,
  Heading,
  FormErrorMessage,
  useColorModeValue,
  Box,
  Divider,
  Text
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { getProjects } from '../../../services/api/projectApi';
import { getTasks } from '../../../services/api/taskApi';
import { LOAI_BAO_CAO, PHAN_HE } from '../constants/loai_bao_cao';
import TrinhSoanThao from './trinh_soan_thao';

const generateReportId = (prefix = 'RPT') => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${year}${month}${day}${random}`;
};

const FormBaoCao = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const toast = useToast();
  const [duAns, setDuAns] = useState([]);
  const [nhiemVus, setNhiemVus] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: initialData || {
      reportId: generateReportId(),
      tieuDe: '',
      nguoiTaoTen: '',
      nguoiTaoMaSo: '',
      nguoiNhan: '',
      loaiBaoCao: '',
      phanHe: '',
      duAnId: '',
      nhiemVuId: '',
      noiDung: '',
      ghiChu: '',
      linkBaoCao: ''
    }
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      setValue('nguoiTaoTen', currentUser.fullName || '');
      setValue('nguoiTaoMaSo', currentUser.memberCode || '');
    }
  }, [setValue]);

  const selectedDuAn = watch('duAnId');
  const selectedPhanHe = watch('phanHe');

  const loadDuAns = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const projectsRes = await getProjects();
      setDuAns(projectsRes || []);
    } catch (error) {
      toast({
        title: 'Lỗi tải dự án',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingData(false);
    }
  }, [toast]);

  const loadNhiemVus = useCallback(async (duAnId) => {
    if (!duAnId) {
      setNhiemVus([]);
      return;
    }
    
    try {
      setIsLoadingData(true);
      const tasksRes = await getTasks(duAnId);
      setNhiemVus(tasksRes.data || []);
    } catch (error) {
      toast({
        title: 'Lỗi tải nhiệm vụ',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setNhiemVus([]);
    } finally {
      setIsLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDuAns();
  }, [loadDuAns]);

  useEffect(() => {
    loadNhiemVus(selectedDuAn);
  }, [selectedDuAn, loadNhiemVus]);

  // Xử lý submit form 
  const handleFormSubmit = async (data) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      
      const enhancedData = {
        ...data,
        reportId: data.reportId || generateReportId(),
        nguoiTaoInfo: {
          ten: data.nguoiTaoTen,
          maSo: data.nguoiTaoMaSo,
          department: currentUser?.department || ''
        },
        nguoiNhanInfo: {
          ten: data.nguoiNhan
        }
      };

      // Xóa các trường tạm
      delete enhancedData.nguoiTaoTen;
      delete enhancedData.nguoiTaoMaSo; 
      delete enhancedData.nguoiNhan;

      await onSubmit(enhancedData);

      toast({
        title: `${initialData ? 'Cập nhật' : 'Tạo'} báo cáo thành công`,
        status: 'success',
        duration: 3000,
        isClosable: true,
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

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s ease-in-out"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
    >
      <CardBody>
        <VStack
          as="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          spacing={6}
          align="stretch"
          w="full"
        >
          <Heading size="md" mb={4}>
            {initialData ? 'Cập Nhật Báo Cáo' : 'Tạo Báo Cáo Mới'}
          </Heading>

          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            ID Báo cáo: {watch('reportId')}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <FormControl isInvalid={errors.nguoiTaoTen} isRequired>
              <FormLabel>Người tạo báo cáo</FormLabel>
              <Input
                {...register('nguoiTaoTen', {
                  required: 'Vui lòng nhập tên người tạo báo cáo'
                })}
                placeholder="Nhập tên người tạo"
                _hover={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              />
              <FormErrorMessage>
                {errors.nguoiTaoTen?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.nguoiTaoMaSo} isRequired>
              <FormLabel>Mã số thành viên</FormLabel>
              <Input
                {...register('nguoiTaoMaSo', {
                  required: 'Vui lòng nhập mã số thành viên'
                })}
                placeholder="Nhập mã số thành viên"
                _hover={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              />
              <FormErrorMessage>
                {errors.nguoiTaoMaSo?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.nguoiNhan} isRequired>
              <FormLabel>Người nhận báo cáo</FormLabel>
              <Input
                {...register('nguoiNhan', {
                  required: 'Vui lòng nhập tên người nhận báo cáo'
                })}
                placeholder="Nhập tên người nhận"
                _hover={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              />
              <FormErrorMessage>
                {errors.nguoiNhan?.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={errors.tieuDe} isRequired>
            <FormLabel>Tiêu đề</FormLabel>
            <Input
              {...register('tieuDe', {
                required: 'Vui lòng nhập tiêu đề',
                minLength: {
                  value: 5,
                  message: 'Tiêu đề phải có ít nhất 5 ký tự'
                }
              })}
              placeholder="Nhập tiêu đề báo cáo"
              _hover={{ borderColor: 'blue.500' }}
              transition="all 0.2s"
            />
            <FormErrorMessage>
              {errors.tieuDe?.message}
            </FormErrorMessage>
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl isInvalid={errors.loaiBaoCao} isRequired>
              <FormLabel>Loại báo cáo</FormLabel>
              <Select
                {...register('loaiBaoCao', {
                  required: 'Vui lòng chọn loại báo cáo'
                })}
                placeholder="Chọn loại báo cáo"
                _hover={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              >
                {LOAI_BAO_CAO.map(loai => (
                  <option key={loai.id} value={loai.id}>
                    {loai.icon} {loai.label}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.loaiBaoCao?.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.phanHe} isRequired>
              <FormLabel>Phân hệ</FormLabel>
              <Select
                {...register('phanHe', {
                  required: 'Vui lòng chọn phân hệ'
                })}
                placeholder="Chọn phân hệ"
                _hover={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              >
                {PHAN_HE.map(ph => (
                  <option key={ph.id} value={ph.id}>
                    {ph.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.phanHe?.message}
              </FormErrorMessage>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel>Dự án</FormLabel>
              <Select
                {...register('duAnId')}
                placeholder="Chọn dự án"
                isDisabled={!selectedPhanHe || isLoadingData}
                _hover={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              >
                {duAns.map(duAn => (
                  <option key={duAn.id} value={duAn.id}>
                    {duAn.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Nhiệm vụ</FormLabel>
              <Select
                {...register('nhiemVuId')}
                placeholder="Chọn nhiệm vụ"
                isDisabled={!selectedDuAn || isLoadingData}
                _hover={{ borderColor: 'blue.500' }}
                transition="all 0.2s"
              >
                {nhiemVus.map(nhiemVu => (
                  <option key={nhiemVu.id} value={nhiemVu.id}>
                    {nhiemVu.title} ({nhiemVu.taskId})
                  </option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <Box>
            <TrinhSoanThao
              value={watch('noiDung')}
              onChange={(value) => setValue('noiDung', value)}
              error={errors.noiDung?.message}
              isRequired
              height="300px"
            />
          </Box>

          <FormControl>
            <FormLabel>Link báo cáo</FormLabel>
            <Input
              {...register('linkBaoCao')}
              placeholder="Nhập link báo cáo (nếu có)"
              _hover={{ borderColor: 'blue.500' }}
              transition="all 0.2s"
            />
          </FormControl>

          <Divider />

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Button
              onClick={onCancel}
              variant="outline"
              isDisabled={isSubmitting}
              _hover={{ bg: hoverBg }}
              transition="all 0.2s"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Đang xử lý..."
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              {initialData ? 'Cập nhật' : 'Tạo báo cáo'}
            </Button>
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default FormBaoCao;