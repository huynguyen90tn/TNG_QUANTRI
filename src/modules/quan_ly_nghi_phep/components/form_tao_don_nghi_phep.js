// File: src/modules/quan_ly_nghi_phep/components/form_tao_don_nghi_phep.js
// Link tham khảo: https://chakra-ui.com/docs/components

import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
  FormErrorMessage,
  HStack,
  Text,
  Alert,
  AlertDescription,
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import { useNghiPhep } from '../hooks/useNghiPhep';
import { LOAI_NGHI_PHEP } from '../constants/trang_thai_don';

const LEAVE_TYPES = [
  { value: 'nghi-phep-nam', label: 'Nghỉ phép năm' },
  { value: 'nghi-om', label: 'Nghỉ ốm' }, 
  { value: 'nghi-thai-san', label: 'Nghỉ thai sản' },
  { value: 'nghi-khong-luong', label: 'Nghỉ không lương' },
  { value: 'nghi-viec-rieng', label: 'Nghỉ việc riêng' }
];

const DEPARTMENTS = [
  { value: 'thien-minh-duong', label: 'Thiên Minh Đường' },
  { value: 'tay-van-cac', label: 'Tây Vân Các' },
  { value: 'hoa-tam-duong', label: 'Họa Tam Đường' },
  { value: 'ho-ly-son-trang', label: 'Hồ Ly Sơn trang' },
  { value: 'hoa-van-cac', label: 'Hoa Vân Các' },
  { value: 'tinh-van-cac', label: 'Tinh Vân Các' }
];

const LeaveRequestForm = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const { themDonNghiPhep, isLoading: isSubmitting } = useNghiPhep();

  const initialFormData = useMemo(() => ({
    fullName: user?.displayName || '',
    employeeId: user?.memberCode || '',
    department: user?.department || '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    attachmentUrl: ''
  }), [user?.displayName, user?.memberCode, user?.department]);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      toast({
        title: 'Cảnh báo',
        description: 'Vui lòng đăng nhập để thực hiện chức năng này',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      onClose();
      return;
    }

    if (!isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen, isAuthenticated, initialFormData, onClose, toast]);

  const calculateTotalDays = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, []);

  const validateDates = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return '';
    
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

    if (!formData.fullName) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.employeeId) {
      newErrors.employeeId = 'Vui lòng nhập mã nhân viên';
    }

    if (!formData.department) {
      newErrors.department = 'Vui lòng chọn phòng ban';
    }

    if (!formData.leaveType) {
      newErrors.leaveType = 'Vui lòng chọn loại nghỉ phép';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }

    const dateError = validateDates(formData.startDate, formData.endDate);
    if (dateError) {
      newErrors.endDate = dateError;
    }

    if (!formData.reason) {
      newErrors.reason = 'Vui lòng nhập lý do';
    } else if (formData.reason.length < 10) {
      newErrors.reason = 'Lý do phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateDates]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng đăng nhập để thực hiện chức năng này',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng kiểm tra lại thông tin',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const totalDays = calculateTotalDays(formData.startDate, formData.endDate);

      const leaveRequest = {
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        department: formData.department,
        userId: user.id,
        userEmail: user.email,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays,
        reason: formData.reason,
        attachments: formData.attachmentUrl ? [{ url: formData.attachmentUrl }] : []
      };

      const result = await themDonNghiPhep(leaveRequest);

      if (result) {
        toast({
          title: 'Thành công',
          description: `Đơn xin nghỉ phép ${totalDays} ngày đã được gửi và đang chờ duyệt`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
  
        if (onSuccess) {
          onSuccess(result);
        }
        onClose();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Lỗi khi gửi đơn nghỉ phép:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo đơn nghỉ phép',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [
    formData,
    user,
    validateForm,
    calculateTotalDays,
    themDonNghiPhep,
    toast,
    onSuccess,
    onClose,
    isAuthenticated
  ]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  const totalDays = useMemo(() => 
    calculateTotalDays(formData.startDate, formData.endDate),
    [formData.startDate, formData.endDate, calculateTotalDays]
  );

  if (!isAuthenticated) {
    return null;
  }

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
                <FormControl isInvalid={errors.fullName}>
                  <FormLabel>Họ tên</FormLabel>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                    isDisabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.employeeId}>
                  <FormLabel>Mã nhân viên</FormLabel>
                  <Input
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Nhập mã nhân viên"
                    isDisabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.employeeId}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={errors.department}>
                <FormLabel>Phòng ban</FormLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Chọn phòng ban"
                  isDisabled={isSubmitting}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.department}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.leaveType}>
                <FormLabel>Loại nghỉ phép</FormLabel>
                <Select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  placeholder="Chọn loại nghỉ phép"
                  isDisabled={isSubmitting}
                >
                  {LEAVE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.leaveType}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4}>
                <FormControl isInvalid={errors.startDate}>
                  <FormLabel>Ngày bắt đầu</FormLabel>
                  <Input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    isDisabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.startDate}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.endDate}>
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <Input
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    isDisabled={isSubmitting}
                  />
                  <FormErrorMessage>{errors.endDate}</FormErrorMessage>
                </FormControl>
              </HStack>

              {totalDays > 0 && (
                <Alert status="info">
                  <AlertDescription>
                    Tổng số ngày nghỉ: {totalDays} ngày
                  </AlertDescription>
                </Alert>
              )}

              <FormControl isInvalid={errors.reason}>
                <FormLabel>Lý do xin nghỉ</FormLabel>
                <Textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Nhập lý do xin nghỉ (tối thiểu 10 ký tự)"
                  size="sm"
                  rows={4}
                  isDisabled={isSubmitting}
                />
                <FormErrorMessage>{errors.reason}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Link tài liệu đính kèm</FormLabel>
                <Input
                  name="attachmentUrl"
                  value={formData.attachmentUrl}
                  onChange={handleChange}
                  placeholder="Nhập link tài liệu (nếu có)"
                  isDisabled={isSubmitting}
                />
              </FormControl>

              <HStack spacing={4} justify="flex-end" pt={4}>
                <Button variant="outline" onClick={onClose} isDisabled={isSubmitting}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
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

export default LeaveRequestForm;