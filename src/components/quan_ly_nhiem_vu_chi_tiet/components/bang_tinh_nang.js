// src/components/quan_ly_nhiem_vu_chi_tiet/components/bang_tinh_nang.js
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Progress,
  VStack,
  HStack,
  Box,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { TRANG_THAI } from "../constants/trang_thai";
import { 
  fetchTinhNangList, 
  deleteTinhNang, 
  updateTinhNang,
  setSelectedItem
} from '../store/nhiem_vu_slice';

const ModalConfirmDelete = ({ isOpen, onClose, selectedItem, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Xác nhận xóa</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>
          Bạn có chắc chắn muốn xóa tính năng &ldquo;{selectedItem?.tenTinhNang}&rdquo;?
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" mr={3} onClick={onClose}>
          Hủy
        </Button>
        <Button
          colorScheme="red"
          onClick={() => {
            onConfirm(selectedItem?.id);
            onClose();
          }}
        >
          Xóa
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

ModalConfirmDelete.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({
    id: PropTypes.string,
    tenTinhNang: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
};

const BangTinhNang = ({ projectId }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const tinhNangList = useSelector((state) => state.nhiemVu?.tinhNangList || []);
  const loading = useSelector((state) => state.nhiemVu?.loading || false);
  const error = useSelector((state) => state.nhiemVu?.error);

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchTinhNangList(projectId)).unwrap();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: error || "Không thể tải danh sách tính năng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dispatch, projectId, toast, error]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTinhNang(id)).unwrap();
      toast({
        title: "Thành công",
        description: "Đã xóa tính năng",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadData();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: error || "Không thể xóa tính năng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (item) => {
    try {
      await dispatch(updateTinhNang({ id: item.id, ...item })).unwrap();
      toast({
        title: "Thành công",
        description: "Đã cập nhật tính năng",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadData();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: error || "Không thể cập nhật tính năng",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleView = (item) => {
    dispatch(setSelectedItem(item));
  };

  const confirmDelete = (item) => {
    setSelectedDeleteItem(item);
    onOpen();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TRANG_THAI.DANG_PHAT_TRIEN:
        return "orange";
      case TRANG_THAI.HOAN_TAT:
        return "green";
      case TRANG_THAI.DANG_XU_LY:
        return "blue";
      case TRANG_THAI.DANG_KIEM_THU:
        return "purple";
      default:
        return "gray";
    }
  };

  const columns = [
    { id: "maTinhNang", label: "Mã tính năng" },
    { id: "tenTinhNang", label: "Tên tính năng" },
    { id: "moTa", label: "Mô tả" },
    { id: "nguoiPhuTrach", label: "Người phụ trách" },
    { id: "trangThai", label: "Trạng thái" },
    { id: "tienDo", label: "Tiến độ" },
    { id: "thaoTac", label: "Thao tác" },
  ];

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.id}>{column.label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tinhNangList.map((item) => (
            <Tr key={item.id}>
              <Td>{item.maTinhNang}</Td>
              <Td>
                <Text noOfLines={2}>{item.tenTinhNang}</Text>
              </Td>
              <Td>
                <Text noOfLines={2}>{item.moTa}</Text>
              </Td>
              <Td>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">{item.nguoiPhuTrach}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {item.email}
                  </Text>
                </VStack>
              </Td>
              <Td>
                <Badge colorScheme={getStatusColor(item.trangThai)}>
                  {item.trangThai}
                </Badge>
              </Td>
              <Td>
                <VStack align="start" spacing={1}>
                  <Progress
                    value={item.tienDo}
                    size="sm"
                    width="100%"
                    colorScheme={item.tienDo === 100 ? "green" : "blue"}
                  />
                  <Text fontSize="sm">{item.tienDo}%</Text>
                </VStack>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<ChevronDownIcon />}
                      variant="outline"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem 
                        icon={<ViewIcon />}
                        onClick={() => handleView(item)}
                      >
                        Xem chi tiết
                      </MenuItem>
                      <MenuItem 
                        icon={<EditIcon />}
                        onClick={() => handleUpdate(item)}
                      >
                        Chỉnh sửa
                      </MenuItem>
                      <MenuItem
                        icon={<DeleteIcon />}
                        onClick={() => confirmDelete(item)}
                        color="red.500"
                      >
                        Xóa
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ModalConfirmDelete 
        isOpen={isOpen}
        onClose={onClose}
        selectedItem={selectedDeleteItem}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

BangTinhNang.propTypes = {
  projectId: PropTypes.string.isRequired,
};

export default BangTinhNang;