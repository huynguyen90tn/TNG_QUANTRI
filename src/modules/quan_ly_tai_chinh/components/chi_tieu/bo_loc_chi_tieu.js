 
// File: src/modules/quan_ly_tai_chinh/components/chi_tieu/bo_loc_chi_tieu.js
// Link tham khảo: https://chakra-ui.com/docs/components/form-control
// Nhánh: main

import React from 'react';
import {
  Box,
  SimpleGrid,
  FormControl,
  FormLabel,
  Select,
  Input,
  Stack,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { useChiTieu } from '../../hooks/use_chi_tieu';
import { LOAI_CHI_TIEU, TEN_LOAI_CHI_TIEU } from '../../constants/loai_chi_tieu';
import { TRANG_THAI, TEN_TRANG_THAI } from '../../constants/trang_thai';

const BoLocChiTieu = () => {
  const { boLoc, capNhatBoLoc } = useChiTieu();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    capNhatBoLoc({
      tuNgay: formData.get('tuNgay'),
      denNgay: formData.get('denNgay'),
      loaiChi: formData.get('loaiChi'),
      trangThai: formData.get('trangThai'),
      mucTienTu: formData.get('mucTienTu') ? Number(formData.get('mucTienTu')) : null,
      mucTienDen: formData.get('mucTienDen') ? Number(formData.get('mucTienDen')) : null
    });
  };

  const handleReset = () => {
    capNhatBoLoc({
      tuNgay: null,
      denNgay: null,
      loaiChi: 'TAT_CA',
      trangThai: 'TAT_CA',
      mucTienTu: null,
      mucTienDen: null
    });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      bg={bgColor}
      borderRadius="lg"
      shadow="sm"
    >
      <Stack spacing={4}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          <FormControl>
            <FormLabel>Từ ngày</FormLabel>
            <Input
              type="date"
              name="tuNgay"
              defaultValue={boLoc.tuNgay}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Đến ngày</FormLabel>
            <Input
              type="date"
              name="denNgay"
              defaultValue={boLoc.denNgay}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Loại chi tiêu</FormLabel>
            <Select
              name="loaiChi"
              defaultValue={boLoc.loaiChi}
            >
              <option value="TAT_CA">Tất cả</option>
              {Object.entries(TEN_LOAI_CHI_TIEU).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Mức tiền từ</FormLabel>
            <Input
              type="number"
              name="mucTienTu"
              defaultValue={boLoc.mucTienTu}
              min={0}
              placeholder="Nhập số tiền"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Mức tiền đến</FormLabel>
            <Input
              type="number"
              name="mucTienDen"
              defaultValue={boLoc.mucTienDen}
              min={0}
              placeholder="Nhập số tiền"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Trạng thái</FormLabel>
            <Select
              name="trangThai"
              defaultValue={boLoc.trangThai}
            >
              <option value="TAT_CA">Tất cả</option>
              {Object.entries(TEN_TRANG_THAI).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <Stack direction="row" spacing={4} justify="flex-end">
          <Button type="submit" colorScheme="blue">
            Áp dụng
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            Đặt lại
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default BoLocChiTieu;