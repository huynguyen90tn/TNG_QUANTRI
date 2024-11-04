// src/modules/quan_ly_thanh_vien/components/chi_tiet_thanh_vien.js
import React, { useState, useEffect, memo } from 'react';
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
  Grid,
  GridItem,
  Stack,
  IconButton,
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
} from 'react-icons/fa';
import { useAuth } from '../../../hooks/useAuth';
import { thanhVienService } from '../services/thanh_vien_service';
import {
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  CAP_BAC,
  CAP_BAC_LABEL,
  PHONG_BAN_LABEL,
} from '../constants/trang_thai_thanh_vien';

// Các hằng số giữ nguyên
const CHUC_VU = {
  THANH_VIEN: 'THANH_VIEN',
  DUONG_CHU: 'DUONG_CHU',
  PHO_BANG_CHU: 'PHO_BANG_CHU',
};

const CHUC_VU_LABEL = {
  [CHUC_VU.THANH_VIEN]: 'Thành viên',
  [CHUC_VU.DUONG_CHU]: 'Đường chủ',
  [CHUC_VU.PHO_BANG_CHU]: 'Phó Bang chủ',
};

const PHONG_BAN_OPTIONS = [
  { value: '', label: 'Chọn phân hệ' },
  { value: 'thien-minh-duong', label: 'Thiên Minh Đường' },
  { value: 'tay-van-cac', label: 'Tây Vân Các' },
  { value: 'hoa-tam-duong', label: 'Họa Tam Đường' },
  { value: 'ho-ly-son-trang', label: 'Hồ Ly Sơn trang' },
  { value: 'hoa-van-cac', label: 'Hoa Vân Các' },
  { value: 'tinh-van-cac', label: 'Tinh Vân Các' },
];

// Thêm hàm formatDate
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

// Component ThongTinItem được cải tiến với icon và kiểu dáng tốt hơn
const ThongTinItem = memo(({ label, value, icon, isEditing, children }) => {
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
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            {label}
          </Text>
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
};

// Component LichSuCapBacModal được cải tiến với kiểu dáng tốt hơn
const LichSuCapBacModal = memo(({ isOpen, onClose, danhSachCapBac }) => {
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent>
        <ModalHeader bg={headerBg} borderBottomWidth="1px">
          <HStack>
            <Icon as={FaHistory} color="blue.500" />
            <Text>Lịch sử cấp bậc</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={4}>
          <Table variant="simple">
            <Thead bg={headerBg}>
              <Tr>
                <Th>Cấp bậc</Th>
                <Th>Ngày nhận</Th>
                <Th>Ghi chú</Th>
              </Tr>
            </Thead>
            <Tbody>
              {danhSachCapBac.map((capBac, index) => (
                <Tr key={index} _hover={{ bg: headerBg }}>
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
                  <Td>{capBac.ghiChu}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter borderTopWidth="1px">
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
      ngayNhan: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
      ghiChu: PropTypes.string,
    })
  ).isRequired,
};

// Component ThemCapBacModal được cải tiến với kiểu dáng tốt hơn
const ThemCapBacModal = memo(
  ({ isOpen, onClose, onSubmit, editData, setEditData }) => {
    const headerBg = useColorModeValue('gray.50', 'gray.700');

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalHeader bg={headerBg} borderBottomWidth="1px">
            <HStack>
              <Icon as={FaUserTie} color="blue.500" />
              <Text>Thêm cấp bậc mới</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>
                  <HStack>
                    <Icon as={FaUserTie} color="blue.500" />
                    <Text>Cấp bậc</Text>
                  </HStack>
                </FormLabel>
                <Select
                  value={editData.capBac}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      capBac: e.target.value,
                    }))
                  }
                >
                  {Object.entries(CAP_BAC).map(([key, value]) => (
                    <option key={key} value={value}>
                      {CAP_BAC_LABEL[value]}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>
                  <HStack>
                    <Icon as={FaCalendarAlt} color="green.500" />
                    <Text>Ngày nhận cấp</Text>
                  </HStack>
                </FormLabel>
                <Input
                  type="date"
                  value={editData.ngayNhanCap}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      ngayNhanCap: e.target.value,
                    }))
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px">
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onSubmit}
              leftIcon={<FaSave />}
            >
              Thêm
            </Button>
            <Button onClick={onClose} leftIcon={<FaTimes />}>
              Hủy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);

ThemCapBacModal.displayName = 'ThemCapBacModal';

ThemCapBacModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    capBac: PropTypes.string.isRequired,
    ngayNhanCap: PropTypes.string.isRequired,
  }).isRequired,
  setEditData: PropTypes.func.isRequired,
};

// Component ChiTietThanhVien
const ChiTietThanhVien = ({
  isOpen,
  onClose,
  thanhVien,
  onCapNhatThongTin,
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const lichSuCapBacModal = useDisclosure();
  const themCapBacModal = useDisclosure();
  const isAdminTong = user?.role === 'admin-tong';

  const [isEditing, setIsEditing] = useState(false);
  const [danhSachCapBac, setDanhSachCapBac] = useState([]);
  const [isImageError, setIsImageError] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('gray.50', 'gray.700');

  const [editData, setEditData] = useState({
    capBac: CAP_BAC.THU_SINH,
    ngayNhanCap: new Date().toISOString().split('T')[0],
    anhDaiDien: '',
    hoTen: '',
    email: '',
    phongBan: '',
    chucVu: CHUC_VU.THANH_VIEN,
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

  useEffect(() => {
    if (thanhVien) {
      setEditData((prev) => ({
        ...prev,
        anhDaiDien: thanhVien.anhDaiDien || '',
        hoTen: thanhVien.hoTen || '',
        email: thanhVien.email || '',
        phongBan: thanhVien.phongBan || '',
        chucVu: thanhVien.chucVu || CHUC_VU.THANH_VIEN,
        capBac: thanhVien.capBac || CAP_BAC.THU_SINH,
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
      }));
      setDanhSachCapBac(thanhVien.danhSachCapBac || []);
      setIsImageError(false);
    }
  }, [thanhVien]);

  const handleImageError = () => {
    setIsImageError(true);
  };

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: 'top',
      variant: 'solid',
    });
  };

  const handleSave = async () => {
    if (!thanhVien?.id) return;

    try {
      const updatedData = {
        anhDaiDien: editData.anhDaiDien,
        phongBan: editData.phongBan,
        chucVu: editData.chucVu,
        capBac: editData.capBac,
        ngayVao: editData.ngayVao,
        soDienThoai: editData.soDienThoai,
      };

      const result = await thanhVienService.capNhat(thanhVien.id, updatedData);

      if (result) {
        setIsEditing(false);
        if (onCapNhatThongTin) {
          onCapNhatThongTin(thanhVien.id, result);
        }
        showToast('Thành công', 'Cập nhật thông tin thành công', 'success');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      showToast('Lỗi', error.message || 'Không thể cập nhật thông tin', 'error');
    }
  };

  const handleThemCapBac = async () => {
    if (!thanhVien?.id) return;

    try {
      const capBacMoi = {
        capBac: editData.capBac,
        ngayNhan: editData.ngayNhanCap,
        ghiChu: '',
      };

      const danhSachCapBacMoi = [...danhSachCapBac, capBacMoi];

      const result = await thanhVienService.capNhat(thanhVien.id, {
        capBac: editData.capBac,
        danhSachCapBac: danhSachCapBacMoi,
      });

      if (result) {
        setDanhSachCapBac(danhSachCapBacMoi);
        themCapBacModal.onClose();
        if (onCapNhatThongTin) {
          onCapNhatThongTin(thanhVien.id, result);
        }
        showToast('Thành công', 'Thêm cấp bậc thành công', 'success');
      }
    } catch (error) {
      console.error('Lỗi thêm cấp bậc:', error);
      showToast('Lỗi', error.message || 'Không thể thêm cấp bậc', 'error');
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
    >
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent bg={bgColor}>
        <ModalHeader
          bg={headerBg}
          borderBottomWidth="1px"
          borderColor={borderColor}
          py={4}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <HStack spacing={3}>
              <Icon as={FaUser} color="blue.500" boxSize={6} />
              <Heading size="md">Thông tin chi tiết thành viên</Heading>
            </HStack>
            {isAdminTong && (
              <Tooltip label={isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}>
                <IconButton
                  icon={isEditing ? <FaSave /> : <FaEdit />}
                  colorScheme={isEditing ? 'green' : 'blue'}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  aria-label={isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
                />
              </Tooltip>
            )}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <Container maxW="container.lg">
            <VStack spacing={8}>
              {/* Thông tin cơ bản */}
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
                />
                <ThongTinItem
                  label="Email"
                  value={thanhVien.email}
                  icon={FaEnvelope}
                />

                <ThongTinItem
                  label="Phòng ban"
                  value={PHONG_BAN_LABEL[thanhVien.phongBan]}
                  icon={FaBuilding}
                  isEditing={isEditing && isAdminTong}
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
                    value={CAP_BAC_LABEL[thanhVien.capBac]}
                    icon={FaUserTie}
                  >
                    <HStack justifyContent="space-between" mt={2}>
                      <Text>{CAP_BAC_LABEL[thanhVien.capBac]}</Text>
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
                  </ThongTinItem>
                </Box>

                <ThongTinItem
                  label="Địa chỉ"
                  value={thanhVien.address}
                  icon={FaMapMarkerAlt}
                />

                <ThongTinItem
                  label="Ngày sinh"
                  value={formatDate(thanhVien.dateOfBirth)}
                  icon={FaBirthdayCake}
                />

                <ThongTinItem
                  label="Facebook"
                  value={thanhVien.facebookLink}
                  icon={FaFacebook}
                />

                <ThongTinItem
                  label="CV"
                  value={thanhVien.cvLink}
                  icon={FaFileAlt}
                />

                <ThongTinItem
                  label="Học vấn"
                  value={thanhVien.education}
                  icon={FaGraduationCap}
                />

                <ThongTinItem
                  label="CMND/CCCD"
                  value={thanhVien.idNumber}
                  icon={FaIdCard}
                />

                <ThongTinItem
                  label="Biển số xe"
                  value={thanhVien.licensePlate}
                  icon={FaMotorcycle}
                />

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
                      />
                      <ThongTinItem
                        label="SĐT cha"
                        value={thanhVien.fatherPhone}
                        icon={FaPhone}
                      />
                    </VStack>
                    <VStack alignItems="start" spacing={2}>
                      <ThongTinItem
                        label="Tên mẹ"
                        value={thanhVien.motherName}
                        icon={FaUser}
                      />
                      <ThongTinItem
                        label="SĐT mẹ"
                        value={thanhVien.motherPhone}
                        icon={FaPhone}
                      />
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
                    />
                    <ThongTinItem
                      label="Zalo"
                      value={thanhVien.zaloPhone}
                      icon={FaCommentDots}
                    />
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
                >
                  Lưu thay đổi
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  leftIcon={<FaTimes />}
                >
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

      {isAdminTong && (
        <ThemCapBacModal
          isOpen={themCapBacModal.isOpen}
          onClose={themCapBacModal.onClose}
          onSubmit={handleThemCapBac}
          editData={editData}
          setEditData={setEditData}
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
    danhSachCapBac: PropTypes.array,
  }),
  onCapNhatThongTin: PropTypes.func,
};

export default memo(ChiTietThanhVien);
