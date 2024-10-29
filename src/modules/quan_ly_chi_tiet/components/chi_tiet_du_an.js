import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useDisclosure,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Progress,
  Icon,
  Divider,
  Flex
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { FaTasks, FaCheck, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useDuAn } from '../hooks/use_du_an';
import { useNhiemVu } from '../hooks/use_nhiem_vu';
import { formatDate, getStatusColor } from '../utils/helpers';
import BangNhiemVu from './bang_nhiem_vu';
import ThemNhiemVuModal from './them_nhiem_vu';
import BieuDoTienDo from './bieu_do_tien_do';

const ChiTietDuAn = () => {
  const { duAnId } = useParams();
  const { layChiTietDuAn, duAnHienTai, loading } = useDuAn();
  const { layDanhSachNhiemVu, danhSachNhiemVu } = useNhiemVu();
  const themNhiemVuModal = useDisclosure();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (duAnId) {
      layChiTietDuAn(duAnId);
      layDanhSachNhiemVu(duAnId);
    }
  }, [duAnId, layChiTietDuAn, layDanhSachNhiemVu]);

  const thongKe = {
    tongSoNhiemVu: danhSachNhiemVu.length,
    daHoanThanh: danhSachNhiemVu.filter(nv => nv.trangThai === 'HOAN_THANH').length,
    dangThucHien: danhSachNhiemVu.filter(nv => nv.trangThai === 'DANG_LAM').length,
    quaHan: danhSachNhiemVu.filter(nv => {
      const deadline = new Date(nv.deadline);
      return deadline < new Date() && nv.trangThai !== 'HOAN_THANH';
    }).length,
    tienDoTrungBinh: danhSachNhiemVu.reduce((acc, nv) => acc + nv.tienDo, 0) / 
      (danhSachNhiemVu.length || 1)
  };

  if (!duAnHienTai || loading) {
    return null;
  }

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        {/* Thông tin dự án */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <VStack align="start" spacing={2}>
                  <Heading size="lg">{duAnHienTai.tenDuAn}</Heading>
                  <HStack>
                    <Badge colorScheme={getStatusColor(duAnHienTai.trangThai)}>
                      {duAnHienTai.trangThai}
                    </Badge>
                    <Text color="gray.500">
                      {formatDate(duAnHienTai.ngayBatDau)} - {formatDate(duAnHienTai.ngayKetThuc)}
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  colorScheme="blue"
                  onClick={themNhiemVuModal.onOpen}
                >
                  Thêm nhiệm vụ
                </Button>
              </Flex>
              <Text color="gray.600">{duAnHienTai.moTa}</Text>
              <Progress
                value={duAnHienTai.tienDo}
                size="lg"
                colorScheme={duAnHienTai.tienDo === 100 ? 'green' : 'blue'}
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
                <StatLabel>Tổng số nhiệm vụ</StatLabel>
                <StatNumber>
                  <HStack>
                    <Icon as={FaTasks} color="blue.500" />
                    <Text>{thongKe.tongSoNhiemVu}</Text>
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
                  {((thongKe.daHoanThanh / thongKe.tongSoNhiemVu) * 100).toFixed(1)}%
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
                  {((thongKe.dangThucHien / thongKe.tongSoNhiemVu) * 100).toFixed(1)}%
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
                  {((thongKe.quaHan / thongKe.tongSoNhiemVu) * 100).toFixed(1)}%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Tabs */}
        <Tabs index={selectedTab} onChange={setSelectedTab}>
          <TabList>
            <Tab>Danh sách nhiệm vụ</Tab>
            <Tab>Biểu đồ tiến độ</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={4}>
              <BangNhiemVu duAnId={duAnId} />
            </TabPanel>
            <TabPanel p={0} pt={4}>
              <BieuDoTienDo duAnId={duAnId} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Modals */}
      <ThemNhiemVuModal
        isOpen={themNhiemVuModal.isOpen}
        onClose={themNhiemVuModal.onClose}
        duAnId={duAnId}
      />
    </Box>
  );
};

export default ChiTietDuAn;