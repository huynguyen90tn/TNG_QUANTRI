// File: src/components/su_kien_review/components/form_su_kien.js
// Link tham khảo: https://chakra-ui.com/docs/components/form
// Nhánh: main
import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Heading,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { useSuKien } from '../hooks/use_su_kien';

const FormSuKien = memo(() => {
  const toast = useToast();
  const { themSuKien, loading, error } = useSuKien();
  const [formData, setFormData] = useState({
    tenSuKien: '',
    ngayToChuc: '',
    linkQuayPhim: '',
    linkKichBan: '',
    ghiChu: ''
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const isFormValid = useMemo(() => {
    return formData.tenSuKien.trim() && formData.ngayToChuc;
  }, [formData.tenSuKien, formData.ngayToChuc]);

  const resetForm = useCallback(() => {
    setFormData({
      tenSuKien: '',
      ngayToChuc: '',
      linkQuayPhim: '',
      linkKichBan: '',
      ghiChu: ''
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        await themSuKien(formData);
        toast({
          title: "Thêm sự kiện thành công",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        resetForm();
      } catch (err) {
        toast({
          title: "Lỗi khi thêm sự kiện",
          description: error || "Đã có lỗi xảy ra",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [themSuKien, formData, isFormValid, toast, error, resetForm]);

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Thêm sự kiện mới</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
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

            <FormControl>
              <FormLabel>Link quay phim</FormLabel>
              <Input
                name="linkQuayPhim"
                value={formData.linkQuayPhim}
                onChange={handleChange}
                placeholder="Nhập link quay phim"
                disabled={loading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Link kịch bản</FormLabel>
              <Input
                name="linkKichBan"
                value={formData.linkKichBan}
                onChange={handleChange}
                placeholder="Nhập link kịch bản"
                disabled={loading}
              />
            </FormControl>

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
      </CardBody>
    </Card>
  );
});

FormSuKien.displayName = 'FormSuKien';

export default FormSuKien;
