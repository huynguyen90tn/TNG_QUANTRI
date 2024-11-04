// File: src/modules/nhiem_vu_hang_ngay/components/xac_nhan_thuc_hien.js
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  useToast
} from '@chakra-ui/react';
import { capNhatTrangThaiNhiemVuAsync } from '../store/nhiem_vu_slice';

const XacNhanThucHien = ({ nhiemVu }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const handleXacNhan = async () => {
    try {
      await dispatch(capNhatTrangThaiNhiemVuAsync({
        nhiemVuId: nhiemVu.id,
        trangThaiMoi: 'hoan_thanh'
      })).unwrap();

      toast({
        title: 'Xác nhận thành công',
        description: 'Đã cập nhật trạng thái nhiệm vụ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button
      colorScheme="blue"
      size="sm"
      onClick={handleXacNhan}
      isDisabled={nhiemVu.trangThai === 'hoan_thanh'}
    >
      {nhiemVu.trangThai === 'hoan_thanh' ? 'Đã hoàn thành' : 'Xác nhận thực hiện'}
    </Button>
  );
};

export default XacNhanThucHien;
