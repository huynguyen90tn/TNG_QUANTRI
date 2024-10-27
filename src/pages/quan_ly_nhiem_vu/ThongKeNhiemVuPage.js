// src/pages/quan_ly_nhiem_vu/ThongKeNhiemVuPage.js
import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useQuanLyNhiemVu } from '../../components/quan_ly_nhiem_vu_chi_tiet/hooks/useQuanLyNhiemVu';
import BieuDoTienDo from '../../components/quan_ly_nhiem_vu_chi_tiet/components/bieu_do_tien_do';

const ThongKeNhiemVuPage = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { fetchThongKe } = useQuanLyNhiemVu();
  const [thongKe, setThongKe] = React.useState(null);

  React.useEffect(() => {
    const loadThongKe = async () => {
      const data = await fetchThongKe();
      setThongKe(data);
    };
    loadThongKe();
  }, [fetchThongKe]);

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={6} align="stretch">
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/quan-ly-nhiem-vu-chi-tiet">
              Quản lý nhiệm vụ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Thống kê</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
          <VStack spacing={6} align="stretch">
            <Heading size="lg">Thống kê nhiệm vụ</Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Stat>
                <StatLabel>Tổng số nhiệm vụ</StatLabel>
                <StatNumber>{thongKe?.totalTasks || 0}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Đang thực hiện</StatLabel>
                <StatNumber>{thongKe?.inProgressTasks || 0}</StatNumber>
                <StatHelpText>
                  {((thongKe?.inProgressTasks || 0) / (thongKe?.totalTasks || 1) * 100).toFixed(1)}%
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Hoàn thành</StatLabel>
                <StatNumber>{thongKe?.completedTasks || 0}</StatNumber>
                <StatHelpText>
                  {((thongKe?.completedTasks || 0) / (thongKe?.totalTasks || 1) * 100).toFixed(1)}%
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Quá hạn</StatLabel>
                <StatNumber>{thongKe?.overdueTasks || 0}</StatNumber>
                <StatHelpText>
                  {((thongKe?.overdueTasks || 0) / (thongKe?.totalTasks || 1) * 100).toFixed(1)}%
                </StatHelpText>
              </Stat>
            </SimpleGrid>

            <Box h="400px">
              <BieuDoTienDo data={thongKe?.progressData || []} />
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default ThongKeNhiemVuPage;