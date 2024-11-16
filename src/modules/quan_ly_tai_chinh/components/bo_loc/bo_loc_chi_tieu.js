// File: src/modules/quan_ly_tai_chinh/components/bo_loc/bo_loc_chi_tieu.js
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
import { LOAI_CHI_TIEU, TEN_LOAI_CHI_TIEU } from '../../constants/loai_chi_tieu';

const BoLocChiTieu = () => {
  const { register, handleSubmit, reset } = useForm();
  const { boLoc, capNhatBoLoc } = useTaiChinh();
  const bgColor = useColorModeValue('white', 'gray.800');

  const onSubmit = (data) => {
    capNhatBoLoc({
      ...data,
      mucTienTu: data.mucTienTu ? Number(data.mucTienTu) : null,
      mucTienDen: data.mucTienDen ? Number(data.mucTienDen) : null
    });
  };

  const handleReset = () => {
    reset({
      tuNgay: '',
      denNgay: '',
      loaiChi: 'TAT_CA',
      mucTienTu: '',
      mucTienDen: ''
    });
    capNhatBoLoc({
      tuNgay: null,
      denNgay: null,
      loaiChi: 'TAT_CA',
      mucTienTu: null,
      mucTienDen: null
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
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
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
            <FormLabel>Loại chi tiêu</FormLabel>
            <Select
              {...register('loaiChi')}
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
              {...register('mucTienTu')}
              defaultValue={boLoc.mucTienTu || ''}
              min={0}
              placeholder="Nhập số tiền"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Mức tiền đến</FormLabel>
            <Input
              type="number"
              {...register('mucTienDen')}
              defaultValue={boLoc.mucTienDen || ''}
              min={0}
              placeholder="Nhập số tiền"
            />
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

export default BoLocChiTieu;