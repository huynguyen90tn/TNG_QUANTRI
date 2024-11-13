 
// File: src/modules/quan_ly_luong/components/thue_va_bao_hiem.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useMemo } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Tooltip,
  Flex,
  Icon,
  Divider
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { MUC_THUE, BAO_HIEM } from '../constants/loai_luong';
import { formatCurrency } from '../../../utils/format';

export const ThueVaBaoHiem = ({ luongCoBan = 0, tongThuNhap = 0 }) => {
  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Tính BHXH
  const tinhBHXH = useMemo(() => {
    const mucBHXH = luongCoBan * BAO_HIEM.BHXH;
    return {
      nhanVien: mucBHXH,
      congTy: luongCoBan * 0.175, // Công ty đóng 17.5%
      tong: mucBHXH + (luongCoBan * 0.175)
    };
  }, [luongCoBan]);

  // Tính BHYT
  const tinhBHYT = useMemo(() => {
    const mucBHYT = luongCoBan * BAO_HIEM.BHYT;
    return {
      nhanVien: mucBHYT,
      congTy: luongCoBan * 0.03, // Công ty đóng 3%
      tong: mucBHYT + (luongCoBan * 0.03)
    };
  }, [luongCoBan]);

  // Tính BHTN
  const tinhBHTN = useMemo(() => {
    const mucBHTN = luongCoBan * BAO_HIEM.BHTN;
    return {
      nhanVien: mucBHTN,
      congTy: luongCoBan * 0.01, // Công ty đóng 1%
      tong: mucBHTN + (luongCoBan * 0.01)
    };
  }, [luongCoBan]);

  // Tính thuế TNCN
  const tinhThueTNCN = useMemo(() => {
    let thuNhapTinhThue = tongThuNhap;
    let thueTNCN = 0;
    let mucTruocDo = 0;

    for (const { muc, tiLe } of MUC_THUE) {
      const phanThuNhap = Math.min(thuNhapTinhThue, muc - mucTruocDo);
      if (phanThuNhap <= 0) break;
      
      thueTNCN += phanThuNhap * tiLe;
      thuNhapTinhThue -= phanThuNhap;
      mucTruocDo = muc;
    }

    return Math.round(thueTNCN);
  }, [tongThuNhap]);

  return (
    <Box>
      <Grid templateColumns="repeat(12, 1fr)" gap={6}>
        {/* Bảng tính BHXH, BHYT, BHTN */}
        <GridItem colSpan={{ base: 12, lg: 8 }}>
          <Card bg={bgCard} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Chi Tiết Bảo Hiểm</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Loại bảo hiểm</Th>
                    <Th isNumeric>Người lao động</Th>
                    <Th isNumeric>Công ty</Th>
                    <Th isNumeric>Tổng cộng</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>
                      <Flex align="center">
                        <Text mr={2}>BHXH (8%)</Text>
                        <Tooltip label="Bảo hiểm xã hội">
                          <Icon as={InfoIcon} />
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td isNumeric>{formatCurrency(tinhBHXH.nhanVien)}</Td>
                    <Td isNumeric>{formatCurrency(tinhBHXH.congTy)}</Td>
                    <Td isNumeric fontWeight="bold">{formatCurrency(tinhBHXH.tong)}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex align="center">
                        <Text mr={2}>BHYT (1.5%)</Text>
                        <Tooltip label="Bảo hiểm y tế">
                          <Icon as={InfoIcon} />
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td isNumeric>{formatCurrency(tinhBHYT.nhanVien)}</Td>
                    <Td isNumeric>{formatCurrency(tinhBHYT.congTy)}</Td>
                    <Td isNumeric fontWeight="bold">{formatCurrency(tinhBHYT.tong)}</Td>
                  </Tr>
                  <Tr>
                    <Td>
                      <Flex align="center">
                        <Text mr={2}>BHTN (1%)</Text>
                        <Tooltip label="Bảo hiểm thất nghiệp">
                          <Icon as={InfoIcon} />
                        </Tooltip>
                      </Flex>
                    </Td>
                    <Td isNumeric>{formatCurrency(tinhBHTN.nhanVien)}</Td>
                    <Td isNumeric>{formatCurrency(tinhBHTN.congTy)}</Td>
                    <Td isNumeric fontWeight="bold">{formatCurrency(tinhBHTN.tong)}</Td>
                  </Tr>
                </Tbody>
              </Table>

              <Divider my={4} />

              <Flex justify="flex-end">
                <Box textAlign="right">
                  <Text fontWeight="bold" mb={2}>Tổng đóng bảo hiểm:</Text>
                  <Text fontSize="lg" color="blue.500">
                    {formatCurrency(tinhBHXH.tong + tinhBHYT.tong + tinhBHTN.tong)}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Người lao động: {formatCurrency(tinhBHXH.nhanVien + tinhBHYT.nhanVien + tinhBHTN.nhanVien)}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Công ty: {formatCurrency(tinhBHXH.congTy + tinhBHYT.congTy + tinhBHTN.congTy)}
                  </Text>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        </GridItem>

        {/* Bảng tính thuế TNCN */}
        <GridItem colSpan={{ base: 12, lg: 4 }}>
          <Card bg={bgCard} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Thuế Thu Nhập Cá Nhân</Heading>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatLabel>Tổng thu nhập tính thuế</StatLabel>
                <StatNumber>{formatCurrency(tongThuNhap)}</StatNumber>
                <StatHelpText>
                  <StatArrow type={tongThuNhap > 0 ? 'increase' : 'decrease'} />
                  {((tinhThueTNCN / tongThuNhap) * 100).toFixed(1)}%
                </StatHelpText>
              </Stat>

              <Divider my={4} />

              <Box>
                <Text fontWeight="bold" mb={2}>Các mức thuế suất:</Text>
                {MUC_THUE.map((muc, index) => {
                  const mucTruoc = index > 0 ? MUC_THUE[index - 1].muc : 0;
                  return (
                    <Text key={index} fontSize="sm" color="gray.500">
                      {mucTruoc.toLocaleString()} - {muc.muc === Infinity ? 'trở lên' : muc.muc.toLocaleString()}: 
                      {' '}{(muc.tiLe * 100)}%
                    </Text>
                  );
                })}
              </Box>

              <Divider my={4} />

              <Box textAlign="center">
                <Text color="red.500" fontSize="lg" fontWeight="bold">
                  Thuế phải nộp
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {formatCurrency(tinhThueTNCN)}
                </Text>
              </Box>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ThueVaBaoHiem;