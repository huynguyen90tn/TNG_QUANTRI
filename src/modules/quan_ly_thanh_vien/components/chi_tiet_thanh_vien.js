// src/modules/quan_ly_thanh_vien/components/chi_tiet_thanh_vien.js
import React, { useState, useEffect, memo } from 'react';
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
} from '@chakra-ui/react';
import { useAuth } from '../../../hooks/useAuth';
import { thanhVienService } from '../services/thanh_vien_service';
import {
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  CAP_BAC,
  CAP_BAC_LABEL,
  PHONG_BAN_LABEL
} from '../constants/trang_thai_thanh_vien';

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

const ThongTinItem = memo(({ label, value }) => (
  <HStack width="100%" justify="space-between" align="center">
    <Text fontWeight="medium">{label}:</Text>
    <Text>{value || 'Chưa cập nhật'}</Text>
  </HStack>
));

ThongTinItem.displayName = 'ThongTinItem';

const LichSuCapBacModal = memo(({ isOpen, onClose, danhSachCapBac }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="xl">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        <Text>Lịch sử cấp bậc</Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Cấp bậc</Th>
              <Th>Ngày nhận</Th>
              <Th>Ghi chú</Th>
            </Tr>
          </Thead>
          <Tbody>
            {danhSachCapBac.map((capBac, index) => (
              <Tr key={index}>
                <Td>{CAP_BAC_LABEL[capBac.capBac]}</Td>
                <Td>{new Date(capBac.ngayNhan).toLocaleDateString('vi-VN')}</Td>
                <Td>{capBac.ghiChu}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Đóng</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
));

LichSuCapBacModal.displayName = 'LichSuCapBacModal';

const ThemCapBacModal = memo(({ isOpen, onClose, onSubmit, editData, setEditData }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Thêm cấp bậc mới</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Cấp bậc</FormLabel>
            <Select
              value={editData.capBac}
              onChange={(e) => setEditData({ ...editData, capBac: e.target.value })}
            >
              {Object.entries(CAP_BAC).map(([key, value]) => (
                <option key={key} value={value}>
                  {CAP_BAC_LABEL[value]}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Ngày nhận cấp</FormLabel>
            <Input
              type="date"
              value={editData.ngayNhanCap}
              onChange={(e) => setEditData({ ...editData, ngayNhanCap: e.target.value })}
            />
          </FormControl>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onSubmit}>
          Thêm
        </Button>
        <Button onClick={onClose}>Hủy</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
));

ThemCapBacModal.displayName = 'ThemCapBacModal';

const ChiTietThanhVien = ({
  isOpen,
  onClose,
  thanhVien,
  onCapNhatThongTin
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const lichSuCapBacModal = useDisclosure();
  const themCapBacModal = useDisclosure();
  const isAdminTong = user?.role === 'admin-tong';
  const [isEditing, setIsEditing] = useState(false);
  const [danhSachCapBac, setDanhSachCapBac] = useState([]);

  const [editData, setEditData] = useState({
    capBac: CAP_BAC.THU_SINH,
    ngayNhanCap: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (thanhVien) {
      setEditData((prevState) => ({
        ...prevState,
        anhDaiDien: thanhVien.anhDaiDien || '',
        hoTen: thanhVien.hoTen || '',
        email: thanhVien.email || '',
        phongBan: thanhVien.phongBan || '',
        chucVu: thanhVien.chucVu || CHUC_VU.THANH_VIEN,
        capBac: thanhVien.capBac || CAP_BAC.THU_SINH,
        trangThai: thanhVien.trangThai || TRANG_THAI_THANH_VIEN.DANG_CONG_TAC,
        soDienThoai: thanhVien.soDienThoai || '',
        ngayVao: thanhVien.ngayVao || new Date().toISOString().split('T')[0],
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
        zaloPhone: thanhVien.zaloPhone || ''
      }));
      setDanhSachCapBac(thanhVien.danhSachCapBac || []);
    }
  }, [thanhVien]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSave = async () => {
    if (!thanhVien?.id) return;

    try {
      const updatedData = {
        phongBan: editData.phongBan,
        chucVu: editData.chucVu,
        capBac: editData.capBac,
        ngayVao: editData.ngayVao,
        soDienThoai: editData.soDienThoai
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
        ghiChu: ''
      };

      const danhSachCapBacMoi = [...danhSachCapBac, capBacMoi];

      const result = await thanhVienService.capNhat(thanhVien.id, {
        capBac: editData.capBac,
        danhSachCapBac: danhSachCapBacMoi
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Thông tin chi tiết thành viên</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Avatar
              size="xl"
              name={thanhVien.hoTen}
              src={thanhVien.anhDaiDien}
            />
            <Text fontSize="xl" fontWeight="bold">
              {thanhVien.hoTen}
            </Text>
            <Badge
              colorScheme={
                thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DANG_CONG_TAC
                  ? 'green'
                  : thanhVien.trangThai === TRANG_THAI_THANH_VIEN.DUNG_CONG_TAC
                  ? 'yellow'
                  : 'red'
              }
            >
              {TRANG_THAI_LABEL[thanhVien.trangThai]}
            </Badge>

            <SimpleGrid columns={1} spacing={4} width="100%">
              <ThongTinItem label="Mã thành viên" value={thanhVien.memberCode} />
              <ThongTinItem label="Email" value={thanhVien.email} />

              <FormControl>
                <FormLabel>Phòng ban</FormLabel>
                {isEditing && isAdminTong ? (
                  <Select
                    value={editData.phongBan}
                    onChange={(e) => setEditData({ ...editData, phongBan: e.target.value })}
                  >
                    {PHONG_BAN_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Text>{PHONG_BAN_LABEL[thanhVien.phongBan] || 'Chưa cập nhật'}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Chức vụ</FormLabel>
                {isEditing && isAdminTong ? (
                  <Select
                    value={editData.chucVu}
                    onChange={(e) => setEditData({ ...editData, chucVu: e.target.value })}
                  >
                    {Object.entries(CHUC_VU).map(([key, value]) => (
                      <option key={key} value={value}>
                        {CHUC_VU_LABEL[value]}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Text>{CHUC_VU_LABEL[thanhVien.chucVu] || 'Chưa cập nhật'}</Text>
                )}
              </FormControl>

              {isAdminTong && (
                <>
                  <FormControl>
                    <FormLabel>Ngày vào làm</FormLabel>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.ngayVao}
                        onChange={(e) => setEditData({ ...editData, ngayVao: e.target.value })}
                      />
                    ) : (
                      <Text>{thanhVien.ngayVao || 'Chưa cập nhật'}</Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel>Số điện thoại</FormLabel>
                    {isEditing ? (
                      <Input
                        value={editData.soDienThoai}
                        onChange={(e) => setEditData({ ...editData, soDienThoai: e.target.value })}
                      />
                    ) : (
                      <Text>{thanhVien.soDienThoai || 'Chưa cập nhật'}</Text>
                    )}
                  </FormControl>
                </>
              )}

              <FormControl>
                <HStack justify="space-between" align="center">
                  <FormLabel mb={0}>Cấp bậc hiện tại</FormLabel>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={lichSuCapBacModal.onOpen}
                  >
                    Xem lịch sử
                  </Button>
                </HStack>
                <Text mt={2}>{CAP_BAC_LABEL[thanhVien.capBac] || 'Chưa cập nhật'}</Text>
              </FormControl>

              <ThongTinItem label="Địa chỉ" value={thanhVien.address} />
              <ThongTinItem label="Ngày sinh" value={thanhVien.dateOfBirth} />
              <ThongTinItem label="Facebook" value={thanhVien.facebookLink} />
              <ThongTinItem label="CV" value={thanhVien.cvLink} />
              <ThongTinItem label="Học vấn" value={thanhVien.education} />
              <ThongTinItem label="CMND/CCCD" value={thanhVien.idNumber} />
              <ThongTinItem label="Biển số xe" value={thanhVien.licensePlate} />
              <ThongTinItem label="Tên cha" value={thanhVien.fatherName} />
              <ThongTinItem label="SĐT cha" value={thanhVien.fatherPhone} />
              <ThongTinItem label="Tên mẹ" value={thanhVien.motherName} />
              <ThongTinItem label="SĐT mẹ" value={thanhVien.motherPhone} />
              <ThongTinItem label="Telegram ID" value={thanhVien.telegramId} />
              <ThongTinItem label="Zalo" value={thanhVien.zaloPhone} />
            </SimpleGrid>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={2}>
            {isAdminTong && (
              <Button
                colorScheme={isEditing ? 'green' : 'blue'}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
              </Button>
            )}
            <Button onClick={onClose}>
              Đóng
            </Button>
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

export default memo(ChiTietThanhVien);
