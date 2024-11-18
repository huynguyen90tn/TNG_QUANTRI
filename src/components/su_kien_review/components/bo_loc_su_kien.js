// File: src/components/su_kien_review/components/bo_loc_su_kien.js 
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { memo, useCallback } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Input,
  Select,
  ButtonGroup,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { SortAsc, SortDesc } from 'lucide-react';

const BoLocSuKien = memo(({ onFilterChange }) => {
  const bgColor = useColorModeValue('gray.700', 'gray.700');
  const borderColor = useColorModeValue('gray.600', 'gray.600');

  const handleChange = useCallback((type, value) => {
    onFilterChange(prev => ({ ...prev, [type]: value }));
  }, [onFilterChange]);

  return (
    <Grid 
      templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} 
      gap={4} 
      mb={6}
    >
      <GridItem>
        <Input
          type="date"
          placeholder="Từ ngày"
          onChange={(e) => handleChange('startDate', e.target.value)}
          bg={bgColor}
          borderColor={borderColor}
          _hover={{ borderColor: 'gray.500' }}
          _focus={{ borderColor: 'blue.500' }}
        />
      </GridItem>

      <GridItem>
        <Input
          type="date"
          placeholder="Đến ngày"
          onChange={(e) => handleChange('endDate', e.target.value)}
          bg={bgColor}
          borderColor={borderColor}
          _hover={{ borderColor: 'gray.500' }}
          _focus={{ borderColor: 'blue.500' }}
        />
      </GridItem>

      <GridItem>
        <Input
          type="month"
          onChange={(e) => handleChange('month', e.target.value)}
          bg={bgColor}
          borderColor={borderColor}
          _hover={{ borderColor: 'gray.500' }}
          _focus={{ borderColor: 'blue.500' }}
        />
      </GridItem>

      <GridItem>
        <Select
          onChange={(e) => handleChange('status', e.target.value)}
          bg={bgColor}
          borderColor={borderColor}
          _hover={{ borderColor: 'gray.500' }}
          _focus={{ borderColor: 'blue.500' }}
        >
          <option value="TAT_CA">Tất cả trạng thái</option>
          <option value="CHUA_DIEN_RA">Chưa diễn ra</option>
          <option value="DANG_DIEN_RA">Đang diễn ra</option>
          <option value="HOAN_THANH">Đã hoàn thành</option>
        </Select>
      </GridItem>

      <GridItem>
        <ButtonGroup isAttached variant="outline">
          <Button
            leftIcon={<SortAsc size={16} />}
            onClick={() => handleChange('sort', 'asc')}
            _hover={{ bg: 'gray.700' }}
          >
            Cũ nhất
          </Button>
          <Button
            leftIcon={<SortDesc size={16} />}
            onClick={() => handleChange('sort', 'desc')}
            _hover={{ bg: 'gray.700' }}
          >
            Mới nhất
          </Button>
        </ButtonGroup>
      </GridItem>
    </Grid>
  );
});

BoLocSuKien.displayName = 'BoLocSuKien';

export default BoLocSuKien;