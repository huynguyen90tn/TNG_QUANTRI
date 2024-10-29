// src/modules/quan_ly_chi_tiet/components/chi_tiet_tinh_nang.js
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  Divider,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  List,
  ListItem,
  ListIcon,
  Tag
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { getStatusColor } from '../utils/helpers';
import { LOAI_KIEM_THU } from '../constants/loai_kiem_thu';

const ChiTietTinhNang = ({ tinhNang }) => {
  const renderPhanHeInfo = (phanHe, title, data) => (
    <Card>
      <CardHeader>
        <Text fontSize="lg" fontWeight="medium">
          {title}
        </Text>
      </CardHeader>
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <Text fontWeight="medium">Người phụ trách:</Text>
            <Text>{data.nguoiPhuTrach}</Text>
          </HStack>

          <HStack justify="space-between" w="full">
            <Text fontWeight="medium">Trạng thái:</Text>
            <Badge colorScheme={getStatusColor(data.trangThai)}>
              {data.trangThai}
            </Badge>
          </HStack>

          <VStack align="start" w="full" spacing={1}>
            <Text fontWeight="medium">Tiến độ:</Text>
            <Progress
              value={data.tienDo}
              size="sm"
              w="full"
              colorScheme={data.tienDo === 100 ? 'green' : 'blue'}
            />
            <Text fontSize="sm">{data.tienDo}%</Text>
          </VStack>

          {phanHe === 'backend' && data.apiEndpoints?.length > 0 && (
            <VStack align="start" w="full">
              <Text fontWeight="medium">API Endpoints:</Text>
              <List spacing={2}>
                {data.apiEndpoints.map((endpoint, index) => (
                  <ListItem key={index}>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    {endpoint}
                  </ListItem>
                ))}
              </List>
            </VStack>
          )}

          {phanHe === 'kiemThu' && (
            <VStack align="start" w="full">
              <Text fontWeight="medium">Loại kiểm thử:</Text>
              <HStack wrap="wrap" spacing={2}>
                {data.loaiTest?.map((loai) => (
                  <Tag key={loai} colorScheme="blue">
                    {LOAI_KIEM_THU[loai]}
                  </Tag>
                ))}
              </HStack>
            </VStack>
          )}

          {data.ghiChu && (
            <VStack align="start" w="full">
              <Text fontWeight="medium">Ghi chú:</Text>
              <Text>{data.ghiChu}</Text>
            </VStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <VStack align="start" spacing={2}>
          <Text fontSize="2xl" fontWeight="bold">
            {tinhNang.tenTinhNang}
          </Text>
          <Text color="gray.600">{tinhNang.moTa}</Text>
        </VStack>

        <Divider />

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {renderPhanHeInfo('frontend', 'Frontend', tinhNang.frontend)}
          {renderPhanHeInfo('backend', 'Backend', tinhNang.backend)}
          {renderPhanHeInfo('kiemThu', 'Kiểm thử', tinhNang.kiemThu)}
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default ChiTietTinhNang;