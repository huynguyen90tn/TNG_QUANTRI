// File: src/modules/quan_ly_nghi_phep/components/bo_loc_don_nghi_phep.js
// Link tham khảo: https://chakra-ui.com/docs/components/form-control
// Link tham khảo về xử lý form: https://chakra-ui.com/docs/components/form-control


import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Stack,
  HStack,
  Select,
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Collapse,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  CloseIcon 
} from '@chakra-ui/icons';
import { 
  TRANG_THAI_LABEL,
  LOAI_NGHI_PHEP_LABEL 
} from '../constants/trang_thai_don';
import { useAuth } from '../../../hooks/useAuth';


const PHONG_BAN_OPTIONS = [
  { value: 'IT', label: 'IT' },
  { value: 'HR', label: 'HR' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Finance', label: 'Finance' }
];

const BoLocDonNghiPhep = ({ onFilter, isLoading }) => {
  const { user } = useAuth();
  const { isOpen, onToggle } = useDisclosure();

  // Theme colors
  const bgColor = useColorModeValue('whiteAlpha.50', 'whiteAlpha.50');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const inputBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.50');

  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    department: '',
    startDate: '',
    endDate: '',
  });

  const handleInputChange = useCallback((field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleFilter = useCallback(() => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});

    onFilter(activeFilters);
  }, [filters, onFilter]);

  const handleReset = useCallback(() => {
    const emptyFilters = {
      status: '',
      leaveType: '',
      department: '',
      startDate: '',
      endDate: '',
    };
    setFilters(emptyFilters);
    onFilter({});
  }, [onFilter]);

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  const validateDateRange = useCallback(() => {
    const { startDate, endDate } = filters;
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return false;
    }
    return true;
  }, [filters]);

  const isDateRangeValid = validateDateRange();

  return (
    <Box
      p={4}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      mb={4}
    >
      <HStack justify="space-between" mb={isOpen ? 4 : 0}>
        <Button
          variant="ghost"
          onClick={onToggle}
          rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          aria-label={isOpen ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc'}
          color={labelColor}
          _hover={{ bg: 'whiteAlpha.200' }}
        >
          Bộ lọc tìm kiếm
        </Button>
        
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="red"
            leftIcon={<CloseIcon />}
            onClick={handleReset}
            aria-label="Xóa bộ lọc"
            _hover={{ bg: 'red.900' }}
          >
            Xóa bộ lọc
          </Button>
        )}
      </HStack>

      <Collapse in={isOpen}>
        <Stack spacing={4}>
          <HStack spacing={4} align="flex-end">
            <FormControl>
              <FormLabel color={labelColor}>Trạng thái</FormLabel>
              <Select
                placeholder="Tất cả trạng thái"
                value={filters.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                aria-label="Chọn trạng thái"
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.400' }}
              >
                {Object.entries(TRANG_THAI_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color={labelColor}>Loại nghỉ phép</FormLabel>
              <Select
                placeholder="Tất cả loại nghỉ phép"
                value={filters.leaveType}
                onChange={(e) => handleInputChange('leaveType', e.target.value)}
                aria-label="Chọn loại nghỉ phép"
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.400' }}
              >
                {Object.entries(LOAI_NGHI_PHEP_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormControl>

            {user?.role === 'admin-tong' && (
              <FormControl>
                <FormLabel color={labelColor}>Phòng ban</FormLabel>
                <Select
                  placeholder="Tất cả phòng ban"
                  value={filters.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  aria-label="Chọn phòng ban"
                  bg={inputBg}
                  borderColor={borderColor}
                  _hover={{ borderColor: 'blue.400' }}
                >
                  {PHONG_BAN_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
          </HStack>

          <HStack spacing={4} align="flex-end">
            <FormControl isInvalid={!isDateRangeValid}>
              <FormLabel color={labelColor}>Từ ngày</FormLabel>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                max={filters.endDate || undefined}
                aria-label="Chọn ngày bắt đầu"
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.400' }}
              />
            </FormControl>

            <FormControl isInvalid={!isDateRangeValid}>
              <FormLabel color={labelColor}>Đến ngày</FormLabel>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={filters.startDate || undefined}
                aria-label="Chọn ngày kết thúc"
                bg={inputBg}
                borderColor={borderColor}
                _hover={{ borderColor: 'blue.400' }}
              />
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleFilter}
              isLoading={isLoading}
              loadingText="Đang lọc..."
              isDisabled={!isDateRangeValid}
              minW="120px"
              aria-label="Áp dụng bộ lọc"
            >
              Lọc
            </Button>
          </HStack>
        </Stack>
      </Collapse>
    </Box>
  );
};

BoLocDonNghiPhep.propTypes = {
  onFilter: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

BoLocDonNghiPhep.defaultProps = {
  isLoading: false,
};

export default memo(BoLocDonNghiPhep);