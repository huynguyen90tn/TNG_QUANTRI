// src/pages/quan_ly_nhiem_vu/QuanLyNhiemVuPage.js
import React from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useParams, Link } from 'react-router-dom';
import BangTinhNang from '../../components/quan_ly_nhiem_vu_chi_tiet/components/bang_tinh_nang';
import BangBackend from '../../components/quan_ly_nhiem_vu_chi_tiet/components/bang_backend';
import BangKiemThu from '../../components/quan_ly_nhiem_vu_chi_tiet/components/bang_kiem_thu';
import BangTongHop from '../../components/quan_ly_nhiem_vu_chi_tiet/components/bang_tong_hop';
import { useQuanLyNhiemVu } from '../../components/quan_ly_nhiem_vu_chi_tiet/hooks/useQuanLyNhiemVu';

const QuanLyNhiemVuPage = () => {
  const { projectId } = useParams();
  const bgColor = useColorModeValue('white', 'gray.800');
  const { fetchProject } = useQuanLyNhiemVu();
  const [projectInfo, setProjectInfo] = React.useState(null);

  React.useEffect(() => {
    const loadProjectInfo = async () => {
      if (projectId) {
        const project = await fetchProject(projectId);
        setProjectInfo(project);
      }
    };
    loadProjectInfo();
  }, [projectId, fetchProject]);

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={6} align="stretch">
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/quan-ly-du-an">
              Dự án
            </BreadcrumbLink>
          </BreadcrumbItem>
          {projectInfo && (
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to={`/quan-ly-du-an/${projectId}`}>
                {projectInfo.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Quản lý nhiệm vụ chi tiết</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Box bg={bgColor} p={6} borderRadius="lg" shadow="base">
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between">
              <Heading size="lg">
                {projectInfo ? `Nhiệm vụ - ${projectInfo.name}` : 'Quản lý nhiệm vụ chi tiết'}
              </Heading>
              <Button
                as={Link}
                to="thong-ke"
                colorScheme="teal"
              >
                Xem thống kê
              </Button>
            </HStack>

            <Tabs variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>Tính năng</Tab>
                <Tab>Backend</Tab>
                <Tab>Kiểm thử</Tab>
                <Tab>Tổng hợp</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <BangTinhNang projectId={projectId} />
                </TabPanel>
                <TabPanel>
                  <BangBackend projectId={projectId} />
                </TabPanel>
                <TabPanel>
                  <BangKiemThu projectId={projectId} />
                </TabPanel>
                <TabPanel>
                  <BangTongHop projectId={projectId} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default QuanLyNhiemVuPage;