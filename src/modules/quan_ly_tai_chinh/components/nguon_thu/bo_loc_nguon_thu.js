 
// File: src/modules/quan_ly_tai_chinh/components/nguon_thu/bo_loc_nguon_thu.js
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
  Button,
  Stack,
  useColorModeValue
} from '@chakra-ui/react';
import { useNguonThu } from '../../hooks/use_nguon_thu';
import { LOAI_NGUON_THU, TEN_LOAI_NGUON_THU } from '../../constants/loai_nguon_thu';
import { TRANG_THAI, TEN_TRANG_THAI } from '../../constants/trang_thai';

const BoLocNguonThu = () => {
  const { boLoc, capNhatBoLoc } = useNguonThu();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    capNhatBoLoc({
      tuNgay: formData.get('tuNgay'),
      denNgay: formData.get('denNgay'),
      loaiThu: formData.get('loaiThu'),
      trangThai: formData.get('trangThai')
    });
  };

  const handleReset = () => {
    capNhatBoLoc({
      tuNgay: null,
      denNgay: null,
      loaiThu: 'TAT_CA',
      trangThai: 'TAT_CA'
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
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
            <FormLabel>Loại thu</FormLabel>
            <Select 
              name="loaiThu"
              defaultValue={boLoc.loaiThu}
            >
              <option value="TAT_CA">Tất cả</option>
              {Object.entries(TEN_LOAI_NGUON_THU).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
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

export default BoLocNguonThu;