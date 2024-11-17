// File: src/components/su_kien_review/components/tim_kiem.js
// Link tham khảo: https://chakra-ui.com/docs/components/input
// Nhánh: main
import React, { memo, useCallback } from 'react';
import { Input, FormControl, FormLabel } from '@chakra-ui/react';
import { useSuKien } from '../hooks/use_su_kien';

const TimKiem = memo(() => {
  const { timKiem } = useSuKien();

  const handleChange = useCallback((e) => {
    timKiem(e.target.value);
  }, [timKiem]);

  return (
    <FormControl>
      <FormLabel>Tìm kiếm sự kiện</FormLabel>
      <Input
        placeholder="Nhập tên sự kiện cần tìm..."
        onChange={handleChange}
      />
    </FormControl>
  );
});

TimKiem.displayName = 'TimKiem';

export default TimKiem;
