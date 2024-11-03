// src/modules/quan_ly_nghi_phep/components/chi_tiet_don_nghi_phep.js

import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import { nghiPhepService } from '../services/nghi_phep_service';
import {
  TRANG_THAI_LABEL,
  TRANG_THAI_COLOR,
  LOAI_NGHI_PHEP_LABEL
} from '../constants/trang_thai_don';

const ChiTietDonNghiPhep = ({
  isOpen,
  onClose,
  donNghiPhep,
  onUpdateStatus
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const [approverNote, setApproverNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isAdminTong = user?.role === 'admin-tong';
  const canApprove = isAdminTong && donNghiPhep.status === 'CHO_DUYET';
  const canCancel = donNghiPhep.userId === user?.id && donNghiPhep.status === 'CHO_DUYET';

  const handleUpdateStatus = async (newStatus) => {
    try {
      setIsProcessing(true);

      const result = await nghiPhepService.capNhatTrangThai(donNghiPhep.id, {
        status: newStatus,
        approverNote,
        approverId: user.id,
        approverName: user.displayName
      });

      if (onUpdateStatus) {
        onUpdateStatus(result);
      }

      toast({
        title: 'Cập nhật thành công',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsProcessing(true);

      const result = await nghiPhepService.huyDon(donNghiPhep.id);

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
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
              <Text>Loại nghỉ phép: {LOAI_NGHI_PHEP_LABEL[donNghiPhep.leaveType]}</Text>
              <Text>
                Thời gian: Từ {new Date(donNghiPhep.startDate).toLocaleDateString('vi-VN')}
                {' '}đến {new Date(donNghiPhep.endDate).toLocaleDateString('vi-VN')}
              </Text>
              <Text>Số ngày nghỉ: {donNghiPhep.totalDays} ngày</Text>
              <Text>Lý do: {donNghiPhep.reason}</Text>
            </VStack>

            {donNghiPhep.status !== 'CHO_DUYET' && (
              <VStack align="flex-start" spacing={2}>
                <Text fontWeight="bold">Thông tin phê duyệt:</Text>
                <Text>Người phê duyệt: {donNghiPhep.approverName}</Text>
                <Text>
                  Thời gian phê duyệt:{' '}
                  {donNghiPhep.approvedAt?.toLocaleDateString('vi-VN')}
                </Text>
                {donNghiPhep.approverNote && (
                  <Text>Ghi chú: {donNghiPhep.approverNote}</Text>
                )}
              </VStack>
            )}

{canApprove && (
              <VStack align="stretch" spacing={2}>
                <Text fontWeight="bold">Ghi chú phê duyệt:</Text>
                <Textarea
                  value={approverNote}
                  onChange={(e) => setApproverNote(e.target.value)}
                  placeholder="Nhập ghi chú phê duyệt (nếu có)"
                  rows={3}
                />
              </VStack>
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