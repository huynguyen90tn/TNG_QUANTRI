// File: src/components/su_kien_review/components/cap_nhat_su_kien.js
// Nhánh: main

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Container,
  Card,
  CardHeader,
  CardBody,
  Heading,
  SimpleGrid,
  GridItem,
  Textarea,
  Select,
  HStack,
  IconButton,
  Badge,
  useToast,
  Text,
  useColorModeValue,
  Image,
  AspectRatio
} from '@chakra-ui/react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Link as LinkIcon
} from 'lucide-react';
import { useSuKien } from '../hooks/use_su_kien';

const CapNhatSuKien = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { layChiTietSuKien, capNhatSuKien } = useSuKien();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.200', 'blue.700');

  // Form state
  const [formData, setFormData] = useState({
    tenSuKien: '',
    donViToChuc: '',
    ngayToChuc: '',
    gioToChuc: '',
    ngayKetThuc: '',
    gioKetThuc: '',
    diaDiem: '',
    thanhVienThamGia: [],
    nguoiLienHe: [],
    links: [],
    media: [],
    ghiChu: '',
    trangThai: 'CHUA_DIEN_RA'
  });

  // Load sự kiện data
  useEffect(() => {
    const loadSuKien = async () => {
      try {
        const data = await layChiTietSuKien(id);
        if (data) {
          setFormData(data);
        }
      } catch (error) {
        toast({
          title: "Lỗi khi tải thông tin sự kiện",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };
    loadSuKien();
  }, [id, layChiTietSuKien, toast]);

  // Handle form changes
  const handleChange = useCallback((e, index, field, parentField) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (parentField) {
        const newArray = [...prev[parentField]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [parentField]: newArray };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  // Add/Remove fields
  const addField = useCallback((field) => {
    const templates = {
      thanhVienThamGia: '',
      nguoiLienHe: { hoTen: '', chucVu: '', soDienThoai: '', ghiChu: '' },
      links: { url: '', ghiChu: '' },
      media: { type: 'image', url: '', caption: '' }
    };

    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], templates[field]]
    }));
  }, []);

  const removeField = useCallback((index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    const requiredFields = [
      'tenSuKien',
      'donViToChuc',
      'ngayToChuc',
      'gioToChuc',
      'ngayKetThuc',
      'gioKetThuc',
      'diaDiem'
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        toast({
          title: "Thiếu thông tin",
          description: `Vui lòng nhập ${field}`,
          status: "warning",
          duration: 3000,
          isClosable: true
        });
        return false;
      }
    }

    // Validate datetime
    const startDate = new Date(`${formData.ngayToChuc}T${formData.gioToChuc}`);
    const endDate = new Date(`${formData.ngayKetThuc}T${formData.gioKetThuc}`);
    if (endDate <= startDate) {
      toast({
        title: "Thời gian không hợp lệ",
        description: "Thời gian kết thúc phải sau thời gian bắt đầu",
        status: "warning",
        duration: 3000,
        isClosable: true
      });
      return false;
    }

    return true;
  }, [formData, toast]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      await capNhatSuKien(id, formData);
      toast({
        title: "Cập nhật thành công",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      navigate(`/su-kien/${id}`);
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSaving(false);
    }
  };

  // Render media preview
  const renderMediaPreview = useCallback((item) => {
    if (!item.url) return null;

    if (item.type === 'youtube') {
      const videoId = item.url.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([^&\s]+)/)?.[1];
      if (!videoId) return null;

      return (
        <AspectRatio ratio={16/9}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allowFullScreen
          />
        </AspectRatio>
      );
    }

    return (
      <Image
        src={item.url}
        alt={item.caption}
        maxH="200px"
        objectFit="contain"
        fallback={<Box p={4} bg="gray.100" textAlign="center">Không thể tải ảnh</Box>}
      />
    );
  }, []);

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Card>
          <CardBody>
            <Text>Đang tải thông tin sự kiện...</Text>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Card
        bg={bgColor}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="xl"
      >
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="lg">Cập nhật sự kiện</Heading>
            <Button
              leftIcon={<ArrowLeft />}
              onClick={() => navigate(-1)}
              variant="outline"
            >
              Quay lại
            </Button>
          </HStack>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              {/* Thông tin cơ bản */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <GridItem colSpan={2}>
                  <FormControl isRequired>
                    <FormLabel>Tên sự kiện</FormLabel>
                    <Input
                      name="tenSuKien"
                      value={formData.tenSuKien}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </FormControl>
                </GridItem>

                <GridItem colSpan={2}>
                  <FormControl isRequired>
                    <FormLabel>Đơn vị tổ chức</FormLabel>
                    <Input
                      name="donViToChuc"
                      value={formData.donViToChuc}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </FormControl>
                </GridItem>

                <FormControl isRequired>
                  <FormLabel>Ngày tổ chức</FormLabel>
                  <Input
                    type="date"
                    name="ngayToChuc"
                    value={formData.ngayToChuc}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Giờ tổ chức</FormLabel>
                  <Input
                    type="time"
                    name="gioToChuc"
                    value={formData.gioToChuc}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Ngày kết thúc</FormLabel>
                  <Input
                    type="date"
                    name="ngayKetThuc"
                    value={formData.ngayKetThuc}
                    onChange={handleChange}
                    min={formData.ngayToChuc}
                    disabled={saving}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Giờ kết thúc</FormLabel>
                  <Input
                    type="time"
                    name="gioKetThuc"
                    value={formData.gioKetThuc}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </FormControl>

                <GridItem colSpan={2}>
                  <FormControl isRequired>
                    <FormLabel>Địa điểm</FormLabel>
                    <Input
                      name="diaDiem"
                      value={formData.diaDiem}
                      onChange={handleChange}
                      disabled={saving}
                    />
                  </FormControl>
                </GridItem>

                <GridItem colSpan={2}>
                  <FormControl>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      name="trangThai"
                      value={formData.trangThai}
                      onChange={handleChange}
                      disabled={saving}
                    >
                      <option value="CHUA_DIEN_RA">Chưa diễn ra</option>
                      <option value="DANG_DIEN_RA">Đang diễn ra</option>
                      <option value="HOAN_THANH">Hoàn thành</option>
                    </Select>
                  </FormControl>
                </GridItem>
              </SimpleGrid>

              {/* Thành viên tham gia */}
              <Box w="full">
                <FormLabel>Thành viên tham gia</FormLabel>
                {formData.thanhVienThamGia.map((member, index) => (
                  <HStack key={`member-${index}`} mb={2}>
                    <Input
                      value={member}
                      onChange={(e) => handleChange(e, index, 'thanhVienThamGia')}
                      placeholder="Nhập tên thành viên"
                      disabled={saving}
                    />
                    {index > 0 && (
                      <IconButton
                        icon={<Trash2 />}
                        onClick={() => removeField(index, 'thanhVienThamGia')}
                        colorScheme="red"
                        variant="ghost"
                        disabled={saving}
                        aria-label="Xóa thành viên"
                      />
                    )}
                  </HStack>
                ))}
                <Button
                  leftIcon={<Plus />}
                  onClick={() => addField('thanhVienThamGia')}
                  size="sm"
                  mt={2}
                  disabled={saving}
                >
                  Thêm thành viên
                </Button>
              </Box>

              {/* Người liên hệ */}
              <Box w="full">
                <FormLabel>Người liên hệ</FormLabel>
                {formData.nguoiLienHe.map((contact, index) => (
                  <Card key={`contact-${index}`} mb={4}>
                    <CardBody>
                      <VStack spacing={4}>
                        <SimpleGrid columns={2} spacing={4} w="full">
                          <FormControl>
                            <FormLabel>Họ tên</FormLabel>
                            <Input
                              value={contact.hoTen}
                              onChange={(e) => handleChange(e, index, 'hoTen', 'nguoiLienHe')}
                              disabled={saving}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Chức vụ</FormLabel>
                            <Input
                              value={contact.chucVu}
                              onChange={(e) => handleChange(e, index, 'chucVu', 'nguoiLienHe')}
                              disabled={saving}
                            />
                          </FormControl>
                        </SimpleGrid>
                        <SimpleGrid columns={2} spacing={4} w="full">
                          <FormControl>
                            <FormLabel>Số điện thoại</FormLabel>
                            <Input
                              value={contact.soDienThoai}
                              onChange={(e) => handleChange(e, index, 'soDienThoai', 'nguoiLienHe')}
                              disabled={saving}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Ghi chú</FormLabel>
                            <Input
                              value={contact.ghiChu}
                              onChange={(e) => handleChange(e, index, 'ghiChu', 'nguoiLienHe')}
                              disabled={saving}
                            />
                          </FormControl>
                        </SimpleGrid>
                        {index > 0 && (
                          <Button
                            leftIcon={<Trash2 />}
                            onClick={() => removeField(index, 'nguoiLienHe')}
                            colorScheme="red"
                            size="sm"
                            disabled={saving}
                          >
                            Xóa
                          </Button>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
                <Button
                  leftIcon={<Plus />}
                  onClick={() => addField('nguoiLienHe')}
                  size="sm"
                  mt={2}
                  disabled={saving}
                >
                  Thêm người liên hệ
                </Button>
              </Box>

              {/* Links */}
              <Box w="full">
                <FormLabel>Links</FormLabel>
                {formData.links.map((link, index) => (
                  <HStack key={`link-${index}`} mb={2}>
                    <Input
                      value={link.url}
                      onChange={(e) => handleChange(e, index, 'url', 'links')}
                      placeholder="URL"
                      disabled={saving}
                    />
                    <Input
                      value={link.ghiChu}
                      onChange={(e) => handleChange(e, index, 'ghiChu', 'links')}
                      placeholder="Ghi chú"
                      disabled={saving}
                    />
                    {index > 0 && (
                      <IconButton
                        icon={<Trash2 />}
                        onClick={() => removeField(index, 'links')}
                        colorScheme="red"
                        variant="ghost"
                        disabled={saving}
                        aria-label="Xóa link"
                      />
                    )}
                  </HStack>
                ))}
                <Button
                  leftIcon={<LinkIcon />}
                  onClick={() => addField('links')}
                  size="sm"
                  mt={2}
                  disabled={saving}
                >
                  Thêm link
                </Button>
              </Box>

              {/* Media */}
              <Box w="full">
                <FormLabel>Media</FormLabel>
                {formData.media.map((item, index) => (
                  <Card key={`media-${index}`} mb={4}>
                    <CardBody>
                      <VStack spacing={4}>
                        <SimpleGrid columns={2} spacing={4} w="full">
                          <FormControl>
                            <FormLabel>Loại</FormLabel>
                            <Select
                              value={item.type}
                              onChange={(e) => handleChange(e, index, 'type', 'media')}
                              disabled={saving}
                            >
                              <option value="image">Ảnh</option>
                              <option value="youtube">Youtube</option>
                            </Select>
                          </FormControl>
                          <FormControl>
                            <FormLabel>URL</FormLabel>
                            <Input
                              value={item.url}
                              onChange={(e) => handleChange(e, index, 'url', 'media')}
                              placeholder={item.type === 'image' ? 'Link ảnh' : 'Link Youtube'}
                              disabled={saving}
                            />
                          </FormControl>
                        </SimpleGrid>
                        <FormControl>
                          <FormLabel>Caption</FormLabel>
                          <Input
                            value={item.caption}
                            onChange={(e) => handleChange(e, index, 'caption', 'media')}
                            placeholder="Mô tả"
                            disabled={saving}
                          />
                        </FormControl>
                        {item.url && (
                          <Box w="full">
                            {renderMediaPreview(item)}
                          </Box>
                        )}
                        {index > 0 && (
                          <Button
                            leftIcon={<Trash2 />}
                            onClick={() => removeField(index, 'media')}
                            colorScheme="red"
                            size="sm"
                            disabled={saving}
                          >
                            Xóa
                          </Button>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
                <Button
                  leftIcon={<Plus />}
                  onClick={() => addField('media')}
                  size="sm"
                  mt={2}
                  disabled={saving}
                >
                  Thêm media
                </Button>
              </Box>

              {/* Ghi chú */}
              <FormControl>
                <FormLabel>Ghi chú</FormLabel>
                <Textarea
                  name="ghiChu"
                  value={formData.ghiChu}
                  onChange={handleChange}
                  placeholder="Nhập ghi chú"
                  resize="vertical"
                  disabled={saving}
                />
              </FormControl>

              {/* Submit button */}
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={saving}
                loadingText="Đang lưu..."
                leftIcon={<Save />}
              >
                Lưu thay đổi
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default CapNhatSuKien;