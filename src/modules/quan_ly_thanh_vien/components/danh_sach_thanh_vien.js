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
  useDisclosure,
  Heading,
  HStack,
  useToast,
  Avatar,
  useColorModeValue,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  Card,
  CardBody,
  Text,
  IconButton,
  Tooltip,
  Flex,
  Tag,
  TagLeftIcon,
  TagLabel,
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  EditIcon, 
  DeleteIcon,
  CheckIcon,
  TimeIcon,
  CloseIcon,
  CalendarIcon
} from '@chakra-ui/icons';
import { 
  FaBuilding, 
  FaUserGraduate,
  FaUserTie,
  FaUserSecret,
  FaBirthdayCake
} from 'react-icons/fa';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';

import { useThanhVien } from '../hooks/use_thanh_vien';
import { 
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  PHONG_BAN_LABEL,
  CHUC_VU_LABEL,
  CAP_BAC,
  CAP_BAC_LABEL
} from '../constants/trang_thai_thanh_vien';
import ThemThanhVien from './them_thanh_vien';
import BoLocThanhVien from './bo_loc_thanh_vien';
import ChiTietThanhVien from './chi_tiet_thanh_vien';
import { useAuth } from '../../../hooks/useAuth';

const MotionBox = motion(Box);

const DanhSachThanhVien = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [selectedMember, setSelectedMember] = React.useState(null);

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch {
      return 'Định dạng không hợp lệ';
    }
  };
  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      [TRANG_THAI_THANH_VIEN.DANG_CONG_TAC]: {
        color: 'green',
        icon: CheckIcon,
      },
      [TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC]: {
        color: 'yellow',
        icon: TimeIcon,
      },
      [TRANG_THAI_THANH_VIEN.NGHI]: {
        color: 'red',
        icon: CloseIcon,
      },
    };

    const config = statusConfig[status];

    return (
      <Badge
        display="flex"
        alignItems="center"
        px={3}
        py={1}
        borderRadius="full"
        colorScheme={config.color}
        variant="subtle"
      >
        <Box as={config.icon} mr={2} />
        {TRANG_THAI_LABEL[status]}
      </Badge>
    );
  };

  // Cấp bậc Tag Component
  const CapBacTag = ({ capBac }) => {
    const levelConfig = {
      [CAP_BAC.THU_SINH]: {
        icon: FaUserGraduate,
        color: 'blue'
      },
      [CAP_BAC.CHINH_THUC]: {
        icon: FaUserTie,
        color: 'purple'
      },
      [CAP_BAC.TRUONG_THANH]: {
        icon: FaUserSecret,
        color: 'orange'
      }
    };

    const config = levelConfig[capBac] || levelConfig[CAP_BAC.THU_SINH];

    return (
      <Tag colorScheme={config.color} borderRadius="full">
        <TagLeftIcon as={config.icon} />
        <TagLabel>{CAP_BAC_LABEL[capBac]}</TagLabel>
      </Tag>
    );
  };

  if (dangTai) {
    return (
      <Box p={4}>
        <Card bg={cardBg}>
          <CardBody>
            <Text>Đang tải dữ liệu...</Text>
          </CardBody>
        </Card>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card bg={cardBg} boxShadow="sm">
          <CardBody p={0}>
            {/* Header */}
            <Box bg={headerBg} p={4} borderBottomWidth="1px" borderColor={borderColor}>
              <Flex justify="space-between" align="center" mb={4}>
                <HStack>
                  <Box as={FaBuilding} color="blue.500" fontSize="xl" />
                  <Heading size="lg" color={textColor}>Danh sách thành viên</Heading>
                </HStack>
              </Flex>

              {/* Bộ lọc */}
              <BoLocThanhVien />
            </Box>

            {/* Table */}
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg={headerBg}>
                  <Tr>
                    <Th color={textColor}>THÔNG TIN</Th>
                    <Th color={textColor}>PHÒNG BAN</Th>
                    <Th color={textColor}>CHỨC VỤ</Th>
                    <Th color={textColor}>CẤP BẬC</Th>
                    <Th color={textColor}>NGÀY VÀO</Th>
                    <Th color={textColor}>NGÀY SINH</Th>
                    <Th color={textColor}>TRẠNG THÁI</Th>
                    <Th color={textColor} textAlign="right">THAO TÁC</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {danhSachLoc.map((thanhVien) => (
                    <Tr 
                      key={thanhVien.id}
                      _hover={{ bg: hoverBg }}
                      transition="all 0.2s"
                    >
                      <Td>
                        <HStack spacing={4}>
                          <Avatar
                            size="md"
                            name={thanhVien.hoTen}
                            src={thanhVien.anhDaiDien}
                          />
                          <Box>
                            <Text fontWeight="bold" color={textColor}>{thanhVien.hoTen}</Text>
                            <Text fontSize="sm" color={mutedColor}>{thanhVien.email}</Text>
                            <Text fontSize="sm" color={mutedColor}>Mã TV: {thanhVien.memberCode}</Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td>{PHONG_BAN_LABEL[thanhVien.phongBan]}</Td>
                      <Td>{CHUC_VU_LABEL[thanhVien.chucVu]}</Td>
                      <Td>
                        <CapBacTag capBac={thanhVien.capBac} />
                      </Td>
                      <Td>
                        <HStack>
                          <CalendarIcon color="blue.500" />
                          <Text>{formatDate(thanhVien.ngayVao)}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack>
                          <Box as={FaBirthdayCake} color="pink.500" />
                          <Text>{formatDate(thanhVien.dateOfBirth)}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <StatusBadge status={thanhVien.trangThai} />
                      </Td>
                      <Td>
                        <HStack spacing={2} justify="flex-end">
                          <Tooltip label="Xem chi tiết">
                            <IconButton
                              icon={<ViewIcon />}
                              colorScheme="blue"
                              variant="ghost"
                              onClick={() => handleXemChiTiet(thanhVien)}
                              aria-label="Xem chi tiết"
                            />
                          </Tooltip>
                          
                          {(user?.role === 'admin-tong' || user?.role === 'admin-con') && (
                            <>
                              <Tooltip label="Đang công tác">
                                <IconButton
                                  icon={<CheckIcon />}
                                  colorScheme="green"
                                  variant="ghost"
                                  onClick={() => handleCapNhatTrangThai(thanhVien.id, TRANG_THAI_THANH_VIEN.DANG_CONG_TAC)}
                                  isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DANG_CONG_TAC}
                                  aria-label="Đang công tác"
                                />
                              </Tooltip>
                              <Tooltip label="Dừng công tác">
                                <IconButton
                                  icon={<TimeIcon />}
                                  colorScheme="yellow"
                                  variant="ghost"
                                  onClick={() => handleCapNhatTrangThai(thanhVien.id, TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC)}
                                  isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC}
                                  aria-label="Dừng công tác"
                                />
                              </Tooltip>
                              <Tooltip label="Nghỉ">
                                <IconButton
                                  icon={<CloseIcon />}
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => handleCapNhatTrangThai(thanhVien.id, TRANG_THAI_THANH_VIEN.NGHI)}
                                  isDisabled={thanhVien.trangThai === TRANG_THAI_THANH_VIEN.NGHI}
                                  aria-label="Nghỉ"
                                />
                              </Tooltip>
                            </>
                          )}

                          {user?.role === 'admin-tong' && (
                            <Tooltip label="Xóa">
                              <IconButton
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleXoa(thanhVien.id)}
                                aria-label="Xóa"
                              />
                            </Tooltip>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </MotionBox>

      {/* Modal Chi tiết */}
      <ChiTietThanhVien
        isOpen={isDetailOpen}
        onClose={onDetailClose}
        thanhVien={selectedMember}
        onCapNhatTrangThai={handleCapNhatTrangThai}
        onCapNhatThongTin={capNhatThongTin}
      />
    </Box>
  );
};

DanhSachThanhVien.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
};

export default DanhSachThanhVien;