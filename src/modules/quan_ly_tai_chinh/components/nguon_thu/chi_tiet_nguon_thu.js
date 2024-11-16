 
// File: src/modules/quan_ly_tai_chinh/components/nguon_thu/chi_tiet_nguon_thu.js
// Link tham khảo: https://chakra-ui.com/docs/components/modal
// Nhánh: main

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
  Badge,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { useNguonThu } from '../../hooks/use_nguon_thu';
import { dinhDangTien } from '../../utils/dinh_dang_tien';
import { dinhDangNgay } from '../../utils/xu_ly_ngay';
import { TEN_LOAI_NGUON_THU } from '../../constants/loai_nguon_thu';
import { TEN_TRANG_THAI } from '../../constants/trang_thai';

const ChiTietNguonThu = ({ nguonThuId, isOpen, onClose }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { nguonThuHienTai } = useNguonThu();

  if (!nguonThuHienTai) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>Chi tiết nguồn thu</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Loại thu:</Text>
              <Text>{TEN_LOAI_NGUON_THU[nguonThuHienTai.loaiThu]}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Số tiền:</Text>
              <Text color="green.500" fontWeight="bold">
                {dinhDangTien(nguonThuHienTai.soTien)}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Ngày thu:</Text>
              <Text>{dinhDangNgay(nguonThuHienTai.ngayThu)}</Text>
            </HStack>

            <HStack justify="space-between">
              <Text fontWeight="bold">Trạng thái:</Text>
              <Badge
                colorScheme={
                  nguonThuHienTai.trangThai === 'DA_THU' ? 'green' : 
                  nguonThuHienTai.trangThai === 'CHO_THU' ? 'yellow' : 
                  'red'
                }
              >
                {TEN_TRANG_THAI[nguonThuHienTai.trangThai]}
              </Badge>
            </HStack>

            <Divider />

            <VStack align="stretch">
              <Text fontWeight="bold">Ghi chú:</Text>
              <Text>{nguonThuHienTai.ghiChu || 'Không có ghi chú'}</Text>
            </VStack>

            <Divider />

            <VStack align="stretch" spacing={2}>
              <Text fontWeight="bold">Thông tin thêm:</Text>
              <HStack justify="space-between">
                <Text>Ngày tạo:</Text>
                <Text>{dinhDangNgay(nguonThuHienTai.ngayTao)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text>Cập nhật lần cuối:</Text>
                <Text>{dinhDangNgay(nguonThuHienTai.ngayCapNhat)}</Text>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChiTietNguonThu;