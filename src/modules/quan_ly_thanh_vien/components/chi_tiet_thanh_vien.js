// src/modules/quan_ly_thanh_vien/components/chi_tiet_thanh_vien.js

import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Select,
  Input,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  SimpleGrid,
  Box,
  Heading,
  Divider,
  Flex,
  Icon,
  Tooltip,
  useColorModeValue,
  Image,
  AspectRatio,
  Container,
  IconButton,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaFacebook,
  FaFileAlt,
  FaGraduationCap,
  FaMotorcycle,
  FaTelegram,
  FaCommentDots,
  FaBuilding,
  FaUserTie,
  FaCalendarAlt,
  FaHistory,
  FaEdit,
  FaSave,
  FaTimes,
  FaInfoCircle,
} from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { thanhVienService } from '../services/thanh_vien_service';
import {
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  CAP_BAC,
  CAP_BAC_LABEL,
  CAP_BAC_OPTIONS,
  PHONG_BAN_LABEL,
  PHONG_BAN_OPTIONS,
  CHUC_VU,
  CHUC_VU_LABEL,
} from '../constants/trang_thai_thanh_vien';

const EDIT_HISTORY_TYPE = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  LEVEL_CHANGED: 'LEVEL_CHANGED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  DEPARTMENT_CHANGED: 'DEPARTMENT_CHANGED',
  POSITION_CHANGED: 'POSITION_CHANGED',
};

const EDIT_HISTORY_LABEL = {
  [EDIT_HISTORY_TYPE.CREATED]: 'Tạo mới',
  [EDIT_HISTORY_TYPE.UPDATED]: 'Cập nhật thông tin',
  [EDIT_HISTORY_TYPE.LEVEL_CHANGED]: 'Thay đổi cấp bậc',
  [EDIT_HISTORY_TYPE.STATUS_CHANGED]: 'Thay đổi trạng thái',
  [EDIT_HISTORY_TYPE.DEPARTMENT_CHANGED]: 'Thay đổi phòng ban',
  [EDIT_HISTORY_TYPE.POSITION_CHANGED]: 'Thay đổi chức vụ',
};

const formatDate = (date) => {
  if (!date) return 'Chưa cập nhật';

  try {
    if (date?.toDate) {
      date = date.toDate();
    }

    if (typeof date === 'string') {
      date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date)) {
      return 'Chưa cập nhật';
    }

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    return date.toLocaleDateString('vi-VN', options);
  } catch (error) {
    console.error('Lỗi format date:', error);
    return 'Chưa cập nhật';
  }
};

const getEditTypeColor = (type) => {
  switch (type) {
    case EDIT_HISTORY_TYPE.CREATED:
      return 'green';
    case EDIT_HISTORY_TYPE.UPDATED:
      return 'blue';
    case EDIT_HISTORY_TYPE.LEVEL_CHANGED:
      return 'purple';
    case EDIT_HISTORY_TYPE.STATUS_CHANGED:
      return 'orange';
    case EDIT_HISTORY_TYPE.DEPARTMENT_CHANGED:
      return 'cyan';
    case EDIT_HISTORY_TYPE.POSITION_CHANGED:
      return 'pink';
    default:
      return 'gray';
  }
};

// Component ThongTinItem
const ThongTinItem = memo(({ label, value, icon, isEditing, children, isRequired }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      p={3}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      transition="all 0.2s"
      _hover={{ shadow: 'sm' }}
    >
      <HStack spacing={3} alignItems="center">
        <Icon as={icon} color="blue.500" boxSize={5} />
        <VStack alignItems="start" spacing={1} flex={1}>
          <HStack>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              {label}
            </Text>
            {isRequired && (
              <Text color="red.500" fontSize="sm">
                *
              </Text>
            )}
          </HStack>
          {isEditing && children ? (
            children
          ) : (
            <Text fontSize="md" fontWeight="medium">
              {value || 'Chưa cập nhật'}
            </Text>
          )}
        </VStack>
      </HStack>
    </Box>
  );
});

ThongTinItem.displayName = 'ThongTinItem';

ThongTinItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  icon: PropTypes.elementType.isRequired,
  isEditing: PropTypes.bool,
  children: PropTypes.node,
  isRequired: PropTypes.bool,
};

// Các modal phụ
const LichSuChinhSuaModal = memo(({ isOpen, onClose, lichSuChinhSua }) => {
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader bg={headerBg} borderBottomWidth="1px" borderColor={borderColor}>
          <HStack>
            <Icon as={FaHistory} color="blue.500" />
            <Text>Lịch sử chỉnh sửa thông tin</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={4}>
          <Table variant="simple">
            <Thead bg={headerBg}>
              <Tr>
                <Th>Thời gian</Th>
                <Th>Loại thay đổi</Th>
                <Th>Người thực hiện</Th>
                <Th>Thông tin cũ</Th>
                <Th>Thông tin mới</Th>
                <Th>Ghi chú</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lichSuChinhSua.map((item, index) => (
                <Tr key={index}>
                  <Td whiteSpace="nowrap">{formatDate(item.thoiGian)}</Td>
                  <Td>
                    <Badge colorScheme={getEditTypeColor(item.loai)}>
                      {EDIT_HISTORY_LABEL[item.loai]}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack>
                      <Avatar size="xs" name={item.nguoiThucHien} src={item.anhNguoiThucHien} />
                      <Text>{item.nguoiThucHien}</Text>
                    </HStack>
                  </Td>
                  <Td maxW="200px" isTruncated>
                    {item.thongTinCu || '—'}
                  </Td>
                  <Td maxW="200px" isTruncated>
                    {item.thongTinMoi || '—'}
                  </Td>
                  <Td maxW="200px" isTruncated>
                    <Tooltip label={item.ghiChu} placement="top">
                      <Text>{item.ghiChu || '—'}</Text>
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <Button onClick={onClose} leftIcon={<FaTimes />}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

LichSuChinhSuaModal.displayName = 'LichSuChinhSuaModal';

LichSuChinhSuaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lichSuChinhSua: PropTypes.arrayOf(
    PropTypes.shape({
      thoiGian: PropTypes.any.isRequired,
      loai: PropTypes.oneOf(Object.values(EDIT_HISTORY_TYPE)).isRequired,
      nguoiThucHien: PropTypes.string.isRequired,
      anhNguoiThucHien: PropTypes.string,
      thongTinCu: PropTypes.string,
      thongTinMoi: PropTypes.string,
      ghiChu: PropTypes.string,
    })
  ).isRequired,
};

const LichSuCapBacModal = memo(({ isOpen, onClose, danhSachCapBac }) => {
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader bg={headerBg} borderBottomWidth="1px" borderColor={borderColor}>
          <HStack>
            <Icon as={FaUserTie} color="blue.500" />
            <Text>Lịch sử cấp bậc</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={4}>
          <Table variant="simple">
            <Thead bg={headerBg}>
              <Tr>
                <Th>STT</Th>
                <Th>Cấp bậc</Th>
                <Th>Ngày nhận</Th>
                <Th>Người cập nhật</Th>
                <Th>Ghi chú</Th>
              </Tr>
            </Thead>
            <Tbody>
              {danhSachCapBac.map((capBac, index) => (
                <Tr key={index}>
                  <Td isNumeric>{index + 1}</Td>
                  <Td>
                    <HStack>
                      <Icon as={FaUserTie} color="blue.500" />
                      <Text>{CAP_BAC_LABEL[capBac.capBac]}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack>
                      <Icon as={FaCalendarAlt} color="green.500" />
                      <Text>{formatDate(capBac.ngayNhan)}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack>
                      <Avatar size="xs" name={capBac.nguoiCapNhat} src={capBac.anhNguoiCapNhat} />
                      <Text>{capBac.nguoiCapNhat}</Text>
                    </HStack>
                  </Td>
                  <Td maxW="300px">
                    <Tooltip label={capBac.ghiChu} placement="top">
                      <Text isTruncated>{capBac.ghiChu || '—'}</Text>
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <Button onClick={onClose} leftIcon={<FaTimes />}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

LichSuCapBacModal.displayName = 'LichSuCapBacModal';

LichSuCapBacModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  danhSachCapBac: PropTypes.arrayOf(
    PropTypes.shape({
      capBac: PropTypes.string.isRequired,
      ngayNhan: PropTypes.any.isRequired,
      nguoiCapNhat: PropTypes.string.isRequired,
      anhNguoiCapNhat: PropTypes.string,
      ghiChu: PropTypes.string,
    })
  ).isRequired,
};

const ThemCapBacModal = memo(({ isOpen, onClose, onSubmit, capBacData, setCapBacData }) => {
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader bg={headerBg} borderBottomWidth="1px" borderColor={borderColor}>
          <HStack>
            <Icon as={FaUserTie} color="blue.500" />
            <Text>Thêm cấp bậc mới</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={4}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>
                <HStack>
                  <Icon as={FaUserTie} color="blue.500" />
                  <Text>Cấp bậc</Text>
                </HStack>
              </FormLabel>
              <Select
                value={capBacData.capBac}
                onChange={(e) =>
                  setCapBacData((prev) => ({
                    ...prev,
                    capBac: e.target.value,
                  }))
                }
              >
                {CAP_BAC_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>
                <HStack>
                  <Icon as={FaCalendarAlt} color="green.500" />
                  <Text>Ngày nhận cấp</Text>
                </HStack>
              </FormLabel>
              <Input
                type="date"
                value={capBacData.ngayNhanCap}
                onChange={(e) =>
                  setCapBacData((prev) => ({
                    ...prev,
                    ngayNhanCap: e.target.value,
                  }))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>
                <HStack>
                  <Icon as={FaInfoCircle} color="blue.500" />
                  <Text>Ghi chú</Text>
                </HStack>
              </FormLabel>
              <Textarea
                value={capBacData.ghiChu}
                onChange={(e) =>
                  setCapBacData((prev) => ({
                    ...prev,
                    ghiChu: e.target.value,
                  }))
                }
                placeholder="Nhập ghi chú (nếu có)"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleSubmit}
            leftIcon={<FaSave />}
            isLoading={isSubmitting}
          >
            Thêm cấp bậc
          </Button>
          <Button onClick={onClose} leftIcon={<FaTimes />}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

ThemCapBacModal.displayName = 'ThemCapBacModal';

ThemCapBacModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  capBacData: PropTypes.shape({
    capBac: PropTypes.string.isRequired,
    ngayNhanCap: PropTypes.string.isRequired,
    ghiChu: PropTypes.string,
  }).isRequired,
  setCapBacData: PropTypes.func.isRequired,
};

const ChiTietThanhVien = ({
  isOpen,
  onClose,
  thanhVien,
  onCapNhatThongTin,
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const lichSuCapBacModal = useDisclosure();
  const lichSuChinhSuaModal = useDisclosure();
  const themCapBacModal = useDisclosure();
  const isAdminTong = user?.role === 'admin-tong';

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [danhSachCapBac, setDanhSachCapBac] = useState([]);
  const [lichSuChinhSua, setLichSuChinhSua] = useState([]);
  const [isImageError, setIsImageError] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const cancelRef = useRef();

  const [editData, setEditData] = useState({
    anhDaiDien: '',
    hoTen: '',
    email: '',
    phongBan: '',
    chucVu: CHUC_VU.THANH_VIEN,
    capBac: CAP_BAC.THU_SINH,
    ngayNhanCapBac: new Date().toISOString().split('T')[0],
    trangThai: TRANG_THAI_THANH_VIEN.DANG_CONG_TAC,
    soDienThoai: '',
    ngayVao: '',
    memberCode: '',
    address: '',
    dateOfBirth: '',
    facebookLink: '',
    cvLink: '',
    education: '',
    idNumber: '',
    licensePlate: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    telegramId: '',
    zaloPhone: '',
  });

  const [capBacData, setCapBacData] = useState({
    capBac: CAP_BAC.THU_SINH,
    ngayNhanCap: new Date().toISOString().split('T')[0],
    ghiChu: '',
  });

  const [originalData, setOriginalData] = useState(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    if (thanhVien) {
      const newEditData = {
        anhDaiDien: thanhVien.anhDaiDien || '',
        hoTen: thanhVien.hoTen || '',
        email: thanhVien.email || '',
        phongBan: thanhVien.phongBan || '',
        chucVu: thanhVien.chucVu || CHUC_VU.THANH_VIEN,
        capBac: thanhVien.capBac || CAP_BAC.THU_SINH,
        ngayNhanCapBac: thanhVien.ngayNhanCapBac || new Date().toISOString().split('T')[0],
        trangThai: thanhVien.trangThai || TRANG_THAI_THANH_VIEN.DANG_CONG_TAC,
        soDienThoai: thanhVien.soDienThoai || '',
        ngayVao: thanhVien.ngayVao || '',
        memberCode: thanhVien.memberCode || '',
        address: thanhVien.address || '',
        dateOfBirth: thanhVien.dateOfBirth || '',
        facebookLink: thanhVien.facebookLink || '',
        cvLink: thanhVien.cvLink || '',
        education: thanhVien.education || '',
        idNumber: thanhVien.idNumber || '',
        licensePlate: thanhVien.licensePlate || '',
        fatherName: thanhVien.fatherName || '',
        fatherPhone: thanhVien.fatherPhone || '',
        motherName: thanhVien.motherName || '',
        motherPhone: thanhVien.motherPhone || '',
        telegramId: thanhVien.telegramId || '',
        zaloPhone: thanhVien.zaloPhone || '',
      };
      setEditData(newEditData);
      setOriginalData(newEditData);
      setDanhSachCapBac(thanhVien.danhSachCapBac || []);
      setLichSuChinhSua(thanhVien.lichSuChinhSua || []);
      setIsImageError(false);
      setHasUnsavedChanges(false);
    }
  }, [thanhVien]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setIsImageError(false);
      setHasUnsavedChanges(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (originalData && isEditing) {
      const hasChanges = Object.keys(editData).some(
        (key) => editData[key] !== originalData[key]
      );
      setHasUnsavedChanges(hasChanges);
    }
  }, [editData, originalData, isEditing]);

  const showToast = useCallback(
    (title, description, status) => {
      toast({
        title,
        description,
        status,
        duration: 3000,
        isClosable: true,
        position: 'top',
        variant: 'solid',
      });
    },
    [toast]
  );

  const handleImageError = useCallback(() => {
    setIsImageError(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    if (hasUnsavedChanges) {
      toast({
        title: 'Xác nhận hủy',
        description: 'Bạn có chắc muốn hủy các thay đổi?',
        status: 'warning',
        duration: null,
        isClosable: true,
        position: 'top',
        variant: 'solid',
        render: ({ onClose }) => (
          <AlertDialog
            isOpen
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Xác nhận hủy chỉnh sửa
                </AlertDialogHeader>

                <AlertDialogBody>
                  Bạn có chắc muốn hủy các thay đổi? Mọi thông tin đã chỉnh sửa sẽ không được lưu.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Tiếp tục chỉnh sửa
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      setEditData(originalData);
                      setIsEditing(false);
                      setHasUnsavedChanges(false);
                      onClose();
                    }}
                    ml={3}
                  >
                    Hủy thay đổi
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        ),
      });
    } else {
      setIsEditing(false);
    }
  }, [hasUnsavedChanges, originalData, toast]);

  const handleSave = async () => {
    if (!thanhVien?.id || !hasUnsavedChanges) return;

    try {
      setIsSubmitting(true);

      const changedFields = {};
      Object.keys(editData).forEach((key) => {
        if (editData[key] !== originalData[key]) {
          changedFields[key] = {
            old: originalData[key],
            new: editData[key],
          };
        }
      });

      const lichSuMoi = [];

      if (changedFields.capBac || changedFields.ngayNhanCapBac) {
        lichSuMoi.push({
          thoiGian: new Date(),
          loai: EDIT_HISTORY_TYPE.LEVEL_CHANGED,
          nguoiThucHien: user.displayName,
          anhNguoiThucHien: user.avatar,
          thongTinCu: `${CAP_BAC_LABEL[originalData.capBac]} (${formatDate(
            originalData.ngayNhanCapBac
          )})`,
          thongTinMoi: `${CAP_BAC_LABEL[editData.capBac]} (${formatDate(
            editData.ngayNhanCapBac
          )})`,
          ghiChu: `Thay đổi cấp bậc bởi ${user.displayName}`,
        });

        const capBacMoi = {
          capBac: editData.capBac,
          ngayNhan: editData.ngayNhanCapBac,
          nguoiCapNhat: user.displayName,
          anhNguoiCapNhat: user.avatar,
          ghiChu: '',
        };

        setDanhSachCapBac((prev) => [...prev, capBacMoi]);
      }

      if (changedFields.phongBan) {
        lichSuMoi.push({
          thoiGian: new Date(),
          loai: EDIT_HISTORY_TYPE.DEPARTMENT_CHANGED,
          nguoiThucHien: user.displayName,
          anhNguoiThucHien: user.avatar,
          thongTinCu: PHONG_BAN_LABEL[originalData.phongBan],
          thongTinMoi: PHONG_BAN_LABEL[editData.phongBan],
          ghiChu: `Thay đổi phòng ban bởi ${user.displayName}`,
        });
      }

      if (changedFields.chucVu) {
        lichSuMoi.push({
          thoiGian: new Date(),
          loai: EDIT_HISTORY_TYPE.POSITION_CHANGED,
          nguoiThucHien: user.displayName,
          anhNguoiThucHien: user.avatar,
          thongTinCu: CHUC_VU_LABEL[originalData.chucVu],
          thongTinMoi: CHUC_VU_LABEL[editData.chucVu],
          ghiChu: `Thay đổi chức vụ bởi ${user.displayName}`,
        });
      }

      const updatedData = {
        ...editData,
        danhSachCapBac: danhSachCapBac,
        lichSuChinhSua: [...lichSuChinhSua, ...lichSuMoi],
      };

      const result = await thanhVienService.capNhat(thanhVien.id, updatedData);

      if (result) {
        setIsEditing(false);
        setHasUnsavedChanges(false);
        setOriginalData(editData);
        setLichSuChinhSua((prev) => [...prev, ...lichSuMoi]);
        if (onCapNhatThongTin) {
          onCapNhatThongTin(thanhVien.id, result);
        }
        showToast('Thành công', 'Cập nhật thông tin thành công', 'success');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      showToast('Lỗi', error.message || 'Không thể cập nhật thông tin', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThemCapBac = async () => {
    if (!thanhVien?.id) return;

    try {
      setIsSubmitting(true);

      const capBacMoi = {
        capBac: capBacData.capBac,
        ngayNhan: capBacData.ngayNhanCap,
        nguoiCapNhat: user.displayName,
        anhNguoiCapNhat: user.avatar,
        ghiChu: capBacData.ghiChu || '',
      };

      const danhSachCapBacMoi = [...danhSachCapBac, capBacMoi];

      const lichSuMoi = {
        thoiGian: new Date(),
        loai: EDIT_HISTORY_TYPE.LEVEL_CHANGED,
        nguoiThucHien: user.displayName,
        anhNguoiThucHien: user.avatar,
        thongTinCu: `${CAP_BAC_LABEL[thanhVien.capBac]} (${formatDate(
          thanhVien.ngayNhanCapBac
        )})`,
        thongTinMoi: `${CAP_BAC_LABEL[capBacData.capBac]} (${formatDate(
          capBacData.ngayNhanCap
        )})`,
        ghiChu: capBacData.ghiChu || `Thay đổi cấp bậc bởi ${user.displayName}`,
      };

      const result = await thanhVienService.capNhat(thanhVien.id, {
        capBac: capBacData.capBac,
        ngayNhanCapBac: capBacData.ngayNhanCap,
        danhSachCapBac: danhSachCapBacMoi,
        lichSuChinhSua: [...lichSuChinhSua, lichSuMoi],
      });

      if (result) {
        setDanhSachCapBac(danhSachCapBacMoi);
        setLichSuChinhSua((prev) => [...prev, lichSuMoi]);
        themCapBacModal.onClose();
        if (onCapNhatThongTin) {
          onCapNhatThongTin(thanhVien.id, result);
        }
        showToast('Thành công', 'Thêm cấp bậc thành công', 'success');
      }
    } catch (error) {
      console.error('Lỗi thêm cấp bậc:', error);
      showToast('Lỗi', error.message || 'Không thể thêm cấp bậc', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!thanhVien) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      motionPreset="slideInBottom"
      closeOnOverlayClick={!isEditing || !hasUnsavedChanges}
    >
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent bg={bgColor}>
        <ModalHeader
          bg={headerBg}
          borderBottomWidth="1px"
          borderColor={borderColor}
          py={4}
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon as={FaUser} color="blue.500" boxSize={6} />
              <Heading size="md">Thông tin chi tiết thành viên</Heading>
            </HStack>
            <HStack spacing={2}>
              <Tooltip label="Xem lịch sử chỉnh sửa">
                <IconButton
                  icon={<FaHistory />}
                  colorScheme="blue"
                  variant="ghost"
                  onClick={lichSuChinhSuaModal.onOpen}
                  aria-label="Xem lịch sử chỉnh sửa"
                />
              </Tooltip>
              {isAdminTong && (
                <Tooltip label={isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}>
                  <IconButton
                    icon={isEditing ? <FaSave /> : <FaEdit />}
                    colorScheme={isEditing ? 'green' : 'blue'}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    isLoading={isSubmitting}
                    aria-label={isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
                  />
                </Tooltip>
              )}
            </HStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Container maxW="container.lg">
            <VStack spacing={8}>
              {/* Avatar và thông tin cơ bản */}
              <Box width="full" textAlign="center">
                <AspectRatio ratio={1} width="150px" mx="auto" mb={4}>
                  <Box
                    borderWidth={2}
                    borderColor={isImageError ? 'red.400' : 'blue.400'}
                    borderRadius="full"
                    overflow="hidden"
                  >
                    {isEditing ? (
                      <Image
                        src={editData.anhDaiDien || thanhVien.anhDaiDien}
                        alt={thanhVien.hoTen}
                        objectFit="cover"
                        onError={handleImageError}
                        fallback={
                          <Avatar size="full" name={thanhVien.hoTen} bg="blue.500" />
                        }
                      />
                    ) : (
                      <Avatar
                        size="full"
                        name={thanhVien.hoTen}
                        src={thanhVien.anhDaiDien}
                      />
                    )}
                  </Box>
                </AspectRatio>

                {isEditing && (
                  <Input
                    size="sm"
                    placeholder="Nhập URL ảnh mới"
                    value={editData.anhDaiDien}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        anhDaiDien: e.target.value,
                      }))
                    }
                    width="80%"
                    mx="auto"
                    mt={2}
                  />
                )}

                <Text fontSize="2xl" fontWeight="bold" mt={4}>
                  {thanhVien.hoTen}
                </Text>

                <Badge
                  size="lg"
                  px={3}
                  py={1}
                  borderRadius="full"
                  colorScheme={
                    thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DANG_CONG_TAC
                      ? 'green'
                      : thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC
                      ? 'yellow'
                      : 'red'
                  }
                  mt={2}
                >
                  {TRANG_THAI_LABEL[thanhVien.trangThai]}
                </Badge>
              </Box>

              <Divider />

              {/* Grid layout cho các thông tin */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="full">
                <ThongTinItem
                  label="Mã thành viên"
                  value={thanhVien.memberCode}
                  icon={FaIdCard}
                  isRequired
                />

                <ThongTinItem
                  label="Email"
                  value={thanhVien.email}
                  icon={FaEnvelope}
                  isRequired
                />

                <ThongTinItem
                  label="Phòng ban"
                  value={PHONG_BAN_LABEL[thanhVien.phongBan]}
                  icon={FaBuilding}
                  isEditing={isEditing && isAdminTong}
                  isRequired
                >
                  <Select
                    value={editData.phongBan}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, phongBan: e.target.value }))
                    }
                  >
                    {PHONG_BAN_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </ThongTinItem>

                <ThongTinItem
                  label="Chức vụ"
                  value={CHUC_VU_LABEL[thanhVien.chucVu]}
                  icon={FaUserTie}
                  isEditing={isEditing && isAdminTong}
                  isRequired
                >
                  <Select
                    value={editData.chucVu}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, chucVu: e.target.value }))
                    }
                  >
                    {Object.entries(CHUC_VU).map(([key, value]) => (
                      <option key={key} value={value}>
                        {CHUC_VU_LABEL[value]}
                      </option>
                    ))}
                  </Select>
                </ThongTinItem>

                {isAdminTong && (
                  <>
                    <ThongTinItem
                      label="Ngày vào làm"
                      value={formatDate(thanhVien.ngayVao)}
                      icon={FaCalendarAlt}
                      isEditing={isEditing}
                      isRequired
                    >
                      <Input
                        type="date"
                        value={editData.ngayVao}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, ngayVao: e.target.value }))
                        }
                      />
                    </ThongTinItem>

                    <ThongTinItem
                      label="Số điện thoại"
                      value={thanhVien.soDienThoai}
                      icon={FaPhone}
                      isEditing={isEditing}
                      isRequired
                    >
                      <Input
                        value={editData.soDienThoai}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, soDienThoai: e.target.value }))
                        }
                      />
                    </ThongTinItem>
                  </>
                )}

                <Box gridColumn="span 2">
                  <ThongTinItem
                    label="Cấp bậc hiện tại"
                    value={`${CAP_BAC_LABEL[thanhVien.capBac]} (${formatDate(
                      thanhVien.ngayNhanCapBac
                    )})`}
                    icon={FaUserTie}
                    isRequired
                    isEditing={isEditing && isAdminTong}
                  >
                    {isEditing && isAdminTong ? (
                      <VStack alignItems="start" spacing={2}>
                        <Select
                          value={editData.capBac}
                          onChange={(e) =>
                            setEditData((prev) => ({ ...prev, capBac: e.target.value }))
                          }
                        >
                          {CAP_BAC_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Select>
                        <Input
                          type="date"
                          value={editData.ngayNhanCapBac}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              ngayNhanCapBac: e.target.value,
                            }))
                          }
                        />
                      </VStack>
                    ) : (
                      <HStack justifyContent="space-between" mt={2}>
                        <Text
                          className={`cap-bac-${thanhVien.capBac}`}
                          fontSize="xl"
                          fontWeight="bold"
                          textShadow="0 0 10px rgba(0,0,0,0.5)"
                        >
                          {CAP_BAC_LABEL[thanhVien.capBac]}
                        </Text>
                        <HStack>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            leftIcon={<FaHistory />}
                            onClick={lichSuCapBacModal.onOpen}
                          >
                            Xem lịch sử
                          </Button>
                          {isAdminTong && (
                            <Button
                              size="sm"
                              colorScheme="green"
                              leftIcon={<FaEdit />}
                              onClick={themCapBacModal.onOpen}
                            >
                              Thêm cấp bậc
                            </Button>
                          )}
                        </HStack>
                      </HStack>
                    )}
                  </ThongTinItem>
                </Box>

                <ThongTinItem
                  label="Địa chỉ"
                  value={thanhVien.address}
                  icon={FaMapMarkerAlt}
                  isEditing={isEditing}
                  isRequired
                >
                  <Input
                    value={editData.address}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, address: e.target.value }))
                    }
                  />
                </ThongTinItem>

                <ThongTinItem
                  label="Ngày sinh"
                  value={formatDate(thanhVien.dateOfBirth)}
                  icon={FaBirthdayCake}
                  isEditing={isEditing}
                  isRequired
                >
                  <Input
                    type="date"
                    value={editData.dateOfBirth}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                    }
                  />
                </ThongTinItem>

                <ThongTinItem
                  label="Facebook"
                  value={thanhVien.facebookLink}
                  icon={FaFacebook}
                  isEditing={isEditing}
                >
                  <Input
                    value={editData.facebookLink}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, facebookLink: e.target.value }))
                    }
                  />
                </ThongTinItem>

                <ThongTinItem
                  label="CV"
                  value={thanhVien.cvLink}
                  icon={FaFileAlt}
                  isEditing={isEditing}
                >
                  <Input
                    value={editData.cvLink}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, cvLink: e.target.value }))
                    }
                  />
                </ThongTinItem>

                <ThongTinItem
                  label="Học vấn"
                  value={thanhVien.education}
                  icon={FaGraduationCap}
                  isEditing={isEditing}
                >
                  <Input
                    value={editData.education}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, education: e.target.value }))
                    }
                  />
                </ThongTinItem>

                <ThongTinItem
                  label="CMND/CCCD"
                  value={thanhVien.idNumber}
                  icon={FaIdCard}
                  isEditing={isEditing}
                  isRequired
                >
                  <Input
                    value={editData.idNumber}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, idNumber: e.target.value }))
                    }
                  />
                </ThongTinItem>

                <ThongTinItem
                  label="Biển số xe"
                  value={thanhVien.licensePlate}
                  icon={FaMotorcycle}
                  isEditing={isEditing}
                >
                  <Input
                    value={editData.licensePlate}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, licensePlate: e.target.value }))
                    }
                  />
                </ThongTinItem>

                <Box p={4} borderWidth="1px" borderRadius="lg" gridColumn="span 2">
                  <Heading size="sm" mb={4} color="blue.500">
                    <HStack>
                      <Icon as={FaUser} />
                      <Text>Thông tin gia đình</Text>
                    </HStack>
                  </Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <VStack alignItems="start" spacing={2}>
                      <ThongTinItem
                        label="Tên cha"
                        value={thanhVien.fatherName}
                        icon={FaUser}
                        isEditing={isEditing}
                      >
                        <Input
                          value={editData.fatherName}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              fatherName: e.target.value,
                            }))
                          }
                        />
                      </ThongTinItem>
                      <ThongTinItem
                        label="SĐT cha"
                        value={thanhVien.fatherPhone}
                        icon={FaPhone}
                        isEditing={isEditing}
                      >
                        <Input
                          value={editData.fatherPhone}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              fatherPhone: e.target.value,
                            }))
                          }
                        />
                      </ThongTinItem>
                    </VStack>
                    <VStack alignItems="start" spacing={2}>
                      <ThongTinItem
                        label="Tên mẹ"
                        value={thanhVien.motherName}
                        icon={FaUser}
                        isEditing={isEditing}
                      >
                        <Input
                          value={editData.motherName}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              motherName: e.target.value,
                            }))
                          }
                        />
                      </ThongTinItem>
                      <ThongTinItem
                        label="SĐT mẹ"
                        value={thanhVien.motherPhone}
                        icon={FaPhone}
                        isEditing={isEditing}
                      >
                        <Input
                          value={editData.motherPhone}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              motherPhone: e.target.value,
                            }))
                          }
                        />
                      </ThongTinItem>
                    </VStack>
                  </SimpleGrid>
                </Box>

                <Box p={4} borderWidth="1px" borderRadius="lg" gridColumn="span 2">
                  <Heading size="sm" mb={4} color="blue.500">
                    <HStack>
                      <Icon as={FaCommentDots} />
                      <Text>Thông tin liên lạc khác</Text>
                    </HStack>
                  </Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <ThongTinItem
                      label="Telegram ID"
                      value={thanhVien.telegramId}
                      icon={FaTelegram}
                      isEditing={isEditing}
                    >
                      <Input
                        value={editData.telegramId}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            telegramId: e.target.value,
                          }))
                        }
                      />
                    </ThongTinItem>
                    <ThongTinItem
                      label="Zalo"
                      value={thanhVien.zaloPhone}
                      icon={FaCommentDots}
                      isEditing={isEditing}
                    >
                      <Input
                        value={editData.zaloPhone}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, zaloPhone: e.target.value }))
                        }
                      />
                    </ThongTinItem>
                  </SimpleGrid>
                </Box>
              </SimpleGrid>
            </VStack>
          </Container>
        </ModalBody>

        <ModalFooter
          borderTopWidth="1px"
          borderColor={borderColor}
          bg={headerBg}
        >
          <HStack spacing={2}>
            {isAdminTong && isEditing && (
              <>
                <Button
                  colorScheme="green"
                  onClick={handleSave}
                  leftIcon={<FaSave />}
                  isLoading={isSubmitting}
                  isDisabled={!hasUnsavedChanges}
                >
                  Lưu thay đổi
                </Button>
                <Button onClick={handleCancelEdit} leftIcon={<FaTimes />} variant="ghost">
                  Hủy
                </Button>
              </>
            )}
            {!isEditing && (
              <Button onClick={onClose} leftIcon={<FaTimes />}>
                Đóng
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>

      <LichSuCapBacModal
        isOpen={lichSuCapBacModal.isOpen}
        onClose={lichSuCapBacModal.onClose}
        danhSachCapBac={danhSachCapBac}
      />

      <LichSuChinhSuaModal
        isOpen={lichSuChinhSuaModal.isOpen}
        onClose={lichSuChinhSuaModal.onClose}
        lichSuChinhSua={lichSuChinhSua}
      />

      {isAdminTong && (
        <ThemCapBacModal
          isOpen={themCapBacModal.isOpen}
          onClose={themCapBacModal.onClose}
          onSubmit={handleThemCapBac}
          capBacData={capBacData}
          setCapBacData={setCapBacData}
        />
      )}
    </Modal>
  );
};

ChiTietThanhVien.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  thanhVien: PropTypes.shape({
    id: PropTypes.string.isRequired,
    anhDaiDien: PropTypes.string,
    hoTen: PropTypes.string,
    email: PropTypes.string,
    phongBan: PropTypes.string,
    chucVu: PropTypes.string,
    capBac: PropTypes.string,
    ngayNhanCapBac: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    trangThai: PropTypes.string,
    soDienThoai: PropTypes.string,
    ngayVao: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    memberCode: PropTypes.string,
    address: PropTypes.string,
    dateOfBirth: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    facebookLink: PropTypes.string,
    cvLink: PropTypes.string,
    education: PropTypes.string,
    idNumber: PropTypes.string,
    licensePlate: PropTypes.string,
    fatherName: PropTypes.string,
    fatherPhone: PropTypes.string,
    motherName: PropTypes.string,
    motherPhone: PropTypes.string,
    telegramId: PropTypes.string,
    zaloPhone: PropTypes.string,
    danhSachCapBac: PropTypes.arrayOf(
      PropTypes.shape({
        capBac: PropTypes.string.isRequired,
        ngayNhan: PropTypes.any.isRequired,
        nguoiCapNhat: PropTypes.string,
        anhNguoiCapNhat: PropTypes.string,
        ghiChu: PropTypes.string,
      })
    ),
    lichSuChinhSua: PropTypes.arrayOf(
      PropTypes.shape({
        thoiGian: PropTypes.any.isRequired,
        loai: PropTypes.oneOf(Object.values(EDIT_HISTORY_TYPE)).isRequired,
        nguoiThucHien: PropTypes.string.isRequired,
        anhNguoiThucHien: PropTypes.string,
        thongTinCu: PropTypes.string,
        thongTinMoi: PropTypes.string,
        ghiChu: PropTypes.string,
      })
    ),
  }),
  onCapNhatThongTin: PropTypes.func,
};

export default memo(ChiTietThanhVien);
