 
// File: src/modules/quan_ly_tai_chinh/components/chi_tieu/danh_sach_chi_tieu.js
// Link tham khảo: https://chakra-ui.com/docs/components/table
// Nhánh: main

import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { TEN_LOAI_CHI_TIEU } from '../../constants/loai_chi_tieu';
import { dinhDangTien } from '../../utils/dinh_dang_tien';

const DanhSachChiTieu = () => {
  const { chiTieu, xoaThongTinChiTieu, dangXuLy } = useTaiChinh();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState(null);

  const handleXoa = (id) => {
    setSelectedId(id);
    onOpen();
  };

  const confirmXoa = async () => {
    if (selectedId) {
      try {
        await xoaThongTinChiTieu(selectedId);
        onClose();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Loại chi tiêu</Th>
            <Th isNumeric>Số tiền</Th>
            <Th>Ngày chi</Th>
            <Th>Ghi chú</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {chiTieu.map((item) => (
            <Tr key={item.id}>
              <Td>{TEN_LOAI_CHI_TIEU[item.loaiChi]}</Td>
              <Td isNumeric>{dinhDangTien(item.soTien)}</Td>
              <Td>{new Date(item.ngayChi).toLocaleDateString('vi-VN')}</Td>
              <Td>{item.ghiChu}</Td>
              <Td>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem icon={<FiEdit2 />}>Sửa</MenuItem>
                    <MenuItem 
                      icon={<FiTrash2 />}
                      onClick={() => handleXoa(item.id)}
                      color="red.500"
                    >
                      Xóa
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa</ModalHeader>
          <ModalBody>
            <Text>Bạn có chắc chắn muốn xóa khoản chi tiêu này?</Text>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="red" 
              mr={3} 
              onClick={confirmXoa}
              isLoading={dangXuLy}
            >
              Xóa
            </Button>
            <Button variant="ghost" onClick={onClose}>Hủy</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DanhSachChiTieu;