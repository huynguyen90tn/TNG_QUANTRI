 // File: src/modules/quan_ly_tai_san/components/kiem_ke_tai_san.js
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
  Image,
  AspectRatio,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Radio,
  RadioGroup,
  Stack,
  Divider
} from '@chakra-ui/react';
import { 
  AddIcon, 
  CloseIcon,
  CheckCircleIcon,
  WarningIcon,
  WarningTwoIcon
} from '@chakra-ui/icons';
import { FaCamera, FaTools } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useTaiSan } from '../hooks/use_tai_san';
import { useAuth } from '../../../hooks/useAuth';
import { 
  TRANG_THAI_KIEM_KE,
  TEN_TRANG_THAI_KIEM_KE
} from '../constants/trang_thai_tai_san';
import { layLichSuKiemKeAsync, taoKiemKeAsync } from '../store/tai_san_slice';

const initialFormData = {
  ngayKiemKe: new Date().toISOString().split('T')[0],
  nguoiKiemKe: '',
  tinhTrang: TRANG_THAI_KIEM_KE.BINH_THUONG,
  ghiChu: '',
  anhKiemKe: []
};

const KiemKeTaiSan = ({ taiSan, onSuccess }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const toast = useToast();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [lichSuKiemKe, setLichSuKiemKe] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (taiSan?.id) {
      loadLichSuKiemKe();
    }
  }, [taiSan?.id]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nguoiKiemKe: user.fullName || user.email
      }));
    }
  }, [user]);

  const loadLichSuKiemKe = async () => {
    try {
      const response = await dispatch(layLichSuKiemKeAsync(taiSan.id)).unwrap();
      setLichSuKiemKe(response);
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử kiểm kê:', error);
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

    if (!formData.ngayKiemKe) {
      newErrors.ngayKiemKe = 'Ngày kiểm kê là bắt buộc';
    }
    if (!formData.nguoiKiemKe) {
      newErrors.nguoiKiemKe = 'Người kiểm kê là bắt buộc';
    }
    if (!formData.tinhTrang) {
      newErrors.tinhTrang = 'Tình trạng kiểm kê là bắt buộc';
    }
    if (formData.tinhTrang !== TRANG_THAI_KIEM_KE.BINH_THUONG && !formData.ghiChu) {
      newErrors.ghiChu = 'Vui lòng nhập ghi chú khi tài sản không bình thường';
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const formDataWithImages = {
        ...formData,
        anhKiemKe: selectedFiles.map(file => file.preview),
        ketQua: formData.tinhTrang,
        nguoiTao: user.id
      };

      await dispatch(taoKiemKeAsync({
        taiSanId: taiSan.id,
        data: formDataWithImages
      })).unwrap();

      toast({
        title: 'Thành công',
        description: 'Đã tạo kiểm kê mới',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      setFormData({
        ...initialFormData,
        nguoiKiemKe: user.fullName || user.email
      });
      setSelectedFiles([]);
      setActiveTab(1); // Chuyển sang tab lịch sử
      await loadLichSuKiemKe();
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
            <Text color="gray.400">Người sử dụng</Text>
            <Text fontWeight="medium">{taiSan.nguoiSuDung || 'Chưa cấp phát'}</Text>
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
          <Tab>Kiểm kê mới</Tab>
          <Tab>Lịch sử kiểm kê</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <FormControl isRequired isInvalid={!!errors.ngayKiemKe}>
                      <FormLabel>Ngày kiểm kê</FormLabel>
                      <Input
                        type="date"
                        value={formData.ngayKiemKe}
                        onChange={(e) => setFormData({ ...formData, ngayKiemKe: e.target.value })}
                        bg="whiteAlpha.100"
                      />
                      <FormErrorMessage>{errors.ngayKiemKe}</FormErrorMessage>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isRequired isInvalid={!!errors.nguoiKiemKe}>
                      <FormLabel>Người kiểm kê</FormLabel>
                      <Input
                        value={formData.nguoiKiemKe}
                        onChange={(e) => setFormData({ ...formData, nguoiKiemKe: e.target.value })}
                        placeholder="Nhập tên người kiểm kê"
                        bg="whiteAlpha.100"
                      />
                      <FormErrorMessage>{errors.nguoiKiemKe}</FormErrorMessage>
                    </FormControl>
                  </GridItem>
                </Grid>

                <FormControl isRequired isInvalid={!!errors.tinhTrang}>
                  <FormLabel>Tình trạng kiểm kê</FormLabel>
                  <RadioGroup
                    value={formData.tinhTrang}
                    onChange={(value) => setFormData({ ...formData, tinhTrang: value })}
                  >
                    <Stack spacing={4} direction="row">
                      <Radio 
                        value={TRANG_THAI_KIEM_KE.BINH_THUONG}
                        colorScheme="green"
                      >
                        <HStack spacing={2} align="center">
                          <CheckCircleIcon color="green.500" />
                          <Text>Bình thường</Text>
                        </HStack>
                      </Radio>
                      <Radio 
                        value={TRANG_THAI_KIEM_KE.HU_HONG}
                        colorScheme="orange"
                      >
                        <HStack spacing={2} align="center">
                          <WarningIcon color="orange.500" />
                          <Text>Hư hỏng</Text>
                        </HStack>
                      </Radio>
                      <Radio 
                        value={TRANG_THAI_KIEM_KE.MAT}
                        colorScheme="red"
                      >
                        <HStack spacing={2} align="center">
                          <WarningTwoIcon color="red.500" />
                          <Text>Mất</Text>
                        </HStack>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <FormErrorMessage>{errors.tinhTrang}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.ghiChu}>
                  <FormLabel>Ghi chú</FormLabel>
                  <Textarea
                    value={formData.ghiChu}
                    onChange={(e) => setFormData({ ...formData, ghiChu: e.target.value })}
                    placeholder="Nhập ghi chú kiểm kê"
                    minH="100px"
                    bg="whiteAlpha.100"
                  />
                  <FormErrorMessage>{errors.ghiChu}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Ảnh kiểm kê</FormLabel>
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
                            right={2}
                            colorScheme="red"
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
                  Lưu kiểm kê
                </Button>
              </VStack>
            </form>
          </TabPanel>

          <TabPanel p={0}>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Ngày kiểm kê</Th>
                    <Th>Người kiểm kê</Th>
                    <Th>Tình trạng</Th>
                    <Th>Ghi chú</Th>
                    <Th>Ảnh</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {lichSuKiemKe.map((item) => (
                    <Tr key={item.id}>
                      <Td>{formatDate(item.ngayKiemKe)}</Td>
                      <Td>{item.nguoiKiemKe}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            item.tinhTrang === TRANG_THAI_KIEM_KE.BINH_THUONG
                              ? 'green'
                              : item.tinhTrang === TRANG_THAI_KIEM_KE.HU_HONG
                                ? 'orange'
                                : 'red'
                          }
                          p={2}
                          borderRadius="md"
                        >
                          {TEN_TRANG_THAI_KIEM_KE[item.tinhTrang]}
                        </Badge>
                      </Td>
                      <Td maxW="300px">
                        <Text noOfLines={2}>
                          {item.ghiChu || '-'}
                        </Text>
                      </Td>
                      <Td>
                        {item.anhKiemKe?.length > 0 ? (
                          <HStack spacing={2}>
                            {item.anhKiemKe.slice(0, 3).map((url, index) => (
                              <Box 
                                key={index}
                                position="relative"
                                width="60px"
                                height="60px"
                                borderRadius="md"
                                overflow="hidden"
                              >
                                <Image
                                  src={url}
                                  alt={`Ảnh kiểm kê ${index + 1}`}
                                  objectFit="cover"
                                  w="100%"
                                  h="100%"
                                />
                              </Box>
                            ))}
                            {item.anhKiemKe.length > 3 && (
                              <Text 
                                fontSize="sm" 
                                color="blue.400"
                                pl={2}
                              >
                                +{item.anhKiemKe.length - 3}
                              </Text>
                            )}
                          </HStack>
                        ) : (
                          <Text>-</Text>
                        )}
                      </Td>
                    </Tr>
                  ))}

                  {lichSuKiemKe.length === 0 && (
                    <Tr>
                      <Td colSpan={5} textAlign="center" py={4}>
                        <Text>Chưa có lịch sử kiểm kê</Text>
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

export default KiemKeTaiSan;
