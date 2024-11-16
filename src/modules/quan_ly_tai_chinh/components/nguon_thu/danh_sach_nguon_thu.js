// File: src/modules/quan_ly_tai_chinh/components/nguon_thu/danh_sach_nguon_thu.js
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
  Text,
  useToast
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { TEN_LOAI_NGUON_THU } from '../../constants/loai_nguon_thu';
import { dinhDangTien } from '../../utils/dinh_dang_tien';

const DanhSachNguonThu = () => {
  const { nguonThu, xoaThongTinNguonThu, dangXuLy } = useTaiChinh();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedId, setSelectedId] = useState(null);
  const toast = useToast();

  const handleXoa = (id) => {
    setSelectedId(id);
    onOpen();
  };

  const confirmXoa = async () => {
    if (selectedId) {
      try {
        await xoaThongTinNguonThu(selectedId);
        toast({
          title: "Thành công",
          description: "Đã xóa nguồn thu",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        onClose();
      } catch (error) {
        toast({
          title: "Lỗi",
          description: error.message || "Không thể xóa nguồn thu",
          status: "error", 
          duration: 3000,
          isClosable: true
        });
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Loại thu</Th>
            <Th isNumeric>Số tiền</Th>
            <Th>Ngày thu</Th>
            <Th>Ghi chú</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {nguonThu.map((item) => (
            <Tr key={item.id}>
              <Td>{TEN_LOAI_NGUON_THU[item.loaiThu]}</Td>
              <Td isNumeric color="green.500">{dinhDangTien(item.soTien)}</Td>
              <Td>{new Date(item.ngayThu).toLocaleDateString('vi-VN')}</Td>
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
          {nguonThu.length === 0 && (
            <Tr>
              <Td colSpan={5}>
                <Text textAlign="center" py={4}>
                  Chưa có nguồn thu nào
                </Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa</ModalHeader>
          <ModalBody>
            <Text>Bạn có chắc chắn muốn xóa nguồn thu này?</Text>
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
            <Button variant="ghost" onClick={onClose}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DanhSachNguonThu;