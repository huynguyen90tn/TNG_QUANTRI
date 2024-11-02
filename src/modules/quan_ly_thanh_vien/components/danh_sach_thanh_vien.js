// src/modules/quan_ly_thanh_vien/components/danh_sach_thanh_vien.js
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
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
import { 
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  PHONG_BAN_LABEL,
  CHUC_VU_LABEL 
} from '../constants/trang_thai_thanh_vien';
import ThemThanhVien from './them_thanh_vien';
import BoLocThanhVien from './bo_loc_thanh_vien';
import ChiTietThanhVien from './chi_tiet_thanh_vien';
import { useAuth } from '../../../hooks/useAuth';

const DanhSachThanhVien = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [selectedMember, setSelectedMember] = React.useState(null);

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
    capNhatThongTin,
  } = useThanhVien();

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

  const handleXoa = useCallback(async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa thành viên này?')) {
      await xoaThanhVien(id);
    }
  }, [xoaThanhVien]);

  const handleXemChiTiet = useCallback((thanhVien) => {
    setSelectedMember(thanhVien);
    onDetailOpen();
  }, [onDetailOpen]);

  const handleCapNhatTrangThai = useCallback(async (id, trangThai) => {
    try {
      await capNhatTrangThai(id, trangThai);
      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã có lỗi xảy ra",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [capNhatTrangThai, toast]);

  const handleCapNhatThongTin = useCallback(async (id, data) => {
    try {
      await capNhatThongTin(id, data);
      await layDanhSach();
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Đã có lỗi xảy ra",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [capNhatThongTin, layDanhSach, toast]);

  const renderThaoTac = useCallback((thanhVien) => {
    const isAdmin = user?.role === 'admin-tong' || user?.role === 'admin-con';

    return (
      <HStack spacing={2}>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => handleXemChiTiet(thanhVien)}
        >
          Chi tiết
        </Button>
        {isAdmin && (
          <>
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => handleCapNhatTrangThai(thanhVien.id, TRANG_THAI_THANH_VIEN.DANG_CONG_TAC)}
              isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DANG_CONG_TAC}
            >
              Đang công tác
            </Button>
            <Button
              size="sm"
              colorScheme="yellow"
              onClick={() => handleCapNhatTrangThai(thanhVien.id, TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC)}
              isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC}
            >
              Dừng công tác
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => handleCapNhatTrangThai(thanhVien.id, TRANG_THAI_THANH_VIEN.NGHI)}
              isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.NGHI}
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
    );
  }, [user?.role, handleXoa, handleXemChiTiet, handleCapNhatTrangThai]);

  if (dangTai) {
    return (
      <Box bg={bg} minHeight="100vh" padding={4}>
        <Box bg={tableBg} rounded="lg" shadow="base" padding={4} color={textColor}>
          Đang tải dữ liệu...
        </Box>
      </Box>
    );
  }

  return (
    <Box bg={bg} minHeight="100vh" padding={4}>
      <Box bg={tableBg} rounded="lg" shadow="base" padding={4}>
        <HStack justify="space-between" marginBottom={4}>
          <Heading size="lg" color={textColor}>
            Danh sách thành viên
          </Heading>
          {user?.role === 'admin-tong' && (
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={onAddOpen}
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
              <Th color={textColor}>Mã TV</Th>
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
                <Td>{thanhVien.memberCode}</Td>
                <Td>{thanhVien.hoTen}</Td>
                <Td>{thanhVien.email}</Td>
                <Td>{PHONG_BAN_LABEL[thanhVien.phongBan]}</Td>
                <Td>{CHUC_VU_LABEL[thanhVien.chucVu]}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DANG_CONG_TAC
                        ? 'green'
                        : thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {TRANG_THAI_LABEL[thanhVien.trangThai]}
                  </Badge>
                </Td>
                <Td>
                  {renderThaoTac(thanhVien)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <ThemThanhVien 
          isOpen={isAddOpen} 
          onClose={onAddClose} 
        />
        
        <ChiTietThanhVien
          isOpen={isDetailOpen}
          onClose={onDetailClose}
          thanhVien={selectedMember}
          onCapNhatTrangThai={handleCapNhatTrangThai}
          onCapNhatThongTin={handleCapNhatThongTin}
        />
      </Box>
    </Box>
  );
};

DanhSachThanhVien.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
};

export default DanhSachThanhVien;