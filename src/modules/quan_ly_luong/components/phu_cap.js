 
// File: src/modules/quan_ly_luong/components/phu_cap.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  useToast,
  HStack,
  VStack,
  Text,
  Badge
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { LOAI_PHU_CAP, PHONG_BAN } from '../constants/loai_luong';
import { formatCurrency } from '../../../utils/format';
import { useAuth } from '../../../hooks/useAuth';

const defaultPhuCap = {
  loaiPhuCap: '',
  mucPhuCap: 0,
  phongBan: '',
  chiTiet: '',
  trangThai: 'active'
};

export const PhuCap = () => {
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [danhSachPhuCap, setDanhSachPhuCap] = useState([]);
  const [selectedPhuCap, setSelectedPhuCap] = useState(null);
  const [formData, setFormData] = useState(defaultPhuCap);

  const isAdmin = user?.role === 'admin-tong' || user?.role === 'admin-con';

  const handleOpenForm = (phuCap = null) => {
    if (phuCap) {
      setSelectedPhuCap(phuCap);
      setFormData(phuCap);
    } else {
      setSelectedPhuCap(null);
      setFormData(defaultPhuCap);
    }
    onOpen();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (selectedPhuCap) {
        // Cập nhật phụ cấp
        const updatedList = danhSachPhuCap.map(item =>
          item.id === selectedPhuCap.id ? { ...item, ...formData } : item
        );
        setDanhSachPhuCap(updatedList);
        toast({
          title: 'Thành công',
          description: 'Đã cập nhật phụ cấp',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      } else {
        // Thêm phụ cấp mới
        setDanhSachPhuCap([
          ...danhSachPhuCap,
          { 
            id: Date.now().toString(),
            ...formData,
            ngayTao: new Date(),
            nguoiTao: user.id
          }
        ]);
        toast({
          title: 'Thành công',
          description: 'Đã thêm phụ cấp mới',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
      }
      onClose();
      setFormData(defaultPhuCap);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleDelete = (id) => {
    try {
      setDanhSachPhuCap(danhSachPhuCap.filter(item => item.id !== id));
      toast({
        title: 'Thành công',
        description: 'Đã xóa phụ cấp',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const tongPhuCap = useMemo(() => 
    danhSachPhuCap.reduce((sum, item) => sum + item.mucPhuCap, 0),
    [danhSachPhuCap]
  );

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold">Quản Lý Phụ Cấp</Text>
        {isAdmin && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => handleOpenForm()}
          >
            Thêm Phụ Cấp
          </Button>
        )}
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Loại Phụ Cấp</Th>
            <Th>Phòng Ban</Th>
            <Th isNumeric>Mức Phụ Cấp</Th>
            <Th>Chi Tiết</Th>
            <Th>Trạng Thái</Th>
            {isAdmin && <Th>Thao Tác</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {danhSachPhuCap.map((item) => (
            <Tr key={item.id}>
              <Td>{LOAI_PHU_CAP[item.loaiPhuCap]}</Td>
              <Td>{PHONG_BAN.find(pb => pb.id === item.phongBan)?.ten}</Td>
              <Td isNumeric>{formatCurrency(item.mucPhuCap)}</Td>
              <Td>{item.chiTiet}</Td>
              <Td>
                <Badge
                  colorScheme={item.trangThai === 'active' ? 'green' : 'red'}
                >
                  {item.trangThai === 'active' ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                </Badge>
              </Td>
              {isAdmin && (
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      leftIcon={<EditIcon />}
                      onClick={() => handleOpenForm(item)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      leftIcon={<DeleteIcon />}
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </Button>
                  </HStack>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Box mt={4} p={4} borderRadius="lg" bg="blue.50" _dark={{ bg: 'blue.900' }}>
        <Text fontSize="lg" fontWeight="bold">
          Tổng mức phụ cấp: {formatCurrency(tongPhuCap)}
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              {selectedPhuCap ? 'Cập Nhật Phụ Cấp' : 'Thêm Phụ Cấp Mới'}
            </ModalHeader>
            <ModalCloseButton />
            
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Loại phụ cấp</FormLabel>
                  <Select
                    value={formData.loaiPhuCap}
                    onChange={(e) => setFormData({
                      ...formData,
                      loaiPhuCap: e.target.value
                    })}
                  >
                    <option value="">Chọn loại phụ cấp</option>
                    {Object.entries(LOAI_PHU_CAP).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phòng ban</FormLabel>
                  <Select
                    value={formData.phongBan}
                    onChange={(e) => setFormData({
                      ...formData,
                      phongBan: e.target.value
                    })}
                  >
                    <option value="">Chọn phòng ban</option>
                    {PHONG_BAN.map((pb) => (
                      <option key={pb.id} value={pb.id}>{pb.ten}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Mức phụ cấp</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.mucPhuCap}
                    onChange={(value) => setFormData({
                      ...formData,
                      mucPhuCap: Number(value)
                    })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Chi tiết</FormLabel>
                  <Input
                    value={formData.chiTiet}
                    onChange={(e) => setFormData({
                      ...formData,
                      chiTiet: e.target.value
                    })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select
                    value={formData.trangThai}
                    onChange={(e) => setFormData({
                      ...formData,
                      trangThai: e.target.value
                    })}
                  >
                    <option value="active">Đang áp dụng</option>
                    <option value="inactive">Ngừng áp dụng</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Hủy
              </Button>
              <Button colorScheme="blue" type="submit">
                {selectedPhuCap ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PhuCap;