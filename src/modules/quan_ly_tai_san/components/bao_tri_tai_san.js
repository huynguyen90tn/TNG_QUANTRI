 // File: src/modules/quan_ly_tai_san/components/bao_tri_tai_san.js
// Link tham khảo: https://chakra-ui.com/docs
// Nhánh: main

import React, { useState, useEffect } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  useToast,
  HStack,
  Box,
  Badge,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  AspectRatio
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  AddIcon, 
  CheckIcon,
  CloseIcon,
  WarningIcon 
} from '@chakra-ui/icons';
import { FaTools, FaCamera } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useTaiSan } from '../hooks/use_tai_san';
import { useAuth } from '../../../hooks/useAuth';
import { 
  TRANG_THAI_BAO_TRI, 
  TEN_TRANG_THAI_BAO_TRI 
} from '../constants/trang_thai_tai_san';
import { layLichSuBaoTriAsync, taoBaoTriAsync, hoanThanhBaoTriAsync } from '../store/tai_san_slice';

const initialFormData = {
  ngayBatDau: new Date().toISOString().split('T')[0],
  ngayKetThuc: '',
  noiDung: '',
  chiPhi: 0,
  nguoiThucHien: '',
  ghiChu: '',
  anhBaoTri: []
};

const BaoTriTaiSan = ({ taiSan, onSuccess }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [lichSuBaoTri, setLichSuBaoTri] = useState([]);
  const [selectedBaoTri, setSelectedBaoTri] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (taiSan?.id) {
      loadLichSuBaoTri();
    }
  }, [taiSan?.id]);

  const loadLichSuBaoTri = async () => {
    try {
      const response = await dispatch(layLichSuBaoTriAsync(taiSan.id)).unwrap();
      setLichSuBaoTri(response);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử bảo trì:', error);
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.ngayBatDau) {
      newErrors.ngayBatDau = 'Ngày bắt đầu là bắt buộc';
    }
    if (!formData.noiDung) {
      newErrors.noiDung = 'Nội dung bảo trì là bắt buộc';
    }
    if (!formData.nguoiThucHien) {
      newErrors.nguoiThucHien = 'Người thực hiện là bắt buộc';
    }
    if (formData.ngayKetThuc && new Date(formData.ngayKetThuc) < new Date(formData.ngayBatDau)) {
      newErrors.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setSelectedFiles([...selectedFiles, ...newFiles]);
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleTaoBaoTri = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const formDataWithImages = {
        ...formData,
        anhBaoTri: selectedFiles.map(file => file.preview),
        nguoiTao: user.id
      };

      await dispatch(taoBaoTriAsync({
        taiSanId: taiSan.id,
        data: formDataWithImages
      })).unwrap();

      toast({
        title: 'Thành công',
        description: 'Đã tạo bảo trì mới',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      setFormData(initialFormData);
      setSelectedFiles([]);
      setActiveTab(1); // Chuyển sang tab lịch sử
      await loadLichSuBaoTri();
      onSuccess?.();

    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHoanThanhBaoTri = async (baoTriId, ketQua = 'binh_thuong') => {
    try {
      setLoading(true);
      await dispatch(hoanThanhBaoTriAsync({
        baoTriId,
        data: {
          ketQua,
          ngayKetThuc: new Date().toISOString(),
          nguoiCapNhat: user.id
        }
      })).unwrap();

      toast({
        title: 'Thành công',
        description: 'Đã hoàn thành bảo trì',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      await loadLichSuBaoTri();
      onSuccess?.();

    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (!taiSan) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Không tìm thấy thông tin tài sản</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Thông tin tài sản */}
      <Box 
        p={4} 
        bg="whiteAlpha.50" 
        borderRadius="md"
        border="1px solid"
        borderColor="whiteAlpha.200"
        mb={4}
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Text color="gray.400">Mã tài sản</Text>
            <Text fontWeight="medium">{taiSan.ma}</Text>
          </GridItem>
          
          <GridItem>
            <Text color="gray.400">Tên tài sản</Text>
            <Text fontWeight="medium">{taiSan.ten}</Text>
          </GridItem>

          <GridItem>
            <Text color="gray.400">Phòng ban</Text>
            <Text fontWeight="medium">{taiSan.phongBan}</Text>
          </GridItem>

          <GridItem>
            <Text color="gray.400">Trạng thái</Text>
            <Badge 
              colorScheme={
                taiSan.trangThai === 'dang_bao_tri'
                  ? 'orange'
                  : taiSan.trangThai === 'hong'
                    ? 'red'
                    : 'gray'
              }
            >
              {taiSan.trangThai === 'dang_bao_tri'
                ? 'Đang bảo trì'
                : taiSan.trangThai === 'hong'
                  ? 'Hỏng'
                  : 'Bình thường'
              }
            </Badge>
          </GridItem>
        </Grid>
      </Box>

      <Tabs 
        variant="soft-rounded" 
        colorScheme="blue" 
        index={activeTab}
        onChange={setActiveTab}
      >
        <TabList mb={4}>
          <Tab>Tạo bảo trì mới</Tab>
          <Tab>Lịch sử bảo trì</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <form onSubmit={handleTaoBaoTri}>
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isRequired isInvalid={!!errors.ngayBatDau}>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <Input
                        type="date"
                        value={formData.ngayBatDau}
                        onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                        bg="whiteAlpha.100"
                      />
                      <FormErrorMessage>{errors.ngayBatDau}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isInvalid={!!errors.ngayKetThuc}>
                      <FormLabel>Ngày kết thúc (dự kiến)</FormLabel>
                      <Input
                        type="date"
                        value={formData.ngayKetThuc}
                        onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
                        min={formData.ngayBatDau}
                        bg="whiteAlpha.100"
                      />
                      <FormErrorMessage>{errors.ngayKetThuc}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>

                <FormControl isRequired isInvalid={!!errors.nguoiThucHien}>
                  <FormLabel>Người thực hiện</FormLabel>
                  <Input
                    value={formData.nguoiThucHien}
                    onChange={(e) => setFormData({ ...formData, nguoiThucHien: e.target.value })}
                    placeholder="Nhập tên người thực hiện"
                    bg="whiteAlpha.100"
                  />
                  <FormErrorMessage>{errors.nguoiThucHien}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.noiDung}>
                  <FormLabel>Nội dung bảo trì</FormLabel>
                  <Textarea
                    value={formData.noiDung}
                    onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                    placeholder="Mô tả chi tiết nội dung bảo trì"
                    minH="100px"
                    bg="whiteAlpha.100"
                  />
                  <FormErrorMessage>{errors.noiDung}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Chi phí dự kiến</FormLabel>
                  <NumberInput
                    value={formData.chiPhi}
                    onChange={(value) => setFormData({ ...formData, chiPhi: Number(value) })}
                    min={0}
                    step={100000}
                  >
                    <NumberInputField bg="whiteAlpha.100" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Ghi chú</FormLabel>
                  <Textarea
                    value={formData.ghiChu}
                    onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                    placeholder="Nhập ghi chú nếu có"
                    bg="whiteAlpha.100"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Ảnh bảo trì</FormLabel>
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
                    leftIcon={<FaCamera />}
                    colorScheme="blue"
                    variant="outline"
                    mb={4}
                    cursor="pointer"
                  >
                    Thêm ảnh
                  </Button>

                  <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
                    {selectedFiles.map((file, index) => (
                      <GridItem key={index}>
                        <Box position="relative">
                          <AspectRatio ratio={4/3}>
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
                            right={2}colorScheme="red"
                            onClick={() => removeImage(index)}
                          />
                        </Box>
                      </GridItem>
                    ))}
                  </Grid>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  leftIcon={<FaTools />}
                  isLoading={loading}
                  mt={4}
                >
                  Tạo bảo trì mới
                </Button>
              </VStack>
            </form>
          </TabPanel>

          <TabPanel p={0}>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Ngày</Th>
                    <Th>Người thực hiện</Th>
                    <Th>Nội dung</Th>
                    <Th>Chi phí</Th>
                    <Th>Trạng thái</Th>
                    <Th textAlign="center">Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lichSuBaoTri.map((item) => (
                    <Tr key={item.id}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text>Bắt đầu: {formatDate(item.ngayBatDau)}</Text>
                          {item.ngayKetThuc && (
                            <Text>Kết thúc: {formatDate(item.ngayKetThuc)}</Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>{item.nguoiThucHien}</Td>
                      <Td maxW="300px">
                        <Text noOfLines={2}>{item.noiDung}</Text>
                      </Td>
                      <Td isNumeric>{formatCurrency(item.chiPhi)}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            item.trangThai === TRANG_THAI_BAO_TRI.DANG_THUC_HIEN
                              ? 'orange'
                              : item.trangThai === TRANG_THAI_BAO_TRI.DA_HOAN_THANH
                                ? 'green'
                                : 'red'
                          }
                        >
                          {TEN_TRANG_THAI_BAO_TRI[item.trangThai]}
                        </Badge>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            size="sm"
                            variant="ghost"
                            isDisabled={item.trangThai !== TRANG_THAI_BAO_TRI.DANG_THUC_HIEN}
                          >
                            Thao tác
                          </MenuButton>
                          <MenuList bg="gray.800">
                            <MenuItem
                              icon={<CheckIcon />}
                              onClick={() => handleHoanThanhBaoTri(item.id, 'binh_thuong')}
                            >
                              Hoàn thành bảo trì
                            </MenuItem>
                            <MenuItem
                              icon={<WarningIcon />}
                              onClick={() => handleHoanThanhBaoTri(item.id, 'hong')}
                              color="red.300"
                            >
                              Báo hỏng
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}

                  {lichSuBaoTri.length === 0 && (
                    <Tr>
                      <Td colSpan={6} textAlign="center" py={4}>
                        <Text>Chưa có lịch sử bảo trì</Text>
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default BaoTriTaiSan;
