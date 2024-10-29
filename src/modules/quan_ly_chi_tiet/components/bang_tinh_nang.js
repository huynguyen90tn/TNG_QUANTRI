import React, { useEffect, useState, useCallback } from 'react';
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
  Flex,
  Tag
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
import { useTinhNang } from '../hooks/use_tinh_nang';
import { LOAI_KIEM_THU } from '../constants/loai_kiem_thu';
import { getStatusColor } from '../utils/helpers';
import ThemTinhNangModal from './them_tinh_nang_modal';
import XacNhanXoaModal from './xac_nhan_xoa_modal';

const TRANG_THAI_PHAN_HE = {
  frontend: ['Mới', 'Đang thực hiện', 'Hoàn thành'],
  backend: ['Mới', 'Đang thực hiện', 'Hoàn thành'],
  kiemThu: ['Mới', 'Đang thực hiện', 'Hoàn thành']
};

const INITIAL_FILTERS = {
  phanHe: 'all',
  trangThai: 'all',
  nguoiPhuTrach: 'all',
  search: ''
};

const BangTinhNang = ({ nhiemVuId }) => {
  const navigate = useNavigate();
  const {
    danhSachTinhNang,
    layDanhSachTinhNang,
    xoaTinhNang
  } = useTinhNang();

  const [selectedTinhNang, setSelectedTinhNang] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const themTinhNangModal = useDisclosure();
  const xoaTinhNangModal = useDisclosure();

  useEffect(() => {
    if (nhiemVuId) {
      layDanhSachTinhNang(nhiemVuId);
    }
  }, [nhiemVuId, layDanhSachTinhNang]);

  const handleXoaTinhNang = useCallback(async () => {
    if (selectedTinhNang) {
      await xoaTinhNang(selectedTinhNang.id);
      xoaTinhNangModal.onClose();
      setSelectedTinhNang(null);
    }
  }, [selectedTinhNang, xoaTinhNang, xoaTinhNangModal]);

  const handleFilter = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleEditClick = useCallback((tinhNang) => {
    setSelectedTinhNang(tinhNang);
    themTinhNangModal.onOpen();
  }, [themTinhNangModal]);

  const handleDeleteClick = useCallback((tinhNang) => {
    setSelectedTinhNang(tinhNang);
    xoaTinhNangModal.onOpen();
  }, [xoaTinhNangModal]);

  const getFilteredTinhNang = useCallback(() => {
    return danhSachTinhNang.filter(tinhNang => {
      let matchPhanHe = true;
      if (filters.phanHe !== 'all') {
        matchPhanHe = tinhNang[filters.phanHe]?.trangThai !== 'Hoàn thành';
      }

      let matchTrangThai = true;
      if (filters.trangThai !== 'all') {
        if (filters.phanHe === 'all') {
          matchTrangThai = ['frontend', 'backend', 'kiemThu'].some(phanHe =>
            tinhNang[phanHe]?.trangThai === filters.trangThai
          );
        } else {
          matchTrangThai = tinhNang[filters.phanHe]?.trangThai === filters.trangThai;
        }
      }

      let matchNguoiPhuTrach = true;
      if (filters.nguoiPhuTrach !== 'all') {
        if (filters.phanHe === 'all') {
          matchNguoiPhuTrach = ['frontend', 'backend', 'kiemThu'].some(phanHe =>
            tinhNang[phanHe]?.nguoiPhuTrach === filters.nguoiPhuTrach ||
            tinhNang[phanHe]?.nguoiKiemThu === filters.nguoiPhuTrach
          );
        } else {
          matchNguoiPhuTrach =
            tinhNang[filters.phanHe]?.nguoiPhuTrach === filters.nguoiPhuTrach ||
            tinhNang[filters.phanHe]?.nguoiKiemThu === filters.nguoiPhuTrach;
        }
      }

      const searchTerm = filters.search.toLowerCase();
      const matchSearch = !searchTerm ||
        tinhNang.tenTinhNang.toLowerCase().includes(searchTerm) ||
        tinhNang.moTa.toLowerCase().includes(searchTerm);

      return matchPhanHe && matchTrangThai && matchNguoiPhuTrach && matchSearch;
    });
  }, [danhSachTinhNang, filters]);

  const nguoiPhuTrachList = Array.from(
    new Set(
      danhSachTinhNang.flatMap(tinhNang => [
        tinhNang.frontend?.nguoiPhuTrach,
        tinhNang.backend?.nguoiPhuTrach,
        tinhNang.kiemThu?.nguoiPhuTrach,
        tinhNang.kiemThu?.nguoiKiemThu
      ]).filter(Boolean)
    )
  );

  return (
    <Box>
      <VStack spacing={4} w="full">
        {/* Thanh công cụ */}
        <Flex justifyContent="space-between" w="full" mb={4}>
          <HStack spacing={4}>
            <Select
              name="phanHe"
              value={filters.phanHe}
              onChange={handleFilter}
              w="200px"
              aria-label="Chọn phân hệ"
            >
              <option value="all">Tất cả phân hệ</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="kiemThu">Kiểm thử</option>
            </Select>

            <Select
              name="trangThai"
              value={filters.trangThai}
              onChange={handleFilter}
              w="200px"
              aria-label="Chọn trạng thái"
            >
              <option value="all">Tất cả trạng thái</option>
              {filters.phanHe !== 'all' &&
                TRANG_THAI_PHAN_HE[filters.phanHe].map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
            </Select>

            <Select
              name="nguoiPhuTrach"
              value={filters.nguoiPhuTrach}
              onChange={handleFilter}
              w="200px"
              aria-label="Chọn người phụ trách"
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
                placeholder="Tìm kiếm tính năng..."
                paddingLeft="40px"
                w="300px"
                aria-label="Tìm kiếm tính năng"
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
              setSelectedTinhNang(null);
              themTinhNangModal.onOpen();
            }}
          >
            Thêm tính năng
          </Button>
        </Flex>

        {/* Bảng tính năng */}
        <Box overflowX="auto" w="full">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Tính năng</Th>
                <Th>Frontend</Th>
                <Th>Backend</Th>
                <Th>Kiểm thử</Th>
                <Th>Tiến độ chung</Th>
                <Th>Thao tác</Th>
              </Tr>
            </Thead>
            <Tbody>
              {getFilteredTinhNang().map(tinhNang => {
                const tienDoChung = Math.round(
                  (tinhNang.frontend.tienDo + tinhNang.backend.tienDo + tinhNang.kiemThu.tienDo) / 3
                );

                return (
                  <Tr key={tinhNang.id}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{tinhNang.tenTinhNang}</Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {tinhNang.moTa}
                        </Text>
                      </VStack>
                    </Td>

                    <Td>
                      <VStack align="start" spacing={2}>
                        <Badge colorScheme={getStatusColor(tinhNang.frontend.trangThai)}>
                          {tinhNang.frontend.trangThai}
                        </Badge>
                        <HStack spacing={2}>
                          <Progress
                            value={tinhNang.frontend.tienDo}
                            size="sm"
                            width="100px"
                            colorScheme="blue"
                          />
                          <Text fontSize="sm">{tinhNang.frontend.tienDo}%</Text>
                        </HStack>
                        <Text fontSize="xs">{tinhNang.frontend.nguoiPhuTrach}</Text>
                      </VStack>
                    </Td>

                    <Td>
                      <VStack align="start" spacing={2}>
                        <Badge colorScheme={getStatusColor(tinhNang.backend.trangThai)}>
                          {tinhNang.backend.trangThai}
                        </Badge>
                        <HStack spacing={2}>
                          <Progress
                            value={tinhNang.backend.tienDo}
                            size="sm"
                            width="100px"
                            colorScheme="green"
                          />
                          <Text fontSize="sm">{tinhNang.backend.tienDo}%</Text>
                        </HStack>
                        <Text fontSize="xs">{tinhNang.backend.nguoiPhuTrach}</Text>
                        {tinhNang.backend.apiEndpoints?.length > 0 && (
                          <HStack spacing={1}>
                            {tinhNang.backend.apiEndpoints.map((api, index) => (
                              <Tag key={`${api}-${index}`} size="sm" colorScheme="gray">
                                {api}
                              </Tag>
                            ))}
                          </HStack>
                        )}
                      </VStack>
                    </Td>

                    <Td>
                      <VStack align="start" spacing={2}>
                        <Badge colorScheme={getStatusColor(tinhNang.kiemThu.trangThai)}>
                          {tinhNang.kiemThu.trangThai}
                        </Badge>
                        <HStack spacing={2}>
                          <Progress
                            value={tinhNang.kiemThu.tienDo}
                            size="sm"
                            width="100px"
                            colorScheme="purple"
                          />
                          <Text fontSize="sm">{tinhNang.kiemThu.tienDo}%</Text>
                        </HStack>
                        <Text fontSize="xs">
                          {tinhNang.kiemThu.nguoiPhuTrach || tinhNang.kiemThu.nguoiKiemThu}
                        </Text>
                        {tinhNang.kiemThu.loaiTest?.length > 0 && (
                          <HStack spacing={1}>
                            {tinhNang.kiemThu.loaiTest.map(loai => (
                              <Tag key={loai} size="sm" colorScheme="purple">
                                {LOAI_KIEM_THU[loai]}
                              </Tag>
                            ))}
                          </HStack>
                        )}
                      </VStack>
                    </Td>

                    <Td>
                      <VStack align="start" spacing={2}>
                        <Progress
                          value={tienDoChung}
                          size="sm"
                          width="100px"
                          colorScheme={tienDoChung === 100 ? 'green' : 'blue'}
                        />
                        <Text fontSize="sm">{tienDoChung}%</Text>
                      </VStack>
                    </Td>

                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<ChevronDownIcon />}
                          variant="outline"
                          size="sm"
                          aria-label="Mở menu thao tác"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<ViewIcon />}
                            onClick={() => navigate(`/tinh-nang/${tinhNang.id}`)}
                          >
                            Xem chi tiết
                          </MenuItem>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => handleEditClick(tinhNang)}
                          >
                            Chỉnh sửa
                          </MenuItem>
                          <MenuItem
                            icon={<DeleteIcon />}color="red.500"
                            onClick={() => handleDeleteClick(tinhNang)}
                          >
                            Xóa
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      {/* Modals */}
      <ThemTinhNangModal
        isOpen={themTinhNangModal.isOpen}
        onClose={() => {
          themTinhNangModal.onClose();
          setSelectedTinhNang(null);
        }}
        nhiemVuId={nhiemVuId}
        tinhNangHienTai={selectedTinhNang}
        phanHeActive={filters.phanHe}
      />

      <XacNhanXoaModal
        isOpen={xoaTinhNangModal.isOpen}
        onClose={() => {
          xoaTinhNangModal.onClose();
          setSelectedTinhNang(null);
        }}
        title="Xóa tính năng"
        message={`Bạn có chắc chắn muốn xóa tính năng "${selectedTinhNang?.tenTinhNang}" không?`}
        onConfirm={handleXoaTinhNang}
      />
    </Box>
  );
};

export default BangTinhNang;