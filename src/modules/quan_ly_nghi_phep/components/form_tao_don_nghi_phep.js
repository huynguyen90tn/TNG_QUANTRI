// File: src/modules/quan_ly_nghi_phep/components/form_tao_don_nghi_phep.js
import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Select,
  Textarea,
  useToast,
  Box,
  FormErrorMessage,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import { nghiPhepService } from '../services/nghi_phep_service';

const LOAI_NGHI_PHEP_OPTIONS = [
  { value: 'nghi-phep-nam', label: 'Nghỉ phép năm' },
  { value: 'nghi-om', label: 'Nghỉ ốm' },
  { value: 'nghi-thai-san', label: 'Nghỉ thai sản' },
  { value: 'nghi-khong-luong', label: 'Nghỉ không lương' },
  { value: 'nghi-viec-rieng', label: 'Nghỉ việc riêng' },
];

const PHONG_BAN_OPTIONS = [
  { value: '', label: 'Chọn phân hệ' },
  { value: 'thien-minh-duong', label: 'Thiên Minh Đường' },
  { value: 'tay-van-cac', label: 'Tây Vân Các' },
  { value: 'hoa-tam-duong', label: 'Họa Tam Đường' },
  { value: 'ho-ly-son-trang', label: 'Hồ Ly Sơn trang' },
  { value: 'hoa-van-cac', label: 'Hoa Vân Các' },
  { value: 'tinh-van-cac', label: 'Tinh Vân Các' },
];

const FormTaoDonNghiPhep = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const toast = useToast();

  const initialFormData = {
    hoTen: '',
    maSoNhanVien: '',
    phongBan: '',
    loaiNghiPhep: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    lyDo: '',
    linkTaiLieu: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotalDays = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, []);

  const validateDates = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return 'Ngày bắt đầu không thể là ngày trong quá khứ';
    }
    if (end < start) {
      return 'Ngày kết thúc phải sau ngày bắt đầu';
    }
    return '';
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.hoTen) newErrors.hoTen = 'Vui lòng nhập họ tên';
    if (!formData.maSoNhanVien) newErrors.maSoNhanVien = 'Vui lòng nhập mã số nhân viên';
    if (!formData.phongBan) newErrors.phongBan = 'Vui lòng chọn phòng ban';
    if (!formData.loaiNghiPhep) newErrors.loaiNghiPhep = 'Vui lòng chọn loại nghỉ phép';
    if (!formData.ngayBatDau) newErrors.ngayBatDau = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.ngayKetThuc) newErrors.ngayKetThuc = 'Vui lòng chọn ngày kết thúc';
    
    const dateError = validateDates(formData.ngayBatDau, formData.ngayKetThuc);
    if (dateError) {
      newErrors.ngayKetThuc = dateError;
    }

    if (!formData.lyDo) newErrors.lyDo = 'Vui lòng nhập lý do';
    if (formData.lyDo && formData.lyDo.length < 10) {
      newErrors.lyDo = 'Lý do phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateDates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const totalDays = calculateTotalDays(formData.ngayBatDau, formData.ngayKetThuc);

      const donNghiPhep = {
        hoTen: formData.hoTen,
        maSoNhanVien: formData.maSoNhanVien,
        phongBan: formData.phongBan,
        userId: user.uid,
        userName: formData.hoTen,
        userEmail: user.email,
        department: formData.phongBan,
        leaveType: formData.loaiNghiPhep,
        startDate: formData.ngayBatDau,
        endDate: formData.ngayKetThuc,
        totalDays,
        reason: formData.lyDo,
        attachments: formData.linkTaiLieu ? [{ url: formData.linkTaiLieu }] : [],
        status: 'CHO_DUYET'
      };

      await nghiPhepService.themDon(donNghiPhep);

      toast({
        title: 'Tạo đơn thành công',
        description: `Đơn xin nghỉ phép ${totalDays} ngày đã được gửi và đang chờ duyệt`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo đơn nghỉ phép',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  const totalDays = calculateTotalDays(formData.ngayBatDau, formData.ngayKetThuc);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Tạo đơn xin nghỉ phép</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl isInvalid={errors.hoTen}>
                  <FormLabel>Họ tên</FormLabel>
                  <Input
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                  />
                  <FormErrorMessage>{errors.hoTen}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.maSoNhanVien}>
                  <FormLabel>Mã số nhân viên</FormLabel>
                  <Input
                    name="maSoNhanVien"
                    value={formData.maSoNhanVien}
                    onChange={handleChange}
                    placeholder="Nhập mã số nhân viên"
                  />
                  <FormErrorMessage>{errors.maSoNhanVien}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={errors.phongBan}>
                <FormLabel>Phòng ban</FormLabel>
                <Select
                  name="phongBan"
                  value={formData.phongBan}
                  onChange={handleChange}
                  placeholder="Chọn phòng ban"
                >
                  {PHONG_BAN_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.phongBan}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.loaiNghiPhep}>
                <FormLabel>Loại nghỉ phép</FormLabel>
                <Select
                  name="loaiNghiPhep"
                  value={formData.loaiNghiPhep}
                  onChange={handleChange}
                  placeholder="Chọn loại nghỉ phép"
                >
                  {LOAI_NGHI_PHEP_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.loaiNghiPhep}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4}>
                <FormControl isInvalid={errors.ngayBatDau}>
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <Input
                    name="ngayBatDau"
                    type="date"
                    value={formData.ngayBatDau}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.ngayBatDau}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.ngayKetThuc}>
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <Input
                    name="ngayKetThuc"
                    type="date"
                    value={formData.ngayKetThuc}
                    onChange={handleChange}
                  />
                  <FormErrorMessage>{errors.ngayKetThuc}</FormErrorMessage>
                </FormControl>
              </HStack>

              {totalDays > 0 && (
                <Text color="blue.300" fontSize="sm">
                  Tổng số ngày nghỉ: {totalDays} ngày
                </Text>
              )}

              <FormControl isInvalid={errors.lyDo}>
                <FormLabel>Lý do xin nghỉ</FormLabel>
                <Textarea
                  name="lyDo"
                  value={formData.lyDo}
                  onChange={handleChange}
                  placeholder="Nhập lý do xin nghỉ (tối thiểu 10 ký tự)"
                  rows={4}
                />
                <FormErrorMessage>{errors.lyDo}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Link tài liệu đính kèm</FormLabel>
                <Input
                  name="linkTaiLieu"
                  value={formData.linkTaiLieu}
                  onChange={handleChange}
                  placeholder="Nhập link tài liệu (nếu có)"
                />
              </FormControl>

              <HStack spacing={4} pt={4}>
                <Button colorScheme="red" onClick={onClose}>
                  Hủy
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Đang gửi..."
                >
                  Gửi đơn
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FormTaoDonNghiPhep;