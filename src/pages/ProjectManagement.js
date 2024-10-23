import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  useToast,
  Container,
  useDisclosure,
  Select,
  Input,
  Flex,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Stack,
  useBreakpointValue,
  Text,
  Skeleton,
  Center,
  Image,
  SimpleGrid,
  Collapse,
  FormControl,
  FormLabel,
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react';
import {
  AddIcon,
  RepeatIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@chakra-ui/icons';
import { useAuth } from '../hooks/useAuth';
import ProjectList from '../components/projects/ProjectList';
import ProjectForm from '../components/projects/ProjectForm';
import {
  getProjects,
  createProject,
  updateProject,
} from '../services/api/projectApi';

// Cấu hình chủ đề
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'whiteAlpha.900',
      },
    },
  },
  colors: {
    gray: {
      900: '#1a202c',
      800: '#2d3748',
      700: '#4a5568',
    },
  },
});

// Hằng số
const PROJECT_STATUSES = [
  { value: 'đang-chờ', label: 'Đang Chờ' },
  { value: 'đang-thực-hiện', label: 'Đang Thực Hiện' },
  { value: 'hoàn-thành', label: 'Hoàn Thành' },
  { value: 'tạm-dừng', label: 'Tạm Dừng' },
];

const IMPLEMENTATION_STATUSES = [
  { value: 'not_started', label: 'Chưa triển khai' },
  { value: 'in_progress', label: 'Đang triển khai' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'on_hold', label: 'Tạm dừng' },
];

const PROGRESS_RANGES = [
  { value: '0-25', label: '0% - 25%' },
  { value: '26-50', label: '26% - 50%' },
  { value: '51-75', label: '51% - 75%' },
  { value: '76-100', label: '76% - 100%' },
];

const INITIAL_FILTERS = {
  search: '',
  status: '',
  implementation: '',
  startDate: '',
  endDate: '',
  progress: '',
};

// Component hiển thị khi đang tải
const ProjectsSkeleton = () => (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
    {[1, 2, 3].map((i) => (
      <Box
        key={i}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        bg="gray.800"
      >
        <Skeleton
          height="24px"
          width="50%"
          mb={4}
          startColor="gray.700"
          endColor="gray.600"
        />
        <Skeleton
          height="16px"
          mb={2}
          startColor="gray.700"
          endColor="gray.600"
        />
        <Skeleton
          height="16px"
          width="60%"
          mb={4}
          startColor="gray.700"
          endColor="gray.600"
        />
        <Skeleton
          height="8px"
          mb={2}
          startColor="gray.700"
          endColor="gray.600"
        />
        <Skeleton
          height="8px"
          width="80%"
          startColor="gray.700"
          endColor="gray.600"
        />
      </Box>
    ))}
  </SimpleGrid>
);

// Component hiển thị khi không có dự án
const EmptyState = ({ onCreateNew, isAdmin }) => (
  <Center minH="60vh" p={8} bg="gray.800" borderRadius="xl">
    <VStack spacing={6}>
      <Image
        src="/empty-projects.png"
        alt="No projects"
        boxSize="200px"
        fallbackSrc="https://via.placeholder.com/200"
      />
      <Heading size="lg" textAlign="center" color="gray.300">
        Chưa có dự án nào
      </Heading>
      <Text color="gray.400" textAlign="center">
        {isAdmin
          ? 'Hãy tạo dự án đầu tiên của bạn'
          : 'Hiện tại chưa có dự án nào được tạo'}
      </Text>
      {isAdmin && (
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="lg"
          onClick={onCreateNew}
        >
          Tạo Dự Án Mới
        </Button>
      )}
    </VStack>
  </Center>
);

// Component hiển thị khi xảy ra lỗi
const ErrorState = ({ error, onRetry }) => (
  <Center minH="60vh" bg="gray.800" borderRadius="xl">
    <VStack spacing={6}>
      <Heading size="md" color="red.300">
        Đã xảy ra lỗi
      </Heading>
      <Text color="gray.400" textAlign="center">
        {error || 'Không thể tải dự án. Vui lòng thử lại.'}
      </Text>
      <Button leftIcon={<RepeatIcon />} colorScheme="blue" onClick={onRetry}>
        Thử lại
      </Button>
    </VStack>
  </Center>
);

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Giá trị responsive
  const modalSize = useBreakpointValue({
    base: 'full',
    md: '90vw',
    lg: '95vw',
  });
  const headerHeight = useBreakpointValue({ base: '320px', md: '280px' });
  const modalPadding = useBreakpointValue({ base: '3', md: '6' });

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProjects = await getProjects();

      if (!Array.isArray(fetchedProjects)) {
        throw new Error('Dữ liệu nhận được không hợp lệ');
      }

      const normalizedProjects = fetchedProjects.map((project) => ({
        ...project,
        id: project.id || `temp-${Date.now()}`,
        name: project.name || 'Untitled Project',
        description: project.description || 'No description available',
        videoUrl: project.videoUrl || '',
        status: project.status || 'đang-chờ',
        implementation: project.implementation || 'not_started',
        progress: Number(project.progress) || 0,
        startDate: project.startDate || '',
        endDate: project.endDate || '',
      }));

      setProjects(normalizedProjects);
      setFilteredProjects(normalizedProjects);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
      setError(message);
      toast({
        title: 'Lỗi tải dự án',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setIsAdvancedFilterOpen(false);
  }, []);

  // Áp dụng bộ lọc
  useEffect(() => {
    try {
      let result = [...projects];

      // Lọc theo tìm kiếm
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          (project) =>
            (project.name?.toLowerCase() || '').includes(searchLower) ||
            (project.description?.toLowerCase() || '').includes(searchLower)
        );
      }

      // Lọc theo trạng thái
      if (filters.status) {
        result = result.filter((project) => project.status === filters.status);
      }

      // Lọc theo tình trạng triển khai
      if (filters.implementation) {
        result = result.filter(
          (project) => project.implementation === filters.implementation
        );
      }

      // Lọc theo tiến độ
      if (filters.progress) {
        const [min, max] = filters.progress.split('-').map(Number);
        result = result.filter(
          (project) => project.progress >= min && project.progress <= max
        );
      }

      // Lọc theo ngày bắt đầu
      if (filters.startDate) {
        result = result.filter(
          (project) => project.startDate >= filters.startDate
        );
      }

      // Lọc theo ngày kết thúc
      if (filters.endDate) {
        result = result.filter((project) => project.endDate <= filters.endDate);
      }

      setFilteredProjects(result);
    } catch (err) {
      console.error('Lỗi bộ lọc:', err);
      setFilteredProjects(projects);
    }
  }, [filters, projects]);

  const handleEditProject = useCallback(
    (project) => {
      setEditingProject(project);
      onOpen();
    },
    [onOpen]
  );

  const handleCreateProject = useCallback(
    async (projectData) => {
      try {
        setLoading(true);
        await createProject({
          ...projectData,
          implementation: 'not_started',
        });
        await fetchProjects();
        onClose();
        toast({
          title: 'Tạo dự án thành công',
          status: 'success',
          duration: 3000,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
        toast({
          title: 'Lỗi tạo dự án',
          description: message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    [fetchProjects, onClose, toast]
  );

  const handleUpdateProject = useCallback(
    async (projectData) => {
      try {
        if (!editingProject?.id) {
          throw new Error('Không tìm thấy ID dự án');
        }
        setLoading(true);
        await updateProject(editingProject.id, projectData);
        await fetchProjects();
        setEditingProject(null);
        onClose();
        toast({
          title: 'Cập nhật dự án thành công',
          status: 'success',
          duration: 3000,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
        toast({
          title: 'Lỗi cập nhật dự án',
          description: message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    },
    [editingProject, fetchProjects, onClose, toast]
  );

  const handleCloseModal = useCallback(() => {
    setEditingProject(null);
    onClose();
  }, [onClose]);

  const renderContent = () => {
    if (loading && !projects.length) {
      return <ProjectsSkeleton />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={fetchProjects} />;
    }

    if (!loading && !projects.length) {
      return (
        <EmptyState
          onCreateNew={() => {
            setEditingProject(null);
            onOpen();
          }}
          isAdmin={user?.role === 'admin-tong'}
        />
      );
    }

    return (
      <ProjectList
        projects={filteredProjects}
        onEdit={handleEditProject}
        userRole={user?.role}
        isLoading={loading}
      />
    );
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.900">
        {/* Header cố định */}
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bg="gray.800"
          boxShadow="dark-lg"
          zIndex="sticky"
          p={4}
        >
          <Container maxW="7xl">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'stretch', md: 'center' }}
              gap={4}
            >
              <Heading size="lg" color="blue.300">
                Quản Lý Dự Án
              </Heading>
              <Spacer display={{ base: 'none', md: 'block' }} />
              {user?.role === 'admin-tong' && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={() => {
                    setEditingProject(null);
                    onOpen();
                  }}
                  width={{ base: '100%', md: 'auto' }}
                >
                  Tạo Dự Án Mới
                </Button>
              )}
            </Flex>

            {/* Bảng điều khiển bộ lọc */}
            <Box
              mt={4}
              p={4}
              bg="gray.700"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.600"
            >
              <Stack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Input
                    placeholder="Tìm kiếm dự án..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    bg="gray.800"
                    _placeholder={{ color: 'gray.400' }}
                  />

                  <Select
                    placeholder="Trạng thái"
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange('status', e.target.value)
                    }
                    bg="gray.800"
                    color="white"
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Select>

                  <Select
                    placeholder="Tình trạng triển khai"
                    value={filters.implementation}
                    onChange={(e) =>
                      handleFilterChange('implementation', e.target.value)
                    }
                    bg="gray.800"
                    color="white"
                  >
                    {IMPLEMENTATION_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Select>
                </SimpleGrid>

                {/* Nút mở rộng bộ lọc nâng cao */}
                <Button
                  variant="ghost"
                  rightIcon={
                    isAdvancedFilterOpen ? (
                      <ChevronUpIcon />
                    ) : (
                      <ChevronDownIcon />
                    )
                  }
                  onClick={() =>
                    setIsAdvancedFilterOpen(!isAdvancedFilterOpen)
                  }
                  size="sm"
                  color="white"
                  _hover={{ bg: 'gray.600' }}
                >
                  Bộ lọc nâng cao
                </Button>

                {/* Bộ lọc nâng cao */}
                <Collapse in={isAdvancedFilterOpen}>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel color="gray.300">Từ ngày</FormLabel>
                      <Input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                          handleFilterChange('startDate', e.target.value)
                        }
                        bg="gray.800"
                        color="white"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.300">Đến ngày</FormLabel>
                      <Input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) =>
                          handleFilterChange('endDate', e.target.value)
                        }
                        bg="gray.800"
                        color="white"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.300">Tiến độ</FormLabel>
                      <Select
                        value={filters.progress}
                        onChange={(e) =>
                          handleFilterChange('progress', e.target.value)
                        }
                        bg="gray.800"
                        color="white"
                      >
                        <option value="">Tất cả</option>
                        {PROGRESS_RANGES.map((range) => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </Collapse>

                {/* Nút đặt lại bộ lọc */}
                <Flex justify="flex-end">
                  <Button
                    leftIcon={<RepeatIcon />}
                    variant="ghost"
                    onClick={handleResetFilters}
                    size="sm"
                    color="white"
                    _hover={{ bg: 'gray.600' }}
                  >
                    Đặt lại bộ lọc
                  </Button>
                </Flex>
              </Stack>
            </Box>
          </Container>
        </Box>

        {/* Nội dung chính */}
        <Container
          maxW="7xl"
          pt={headerHeight}
          pb={8}
          px={{ base: 2, md: 4 }}
        >
          {renderContent()}

          {/* Modal */}
          <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            size="full"
            scrollBehavior="inside"
          >
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent
              width={modalSize}
              maxWidth={modalSize}
              margin="auto"
              height={{ base: '100vh', md: '90vh' }}
              my={{ base: 0, md: '5vh' }}
              bg="gray.800"
              color="white"
            >
              <ModalCloseButton
                position="fixed"
                top={4}
                right={4}
                zIndex="modal"
                color="white"
              />
              <ModalBody
                p={0}
                position="relative"
                height="100%"
                overflow="auto"
              >
                <Box
                  p={modalPadding}
                  height="100%"
                  overflow="auto"
                  bg="gray.800"
                  sx={{
                    '&::-webkit-scrollbar': {
                      width: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      width: '6px',
                      bg: 'gray.700',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'gray.500',
                      borderRadius: '24px',
                    },
                  }}
                >
                  <ProjectForm
                    onSubmit={
                      editingProject
                        ? handleUpdateProject
                        : handleCreateProject
                    }
                    initialData={editingProject}
                    onCancel={handleCloseModal}
                    userRole={user?.role}
                  />
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default ProjectManagement;
