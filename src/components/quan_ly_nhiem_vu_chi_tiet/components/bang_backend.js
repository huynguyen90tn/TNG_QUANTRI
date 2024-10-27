import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Box,
  useToast,
  Tooltip,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import { InfoIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { TRANG_THAI } from '../constants/trang_thai';
import { fetchBackendList, deleteBackend, updateBackend } from '../store/nhiem_vu_slice';

const BangBackend = ({ projectId }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const backendList = useSelector((state) => state.nhiemVu?.backendList || []);
  const loading = useSelector((state) => state.nhiemVu?.loading || false);
  const error = useSelector((state) => state.nhiemVu?.error);

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchBackendList(projectId)).unwrap();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: error || "Không thể tải dữ liệu backend",
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
      await dispatch(deleteBackend(id)).unwrap();
      toast({
        title: "Thành công",
        description: "Đã xóa backend",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadData();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa backend",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (item) => {
    try {
      await dispatch(updateBackend({ id: item.id, ...item })).unwrap();
      toast({
        title: "Thành công",
        description: "Đã cập nhật backend",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadData();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật backend",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TRANG_THAI.DANG_PHAT_TRIEN:
        return "orange";
      case TRANG_THAI.HOAN_TAT:
        return "green";
      case TRANG_THAI.DANG_XU_LY:
        return "blue";
      default:
        return "gray";
    }
  };

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
            <Th>ID Backend</Th>
            <Th>Mô tả API/Chức năng</Th>
            <Th>Trạng thái</Th>
            <Th>Người phụ trách</Th>
            <Th>Ngày cập nhật</Th>
            <Th>Ghi chú</Th>
            <Th>Thao tác</Th>
          </Tr>
        </Thead>
        <Tbody>
          {backendList.map((item) => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.moTa}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(item.trangThai)}>
                  {item.trangThai}
                </Badge>
              </Td>
              <Td>{item.nguoiPhuTrach}</Td>
              <Td>{new Date(item.ngayCapNhat).toLocaleDateString('vi-VN')}</Td>
              <Td>{item.ghiChu}</Td>
              <Td>
                <HStack spacing={2}>
                  <Tooltip label="Xem chi tiết">
                    <IconButton
                      icon={<InfoIcon />}
                      onClick={() => handleUpdate({ ...item, viewed: true })}
                      aria-label="Chi tiết backend"
                      size="sm"
                    />
                  </Tooltip>
                  <Tooltip label="Chỉnh sửa">
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => handleUpdate(item)}
                      aria-label="Sửa backend"
                      size="sm"
                    />
                  </Tooltip>
                  <Tooltip label="Xóa">
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(item.id)}
                      aria-label="Xóa backend"
                      size="sm"
                      colorScheme="red"
                    />
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BangBackend;
