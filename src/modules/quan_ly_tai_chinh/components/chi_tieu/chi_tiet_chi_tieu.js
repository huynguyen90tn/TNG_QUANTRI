 

// File: src/modules/quan_ly_tai_chinh/components/chi_tieu/chi_tiet_chi_tieu.js
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
  Box,
  SimpleGrid,
  useColorModeValue,
  IconButton
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import { useChiTieu } from '../../hooks/use_chi_tieu';
import { dinhDangTien } from '../../utils/dinh_dang_tien';
import { dinhDangNgay } from '../../utils/xu_ly_ngay';
import { TEN_LOAI_CHI_TIEU } from '../../constants/loai_chi_tieu';
import { TEN_TRANG_THAI } from '../../constants/trang_thai';

const ChiTietChiTieu = ({ 
  chiTieuId, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { chiTieuHienTai } = useChiTieu();

  if (!chiTieuHienTai) return null;

  const ThongTinItem = ({ label, value, isCurrency, isBadge, colorScheme }) => (
    <Box borderWidth="1px" borderRadius="md" p={3} borderColor={borderColor}>
      <Text fontSize="sm" color="gray.500" mb={1}>
        {label}
      </Text>
      {isCurrency ? (
        <Text fontSize="lg" fontWeight="bold" color="red.500">
          {dinhDangTien(value)}
        </Text>
      ) : isBadge ? (
        <Badge colorScheme={colorScheme}>
          {value}
        </Badge>
      ) : (
        <Text fontSize="lg">{value}</Text>
      )}
    </Box>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>
          <HStack justify="space-between">
            <Text>Chi tiết chi tiêu</Text>
            <HStack spacing={2}>
              <IconButton
                icon={<FiEdit2 />}
                size="sm"
                onClick={onEdit}
                aria-label="Sửa"
              />
              <IconButton
                icon={<FiTrash2 />}
                size="sm"
                colorScheme="red"
                onClick={onDelete}
                aria-label="Xóa"
              />
              <IconButton
                icon={<FiDownload />}
                size="sm"
                colorScheme="green"
                aria-label="Xuất PDF"
              />
            </HStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <ThongTinItem 
                label="Loại chi tiêu"
                value={TEN_LOAI_CHI_TIEU[chiTieuHienTai.loaiChi]}
              />
              <ThongTinItem 
                label="Số tiền"
                value={chiTieuHienTai.soTien}
                isCurrency
              />
              <ThongTinItem 
                label="Ngày chi"
                value={dinhDangNgay(chiTieuHienTai.ngayChi)}
              />
              <ThongTinItem 
                label="Trạng thái"
                value={TEN_TRANG_THAI[chiTieuHienTai.trangThai]}
                isBadge
                colorScheme={chiTieuHienTai.trangThai === 'DA_CHI' ? 'green' : 'yellow'}
              />
            </SimpleGrid>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={2}>
                Ghi chú:
              </Text>
              <Box 
                p={3} 
                borderWidth="1px" 
                borderRadius="md"
                borderColor={borderColor}
                minH="100px"
              >
                <Text>{chiTieuHienTai.ghiChu || 'Không có ghi chú'}</Text>
              </Box>
            </Box>

            <Divider />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <ThongTinItem 
                label="Người tạo"
                value={chiTieuHienTai.nguoiTao}
              />
              <ThongTinItem 
                label="Ngày tạo"
                value={dinhDangNgay(chiTieuHienTai.ngayTao)}
              />
              <ThongTinItem 
                label="Người cập nhật"
                value={chiTieuHienTai.nguoiCapNhat}
              />
              <ThongTinItem 
                label="Ngày cập nhật"
                value={dinhDangNgay(chiTieuHienTai.ngayCapNhat)}
              />
            </SimpleGrid>

            {chiTieuHienTai.taiLieuDinhKem && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Tài liệu đính kèm:
                  </Text>
                  <HStack spacing={2}>
                    <Button 
                      leftIcon={<FiDownload />}
                      size="sm"
                      variant="outline"
                    >
                      Tải xuống
                    </Button>
                  </HStack>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Đóng</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChiTietChiTieu;