// src/modules/quan_ly_thanh_vien/components/chi_tiet_thanh_vien.js
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { 
  TRANG_THAI_THANH_VIEN, 
  TRANG_THAI_LABEL,
  PHONG_BAN_LABEL 
} from '../constants/trang_thai_thanh_vien';
import { useAuth } from '../../../hooks/useAuth';

const ChiTietThanhVien = ({
  isOpen,
  onClose,
  thanhVien,
  onCapNhatTrangThai,
}) => {
  const { user } = useAuth();
  const toast = useToast();

  const handleCapNhatTrangThai = async (trangThaiMoi) => {
    try {
      await onCapNhatTrangThai(thanhVien.id, trangThaiMoi);
      toast({
        title: 'Thành công',
        description: 'Cập nhật trạng thái thành công',
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

  const renderThongTinCoBan = () => (
    <VStack spacing={2} align="start">
      <Text fontSize="sm" color="gray.500">Thông tin cơ bản</Text>
      <HStack w="100%" justify="space-between">
        <Text fontWeight="medium">Email:</Text>
        <Text>{thanhVien.email}</Text>
      </HStack>
      <HStack w="100%" justify="space-between">
        <Text fontWeight="medium">Số điện thoại:</Text>
        <Text>{thanhVien.soDienThoai || 'Chưa cập nhật'}</Text>
      </HStack>
      <HStack w="100%" justify="space-between">
        <Text fontWeight="medium">Phòng ban:</Text>
        <Text>{PHONG_BAN_LABEL[thanhVien.phongBan]}</Text>
      </HStack>
      <HStack w="100%" justify="space-between">
        <Text fontWeight="medium">Chức vụ:</Text>
        <Text>{thanhVien.chucVu}</Text>
      </HStack>
      <HStack w="100%" justify="space-between">
        <Text fontWeight="medium">Trạng thái:</Text>
        <Badge colorScheme={
          thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DANG_CONG_TAC ? 'green' :
          thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC ? 'yellow' : 'red'
        }>
          {TRANG_THAI_LABEL[thanhVien.trangThai]}
        </Badge>
      </HStack>
    </VStack>
  );

  const renderNutCapNhatTrangThai = () => {
    if (user?.role !== 'admin-tong' && user?.role !== 'admin-con') {
      return null;
    }

    return (
      <>
        <Divider my={4} />
        <VStack spacing={3} w="100%">
          <Text fontSize="sm" color="gray.500">Cập nhật trạng thái</Text>
          <HStack spacing={2} w="100%">
            <Button
              size="sm"
              colorScheme="green"
              isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DANG_CONG_TAC}
              onClick={() => handleCapNhatTrangThai(TRANG_THAI_THANH_VIEN.DANG_CONG_TAC)}
            >
              Đang công tác
            </Button>
            <Button
              size="sm"
              colorScheme="yellow"
              isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC}
              onClick={() => handleCapNhatTrangThai(TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC)}
            >
              Dừng công tác
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.NGHI}
              onClick={() => handleCapNhatTrangThai(TRANG_THAI_THANH_VIEN.NGHI)}
            >
              Nghỉ
            </Button>
          </HStack>
        </VStack>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi tiết thành viên</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Avatar
              size="2xl"
              name={thanhVien.hoTen}
              src={thanhVien.anhDaiDien}
            />
            <Text fontSize="xl" fontWeight="bold" mt={2}>
              {thanhVien.hoTen}
            </Text>
            <Divider />
            {renderThongTinCoBan()}
            {renderNutCapNhatTrangThai()}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChiTietThanhVien;