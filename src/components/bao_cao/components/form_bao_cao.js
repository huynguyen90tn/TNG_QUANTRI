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
  Box
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { getProjects } from '../../../services/api/projectApi';
import { getTasks } from '../../../services/api/taskApi';
import { LOAI_BAO_CAO, PHAN_HE } from '../constants/loai_bao_cao';
import TrinhSoanThao from './trinh_soan_thao';

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
      tieuDe: '',
      loaiBaoCao: '',
      phanHe: '',
      duAnId: '',
      nhiemVuId: '',
      noiDung: '',
      ghiChu: ''
    }
  });

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

  const onSubmitForm = async (data) => {
    try {
      await onSubmit(data);
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
          onSubmit={handleSubmit(onSubmitForm)}
          spacing={6}
          align="stretch"
          w="full"
        >
          <Heading size="md" mb={4}>
            {initialData ? 'Cập Nhật Báo Cáo' : 'Tạo Báo Cáo Mới'}
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
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
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
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