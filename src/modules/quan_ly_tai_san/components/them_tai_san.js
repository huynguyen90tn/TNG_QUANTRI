// File: src/modules/quan_ly_tai_san/components/them_tai_san.js

import React, { useState, useEffect, useMemo } from 'react';
import {
  VStack,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  useToast,
  Box,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Icon,
  Image,
  IconButton,
  AspectRatio,
  Divider,
  FormHelperText,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
import { useTaiSan } from '../hooks/use_tai_san';
import { useAuth } from '../../../hooks/useAuth';
import { getAllUsers } from '../../../services/api/userApi';
import { numberToVietnameseWords } from '../../../utils/numberToWords';
import { formatCurrency } from '../../../utils/formatters';
import {
  LOAI_TAI_SAN,
  NHOM_TAI_SAN,
} from '../constants/loai_tai_san';

const initialFormData = {
  ma: '',
  ten: '',
  moTa: '',
  loaiTaiSan: LOAI_TAI_SAN.THIET_BI,
  nhomTaiSan: NHOM_TAI_SAN.MAY_TINH,
  phongBan: '',
  giaTriMua: 0,
  ngayMua: new Date().toISOString().split('T')[0],
  hanBaoHanh: '',
  nguoiQuanLy: '',
  maSoNguoiQuanLy: '',
  emailNguoiQuanLy: '',
  thongSoKyThuat: {},
  anhTaiSan: [],
};

const ThemTaiSan = ({ data, onSuccess }) => {
  const { themTaiSan, capNhatTaiSan } = useTaiSan();
  const toast = useToast();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const giaTriBangChu = useMemo(() => {
    return numberToVietnameseWords(formData.giaTriMua) + ' đồng';
  }, [formData.giaTriMua]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await getAllUsers();
        setUserList(response.data);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải danh sách người dùng',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [toast]);

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        ngayMua: data.ngayMua
          ? new Date(data.ngayMua).toISOString().split('T')[0]
          : '',
        hanBaoHanh: data.hanBaoHanh
          ? new Date(data.hanBaoHanh).toISOString().split('T')[0]
          : '',
      });
    }
  }, [data]);

  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  const validate = () => {
    const newErrors = {};

    if (!formData.ma) newErrors.ma = 'Mã tài sản là bắt buộc';
    if (!formData.ten) newErrors.ten = 'Tên tài sản là bắt buộc';
    if (!formData.loaiTaiSan) newErrors.loaiTaiSan = 'Loại tài sản là bắt buộc';
    if (!formData.phongBan) newErrors.phongBan = 'Phòng ban là bắt buộc';
    if (!formData.ngayMua) newErrors.ngayMua = 'Ngày mua là bắt buộc';
    if (formData.giaTriMua <= 0)
      newErrors.giaTriMua = 'Giá trị mua phải lớn hơn 0';
    if (!formData.emailNguoiQuanLy)
      newErrors.emailNguoiQuanLy = 'Email người quản lý là bắt buộc';
    if (!formData.maSoNguoiQuanLy)
      newErrors.maSoNguoiQuanLy = 'Mã số người quản lý là bắt buộc';

    if (
      formData.hanBaoHanh &&
      new Date(formData.hanBaoHanh) < new Date(formData.ngayMua)
    ) {
      newErrors.hanBaoHanh = 'Hạn bảo hành phải sau ngày mua';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const formDataToSubmit = {
        ...formData,
        giaTriMua: Number(formData.giaTriMua),
        giaTriBangChu: giaTriBangChu,
      };

      if (data) {
        await capNhatTaiSan(data.id, formDataToSubmit);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật tài sản',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await themTaiSan(formDataToSubmit);
        toast({
          title: 'Thành công',
          description: 'Đã thêm tài sản mới',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onSuccess?.();
      setFormData(initialFormData);
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserChange = (email) => {
    const selectedUser = userList.find((user) => user.email === email);
    if (selectedUser) {
      setFormData({
        ...formData,
        emailNguoiQuanLy: selectedUser.email,
        nguoiQuanLy: selectedUser.fullName,
        maSoNguoiQuanLy: selectedUser.memberCode || '',
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleGiaTriMuaChange = (value) => {
    const numericValue = Number(value.replace(/[^0-9]/g, ''));
    setFormData({
      ...formData,
      giaTriMua: numericValue,
    });
  };

  const handleThongSoChange = (field, value) => {
    setFormData({
      ...formData,
      thongSoKyThuat: {
        ...formData.thongSoKyThuat,
        [field]: value,
      },
    });
  };

  const renderThongSoKyThuat = () => {
    if (formData.loaiTaiSan === LOAI_TAI_SAN.THIET_BI) {
      return (
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
          <GridItem>
            <FormControl>
              <FormLabel>CPU</FormLabel>
              <Input
                value={formData.thongSoKyThuat.cpu || ''}
                onChange={(e) => handleThongSoChange('cpu', e.target.value)}
                placeholder="Intel Core i5-10400"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>RAM</FormLabel>
              <Input
                value={formData.thongSoKyThuat.ram || ''}
                onChange={(e) => handleThongSoChange('ram', e.target.value)}
                placeholder="16GB DDR4"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Ổ cứng</FormLabel>
              <Input
                value={formData.thongSoKyThuat.oCung || ''}
                onChange={(e) => handleThongSoChange('oCung', e.target.value)}
                placeholder="SSD 256GB"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Màn hình</FormLabel>
              <Input
                value={formData.thongSoKyThuat.manHinh || ''}
                onChange={(e) => handleThongSoChange('manHinh', e.target.value)}
                placeholder="15.6 inch FHD"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Card đồ họa</FormLabel>
              <Input
                value={formData.thongSoKyThuat.cardDoHoa || ''}
                onChange={(e) => handleThongSoChange('cardDoHoa', e.target.value)}
                placeholder="NVIDIA GTX 1650"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Hệ điều hành</FormLabel>
              <Input
                value={formData.thongSoKyThuat.heDieuHanh || ''}
                onChange={(e) =>
                  handleThongSoChange('heDieuHanh', e.target.value)
                }
                placeholder="Windows 11 Pro"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </GridItem>
        </Grid>
      );
    } else if (formData.loaiTaiSan === LOAI_TAI_SAN.PHAN_MEM) {
      return (
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Phiên bản</FormLabel>
              <Input
                value={formData.thongSoKyThuat.phienBan || ''}
                onChange={(e) =>
                  handleThongSoChange('phienBan', e.target.value)
                }
                placeholder="Version 2.0"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Loại bản quyền</FormLabel>
              <Input
                value={formData.thongSoKyThuat.loaiBanQuyen || ''}
                onChange={(e) =>
                  handleThongSoChange('loaiBanQuyen', e.target.value)
                }
                placeholder="Perpetual License"
                bg="whiteAlpha.100"
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel>Số lượng license</FormLabel>
              <NumberInput
                value={formData.thongSoKyThuat.soLuongLicense || 0}
                onChange={(value) =>
                  handleThongSoChange('soLuongLicense', value)
                }
                min={0}
              >
                <NumberInputField bg="whiteAlpha.100" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </GridItem>
        </Grid>
      );
    }

    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <FormControl isRequired isInvalid={!!errors.ma}>
              <FormLabel>Mã tài sản</FormLabel>
              <Input
                value={formData.ma}
                onChange={(e) => setFormData({ ...formData, ma: e.target.value })}
                placeholder="Nhập mã tài sản"
                bg="whiteAlpha.100"
              />
              <FormErrorMessage>{errors.ma}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.ten}>
              <FormLabel>Tên tài sản</FormLabel>
              <Input
                value={formData.ten}
                onChange={(e) =>
                  setFormData({ ...formData, ten: e.target.value })
                }
                placeholder="Nhập tên tài sản"
                bg="whiteAlpha.100"
              />
              <FormErrorMessage>{errors.ten}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.loaiTaiSan}>
              <FormLabel>Loại tài sản</FormLabel>
              <Select
                value={formData.loaiTaiSan}
                onChange={(e) =>
                  setFormData({ ...formData, loaiTaiSan: e.target.value })
                }
                bg="whiteAlpha.100"
              >
                <option value="">Chọn loại tài sản</option>
                <option value={LOAI_TAI_SAN.THIET_BI}>Thiết bị</option>
                <option value={LOAI_TAI_SAN.PHAN_MEM}>Phần mềm</option>
              </Select>
              <FormErrorMessage>{errors.loaiTaiSan}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.giaTriMua}>
              <FormLabel>Giá trị mua</FormLabel>
              <NumberInput
                value={formatCurrency(formData.giaTriMua)}
                onChange={handleGiaTriMuaChange}
                min={0}
                step={100000}
              >
                <NumberInputField bg="whiteAlpha.100" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText color="gray.500">
                Bằng chữ: {giaTriBangChu}
              </FormHelperText>
              <FormErrorMessage>{errors.giaTriMua}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.emailNguoiQuanLy}>
              <FormLabel>Email người quản lý</FormLabel>
              <Select
                value={formData.emailNguoiQuanLy}
                onChange={(e) => handleUserChange(e.target.value)}
                bg="whiteAlpha.100"
                isDisabled={loadingUsers}
              >
                <option value="">Chọn người quản lý</option>
                {userList.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.fullName} - {user.email}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.emailNguoiQuanLy}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.maSoNguoiQuanLy}>
              <FormLabel>Mã số người quản lý</FormLabel>
              <Input
                value={formData.maSoNguoiQuanLy}
                readOnly
                bg="whiteAlpha.100"
                placeholder="Tự động điền khi chọn người quản lý"
              />
              <FormErrorMessage>{errors.maSoNguoiQuanLy}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.phongBan}>
              <FormLabel>Phòng ban</FormLabel>
              <Select
                value={formData.phongBan}
                onChange={(e) =>
                  setFormData({ ...formData, phongBan: e.target.value })
                }
                bg="whiteAlpha.100"
              >
                <option value="">Chọn phòng ban</option>
                <option value="thien-minh-duong">Thiên Minh Đường</option>
                <option value="tay-van-cac">Tây Văn Các</option>
                <option value="hoa-tam-duong">Hoa Tâm Đường</option>
                <option value="ho-ly-son-trang">Hồ Ly Sơn Trang</option>
                <option value="hoa-van-cac">Hoa Văn Các</option>
                <option value="tinh-van-cac">Tinh Văn Các</option>
              </Select>
              <FormErrorMessage>{errors.phongBan}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired isInvalid={!!errors.ngayMua}>
              <FormLabel>Ngày mua</FormLabel>
              <Input
                type="date"
                value={formData.ngayMua}
                onChange={(e) =>
                  setFormData({ ...formData, ngayMua: e.target.value })
                }
                bg="whiteAlpha.100"
              />
              <FormErrorMessage>{errors.ngayMua}</FormErrorMessage>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isInvalid={!!errors.hanBaoHanh}>
              <FormLabel>Hạn bảo hành</FormLabel>
              <Input
                type="date"
                value={formData.hanBaoHanh}
                onChange={(e) =>
                  setFormData({ ...formData, hanBaoHanh: e.target.value })
                }
                min={formData.ngayMua}
                bg="whiteAlpha.100"
              />
              <FormErrorMessage>{errors.hanBaoHanh}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>

        <FormControl>
          <FormLabel>Mô tả</FormLabel>
          <Textarea
            value={formData.moTa}
            onChange={(e) =>
              setFormData({ ...formData, moTa: e.target.value })
            }
            placeholder="Nhập mô tả tài sản"
            minH="100px"
            bg="whiteAlpha.100"
          />
        </FormControl>

        <Divider my={4} />

        <Text fontWeight="medium" mb={2}>
          Thông số kỹ thuật
        </Text>
        {renderThongSoKyThuat()}

        <Divider my={4} />

        <FormControl>
          <FormLabel>Ảnh tài sản</FormLabel>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <Button
            as="label"
            htmlFor="image-upload"
            leftIcon={<AddIcon />}
            colorScheme="blue"
            variant="outline"
            mb={4}
            cursor="pointer"
          >
            Thêm ảnh
          </Button>

          <Grid
            templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
            gap={4}
          >
            {selectedFiles.map((file, index) => (
              <GridItem key={index}>
                <Box position="relative">
                  <AspectRatio ratio={4 / 3}>
                    <Image
                      src={file.preview}
                      alt={`Preview ${index + 1}`}
                      objectFit="cover"
                      borderRadius="md"
                    />
                  </AspectRatio>
                  <IconButton
                    icon={<CloseIcon />}
                    size="xs"
                    position="absolute"
                    top={2}
                    right={2}
                    colorScheme="red"
                    onClick={() => removeImage(index)}
                  />
                </Box>
              </GridItem>
            ))}
          </Grid>
        </FormControl>

        <HStack justify="flex-end" spacing={4} mt={6}>
          <Button
            onClick={() => {
              setFormData(initialFormData);
              setSelectedFiles([]);
            }}
            variant="ghost"
          >
            Làm mới
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={loading}
            leftIcon={data ? <Icon as={EditIcon} /> : <AddIcon />}
          >
            {data ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default ThemTaiSan;
