// File: src/modules/quan_ly_tai_san/components/danh_sach_tai_san.js
// Link tham khảo: https://chakra-ui.com/docs
// Nhánh: main

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
  HStack,
  VStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Select,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Spinner,
  Tooltip,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  SearchIcon,
  EditIcon,
  DeleteIcon,
  RepeatIcon,
  WarningIcon,
  CheckIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import {
  FaBoxOpen,
  FaTools,
  FaClipboardList,
} from 'react-icons/fa';
import {
  LOAI_TAI_SAN,
  TEN_LOAI_TAI_SAN,
  NHOM_TAI_SAN,
  TEN_NHOM_TAI_SAN,
} from '../constants/loai_tai_san';
import {
  TRANG_THAI_TAI_SAN,
  TEN_TRANG_THAI,
  MAU_TRANG_THAI,
} from '../constants/trang_thai_tai_san';
import { useAuth } from '../../../hooks/useAuth';
import {
  layDanhSachTaiSan,
  xoaTaiSan,
  layChiTietTaiSan,
} from '../services/tai_san_service';
import ThemTaiSan from './them_tai_san';
import CapPhatTaiSan from './cap_phat_tai_san';
import BaoTriTaiSan from './bao_tri_tai_san';
import KiemKeTaiSan from './kiem_ke_tai_san';
import ChiTietTaiSan from './chi_tiet_tai_san';

const ITEMS_PER_PAGE = 20;

const DanhSachTaiSan = () => {
  const { user } = useAuth();
  const [danhSachTaiSan, setDanhSachTaiSan] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    isOpen: isOpenThem,
    onOpen: onOpenThem,
    onClose: onCloseThem,
  } = useDisclosure();
  const {
    isOpen: isOpenCapPhat,
    onOpen: onOpenCapPhat,
    onClose: onCloseCapPhat,
  } = useDisclosure();
  const {
    isOpen: isOpenBaoTri,
    onOpen: onOpenBaoTri,
    onClose: onCloseBaoTri,
  } = useDisclosure();
  const {
    isOpen: isOpenKiemKe,
    onOpen: onOpenKiemKe,
    onClose: onCloseKiemKe,
  } = useDisclosure();
  const {
    isOpen: isOpenXoa,
    onOpen: onOpenXoa,
    onClose: onCloseXoa,
  } = useDisclosure();
  const {
    isOpen: isOpenChiTiet,
    onOpen: onOpenChiTiet,
    onClose: onCloseChiTiet,
  } = useDisclosure();

  const [selectedTaiSan, setSelectedTaiSan] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const isAdmin = user?.role === 'admin-tong' || user?.role === 'admin-con';
  const isAdminTong = user?.role === 'admin-tong';
  const isKyThuat = user?.role === 'ky_thuat';

  const loadDanhSachTaiSan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await layDanhSachTaiSan(filters, pagination.page);
      setDanhSachTaiSan(result.data);
      setPagination({
        page: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
      });
    } catch (err) {
      console.error('Lỗi khi lấy danh sách tài sản:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page]);

  useEffect(() => {
    loadDanhSachTaiSan();
  }, [loadDanhSachTaiSan]);

  const handleSearch = useCallback(
    (searchText) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      setSearchTimeout(
        setTimeout(() => {
          setFilters({ ...filters, searchText });
        }, 500),
      );
    },
    [filters, searchTimeout],
  );

  const handleFilterChange = useCallback(
    (field, value) => {
      setFilters({ ...filters, [field]: value });
    },
    [filters],
  );

  const handleXoaTaiSan = useCallback(async () => {
    if (!selectedTaiSan) return;
    try {
      await xoaTaiSan(selectedTaiSan.id);
      onCloseXoa();
      setSelectedTaiSan(null);
      loadDanhSachTaiSan();
    } catch (err) {
      console.error('Lỗi khi xóa tài sản:', err);
    }
  }, [selectedTaiSan, onCloseXoa, loadDanhSachTaiSan]);

  const handlePageChange = useCallback(
    (newPage) => {
      setPagination({ ...pagination, page: newPage });
    },
    [pagination],
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="200px"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={6}>
        <WarningIcon w={10} h={10} color="red.500" mb={4} />
        <Text color="red.500">{error}</Text>
        <Button
          leftIcon={<RepeatIcon />}
          colorScheme="blue"
          variant="outline"
          mt={4}
          onClick={loadDanhSachTaiSan}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Filters */}
        <Box
          bg="whiteAlpha.50"
          borderRadius="lg"
          p={4}
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={{ base: 12, md: 3 }}>
              <FormControl>
                <FormLabel>Tìm kiếm</FormLabel>
                <Input
                  placeholder="Tìm theo tên, mã tài sản..."
                  onChange={(e) => handleSearch(e.target.value)}
                  bg="whiteAlpha.100"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  _focus={{ bg: 'whiteAlpha.200' }}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 3 }}>
              <FormControl>
                <FormLabel>Loại tài sản</FormLabel>
                <Select
                  value={filters.loaiTaiSan || ''}
                  onChange={(e) =>
                    handleFilterChange('loaiTaiSan', e.target.value)
                  }
                  bg="whiteAlpha.100"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <option value="">Tất cả</option>
                  {Object.entries(TEN_LOAI_TAI_SAN).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 3 }}>
              <FormControl>
                <FormLabel>Nhóm tài sản</FormLabel>
                <Select
                  value={filters.nhomTaiSan || ''}
                  onChange={(e) =>
                    handleFilterChange('nhomTaiSan', e.target.value)
                  }
                  bg="whiteAlpha.100"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <option value="">Tất cả</option>
                  {Object.entries(TEN_NHOM_TAI_SAN).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 12, md: 3 }}>
              <FormControl>
                <FormLabel>Trạng thái</FormLabel>
                <Select
                  value={filters.trangThai || ''}
                  onChange={(e) =>
                    handleFilterChange('trangThai', e.target.value)
                  }
                  bg="whiteAlpha.100"
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <option value="">Tất cả</option>
                  {Object.entries(TEN_TRANG_THAI).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </Grid>

          <Flex mt={4}>
            <Spacer />
            <Button
              leftIcon={<RepeatIcon />}
              variant="outline"
              onClick={() => setFilters({})}
              size="sm"
            >
              Xóa bộ lọc
            </Button>
          </Flex>
        </Box>

        {/* Table */}
        <Box
          overflowX="auto"
          bg="whiteAlpha.50"
          borderRadius="lg"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Mã tài sản</Th>
                <Th>Tên tài sản</Th>
                <Th>Loại</Th>
                <Th>Trạng thái</Th>
                <Th>Người sử dụng</Th>
                <Th>Phòng ban</Th>
                <Th isNumeric>Giá trị</Th>
                <Th>Ngày mua</Th>
                {(isAdmin || isKyThuat) && (
                  <Th textAlign="center">Thao tác</Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {danhSachTaiSan.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.ma}</Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{item.ten}</Text>
                      {item.moTa && (
                        <Text
                          fontSize="sm"
                          color="whiteAlpha.700"
                          noOfLines={2}
                        >
                          {item.moTa}
                        </Text>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <Badge>{TEN_LOAI_TAI_SAN[item.loaiTaiSan]}</Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={MAU_TRANG_THAI[item.trangThai]}
                      variant="solid"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {TEN_TRANG_THAI[item.trangThai]}
                    </Badge>
                  </Td>
                  <Td>{item.nguoiSuDung || '-'}</Td>
                  <Td>{item.phongBan || '-'}</Td>
                  <Td isNumeric>{formatCurrency(item.giaTriMua)}</Td>
                  <Td>{formatDate(item.ngayMua)}</Td>
                  {(isAdmin || isKyThuat) && (
                    <Td>
                      <Menu>
                        <MenuButton
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          size="sm"
                          variant="ghost"
                        >
                          Thao tác
                        </MenuButton>
                        <MenuList bg="gray.800">
                          <MenuItem
                            icon={<ViewIcon />}
                            onClick={async () => {
                              try {
                                const data = await layChiTietTaiSan(item.id);
                                setSelectedTaiSan(data);
                                onOpenChiTiet();
                              } catch (err) {
                                console.error(
                                  'Lỗi khi lấy chi tiết tài sản:',
                                  err,
                                );
                              }
                            }}
                          >
                            Xem chi tiết
                          </MenuItem>

                          {isAdmin && (
                            <MenuItem
                              icon={<EditIcon />}
                              onClick={() => {
                                setSelectedTaiSan(item);
                                onOpenThem();
                              }}
                            >
                              Chỉnh sửa
                            </MenuItem>
                          )}

                          {isAdmin &&
                            item.trangThai === TRANG_THAI_TAI_SAN.CHO_CAP_PHAT && (
                              <MenuItem
                                icon={<FaBoxOpen />}
                                onClick={() => {
                                  setSelectedTaiSan(item);
                                  onOpenCapPhat();
                                }}
                              >
                                Cấp phát
                              </MenuItem>
                            )}

                          {(isAdminTong || isKyThuat) && (
                            <MenuItem
                              icon={<FaTools />}
                              onClick={() => {
                                setSelectedTaiSan(item);
                                onOpenBaoTri();
                              }}
                            >
                              Bảo trì
                            </MenuItem>
                          )}

                          {isAdmin && (
                            <MenuItem
                              icon={<FaClipboardList />}
                              onClick={() => {
                                setSelectedTaiSan(item);
                                onOpenKiemKe();
                              }}
                            >
                              Kiểm kê
                            </MenuItem>
                          )}

                          {isAdminTong &&
                            item.trangThai !==
                              TRANG_THAI_TAI_SAN.DA_CAP_PHAT && (
                              <MenuItem
                                icon={<DeleteIcon />}
                                color="red.300"
                                onClick={() => {
                                  setSelectedTaiSan(item);
                                  onOpenXoa();
                                }}
                              >
                                Xóa
                              </MenuItem>
                            )}
                        </MenuList>
                      </Menu>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Flex justify="center" mt={4}>
            <HStack>
              <Button
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                isDisabled={pagination.page === 1}
              >
                Trước
              </Button>

              {[...Array(pagination.totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  variant={pagination.page === i + 1 ? 'solid' : 'ghost'}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                isDisabled={pagination.page === pagination.totalPages}
              >
                Sau
              </Button>
            </HStack>
          </Flex>
        )}

        {/* Chi tiết Tài Sản Modal */}
        <ChiTietTaiSan
          isOpen={isOpenChiTiet}
          onClose={() => {
            onCloseChiTiet();
            setSelectedTaiSan(null);
          }}
          taiSan={selectedTaiSan}
        />

        {/* Thêm/Sửa Modal */}
        <Modal
          isOpen={isOpenThem}
          onClose={() => {
            onCloseThem();
            setSelectedTaiSan(null);
          }}
          size="xl"
          scrollBehavior="inside"
        >
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>
              {selectedTaiSan ? 'Chỉnh sửa tài sản' : 'Thêm tài sản mới'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <ThemTaiSan
                data={selectedTaiSan}
                onSuccess={() => {
                  onCloseThem();
                  setSelectedTaiSan(null);
                  loadDanhSachTaiSan();
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Cấp phát Modal */}
        <Modal
          isOpen={isOpenCapPhat}
          onClose={() => {
            onCloseCapPhat();
            setSelectedTaiSan(null);
          }}
          size="lg"
        >
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>Cấp phát tài sản</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <CapPhatTaiSan
                taiSan={selectedTaiSan}
                onSuccess={() => {
                  onCloseCapPhat();
                  setSelectedTaiSan(null);
                  loadDanhSachTaiSan();
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Bảo trì Modal */}
        <Modal
          isOpen={isOpenBaoTri}
          onClose={() => {
            onCloseBaoTri();
            setSelectedTaiSan(null);
          }}
          size="xl"
          scrollBehavior="inside"
        >
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>Bảo trì tài sản</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <BaoTriTaiSan
                taiSan={selectedTaiSan}
                onSuccess={() => {
                  onCloseBaoTri();
                  setSelectedTaiSan(null);
                  loadDanhSachTaiSan();
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Kiểm kê Modal */}
        <Modal
          isOpen={isOpenKiemKe}
          onClose={() => {
            onCloseKiemKe();
            setSelectedTaiSan(null);
          }}
          size="lg"
        >
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>Kiểm kê tài sản</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <KiemKeTaiSan
                taiSan={selectedTaiSan}
                onSuccess={() => {
                  onCloseKiemKe();
                  setSelectedTaiSan(null);
                  loadDanhSachTaiSan();
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Xác nhận xóa Modal */}
        <Modal
          isOpen={isOpenXoa}
          onClose={() => {
            onCloseXoa();
            setSelectedTaiSan(null);
          }}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent bg="gray.800">
            <ModalHeader>Xác nhận xóa tài sản</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Text>
                Bạn có chắc chắn muốn xóa tài sản{' '}
                <Text as="span" fontWeight="bold" color="red.300">
                  {selectedTaiSan?.ten}
                </Text>
                {' '}không?
              </Text>
              <Text mt={2} color="red.300" fontSize="sm">
                Lưu ý: Hành động này không thể hoàn tác!
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={handleXoaTaiSan}
                leftIcon={<DeleteIcon />}
              >
                Xác nhận xóa
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onCloseXoa();
                  setSelectedTaiSan(null);
                }}
              >
                Hủy
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default DanhSachTaiSan;
