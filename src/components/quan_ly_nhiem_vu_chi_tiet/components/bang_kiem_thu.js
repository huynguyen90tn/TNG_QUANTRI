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
import { fetchKiemThuList, deleteKiemThu, updateKiemThu } from '../store/nhiem_vu_slice';

const BangKiemThu = ({ projectId }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const kiemThuList = useSelector((state) => state.nhiemVu?.kiemThuList || []);
  const loading = useSelector((state) => state.nhiemVu?.loading || false);
  const error = useSelector((state) => state.nhiemVu?.error);

  const loadData = useCallback(async () => {
    try {
      await dispatch(fetchKiemThuList(projectId)).unwrap();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: error || "Không thể tải dữ liệu kiểm thử",
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
      await dispatch(deleteKiemThu(id)).unwrap();
      toast({
        title: "Thành công",
        description: "Đã xóa kiểm thử",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadData();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa kiểm thử",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = async (item) => {
    try {
      await dispatch(updateKiemThu({ id: item.id, ...item })).unwrap();
      toast({
        title: "Thành công",
        description: "Đã cập nhật kiểm thử",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadData();
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật kiểm thử",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TRANG_THAI.DANG_KIEM_THU:
        return "orange";
      case TRANG_THAI.HOAN_TAT:
        return "green";
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
            <Th>ID Tính Năng</Th>
            <Th>Mã Lỗi</Th>
            <Th>Mô tả Lỗi</Th>
            <Th>Trạng thái</Th>
            <Th>Người kiểm thử</Th>
            <Th>Ngày kiểm thử</Th>
            <Th>Ghi chú</Th>
            <Th>Thao tác</Th>
          </Tr>
        </Thead>
        <Tbody>
          {kiemThuList.map((item) => (
            <Tr key={`${item.idTinhNang}-${item.maLoi}`}>
              <Td>{item.idTinhNang}</Td>
              <Td>{item.maLoi}</Td>
              <Td>{item.moTaLoi}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(item.trangThaiKiemThu)}>
                  {item.trangThaiKiemThu}
                </Badge>
              </Td>
              <Td>{item.nguoiKiemThu}</Td>
              <Td>{new Date(item.ngayKiemThu).toLocaleDateString('vi-VN')}</Td>
              <Td>{item.ghiChu}</Td>
              <Td>
                <HStack spacing={2}>
                  <Tooltip label="Xem chi tiết">
                    <IconButton
                      icon={<InfoIcon />}
                      onClick={() => handleUpdate({ ...item, viewed: true })}
                      aria-label="Chi tiết kiểm thử"
                      size="sm"
                    />
                  </Tooltip>
                  <Tooltip label="Chỉnh sửa">
                    <IconButton
                      icon={<EditIcon />}
                      onClick={() => handleUpdate(item)}
                      aria-label="Sửa kiểm thử"
                      size="sm"
                    />
                  </Tooltip>
                  <Tooltip label="Xóa">
                    <IconButton
                      icon={<DeleteIcon />}
                      onClick={() => handleDelete(item.id)}
                      aria-label="Xóa kiểm thử"
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

export default BangKiemThu;
