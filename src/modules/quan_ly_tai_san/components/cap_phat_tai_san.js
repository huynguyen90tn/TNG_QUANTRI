// File: src/modules/quan_ly_tai_san/components/cap_phat_tai_san.js
// Link tham khảo: https://chakra-ui.com/docs
// Nhánh: main 

import React, { useState, useCallback, useEffect } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  useToast,
  Box,
  Badge,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertDescription
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useTaiSan } from '../hooks/use_tai_san';
import { useAuth } from '../../../hooks/useAuth';
import { getUserList, getUsersByDepartmentsAndRoles } from '../../../services/api/userApi';
import { useMemberList } from '../../../hooks/use_member_list';
import { capPhatTaiSanAsync, thuHoiTaiSanAsync } from '../store/tai_san_slice';

const initialFormData = {
  nguoiSuDung: '',
  emailNguoiDung: '',
  maNguoiDung: '',
  ngayCapPhat: new Date().toISOString().split('T')[0],
  ghiChu: '',
  nguoiCapPhat: ''
};

const CapPhatTaiSan = ({ taiSan, onSuccess }) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const toast = useToast();
  const { members, loading: loadingMembers, fetchMembers } = useMemberList();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load danh sách thành viên
  useEffect(() => {
    if (taiSan?.phongBan) {
      fetchMembers();
    }
  }, [taiSan?.phongBan, fetchMembers]);

  const handleNguoiDungChange = useCallback((emailNguoiDung) => {
    const selectedMember = members.find(member => member.email === emailNguoiDung);
    if (selectedMember) {
      setFormData(prev => ({
        ...prev,
        nguoiSuDung: selectedMember.fullName,
        emailNguoiDung: selectedMember.email,
        maNguoiDung: selectedMember.memberCode || ''
      }));
    }
  }, [members]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.emailNguoiDung) newErrors.emailNguoiDung = 'Người sử dụng là bắt buộc';
    if (!formData.ngayCapPhat) newErrors.ngayCapPhat = 'Ngày cấp phát là bắt buộc';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleCapPhat = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(capPhatTaiSanAsync({
        taiSanId: taiSan.id,
        data: {
          ...formData,
          nguoiCapPhat: user.id
        }
      })).unwrap();

      toast({
        title: 'Thành công',
        description: 'Đã cấp phát tài sản',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThuHoi = async () => {
    if (!taiSan?.id) return;

    setLoading(true);
    try {
      await dispatch(thuHoiTaiSanAsync({
        taiSanId: taiSan.id,  
        data: {
          nguoiThuHoi: user.id,
          lyDo: formData.ghiChu
        }
      })).unwrap();

      toast({
        title: 'Thành công',
        description: 'Đã thu hồi tài sản',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Lỗi', 
        description: error.message || 'Có lỗi xảy ra',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!taiSan) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Không tìm thấy thông tin tài sản</AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Box 
        p={4} 
        bg="whiteAlpha.50" 
        borderRadius="md"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem>
            <Text color="gray.400">Mã tài sản</Text>
            <Text fontWeight="medium">{taiSan.ma}</Text>
          </GridItem>
          
          <GridItem>
            <Text color="gray.400">Tên tài sản</Text>
            <Text fontWeight="medium">{taiSan.ten}</Text>
          </GridItem>

          <GridItem>
            <Text color="gray.400">Phòng ban</Text>
            <Text fontWeight="medium">{taiSan.phongBan}</Text>
          </GridItem>

          <GridItem>
            <Text color="gray.400">Trạng thái</Text>
            <Badge 
              colorScheme={
                taiSan.trangThai === 'cho_cap_phat' 
                  ? 'blue' 
                  : taiSan.trangThai === 'da_cap_phat' 
                    ? 'green' 
                    : 'gray'
              }
            >
              {taiSan.trangThai === 'cho_cap_phat' 
                ? 'Chờ cấp phát'
                : taiSan.trangThai === 'da_cap_phat'
                  ? 'Đã cấp phát'
                  : 'Khác'
              }
            </Badge>
          </GridItem>
        </Grid>
      </Box>

      {taiSan.trangThai === 'da_cap_phat' ? (
        <Box>
          <Alert status="info" mb={4}>
            <AlertIcon />
            <AlertDescription>
              Tài sản đang được cấp phát cho: <strong>{taiSan.nguoiSuDung}</strong>
            </AlertDescription>
          </Alert>

          <form>
            <FormControl mb={4}>
              <FormLabel>Lý do thu hồi</FormLabel>
              <Textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData(prev => ({ ...prev, ghiChu: e.target.value }))}
                placeholder="Nhập lý do thu hồi"
                bg="whiteAlpha.100"
              />
            </FormControl>

            <Button
              colorScheme="red"
              onClick={handleThuHoi}
              isLoading={loading}
              width="full"
            >
              Thu hồi tài sản
            </Button>
          </form>
        </Box>
      ) : (
        <form onSubmit={handleCapPhat}>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={!!errors.emailNguoiDung}>
              <FormLabel>Email người sử dụng</FormLabel>
              <Select
                value={formData.emailNguoiDung}
                onChange={(e) => handleNguoiDungChange(e.target.value)}
                placeholder="Chọn email người sử dụng"
                bg="whiteAlpha.100"
                isDisabled={loadingMembers}
              >
                {members.map((member) => (
                  <option key={member.email} value={member.email}>
                    {member.fullName} - {member.email}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{errors.emailNguoiDung}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Mã người sử dụng</FormLabel>
              <Input
                value={formData.maNguoiDung}
                readOnly
                bg="whiteAlpha.50"
                placeholder="Mã sẽ tự động điền khi chọn email"
              />
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.ngayCapPhat}>
              <FormLabel>Ngày cấp phát</FormLabel>
              <Input
                type="date"
                value={formData.ngayCapPhat}
                onChange={(e) => setFormData(prev => ({ ...prev, ngayCapPhat: e.target.value }))}
                bg="whiteAlpha.100"
              />
              <FormErrorMessage>{errors.ngayCapPhat}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Ghi chú</FormLabel>
              <Textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData(prev => ({ ...prev, ghiChu: e.target.value }))}
                placeholder="Nhập ghi chú nếu có"
                bg="whiteAlpha.100"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Cấp phát tài sản
            </Button>
          </VStack>
        </form>
      )}
    </VStack>
  );
};

export default CapPhatTaiSan;