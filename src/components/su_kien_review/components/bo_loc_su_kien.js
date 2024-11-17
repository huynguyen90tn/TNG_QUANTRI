// File: src/components/su_kien_review/components/bo_loc_su_kien.js
// Link tham khảo: https://chakra-ui.com/docs/components/select
// Nhánh: main
import React, { memo, useCallback } from 'react';
import { Select, FormControl, FormLabel } from '@chakra-ui/react';
import { useSuKien } from '../hooks/use_su_kien';

const BoLocSuKien = memo(() => {
  const { trangThai, chonTrangThai } = useSuKien();

  const handleChange = useCallback((e) => {
    chonTrangThai(e.target.value);
  }, [chonTrangThai]);

  return (
    <FormControl>
      <FormLabel>Lọc theo trạng thái</FormLabel>
      <Select value={trangThai} onChange={handleChange}>
        <option value="TAT_CA">Tất cả</option>
        <option value="CHUA_DIEN_RA">Chưa diễn ra</option>
        <option value="DANG_DIEN_RA">Đang diễn ra</option>
        <option value="HOAN_THANH">Hoàn thành</option>
      </Select>
    </FormControl>
  );
});

BoLocSuKien.displayName = 'BoLocSuKien';

export default BoLocSuKien;
