// src/modules/quan_ly_thanh_vien/components/danh_sach_thanh_vien.js
import React, { useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Heading,
  HStack,
  useToast,
  Avatar,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useThanhVien } from '../hooks/use_thanh_vien';
import { TRANG_THAI_LABEL } from '../constants/trang_thai_thanh_vien';
import ThemThanhVien from './them_thanh_vien';
import BoLocThanhVien from './bo_loc_thanh_vien';
import { useAuth } from '../../../hooks/useAuth';

const DanhSachThanhVien = () => {
  // Theme colors
  const bg = useColorModeValue('gray.800', 'gray.900');
  const tableBg = useColorModeValue('gray.700', 'gray.800');
  const textColor = useColorModeValue('gray.100', 'gray.50');
  const borderColor = useColorModeValue('gray.600', 'gray.700');

  const {
    danhSachLoc,
    dangTai,
    loi,
    thongBao,
    layDanhSach,
    xoaThanhVien,
    capNhatTrangThai,
  } = useThanhVien();

  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    layDanhSach();
  }, [layDanhSach]);

  useEffect(() => {
    if (thongBao) {
      toast({
        title: "Thành công",
        description: thongBao,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [thongBao, toast]);

  useEffect(() => {
    if (loi) {
      toast({
        title: "Lỗi",
        description: loi,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [loi, toast]);

  const handleXoa = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này?')) {
      await xoaThanhVien(id);
    }
  };

  if (dangTai) {
    return (
      <Box bg={bg} minH="100vh" p={4}>
        <Box bg={tableBg} rounded="lg" shadow="base" p={4} color={textColor}>
          Đang tải dữ liệu...
        </Box>
      </Box>
    );
  }

  return (
    <Box bg={bg} minH="100vh" p={4}>
      <Box bg={tableBg} rounded="lg" shadow="base" p={4}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg" color={textColor}>
            Danh sách thành viên
          </Heading>
          {user?.role === 'admin-tong' && (
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Thêm thành viên
            </Button>
          )}
        </HStack>

        <BoLocThanhVien />

        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr>
              <Th color={textColor}>Ảnh</Th>
              <Th color={textColor}>Họ tên</Th>
              <Th color={textColor}>Email</Th>
              <Th color={textColor}>Phòng ban</Th>
              <Th color={textColor}>Chức vụ</Th>
              <Th color={textColor}>Trạng thái</Th>
              <Th color={textColor}>Thao tác</Th>
            </Tr>
          </Thead>
          <Tbody>
            {danhSachLoc.map((thanhVien) => (
              <Tr key={thanhVien.id} borderColor={borderColor}>
                <Td>
                  <Avatar
                    size="md"
                    name={thanhVien.hoTen}
                    src={thanhVien.anhDaiDien}
                  />
                </Td>
                <Td>{thanhVien.hoTen}</Td>
                <Td>{thanhVien.email}</Td>
                <Td>{thanhVien.phongBan}</Td>
                <Td>{thanhVien.chucVu}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      thanhVien.trangThai === 'DANG_CONG_TAC'
                        ? 'green'
                        : thanhVien.trangThai === 'DUNG_CONG_TAC'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {TRANG_THAI_LABEL[thanhVien.trangThai]}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    {(user?.role === 'admin-tong' || user?.role === 'admin-con') && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            capNhatTrangThai(thanhVien.id, 'DANG_CONG_TAC')
                          }
                          colorScheme="green"
                        >
                          Đang công tác
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            capNhatTrangThai(thanhVien.id, 'DUNG_CONG_TAC')
                          }
                          colorScheme="yellow"
                        >
                          Dừng công tác
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => capNhatTrangThai(thanhVien.id, 'NGHI')}
                          colorScheme="red"
                        >
                          Nghỉ
                        </Button>
                      </>
                    )}
                    {user?.role === 'admin-tong' && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleXoa(thanhVien.id)}
                      >
                        Xóa
                      </Button>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <ThemThanhVien isOpen={isOpen} onClose={onClose} />
      </Box>
    </Box>
  );
};

export default DanhSachThanhVien;