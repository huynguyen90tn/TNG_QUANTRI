// src/modules/quan_ly_chi_tiet/components/bang_nhiem_vu.js

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
  Progress,
  VStack,
  Text,
  HStack,
  Button,
  useDisclosure,
  Input,
  Select,
  Flex
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  EditIcon, 
  DeleteIcon, 
  ViewIcon,
  SearchIcon,
  AddIcon
} from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useNhiemVu } from '../hooks/use_nhiem_vu';
import { formatDate, getStatusColor, tinhThoiGianConLai } from '../utils/helpers';
import ThemNhiemVuModal from './them_nhiem_vu';
import XacNhanXoaModal from './xac_nhan_xoa_modal';

const BangNhiemVu = ({ duAnId }) => {
  const navigate = useNavigate();
  const {
    danhSachNhiemVu,
    layDanhSachNhiemVu,
    xoaNhiemVu
  } = useNhiemVu();

  const [selectedNhiemVu, setSelectedNhiemVu] = useState(null);
  const [filters, setFilters] = useState({
    trangThai: 'all',
    nguoiPhuTrach: 'all',
    search: ''
  });

  const themNhiemVuModal = useDisclosure();
  const xoaNhiemVuModal = useDisclosure();

  useEffect(() => {
    if (duAnId) {
      layDanhSachNhiemVu(duAnId);
    }
  }, [duAnId, layDanhSachNhiemVu]);

  const handleXoaNhiemVu = async () => {
    if (selectedNhiemVu) {
      await xoaNhiemVu(selectedNhiemVu.id);
      xoaNhiemVuModal.onClose();
      setSelectedNhiemVu(null);
    }
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredNhiemVu = danhSachNhiemVu.filter(nhiemVu => {
    const matchTrangThai = filters.trangThai === 'all' || 
      nhiemVu.trangThai === filters.trangThai;
    const matchNguoiPhuTrach = filters.nguoiPhuTrach === 'all' || 
      nhiemVu.nguoiPhuTrach === filters.nguoiPhuTrach;
    const matchSearch = !filters.search || 
      nhiemVu.tenNhiemVu.toLowerCase().includes(filters.search.toLowerCase()) ||
      nhiemVu.moTa.toLowerCase().includes(filters.search.toLowerCase());

    return matchTrangThai && matchNguoiPhuTrach && matchSearch;
  });

  const nguoiPhuTrachList = Array.from(
    new Set(danhSachNhiemVu.map(nv => nv.nguoiPhuTrach))
  );

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
              <option value="MỚI">Mới</option>
              <option value="ĐANG_THỰC_HIỆN">Đang thực hiện</option>
              <option value="HOÀN_THÀNH">Hoàn thành</option>
            </Select>
            <Select
              name="nguoiPhuTrach"
              value={filters.nguoiPhuTrach}
              onChange={handleFilter}
              w="200px"
            >
              <option value="all">Tất cả người phụ trách</option>
              {nguoiPhuTrachList.map(nguoi => (
                <option key={nguoi} value={nguoi}>
                  {nguoi}
                </option>
              ))}
            </Select>
            <Box position="relative">
              <Input
                name="search"
                value={filters.search}
                onChange={handleFilter}
                placeholder="Tìm kiếm nhiệm vụ..."
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
            onClick={() => {
              setSelectedNhiemVu(null);
              themNhiemVuModal.onOpen();
            }}
          >
            Thêm nhiệm vụ
          </Button>
        </Flex>

        {/* Bảng nhiệm vụ */}
        <Box overflowX="auto" w="full">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tên nhiệm vụ</Th>
                <Th>Người phụ trách</Th>
                <Th>Trạng thái</Th>
                <Th>Tiến độ</Th>
                <Th>Thời hạn</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredNhiemVu.map(nhiemVu => (
                <Tr key={nhiemVu.id}>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{nhiemVu.tenNhiemVu}</Text>
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {nhiemVu.moTa}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>{nhiemVu.nguoiPhuTrach}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(nhiemVu.trangThai)}>
                      {nhiemVu.trangThai}
                    </Badge>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Progress
                        value={nhiemVu.tienDo}
                        size="sm"
                        width="100%"
                        colorScheme={nhiemVu.tienDo === 100 ? 'green' : 'blue'}
                      />
                      <Text fontSize="sm">{nhiemVu.tienDo}%</Text>
                    </VStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Text>{formatDate(nhiemVu.deadline)}</Text>
                      <Text fontSize="sm" color={
                        tinhThoiGianConLai(nhiemVu.deadline) === 'Đã quá hạn' 
                          ? 'red.500' 
                          : 'gray.500'
                      }>
                        {tinhThoiGianConLai(nhiemVu.deadline)}
                      </Text>
                    </VStack>
                  </Td>
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
                          onClick={() => navigate(`/nhiem-vu/${nhiemVu.id}`)}
                        >
                          Xem chi tiết
                        </MenuItem>
                        <MenuItem
                          icon={<EditIcon />}
                          onClick={() => {
                            setSelectedNhiemVu(nhiemVu);
                            themNhiemVuModal.onOpen();
                          }}
                        >
                          Chỉnh sửa
                        </MenuItem>
                        <MenuItem
                          icon={<DeleteIcon />}
                          color="red.500"
                          onClick={() => {
                            setSelectedNhiemVu(nhiemVu);
                            xoaNhiemVuModal.onOpen();
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
      <ThemNhiemVuModal
        isOpen={themNhiemVuModal.isOpen}
        onClose={() => {
          themNhiemVuModal.onClose();
          setSelectedNhiemVu(null);
        }}
        duAnId={duAnId}
        nhiemVuHienTai={selectedNhiemVu}
      />

      <XacNhanXoaModal
        isOpen={xoaNhiemVuModal.isOpen}
        onClose={() => {
          xoaNhiemVuModal.onClose();
          setSelectedNhiemVu(null);
        }}
        title="Xóa nhiệm vụ"
        message={`Bạn có chắc chắn muốn xóa nhiệm vụ "${selectedNhiemVu?.tenNhiemVu}" không?`}
        onConfirm={handleXoaNhiemVu}
      />
    </Box>
  );
};

export default BangNhiemVu;
