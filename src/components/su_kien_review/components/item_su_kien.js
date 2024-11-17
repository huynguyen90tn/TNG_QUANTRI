// File: src/components/su_kien_review/components/item_su_kien.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main
import React, { useCallback, memo } from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Link,
  useToast,
  Badge
} from '@chakra-ui/react';
import { useSuKien } from '../hooks/use_su_kien';

const ItemSuKien = memo(({ suKien }) => {
  const { xoaSuKien, capNhatSuKien, loading } = useSuKien();
  const toast = useToast();

  const handleXoa = useCallback(async () => {
    try {
      await xoaSuKien(suKien.id);
      toast({
        title: "Đã xóa sự kiện",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Lỗi khi xóa sự kiện",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [xoaSuKien, suKien.id, toast]);

  const handleCapNhat = useCallback(async (trangThai) => {
    try {
      await capNhatSuKien({ ...suKien, trangThai });
      toast({
        title: "Đã cập nhật trạng thái",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật trạng thái",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [capNhatSuKien, suKien, toast]);

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      width="100%"
      boxShadow="sm"
    >
      <VStack align="stretch" spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="bold">{suKien.tenSuKien}</Text>
          <Badge 
            colorScheme={
              suKien.trangThai === 'HOAN_THANH' ? 'green' :
              suKien.trangThai === 'DANG_DIEN_RA' ? 'yellow' :
              'gray'
            }
          >
            {suKien.trangThai}
          </Badge>
        </Box>
        
        <Text>Ngày tổ chức: {new Date(suKien.ngayToChuc).toLocaleDateString('vi-VN')}</Text>
        
        {suKien.linkQuayPhim && (
          <Link href={suKien.linkQuayPhim} isExternal color="blue.500">
            Link quay phim
          </Link>
        )}
        
        {suKien.linkKichBan && (
          <Link href={suKien.linkKichBan} isExternal color="blue.500">
            Link kịch bản
          </Link>
        )}
        
        {suKien.ghiChu && (
          <Text>Ghi chú: {suKien.ghiChu}</Text>
        )}

        <HStack spacing={2} justify="flex-end">
          <Button
            size="sm"
            colorScheme="green"
            onClick={() => handleCapNhat('HOAN_THANH')}
            isDisabled={loading}
          >
            Hoàn thành
          </Button>
          <Button
            size="sm"
            colorScheme="yellow"
            onClick={() => handleCapNhat('DANG_DIEN_RA')}
            isDisabled={loading}
          >
            Đang diễn ra
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            onClick={handleXoa}
            isDisabled={loading}
          >
            Xóa
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
});

ItemSuKien.displayName = 'ItemSuKien';

export default ItemSuKien;