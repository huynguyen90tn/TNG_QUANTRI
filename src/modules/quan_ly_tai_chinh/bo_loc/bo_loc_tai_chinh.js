// File: src/modules/quan_ly_tai_chinh/components/bo_loc/bo_loc_tai_chinh.js
// Link tham khảo: https://chakra-ui.com/docs/components/form
// Nhánh: main

import React from 'react';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { useTaiChinh } from '../../hooks/use_tai_chinh';

const BoLocTaiChinh = () => {
  const { boLoc, capNhatBoLoc } = useTaiChinh();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    capNhatBoLoc({
      tuNgay: formData.get('tuNgay'),
      denNgay: formData.get('denNgay'),
      loaiThu: formData.get('loaiThu'),
      loaiChi: formData.get('loaiChi')
    });
  };

  const handleReset = () => {
    capNhatBoLoc({
      tuNgay: null,
      denNgay: null,
      loaiThu: 'TAT_CA',
      loaiChi: 'TAT_CA'
    });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={bgColor}
      p={4}
      borderRadius="lg"
      shadow="sm"
    >
      <Stack spacing={4}>
        <HStack spacing={4}>
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
        </HStack>

        <HStack spacing={4}>
          <Button type="submit" colorScheme="blue">
            Áp dụng
          </Button>
          <Button variant="ghost" onClick={handleReset}>
            Đặt lại
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default BoLocTaiChinh;