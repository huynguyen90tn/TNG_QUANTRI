// File: src/modules/quan_ly_tai_chinh/components/common/phan_trang.js
// Link tham khảo: https://chakra-ui.com/docs/components/pagination
// Nhánh: main

import React from 'react';
import {
  Flex,
  Button,
  Text,
  Select,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PhanTrang = ({ 
  trangHienTai, 
  tongSoTrang, 
  soLuongMoiTrang,
  onChangeTrang,
  onChangeSoLuong 
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleChangeTrang = (trang) => {
    if (trang >= 1 && trang <= tongSoTrang) {
      onChangeTrang(trang);
    }
  };

  return (
    <Flex justifyContent="space-between" alignItems="center" mt={4}>
      <HStack spacing={2}>
        <Text whiteSpace="nowrap">Số lượng mỗi trang:</Text>
        <Select
          w="70px"
          value={soLuongMoiTrang}
          onChange={(e) => onChangeSoLuong(Number(e.target.value))}
          borderColor={borderColor}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </Select>
      </HStack>

      <HStack spacing={2}>
        <Button
          size="sm"
          leftIcon={<FiChevronLeft />}
          onClick={() => handleChangeTrang(trangHienTai - 1)}
          isDisabled={trangHienTai === 1}
        >
          Trước
        </Button>

        {[...Array(tongSoTrang)].map((_, index) => {
          const trang = index + 1;
          const hienThi = 
            trang === 1 || 
            trang === tongSoTrang || 
            (trang >= trangHienTai - 1 && trang <= trangHienTai + 1);

          if (!hienThi) {
            if (trang === trangHienTai - 2 || trang === trangHienTai + 2) {
              return <Text key={trang}>...</Text>;
            }
            return null;
          }

          return (
            <Button
              key={trang}
              size="sm"
              variant={trang === trangHienTai ? "solid" : "outline"}
              colorScheme={trang === trangHienTai ? "blue" : "gray"}
              onClick={() => handleChangeTrang(trang)}
            >
              {trang}
            </Button>
          );
        })}

        <Button
          size="sm"
          rightIcon={<FiChevronRight />}
          onClick={() => handleChangeTrang(trangHienTai + 1)}
          isDisabled={trangHienTai === tongSoTrang}
        >
          Sau
        </Button>
      </HStack>
    </Flex>
  );
};

export default PhanTrang;