// File: src/modules/quan_ly_nghi_phep/components/chi_tiet_don_nghi_phep.js
// Link tham khảo: https://chakra-ui.com/docs/components/modal
// Link tham khảo về xử lý form: https://chakra-ui.com/docs/components/form-control

import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Textarea,
  useToast,
  Divider,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import nghiPhepService from '../services/nghi_phep_service';
import {
  TRANG_THAI_LABEL,
  TRANG_THAI_COLOR,
  LOAI_NGHI_PHEP_LABEL,
  HANH_DONG,
} from '../constants/trang_thai_don';

const ChiTietDonNghiPhep = ({ isOpen, onClose, donNghiPhep, onUpdateStatus }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [approverNote, setApproverNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdminTong = user?.role === 'admin-tong';
  const canApprove = isAdminTong && donNghiPhep?.status === 'CHO_DUYET';
  const canCancel =
    donNghiPhep?.userId === user?.id && donNghiPhep?.status === 'CHO_DUYET';

  useEffect(() => {
    if (!isOpen) {
      setApproverNote('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  const validateUpdateData = useCallback(() => {
    if (!user?.id || !user?.displayName || !user?.role || !user?.department) {
      throw new Error('Thiếu thông tin người phê duyệt');
    }
    if (!donNghiPhep?.id) {
      throw new Error('Thiếu thông tin đơn nghỉ phép');
    }
  }, [user, donNghiPhep]);

  const handleUpdateStatus = useCallback(
    async (newStatus) => {
      try {
        validateUpdateData();
        setIsProcessing(true);

        const updateData = {
          status: newStatus,
          approverNote: approverNote.trim(),
          approverId: user.id,
          approverName: user.displayName,
          approverRole: user.role,
          approverEmail: user.email,
          approverDepartment: user.department,
          action: newStatus === 'DA_DUYET' ? HANH_DONG.PHE_DUYET : HANH_DONG.TU_CHOI,
        };

        console.log('Thông tin cập nhật:', updateData);

        const result = await nghiPhepService.capNhatTrangThai(donNghiPhep.id, updateData);

        if (result) {
          if (onUpdateStatus) {
            onUpdateStatus(result);
          }

          toast({
            title: 'Cập nhật thành công',
            description: `Đã ${
              newStatus === 'DA_DUYET' ? 'phê duyệt' : 'từ chối'
            } đơn nghỉ phép`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          onClose();
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
        toast({
          title: 'Lỗi',
          description: error.message || 'Không thể cập nhật trạng thái đơn',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [validateUpdateData, approverNote, user, donNghiPhep, onUpdateStatus, toast, onClose],
  );

  const handleCancel = useCallback(async () => {
    try {
      if (!donNghiPhep?.id) {
        throw new Error('Thiếu thông tin đơn nghỉ phép');
      }
      setIsProcessing(true);

      const result = await nghiPhepService.huyDon(donNghiPhep.id);

      if (result) {
        if (onUpdateStatus) {
          onUpdateStatus(result);
        }

        toast({
          title: 'Hủy đơn thành công',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });

        onClose();
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể hủy đơn',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [donNghiPhep, onUpdateStatus, toast, onClose]);

  if (!donNghiPhep) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết đơn xin nghỉ phép</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Mã đơn:</Text>
              <Text>{donNghiPhep.requestId}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Trạng thái:</Text>
              <Badge colorScheme={TRANG_THAI_COLOR[donNghiPhep.status]}>
                {TRANG_THAI_LABEL[donNghiPhep.status]}
              </Badge>
            </HStack>

            <Divider />

            <VStack align="flex-start" spacing={2}>
              <Text fontWeight="bold">Thông tin người xin nghỉ:</Text>
              <Text>Họ tên: {donNghiPhep.userName}</Text>
              <Text>Email: {donNghiPhep.userEmail}</Text>
              <Text>Phòng ban: {donNghiPhep.department}</Text>
            </VStack>

            <Divider />

            <VStack align="flex-start" spacing={2}>
              <Text fontWeight="bold">Chi tiết đơn xin nghỉ:</Text>
              <Text>
                Loại nghỉ phép: {LOAI_NGHI_PHEP_LABEL[donNghiPhep.leaveType]}
              </Text>
              <Text>
                Thời gian: Từ{' '}
                {new Date(donNghiPhep.startDate).toLocaleDateString('vi-VN')} đến{' '}
                {new Date(donNghiPhep.endDate).toLocaleDateString('vi-VN')}
              </Text>
              <Text>Số ngày nghỉ: {donNghiPhep.totalDays} ngày</Text>
              <Text>Lý do: {donNghiPhep.reason}</Text>
            </VStack>

            {donNghiPhep.status !== 'CHO_DUYET' && (
              <>
                <Divider />
                <VStack align="flex-start" spacing={2}>
                  <Text fontWeight="bold">Thông tin phê duyệt:</Text>
                  <Text>Người phê duyệt: {donNghiPhep.approverName}</Text>
                  <Text>
                    Thời gian phê duyệt:{' '}
                    {donNghiPhep.approvedAt
                      ? new Date(donNghiPhep.approvedAt).toLocaleDateString('vi-VN')
                      : ''}
                  </Text>
                  {donNghiPhep.approverNote && (
                    <Text>Ghi chú: {donNghiPhep.approverNote}</Text>
                  )}
                </VStack>
              </>
            )}

            {canApprove && (
              <FormControl>
                <FormLabel>Ghi chú phê duyệt:</FormLabel>
                <Textarea
                  value={approverNote}
                  onChange={(e) => setApproverNote(e.target.value)}
                  placeholder="Nhập ghi chú phê duyệt (nếu có)"
                  rows={3}
                />
              </FormControl>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            {canApprove && (
              <>
                <Button
                  colorScheme="green"
                  onClick={() => handleUpdateStatus('DA_DUYET')}
                  isLoading={isProcessing}
                  loadingText="Đang xử lý..."
                >
                  Phê duyệt
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleUpdateStatus('TU_CHOI')}
                  isLoading={isProcessing}
                  loadingText="Đang xử lý..."
                >
                  Từ chối
                </Button>
              </>
            )}

            {canCancel && (
              <Button
                colorScheme="gray"
                onClick={handleCancel}
                isLoading={isProcessing}
                loadingText="Đang hủy..."
              >
                Hủy đơn
              </Button>
            )}

            <Button variant="ghost" onClick={onClose}>
              Đóng
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChiTietDonNghiPhep;
