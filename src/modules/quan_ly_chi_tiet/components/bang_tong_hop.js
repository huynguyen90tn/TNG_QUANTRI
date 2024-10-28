// src/modules/quan_ly_chi_tiet/components/bang_tong_hop.js
import React, { useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  VStack,
  Text,
  HStack,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { useTinhNang } from '../hooks/use_tinh_nang';
import { getStatusColor } from '../utils/helpers';

const BangTongHop = ({ nhiemVuId }) => {
  const {
    danhSachTinhNang,
    loading,
    layDanhSachTinhNang,
    thongKe
  } = useTinhNang();

  useEffect(() => {
    if (nhiemVuId) {
      layDanhSachTinhNang(nhiemVuId);
    }
  }, [nhiemVuId, layDanhSachTinhNang]);

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Tổng số tính năng</StatLabel>
              <StatNumber>{thongKe.tongSoTinhNang}</StatNumber>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Đã hoàn thành</StatLabel>
              <StatNumber>{thongKe.daHoanThanh}</StatNumber>
              <StatHelpText>
                {((thongKe.daHoanThanh / thongKe.tongSoTinhNang) * 100).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Đang thực hiện</StatLabel>
              <StatNumber>{thongKe.dangThucHien}</StatNumber>
              <StatHelpText>
                {((thongKe.dangThucHien / thongKe.tongSoTinhNang) * 100).toFixed(1)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Tiến độ trung bình</StatLabel>
              <StatNumber>{thongKe.tienDoTrungBinh}%</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Tính năng</Th>
            <Th>Frontend</Th>
            <Th>Backend</Th>
            <Th>Kiểm thử</Th>
            <Th>Tiến độ chung</Th>
          </Tr>
        </Thead>
        <Tbody>
          {danhSachTinhNang.map(tinhNang => {
            const tienDoChung = Math.round(
              (tinhNang.frontend.tienDo + tinhNang.backend.tienDo + tinhNang.kiemThu.tienDo) / 3
            );

            return (
              <Tr key={tinhNang.id}>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{tinhNang.tenTinhNang}</Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {tinhNang.moTa}
                    </Text>
                  </VStack>
                </Td>

                <Td>
                  <VStack align="start" spacing={2}>
                    <Badge colorScheme={getStatusColor(tinhNang.frontend.trangThai)}>
                      {tinhNang.frontend.trangThai}
                    </Badge>
                    <HStack spacing={2} w="full">
                      <Progress
                        value={tinhNang.frontend.tienDo}
                        size="sm"
                        width="100px"
                        colorScheme="blue"
                      />
                      <Text fontSize="sm">{tinhNang.frontend.tienDo}%</Text>
                    </HStack>
                  </VStack>
                </Td>

                <Td>
                  <VStack align="start" spacing={2}>
                    <Badge colorScheme={getStatusColor(tinhNang.backend.trangThai)}>
                      {tinhNang.backend.trangThai}
                    </Badge>
                    <HStack spacing={2} w="full">
                      <Progress
                        value={tinhNang.backend.tienDo}
                        size="sm"
                        width="100px"
                        colorScheme="green"
                      />
                      <Text fontSize="sm">{tinhNang.backend.tienDo}%</Text>
                    </HStack>
                  </VStack>
                </Td>

                <Td>
                  <VStack align="start" spacing={2}>
                    <Badge colorScheme={getStatusColor(tinhNang.kiemThu.trangThai)}>
                      {tinhNang.kiemThu.trangThai}
                    </Badge>
                    <HStack spacing={2} w="full">
                      <Progress
                        value={tinhNang.kiemThu.tienDo}
                        size="sm"
                        width="100px"
                        colorScheme="purple"
                      />
                      <Text fontSize="sm">{tinhNang.kiemThu.tienDo}%</Text>
                    </HStack>
                  </VStack>
                </Td>

                <Td>
                  <VStack align="start" spacing={2}>
                    <Progress
                      value={tienDoChung}
                      size="sm"
                      width="100px"
                      colorScheme={tienDoChung === 100 ? 'green' : 'blue'}
                    />
                    <Text fontSize="sm">{tienDoChung}%</Text>
                  </VStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BangTongHop;