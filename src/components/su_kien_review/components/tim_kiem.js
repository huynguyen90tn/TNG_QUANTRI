// File: src/components/su_kien_review/components/tim_kiem.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { memo, useCallback } from 'react';
import {
  InputGroup,
  InputLeftElement,
  Input,
  useColorModeValue
} from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { useSuKien } from '../hooks/use_su_kien';

const TimKiem = memo(() => {
  const { setSearchTerm } = useSuKien();
  const bgColor = useColorModeValue('gray.700', 'gray.700');
  const borderColor = useColorModeValue('gray.600', 'gray.600');

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <Search color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Tìm kiếm sự kiện..."
        onChange={handleSearch}
        bg={bgColor}
        borderColor={borderColor}
        _hover={{
          borderColor: 'gray.500'
        }}
        _focus={{
          borderColor: 'blue.500',
          boxShadow: '0 0 0 1px blue.500'
        }}
        color="white"
      />
    </InputGroup>
  );
});

TimKiem.displayName = 'TimKiem';

export default TimKiem;