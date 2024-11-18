// File: src/components/su_kien_review/components/form_su_kien.js
// Link tham khảo: https://chakra-ui.com/docs/components/form
// Nhánh: main

import React, { useState, useCallback, useMemo, useRef, memo } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  useToast,
  Spinner,
  IconButton,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  Image,
  AspectRatio,
  FormHelperText,
} from '@chakra-ui/react';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { useSuKien } from '../hooks/use_su_kien';

// Constants
const INITIAL_FORM_STATE = {
  tenSuKien: '',
  donViToChuc: '',
  ngayToChuc: '',
  gioToChuc: '',
  ngayKetThuc: '',
  gioKetThuc: '',
  diaDiem: '',
  thanhVienThamGia: [''],
  nguoiLienHe: [{
    hoTen: '',
    chucVu: '',
    soDienThoai: '',
    ghiChu: ''
  }],
  links: [{
    url: '',
    ghiChu: ''
  }],
  media: [{
    type: 'image',
    url: '',
    caption: ''
  }],
  ghiChu: ''
};

const REQUIRED_FIELDS = [
  'tenSuKien',
  'donViToChuc',
  'ngayToChuc',
  'gioToChuc',
  'ngayKetThuc',
  'gioKetThuc',
  'diaDiem'
];

// Utility functions
const getYoutubeEmbedUrl = (url) => {
  try {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  } catch {
    return '';
  }
};

const isValidDateTime = (ngayToChuc, gioToChuc, ngayKetThuc, gioKetThuc) => {
  const startDateTime = new Date(`${ngayToChuc}T${gioToChuc}`);
  const endDateTime = new Date(`${ngayKetThuc}T${gioKetThuc}`);
  return startDateTime && endDateTime && endDateTime > startDateTime;
};

const prepareFormData = (data) => {
  return {
    ...data,
    tenSuKien: data.tenSuKien.trim(),
    donViToChuc: data.donViToChuc.trim(),
    diaDiem: data.diaDiem.trim(),
    ghiChu: data.ghiChu.trim(),
    thanhVienThamGia: data.thanhVienThamGia.map(member => member.trim()).filter(Boolean),
    nguoiLienHe: data.nguoiLienHe.map(contact => ({
      ...contact,
      hoTen: contact.hoTen.trim(),
      chucVu: contact.chucVu.trim(),
      soDienThoai: contact.soDienThoai.trim(),
      ghiChu: contact.ghiChu.trim()
    })).filter(contact => contact.hoTen),
    links: data.links.map(link => ({
      ...link,
      url: link.url.trim(),
      ghiChu: link.ghiChu.trim()
    })).filter(link => link.url),
    media: data.media.map(item => ({
      ...item,
      url: item.url.trim(),
      caption: item.caption.trim()
    })).filter(item => item.url)
  };
};

const FormSuKien = memo(() => {
  // Hooks
  const toast = useToast();
  const { themSuKien, loading } = useSuKien();
  const formRef = useRef(null);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Memoized handlers
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setFormData(INITIAL_FORM_STATE);
  }, []);

  const handleChange = useCallback((e, index, field, parentField) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (parentField) {
        const newArray = [...prev[parentField]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [parentField]: newArray };
      }
      if (field === 'thanhVienThamGia') {
        const newThanhVien = [...prev.thanhVienThamGia];
        newThanhVien[index] = value;
        return { ...prev, thanhVienThamGia: newThanhVien };
      }
      return { ...prev, [name]: value };
    });
  }, []);

  const addField = useCallback((fieldName) => {
    setFormData(prev => {
      const templates = {
        thanhVienThamGia: '',
        nguoiLienHe: { hoTen: '', chucVu: '', soDienThoai: '', ghiChu: '' },
        links: { url: '', ghiChu: '' },
        media: { type: 'image', url: '', caption: '' }
      };

      return {
        ...prev,
        [fieldName]: [...prev[fieldName], templates[fieldName]]
      };
    });
  }, []);

  const removeField = useCallback((index, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  }, []);

  // Form validation
  const validateForm = useCallback((data) => {
    // Kiểm tra các trường bắt buộc
    const missingFields = REQUIRED_FIELDS.filter(field => !data[field].trim());
    if (missingFields.length > 0) {
      return false;
    }

    // Kiểm tra thời gian
    if (!isValidDateTime(data.ngayToChuc, data.gioToChuc, data.ngayKetThuc, data.gioKetThuc)) {
      return false;
    }

    // Kiểm tra media
    const invalidMedia = data.media.some(item => {
      if (!item.url.trim()) return false;
      if (item.type === 'youtube' && !getYoutubeEmbedUrl(item.url.trim())) {
        return true;
      }
      return false;
    });

    return !invalidMedia;
  }, []);

  const isFormValid = useMemo(() => validateForm(formData), [formData, validateForm]);

  // Form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast({
        title: "Vui lòng kiểm tra lại thông tin",
        description: "Một số trường thông tin chưa hợp lệ hoặc còn thiếu",
        status: "warning",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    try {
      const preparedData = prepareFormData(formData);
      
      await themSuKien(preparedData);
      
      toast({
        title: "Thêm sự kiện thành công",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      
      handleClose();
    } catch (error) {
      console.error('Lỗi khi thêm sự kiện:', error);
      toast({
        title: "Lỗi khi thêm sự kiện",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  }, [formData, isFormValid, themSuKien, toast, handleClose]);

  // Render Media Preview
  const renderMediaPreview = useMemo(() => (item) => {
    if (!item.url.trim()) return null;

    if (item.type === 'image') {
      return (
        <Image 
          src={item.url} 
          alt={item.caption} 
          maxH="200px"
          objectFit="contain"
          fallback={<Box p={4} bg="gray.100" textAlign="center">Không thể tải ảnh</Box>}
        />
      );
    }

    const embedUrl = getYoutubeEmbedUrl(item.url.trim());
    if (!embedUrl) return null;

    return (
      <AspectRatio ratio={16/9}>
        <iframe
          src={embedUrl}
          title={item.caption}
          allowFullScreen
        />
      </AspectRatio>
    );
  }, []);

  return (
    <Box>
      <Button
        colorScheme="blue"
        onClick={() => setIsOpen(true)}
        leftIcon={<Plus size={20} />}
      >
        Thêm sự kiện mới
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="800px">
          <ModalHeader>Thêm sự kiện mới</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit} ref={formRef}>
              <VStack spacing={4}>
                {/* Basic Information */}
                <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel>Tên sự kiện</FormLabel>
                      <Input
                        name="tenSuKien"
                        value={formData.tenSuKien}
                        onChange={handleChange}
                        placeholder="Nhập tên sự kiện"
                        disabled={loading}
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
                        placeholder="Nhập đơn vị tổ chức"
                        disabled={loading}
                      />
                    </FormControl>
                  </GridItem>

                  {/* Date and Time Fields */}
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Ngày tổ chức</FormLabel>
                      <Input
                        name="ngayToChuc"
                        type="date"
                        value={formData.ngayToChuc}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Giờ tổ chức</FormLabel>
                      <Input
                        name="gioToChuc"
                        type="time"
                        value={formData.gioToChuc}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <Input
                        name="ngayKetThuc"
                        type="date"
                        value={formData.ngayKetThuc}
                        onChange={handleChange}
                        min={formData.ngayToChuc}
                        disabled={loading}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>Giờ kết thúc</FormLabel>
                      <Input
                        name="gioKetThuc"
                        type="time"
                        value={formData.gioKetThuc}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel>Địa điểm</FormLabel>
                      <Input
                        name="diaDiem"
                        value={formData.diaDiem}
                        onChange={handleChange}
                        placeholder="Nhập địa điểm tổ chức"
                        disabled={loading}
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                {/* Media Section */}
                <Box w="full">
                  <FormLabel>Ảnh/Video sự kiện</FormLabel>
                  {formData.media.map((item, index) => (
                    <VStack key={`media-${index}`} w="full" p={4} borderWidth={1} borderRadius="md" mb={4}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                        <FormControl>
                          <FormLabel>Loại</FormLabel>
                          <Select
                            value={item.type}
                            onChange={(e) => handleChange(e, index, 'type', 'media')}
                            disabled={loading}
                          >
                            <option value="image">Ảnh</option>
                            <option value="youtube">Youtube</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>
                            {item.type === 'image' ? 'Link ảnh' : 'Link Youtube'}
                          </FormLabel>
                          <Input
                            value={item.url}
                            onChange={(e) => handleChange(e, index, 'url', 'media')}
                            placeholder={item.type === 'image' ? 'Nhập link ảnh' : 'Nhập link Youtube'}
                            disabled={loading}
                          />
                          {item.type === 'youtube' && (
                            <FormHelperText>
                              Hỗ trợ link dạng: https://youtube.com/watch?v=... hoặc https://youtu.be/...
                            </FormHelperText>
                          )}
                        </FormControl>

                        <FormControl gridColumn="span 2">
                          <FormLabel>Mô tả</FormLabel>
                          <Input
                            value={item.caption}
                            onChange={(e) => handleChange(e, index, 'caption', 'media')}
                            placeholder="Nhập mô tả cho ảnh/video"
                            disabled={loading}
                          />
                        </FormControl>

                        <Box gridColumn="span 2">
                          {renderMediaPreview(item)}
                        </Box>
                      </Grid>
                      
                      {index > 0 && (
                        <Button
                          leftIcon={<Trash2 />}
                          onClick={() => removeField(index, 'media')}
                          colorScheme="red"
                          size="sm"
                          isDisabled={loading}
                        >
                          Xóa
                        </Button>
                      )}
                    </VStack>
                  ))}
                  <Button
                    leftIcon={<Plus />}
                    onClick={() => addField('media')}
                    size="sm"
                    mt={2}
                    isDisabled={loading}
                  >
                    Thêm ảnh/video
                  </Button>
                </Box>

                {/* Thành viên tham gia */}
                <Box w="full">
                  <FormLabel>Thành viên tham gia</FormLabel>
                  {formData.thanhVienThamGia.map((member, index) => (
                    <HStack key={`member-${index}`} mb={2}>
                      <Input
                        value={member}
                        onChange={(e) => handleChange(e, index, 'thanhVienThamGia')}
                        placeholder="Nhập tên thành viên"
                        disabled={loading}
                      />
                      {index > 0 && (
                        <IconButton
                          icon={<Trash2 />}
                          onClick={() => removeField(index, 'thanhVienThamGia')}
                          colorScheme="red"
                          isDisabled={loading}
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
                    isDisabled={loading}
                  >
                    Thêm thành viên
                  </Button>
                </Box>

                {/* Người liên hệ */}
                <Box w="full">
                  <FormLabel>Người liên hệ</FormLabel>
                  {formData.nguoiLienHe.map((contact, index) => (
                    <VStack key={`contact-${index}`} w="full" p={4} borderWidth={1} borderRadius="md" mb={4}>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                        <FormControl>
                          <FormLabel>Họ và tên</FormLabel>
                          <Input
                            value={contact.hoTen}
                            onChange={(e) => handleChange(e, index, 'hoTen', 'nguoiLienHe')}
                            placeholder="Nhập họ tên"
                            disabled={loading}
                          />
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Chức vụ</FormLabel>
                          <Input
                            value={contact.chucVu}
                            onChange={(e) => handleChange(e, index, 'chucVu', 'nguoiLienHe')}
                            placeholder="Nhập chức vụ"
                            disabled={loading}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Số điện thoại</FormLabel>
                          <Input
                            value={contact.soDienThoai}
                            onChange={(e) => handleChange(e, index, 'soDienThoai', 'nguoiLienHe')}
                            placeholder="Nhập số điện thoại"
                            disabled={loading}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Ghi chú</FormLabel>
                          <Input
                            value={contact.ghiChu}
                            onChange={(e) => handleChange(e, index, 'ghiChu', 'nguoiLienHe')}
                            placeholder="Nhập ghi chú"
                            disabled={loading}
                          />
                        </FormControl>
                      </Grid>

                      {index > 0 && (
                        <Button
                          leftIcon={<Trash2 />}
                          onClick={() => removeField(index, 'nguoiLienHe')}
                          colorScheme="red"
                          size="sm"
                          isDisabled={loading}
                        >
                          Xóa
                        </Button>
                      )}
                    </VStack>
                  ))}
                  <Button
                    leftIcon={<Plus />}
                    onClick={() => addField('nguoiLienHe')}
                    size="sm"
                    mt={2}
                    isDisabled={loading}
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
                        placeholder="Nhập URL"
                        disabled={loading}
                      />
                      <Input
                        value={link.ghiChu}
                        onChange={(e) => handleChange(e, index, 'ghiChu', 'links')}
                        placeholder="Nhập ghi chú"
                        disabled={loading}
                      />
                      {index > 0 && (
                        <IconButton
                          icon={<Trash2 />}
                          onClick={() => removeField(index, 'links')}
                          colorScheme="red"
                          isDisabled={loading}
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
                    isDisabled={loading}
                  >
                    Thêm link
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
                    disabled={loading}
                  />
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="blue"
                  isDisabled={!isFormValid || loading}
                  width="full"
                  size="lg"
                >
                  {loading ? <Spinner size="sm" /> : 'Thêm sự kiện'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
});

FormSuKien.displayName = 'FormSuKien';

export default FormSuKien;