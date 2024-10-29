// src/modules/quan_ly_chi_tiet/components/chi_tiet_nhiem_vu.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useDisclosure,
  Progress,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { FaTasks, FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useNhiemVu } from '../hooks/use_nhiem_vu';
import { useTinhNang } from '../hooks/use_tinh_nang';
import { getStatusColor, formatDate, tinhThoiGianConLai } from '../utils/helpers';
import ThemTinhNangModal from './them_tinh_nang_modal';
import BangTinhNang from './bang_tinh_nang';
import BangTongHop from './bang_tong_hop';
import BieuDoTienDo from './bieu_do_tien_do';
import XacNhanXoaModal from './xac_nhan_xoa_modal';

const ChiTietNhiemVu = ({ nhiemVuId }) => {
  const { nhiemVuHienTai, layChiTietNhiemVu } = useNhiemVu();
  const { thongKe } = useTinhNang();
  const [selectedTab, setSelectedTab] = useState(0);
  const themTinhNangModal = useDisclosure();

  useEffect(() => {
    if (nhiemVuId) {
      layChiTietNhiemVu(nhiemVuId);
    }
  }, [nhiemVuId, layChiTietNhiemVu]);

  if (!nhiemVuHienTai) {
    return null;
  }

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        {/* Thông tin nhiệm vụ */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <VStack align="start" spacing={2}>
                  <Text fontSize="2xl" fontWeight="bold">
                    {nhiemVuHienTai.tenNhiemVu}
                  </Text>
                  <HStack>
                    <Badge colorScheme={getStatusColor(nhiemVuHienTai.trangThai)}>
                      {nhiemVuHienTai.trangThai}
                    </Badge>
                    <Text color="gray.500">
                      Deadline: {formatDate(nhiemVuHienTai.deadline)} ({tinhThoiGianConLai(nhiemVuHienTai.deadline)})
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={themTinhNangModal.onOpen}
                >
                  Thêm tính năng
                </Button>
              </HStack>
              <Text color="gray.600">{nhiemVuHienTai.moTa}</Text>
              <Progress
                value={nhiemVuHienTai.tienDo}
                size="lg"
                colorScheme={nhiemVuHienTai.tienDo === 100 ? 'green' : 'blue'}
                hasStripe
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Thống kê */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Tổng số tính năng</StatLabel>
                <StatNumber>
                  <HStack>
                    <Icon as={FaTasks} color="blue.500" />
                    <Text>{thongKe.tongSoTinhNang}</Text>
                  </HStack>
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Đã hoàn thành</StatLabel>
                <StatNumber>
                  <HStack>
                    <Icon as={FaCheck} color="green.500" />
                    <Text>{thongKe.daHoanThanh}</Text>
                  </HStack>
                </StatNumber>
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
                <StatNumber>
                  <HStack>
                    <Icon as={FaClock} color="orange.500" />
                    <Text>{thongKe.dangThucHien}</Text>
                  </HStack>
                </StatNumber>
                <StatHelpText>
                  {((thongKe.dangThucHien / thongKe.tongSoTinhNang) * 100).toFixed(1)}%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Quá hạn</StatLabel>
                <StatNumber>
                  <HStack>
                    <Icon as={FaExclamationTriangle} color="red.500" />
                    <Text>{thongKe.quaHan}</Text>
                  </HStack>
                </StatNumber>
                <StatHelpText>
                  {((thongKe.quaHan / thongKe.tongSoTinhNang) * 100).toFixed(1)}%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Tabs */}
        <Tabs index={selectedTab} onChange={setSelectedTab}>
          <TabList>
            <Tab>Danh sách tính năng</Tab>
            <Tab>Bảng tổng hợp</Tab>
            <Tab>Biểu đồ tiến độ</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={4}>
              <BangTinhNang nhiemVuId={nhiemVuId} />
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <BangTongHop nhiemVuId={nhiemVuId} />
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <BieuDoTienDo nhiemVuId={nhiemVuId} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Modals */}
      <ThemTinhNangModal
        isOpen={themTinhNangModal.isOpen}
        onClose={themTinhNangModal.onClose}
        nhiemVuId={nhiemVuId}
      />
    </Box>
  );
};

export default ChiTietNhiemVu;