// File: src/modules/nhiem_vu_hang_ngay/components/tao_nhiem_vu.js
// Link tham khảo: https://chakra-ui.com/docs
// Link tham khảo: https://react-redux.js.org/api/hooks
// Nhánh: main

import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  HStack,
  Switch,
  FormErrorMessage,
  Text,
  Icon,
} from '@chakra-ui/react';
import { 
  FaRegCalendarAlt, 
  FaClock, 
  FaLink, 
  FaRegEdit,
  FaRegClone,
  FaRegCheckCircle,
} from 'react-icons/fa';
import { MdTitle, MdDescription } from 'react-icons/md';
import { LOAI_NHIEM_VU, TEN_LOAI_NHIEM_VU } from '../constants/loai_nhiem_vu';
import { taoNhiemVuAsync } from '../store/nhiem_vu_slice';

const FormInput = ({ icon, ...props }) => (
  <Input
    {...props}
    pl="10"
    bg="whiteAlpha.100"
    border="1px solid"
    borderColor="whiteAlpha.300"
    _hover={{ borderColor: 'blue.400' }}
    _focus={{ 
      borderColor: 'blue.400',
      boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
    }}
    color="whiteAlpha.900"
    position="relative"
    sx={{
      '&::placeholder': {
        color: 'whiteAlpha.500'
      }
    }}
  />
);

const TaoNhiemVu = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  // Hàm lấy ngày mặc định là ngày mai
  const getDefaultStartDate = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  const [formData, setFormData] = useState({
    tieuDe: '',
    moTa: '',
    loaiNhiemVu: LOAI_NHIEM_VU.LIKE,
    duongDan: '',
    ngayBatDau: getDefaultStartDate(),
    ngayKetThuc: '',
    gioThucHien: '09:00',
    lapLai: false,
    thuTrongTuan: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const DAYS = [
    { key: 'T2', label: 'T2' },
    { key: 'T3', label: 'T3' },
    { key: 'T4', label: 'T4' },
    { key: 'T5', label: 'T5' },
    { key: 'T6', label: 'T6' },
    { key: 'T7', label: 'T7' },
    { key: 'CN', label: 'CN' }
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.tieuDe) newErrors.tieuDe = 'Tiêu đề là bắt buộc';
    if (!formData.moTa) newErrors.moTa = 'Mô tả là bắt buộc';
    if (!formData.duongDan) newErrors.duongDan = 'Đường dẫn là bắt buộc';
    if (!formData.ngayBatDau) newErrors.ngayBatDau = 'Ngày bắt đầu là bắt buộc';
    if (!formData.ngayKetThuc) newErrors.ngayKetThuc = 'Ngày kết thúc là bắt buộc';
    if (new Date(formData.ngayKetThuc) < new Date(formData.ngayBatDau)) {
      newErrors.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      // Tạo ngày bắt đầu với múi giờ địa phương
      const ngayBatDau = new Date(formData.ngayBatDau);
      const [hours, minutes] = formData.gioThucHien.split(':');
      ngayBatDau.setHours(parseInt(hours, 10));
      ngayBatDau.setMinutes(parseInt(minutes, 10));
      ngayBatDau.setSeconds(0);
      ngayBatDau.setMilliseconds(0);

      // Tạo ngày kết thúc với múi giờ địa phương
      const ngayKetThuc = new Date(formData.ngayKetThuc);
      ngayKetThuc.setHours(parseInt(hours, 10));
      ngayKetThuc.setMinutes(parseInt(minutes, 10));
      ngayKetThuc.setSeconds(0);
      ngayKetThuc.setMilliseconds(0);

      await dispatch(taoNhiemVuAsync({
        ...formData,
        thoiGianThucHien: {
          batDau: ngayBatDau.toISOString(),
          ketThuc: ngayKetThuc.toISOString(),
          gio: formData.gioThucHien,
          lapLai: formData.lapLai,
          thuTrongTuan: formData.thuTrongTuan
        }
      })).unwrap();

      toast({
        title: 'Thành công',
        description: 'Đã tạo nhiệm vụ mới',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      setFormData({
        tieuDe: '',
        moTa: '',
        loaiNhiemVu: LOAI_NHIEM_VU.LIKE,
        duongDan: '',
        ngayBatDau: getDefaultStartDate(),
        ngayKetThuc: '',
        gioThucHien: '09:00',
        lapLai: false,
        thuTrongTuan: []
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      p={6}
      bg="gray.900"
      borderRadius="xl"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          <FormControl isRequired isInvalid={!!errors.tieuDe}>
            <FormLabel color="whiteAlpha.900">
              <Icon as={MdTitle} mr={2} color="blue.400" />
              Tiêu đề
            </FormLabel>
            <FormInput
              name="tieuDe"
              value={formData.tieuDe}
              onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
              placeholder="Nhập tiêu đề nhiệm vụ"
              icon={MdTitle}
            />
            <FormErrorMessage>{errors.tieuDe}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.moTa}>
            <FormLabel color="whiteAlpha.900">
              <Icon as={MdDescription} mr={2} color="purple.400" />
              Mô tả
            </FormLabel>
            <FormInput
              name="moTa"
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
              placeholder="Nhập mô tả nhiệm vụ"
              icon={MdDescription}
            />
            <FormErrorMessage>{errors.moTa}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired>
            <FormLabel color="whiteAlpha.900">
              <Icon as={FaRegClone} mr={2} color="green.400" />
              Loại nhiệm vụ
            </FormLabel>
            <Select
              value={formData.loaiNhiemVu}
              onChange={(e) => setFormData({ ...formData, loaiNhiemVu: e.target.value })}
              bg="whiteAlpha.100"
              border="1px solid"
              borderColor="whiteAlpha.300"
              color="whiteAlpha.900"
              _hover={{ borderColor: 'blue.400' }}
            >
              {Object.entries(TEN_LOAI_NHIEM_VU).map(([value, label]) => (
                <option key={value} value={value} style={{ background: '#1A202C' }}>
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.duongDan}>
            <FormLabel color="whiteAlpha.900">
              <Icon as={FaLink} mr={2} color="pink.400" />
              Đường dẫn
            </FormLabel>
            <FormInput
              name="duongDan"
              value={formData.duongDan}
              onChange={(e) => setFormData({ ...formData, duongDan: e.target.value })}
              placeholder="Nhập đường dẫn thực hiện nhiệm vụ"
              icon={FaLink}
            />
            <FormErrorMessage>{errors.duongDan}</FormErrorMessage>
          </FormControl>

          <HStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.ngayBatDau}>
              <FormLabel color="whiteAlpha.900">
                <Icon as={FaRegCalendarAlt} mr={2} color="orange.400" />
                Ngày bắt đầu
              </FormLabel>
              <FormInput
                type="date"
                value={formData.ngayBatDau}
                onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                min={getDefaultStartDate()}
                icon={FaRegCalendarAlt}
              />
              <FormErrorMessage>{errors.ngayBatDau}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.ngayKetThuc}>
              <FormLabel color="whiteAlpha.900">
                <Icon as={FaRegCalendarAlt} mr={2} color="red.400" />
                Ngày kết thúc
              </FormLabel>
              <FormInput
                type="date"
                value={formData.ngayKetThuc}
                onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                min={formData.ngayBatDau}
                icon={FaRegCalendarAlt}
              />
              <FormErrorMessage>{errors.ngayKetThuc}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="whiteAlpha.900">
                <Icon as={FaClock} mr={2} color="cyan.400" />
                Giờ thực hiện
              </FormLabel>
              <FormInput
                type="time"
                value={formData.gioThucHien}
                onChange={(e) => setFormData({ ...formData, gioThucHien: e.target.value })}
                icon={FaClock}
              />
            </FormControl>
          </HStack>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" color="whiteAlpha.900">
              <Icon as={FaRegCheckCircle} mr={2} color="teal.400" />
              Lặp lại hàng tuần
            </FormLabel>
            <Switch
              colorScheme="blue"
              isChecked={formData.lapLai}
              onChange={(e) => setFormData({ ...formData, lapLai: e.target.checked })}
            />
          </FormControl>

          {formData.lapLai && (
            <FormControl>
              <FormLabel color="whiteAlpha.900">Chọn ngày trong tuần</FormLabel>
              <HStack spacing={2} wrap="wrap">
                {DAYS.map(({ key, label }) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={formData.thuTrongTuan.includes(key) ? 'solid' : 'outline'}
                    colorScheme={formData.thuTrongTuan.includes(key) ? 'blue' : 'whiteAlpha'}
                    onClick={() => {
                      const newDays = formData.thuTrongTuan.includes(key)
                        ? formData.thuTrongTuan.filter(d => d !== key)
                        : [...formData.thuTrongTuan, key];
                      setFormData({ ...formData, thuTrongTuan: newDays });
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </HStack>
            </FormControl>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="full"
            isLoading={isSubmitting}
            loadingText="Đang tạo..."
            leftIcon={<FaRegEdit />}
          >
            Tạo nhiệm vụ
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TaoNhiemVu;