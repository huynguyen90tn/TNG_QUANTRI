// File: src/modules/quan_ly_tai_chinh/components/bo_loc/bo_loc_nguon_thu.js
// Link tham khảo: https://chakra-ui.com/docs/form/form-control
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
import { useForm } from 'react-hook-form';
import { useTaiChinh } from '../../hooks/use_tai_chinh';
import { LOAI_NGUON_THU, TEN_LOAI_NGUON_THU } from '../../constants/loai_nguon_thu'; 

const BoLocNguonThu = () => {
  const { register, handleSubmit, reset } = useForm();
  const { boLoc, capNhatBoLoc } = useTaiChinh();
  const bgColor = useColorModeValue('white', 'gray.800');

  const onSubmit = (data) => {
    capNhatBoLoc(data);
  };

  const handleReset = () => {
    reset({
      tuNgay: '',
      denNgay: '',
      loaiThu: 'TAT_CA'
    });
    capNhatBoLoc({
      tuNgay: null,
      denNgay: null, 
      loaiThu: 'TAT_CA'
    });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      p={4}
      bg={bgColor}
      borderRadius="lg"
      shadow="sm"
    >
      <Stack spacing={4}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <FormControl>
            <FormLabel>Từ ngày</FormLabel>
            <Input
              type="date"
              {...register('tuNgay')}
              defaultValue={boLoc.tuNgay || ''}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Đến ngày</FormLabel>
            <Input
              type="date"
              {...register('denNgay')}
              defaultValue={boLoc.denNgay || ''}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Loại nguồn thu</FormLabel>
            <Select
              {...register('loaiThu')}
              defaultValue={boLoc.loaiThu}
            >
              <option value="TAT_CA">Tất cả</option>
              {Object.entries(TEN_LOAI_NGUON_THU).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <Stack direction="row" spacing={4} justify="flex-end">
          <Button type="submit" colorScheme="blue">
            Áp dụng
          </Button>
          <Button onClick={handleReset} variant="ghost">
            Đặt lại
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default BoLocNguonThu;