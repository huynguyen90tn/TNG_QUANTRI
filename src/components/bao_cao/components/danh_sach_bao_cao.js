 
// src/components/bao_cao/components/danh_sach_bao_cao.js
import React from 'react';
import {
  VStack,
  Text,
  Spinner,
  Center,
  Button,
  HStack,
  Select,
  Box,
  useColorModeValue,
  Card,
  CardBody
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import ItemBaoCao from './item_bao_cao';

const MotionBox = motion(Box);

const DanhSachBaoCao = ({
  danhSachBaoCao = [],
  dangTai = false,
  onXem,
  onSua,
  onXoa,
  onDuyet,
  onTuChoi,
  quyen = {},
  // Phân trang
  trangHienTai = 1,
  tongSoTrang = 1,
  onChangeTrang,
  soBanGhiMoiTrang = 10,
  onChangeSoBanGhi,
  // Sắp xếp
  sapXep = {
    truong: 'ngayTao',
    huong: 'desc'
  },
  onChangeSapXep
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (dangTai) {
    return (
      <Center py={8}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  if (danhSachBaoCao.length === 0) {
    return (
      <Card
        bg={bgColor}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="lg"
      >
        <CardBody>
          <Center py={8}>
            <Text color="gray.500">
              Không có báo cáo nào
            </Text>
          </Center>
        </CardBody>
      </Card>
    );
  }

  const renderPagination = () => (
    <HStack spacing={2} justify="center" py={4}>
      <Button
        leftIcon={<ChevronLeftIcon />}
        onClick={() => onChangeTrang(trangHienTai - 1)}
        isDisabled={trangHienTai === 1}
        size="sm"
        variant="outline"
      >
        Trước
      </Button>
      
      <Text px={4} minW="100px" textAlign="center">
        Trang {trangHienTai} / {tongSoTrang}
      </Text>

      <Button
        rightIcon={<ChevronRightIcon />}
        onClick={() => onChangeTrang(trangHienTai + 1)}
        isDisabled={trangHienTai === tongSoTrang}
        size="sm"
        variant="outline"
      >
        Sau
      </Button>

      <Select
        width="auto"
        size="sm"
        value={soBanGhiMoiTrang}
        onChange={(e) => onChangeSoBanGhi(Number(e.target.value))}
      >
        <option value={5}>5 / trang</option>
        <option value={10}>10 / trang</option>
        <option value={20}>20 / trang</option>
        <option value={50}>50 / trang</option>
      </Select>
    </HStack>
  );

  const renderSortOptions = () => (
    <Box mb={4}>
      <HStack justify="flex-end" spacing={2}>
        <Select
          size="sm"
          width="auto"
          value={sapXep.truong}
          onChange={(e) => onChangeSapXep({ ...sapXep, truong: e.target.value })}
        >
          <option value="ngayTao">Ngày tạo</option>
          <option value="ngayCapNhat">Ngày cập nhật</option>
          <option value="trangThai">Trạng thái</option>
        </Select>
        <Select
          size="sm"
          width="auto"
          value={sapXep.huong}
          onChange={(e) => onChangeSapXep({ ...sapXep, huong: e.target.value })}
        >
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </Select>
      </HStack>
    </Box>
  );

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {renderSortOptions()}
      
      <VStack spacing={4} align="stretch">
        {danhSachBaoCao.map((baoCao) => (
          <ItemBaoCao
            key={baoCao.id}
            baoCao={baoCao}
            onXem={onXem}
            onSua={onSua}
            onXoa={onXoa}
            onDuyet={onDuyet}
            onTuChoi={onTuChoi}
            quyen={quyen}
          />
        ))}
      </VStack>

      {renderPagination()}
    </MotionBox>
  );
};

export default DanhSachBaoCao;