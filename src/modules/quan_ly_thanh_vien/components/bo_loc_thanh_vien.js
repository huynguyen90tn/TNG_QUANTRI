// src/modules/quan_ly_thanh_vien/components/bo_loc_thanh_vien.js
import React from 'react';
import {
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  HStack,
  Button,
  VStack,
  useDisclosure,
  Collapse,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  PHONG_BAN,
  PHONG_BAN_LABEL
} from '../constants/trang_thai_thanh_vien';
import { useThanhVien } from '../hooks/use_thanh_vien';

const BoLocThanhVien = () => {
  const bg = useColorModeValue('gray.700', 'gray.800');
  const textColor = useColorModeValue('gray.100', 'gray.50');
  const buttonBg = useColorModeValue('gray.600', 'gray.700');
  const inputBg = useColorModeValue('gray.600', 'gray.700');

  const { boLoc, locDanhSach, datLaiDanhSach } = useThanhVien();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const [boLocTamThoi, setBoLocTamThoi] = React.useState(boLoc);

  const handleLocThayDoi = (ten, giaTri) => {
    setBoLocTamThoi(prev => ({
      ...prev,
      [ten]: giaTri
    }));
  };

  const handleApDungLoc = () => {
    locDanhSach(boLocTamThoi);
  };

  const handleDatLai = () => {
    setBoLocTamThoi({
      tuKhoa: '',
      phongBan: '',
      chucVu: '',
      trangThai: '',
    });
    datLaiDanhSach();
  };

  return (
    <Box bg={bg} p={4} rounded="md" shadow="sm" mb={4} color={textColor}>
      <HStack mb={4} justify="space-between">
        <Button
          leftIcon={<SearchIcon />}
          variant="ghost"
          onClick={onToggle}
          color={textColor}
          _hover={{ bg: buttonBg }}
        >
          Bộ lọc tìm kiếm
        </Button>
        <Button
          leftIcon={<RepeatIcon />}
          variant="ghost"
          onClick={handleDatLai}
          color={textColor}
          _hover={{ bg: buttonBg }}
        >
          Đặt lại
        </Button>
      </HStack>

      <Collapse in={isOpen}>
        <VStack spacing={4}>
          <HStack spacing={4} w="100%">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color={textColor} />
              </InputLeftElement>
              <Input
                placeholder="Tìm kiếm theo tên hoặc email"
                value={boLocTamThoi.tuKhoa}
                onChange={(e) => handleLocThayDoi('tuKhoa', e.target.value)}
                bg={inputBg}
                color={textColor}
                _placeholder={{ color: 'gray.400' }}
                borderColor="gray.600"
              />
            </InputGroup>

            <Select
              placeholder="Phòng ban"
              value={boLocTamThoi.phongBan}
              onChange={(e) => handleLocThayDoi('phongBan', e.target.value)}
              bg={inputBg}
              color={textColor}
              borderColor="gray.600"
            >
              {Object.entries(PHONG_BAN).map(([key, value]) => (
                <option key={key} value={value} style={{ backgroundColor: inputBg }}>
                  {PHONG_BAN_LABEL[value]}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Trạng thái"
              value={boLocTamThoi.trangThai}
              onChange={(e) => handleLocThayDoi('trangThai', e.target.value)}
              bg={inputBg}
              color={textColor}
              borderColor="gray.600"
            >
              {Object.entries(TRANG_THAI_THANH_VIEN).map(([key, value]) => (
                <option key={key} value={value} style={{ backgroundColor: inputBg }}>
                  {TRANG_THAI_LABEL[value]}
                </option>
              ))}
            </Select>
          </HStack>

          <HStack w="100%" justify="flex-end">
            <Button
              colorScheme="blue"
              onClick={handleApDungLoc}
            >
              Áp dụng
            </Button>
          </HStack>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default BoLocThanhVien;