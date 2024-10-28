// src/modules/quan_ly_chi_tiet/components/bang_du_an.js

import React, { useEffect, useState } from 'react';
import {
  Box,
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
  useDisclosure,
  HStack,
  Text,
  Progress,
  Button,
  Flex,
  Select,
  Input,
  VStack,
  Tooltip
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  AddIcon,
  SearchIcon
} from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useDuAn } from '../hooks/use_du_an';
import { formatDate, getStatusColor } from '../utils/helpers';
import ThemDuAnModal from './them_du_an';
import XacNhanXoaModal from './xac_nhan_xoa_modal';

const BangDuAn = () => {
  const navigate = useNavigate();
  const { danhSachDuAn, layDanhSachDuAn, xoaDuAn } = useDuAn();

  const [selectedDuAn, setSelectedDuAn] = useState(null);
  const [filters, setFilters] = useState({
    trangThai: 'all',
    phongBan: 'all',
    search: ''
  });

  const themDuAnModal = useDisclosure();
  const xoaDuAnModal = useDisclosure();

  useEffect(() => {
    layDanhSachDuAn();
  }, [layDanhSachDuAn]);

  const handleXoaDuAn = async () => {
    if (selectedDuAn) {
      await xoaDuAn(selectedDuAn.id);
      xoaDuAnModal.onClose();
      setSelectedDuAn(null);
    }
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredDuAn = danhSachDuAn.filter((duAn) => {
    const matchTrangThai =
      filters.trangThai === 'all' || duAn.trangThai === filters.trangThai;
    const matchPhongBan =
      filters.phongBan === 'all' || duAn.phongBan === filters.phongBan;
    const matchSearch =
      !filters.search ||
      duAn.tenDuAn.toLowerCase().includes(filters.search.toLowerCase()) ||
      duAn.moTa.toLowerCase().includes(filters.search.toLowerCase());

    return matchTrangThai && matchPhongBan && matchSearch;
  });

  return (
    <Box>
      <VStack spacing={4} w="full">
        {/* Thanh công cụ */}
        <Flex justifyContent="space-between" w="full" mb={4}>
          <HStack spacing={4}>
            <Select
              name="trangThai"
              value={filters.trangThai}
              onChange={handleFilter}
              w="200px"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="MOI">Mới</option>
              <option value="DANG_THUC_HIEN">Đang thực hiện</option>
              <option value="HOAN_THANH">Hoàn thành</option>
            </Select>
            <Select
              name="phongBan"
              value={filters.phongBan}
              onChange={handleFilter}
              w="200px"
            >
              <option value="all">Tất cả phòng ban</option>
              <option value="PHONG_FRONTEND">Phòng Frontend</option>
              <option value="PHONG_BACKEND">Phòng Backend</option>
              <option value="PHONG_TESTING">Phòng Testing</option>
            </Select>
            <Box position="relative">
              <Input
                name="search"
                value={filters.search}
                onChange={handleFilter}
                placeholder="Tìm kiếm dự án..."
                paddingLeft="40px"
                w="300px"
              />
              <SearchIcon
                position="absolute"
                left="3"
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
              />
            </Box>
          </HStack>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={themDuAnModal.onOpen}
          >
            Thêm dự án
          </Button>
        </Flex>

        {/* Bảng dự án */}
        <Box overflowX="auto" w="full">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tên dự án</Th>
                <Th>Phòng ban</Th>
                <Th>Trạng thái</Th>
                <Th>Tiến độ</Th>
                <Th>Ngày bắt đầu</Th>
                <Th>Ngày kết thúc</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredDuAn.map((duAn) => (
                <Tr key={duAn.id}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{duAn.tenDuAn}</Text>
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {duAn.moTa}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>{duAn.phongBan}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(duAn.trangThai)}>
                      {duAn.trangThai}
                    </Badge>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Progress
                        value={duAn.tienDo}
                        size="sm"
                        width="100%"
                        colorScheme={duAn.tienDo === 100 ? 'green' : 'blue'}
                      />
                      <Text fontSize="sm">{duAn.tienDo}%</Text>
                    </VStack>
                  </Td>
                  <Td>{formatDate(duAn.ngayBatDau)}</Td>
                  <Td>{formatDate(duAn.ngayKetThuc)}</Td>
                  <Td>
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
                          onClick={() => navigate(`/du-an/${duAn.id}`)}
                        >
                          Xem chi tiết
                        </MenuItem>
                        <MenuItem
                          icon={<EditIcon />}
                          onClick={() => {
                            setSelectedDuAn(duAn);
                            themDuAnModal.onOpen();
                          }}
                        >
                          Chỉnh sửa
                        </MenuItem>
                        <MenuItem
                          icon={<DeleteIcon />}
                          color="red.500"
                          onClick={() => {
                            setSelectedDuAn(duAn);
                            xoaDuAnModal.onOpen();
                          }}
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
        </Box>
      </VStack>

      {/* Modals */}
      <ThemDuAnModal
        isOpen={themDuAnModal.isOpen}
        onClose={() => {
          themDuAnModal.onClose();
          setSelectedDuAn(null);
        }}
        duAnHienTai={selectedDuAn}
      />

      <XacNhanXoaModal
        isOpen={xoaDuAnModal.isOpen}
        onClose={() => {
          xoaDuAnModal.onClose();
          setSelectedDuAn(null);
        }}
        title="Xóa dự án"
        message={`Bạn có chắc chắn muốn xóa dự án "${selectedDuAn?.tenDuAn}" không?`}
        onConfirm={handleXoaDuAn}
      />
    </Box>
  );
};

export default BangDuAn;
