// File: src/modules/quan_ly_tai_san/components/chi_tiet_tai_san.js
// Link tham khảo: https://chakra-ui.com/docs
// Nhánh: main

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent, 
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Grid,
  GridItem,
  Text,
  Badge,
  Box,
  VStack,
  HStack,
  Divider,
  Image
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { TEN_LOAI_TAI_SAN, TEN_NHOM_TAI_SAN } from '../constants/loai_tai_san';
import { TEN_TRANG_THAI, MAU_TRANG_THAI } from '../constants/trang_thai_tai_san';

const ChiTietTaiSan = ({ isOpen, onClose, taiSan }) => {

  if (!taiSan) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg="gray.800">
        <ModalHeader>Chi tiết tài sản</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {/* Thông tin chung */}
            <Box>
              <Text fontWeight="bold" mb={2}>Thông tin chung</Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <Text color="gray.500">Mã tài sản</Text>
                  <Text>{taiSan.ma}</Text>
                </GridItem>
                
                <GridItem>
                  <Text color="gray.500">Tên tài sản</Text>
                  <Text>{taiSan.ten}</Text>
                </GridItem>

                <GridItem>
                  <Text color="gray.500">Loại tài sản</Text>
                  <Text>{TEN_LOAI_TAI_SAN[taiSan.loaiTaiSan]}</Text>
                </GridItem>

                <GridItem>
                  <Text color="gray.500">Nhóm tài sản</Text> 
                  <Text>{TEN_NHOM_TAI_SAN[taiSan.nhomTaiSan]}</Text>
                </GridItem>

                <GridItem>
                  <Text color="gray.500">Trạng thái</Text>
                  <Badge colorScheme={MAU_TRANG_THAI[taiSan.trangThai]}>
                    {TEN_TRANG_THAI[taiSan.trangThai]}
                  </Badge>
                </GridItem>

                <GridItem>
                  <Text color="gray.500">Phòng ban</Text>
                  <Text>{taiSan.phongBan}</Text>
                </GridItem>
              </Grid>
            </Box>

            <Divider />

            {/* Thông tin sử dụng */}
            <Box>
              <Text fontWeight="bold" mb={2}>Thông tin sử dụng</Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <Text color="gray.500">Người quản lý</Text>
                  <Text>{taiSan.nguoiQuanLy || 'Chưa có'}</Text>
                </GridItem>

                <GridItem>
                  <Text color="gray.500">Người sử dụng</Text>
                  <Text>{taiSan.nguoiSuDung || 'Chưa cấp phát'}</Text>
                </GridItem>

                <GridItem>
                  <Text color="gray.500">Ngày mua</Text>
                  <Text>{formatDate(taiSan.ngayMua)}</Text>
                </GridItem>

                <GridItem>
                  <Text color="gray.500">Hạn bảo hành</Text>
                  <Text>{formatDate(taiSan.hanBaoHanh) || 'Không có'}</Text>
                </GridItem>

                <GridItem colSpan={2}>
                  <Text color="gray.500">Giá trị mua</Text>
                  <Text fontSize="lg" fontWeight="bold" color="green.400">
                    {formatCurrency(taiSan.giaTriMua)}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            <Divider />

            {/* Thông số kỹ thuật */}
            {Object.keys(taiSan.thongSoKyThuat || {}).length > 0 && (
              <>
                <Box>
                  <Text fontWeight="bold" mb={2}>Thông số kỹ thuật</Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {Object.entries(taiSan.thongSoKyThuat).map(([key, value]) => (
                      <GridItem key={key}>
                        <Text color="gray.500">{key}</Text>
                        <Text>{value}</Text>
                      </GridItem>
                    ))}
                  </Grid>
                </Box>
                <Divider />
              </>
            )}

            {/* Mô tả */}
            {taiSan.moTa && (
              <>
                <Box>
                  <Text fontWeight="bold" mb={2}>Mô tả</Text>
                  <Text whiteSpace="pre-wrap">{taiSan.moTa}</Text>
                </Box>
                <Divider />
              </>
            )}

            {/* Ảnh tài sản */}
            {taiSan.anhTaiSan?.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>Ảnh tài sản</Text>
                <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
                  {taiSan.anhTaiSan.map((url, index) => (
                    <GridItem key={index}>
                      <Box
                        borderRadius="md"
                        overflow="hidden"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                      >
                        <Image
                          src={url}
                          alt={`Ảnh tài sản ${index + 1}`}
                          objectFit="cover"
                          w="100%"
                          h="100%"
                        />
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            )}

          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChiTietTaiSan;