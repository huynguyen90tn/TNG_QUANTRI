import React, { useMemo, memo, useCallback, useState, useEffect } from 'react';
import {
  VStack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Spinner,
  Center,
  useColorModeValue,
  SlideFade, 
  Fade,
  ScaleFade,
  useDisclosure,
  chakra,
  Container,
  SimpleGrid,
  ButtonGroup,
  Button,
  Input,
  Select,
  HStack,
  Grid,
  GridItem,
  Flex,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent, 
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Icon,
  Box
} from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { 
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  ExternalLink,
  Edit,
  Trash,
  PlayCircle,
  CheckCircle,
  ListChecks
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSuKien } from '../hooks/use_su_kien';
import ItemSuKien from './item_su_kien';
import { formatDateTime } from '../utils/format';
import { keyframes } from '@emotion/react';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

const MotionCard = chakra(Card, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
`;

const EventStats = memo(() => {
  const { suKiens } = useSuKien();
  
  const stats = useMemo(() => ({
    total: suKiens.length,
    upcoming: suKiens.filter(s => s.trangThai === 'CHUA_DIEN_RA').length,
    inProgress: suKiens.filter(s => s.trangThai === 'DANG_DIEN_RA').length,
    completed: suKiens.filter(s => s.trangThai === 'HOAN_THANH').length
  }), [suKiens]);

  return (
    <HStack spacing={6} justify="flex-end" color="gray.400" pr={2}>
      <HStack>
        <Icon as={Calendar} />
        <Text>Chưa diễn ra: {stats.upcoming}</Text>
      </HStack>
      <HStack>
        <Icon as={PlayCircle} />
        <Text>Đang diễn ra: {stats.inProgress}</Text>
      </HStack>
      <HStack>
        <Icon as={CheckCircle} />
        <Text>Đã hoàn thành: {stats.completed}</Text>
      </HStack>
      <HStack>
        <Icon as={ListChecks} />
        <Text>Tổng số: {stats.total} sự kiện</Text>
      </HStack>
    </HStack>
  );
});

EventStats.displayName = 'EventStats';

const EventCountdown = memo(({ suKien }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const startDateTime = new Date(`${suKien.ngayToChuc}T${suKien.gioToChuc}`);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = startDateTime - now;

      if (difference <= 0) {
        setTimeLeft('Đang diễn ra');
        clearInterval(timer);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`còn ${hours}h${minutes}p`);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [startDateTime]);

  return (
    <Text
      animation={`${slideIn} 50s linear infinite`}
      whiteSpace="nowrap"
      color="gray.200"
      fontSize="xl"
      fontWeight="bold"
      px={4}
      py={2}
    >
      Sự kiện sắp tới: {suKien.tenSuKien} - {formatDateTime(suKien.ngayToChuc, suKien.gioToChuc)} tại {suKien.diaDiem} ({timeLeft})
    </Text>
  );
});

EventCountdown.displayName = 'EventCountdown';

const FilterSection = memo(({ onFilterChange }) => {
  const [filterState, setFilterState] = useState({
    startDate: '',
    endDate: '',
    month: '',
    status: 'TAT_CA'
  });

  const handleChange = useCallback((type, value) => {
    const newState = { ...filterState, [type]: value };
    setFilterState(newState);
    onFilterChange(newState);
  }, [filterState, onFilterChange]);

  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} gap={4} mb={6}>
      <GridItem>
        <Input
          type="date"
          placeholder="Từ ngày"
          value={filterState.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
      </GridItem>
      <GridItem>
        <Input
          type="date"
          placeholder="Đến ngày"
          value={filterState.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </GridItem>
      <GridItem>
        <Input
          type="month"
          value={filterState.month}
          onChange={(e) => handleChange('month', e.target.value)}
        />
      </GridItem>
      <GridItem>
        <Select
          value={filterState.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="TAT_CA">Tất cả trạng thái</option>
          <option value="CHUA_DIEN_RA">Chưa diễn ra</option>
          <option value="DANG_DIEN_RA">Đang diễn ra</option>
          <option value="HOAN_THANH">Đã hoàn thành</option>
        </Select>
      </GridItem>
      <GridItem>
        <ButtonGroup isAttached variant="outline">
          <Button
            leftIcon={<SortAsc size={16} />}
            onClick={() => handleChange('sort', 'asc')}
          >
            Cũ nhất
          </Button>
          <Button
            leftIcon={<SortDesc size={16} />}
            onClick={() => handleChange('sort', 'desc')}
          >
            Mới nhất
          </Button>
        </ButtonGroup>
      </GridItem>
    </Grid>
  );
});

FilterSection.displayName = 'FilterSection';

const DanhSachSuKien = memo(() => {
  const navigate = useNavigate();
  const toast = useToast();
  const { suKiens, searchTerm, loading, xoaSuKien, capNhatSuKien } = useSuKien();
  const { isOpen } = useDisclosure({ defaultIsOpen: true });

  const [selectedSuKien, setSelectedSuKien] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    month: '',
    status: 'TAT_CA',
    sort: 'desc'
  });

  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const headerBgColor = useColorModeValue('gray.700', 'gray.700');
  const borderColor = useColorModeValue('gray.600', 'gray.600');
  const spinnerColor = useColorModeValue('blue.500', 'blue.200');
  const headingColor = useColorModeValue('gray.100', 'gray.100');

  const filteredSuKiens = useMemo(() => {
    return suKiens
      .filter(suKien => {
        const matchSearch = suKien.tenSuKien.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filters.status === 'TAT_CA' || suKien.trangThai === filters.status;
        
        let matchDate = true;
        if (filters.startDate) {
          matchDate = matchDate && suKien.ngayToChuc >= filters.startDate;
        }
        if (filters.endDate) {
          matchDate = matchDate && suKien.ngayToChuc <= filters.endDate;
        }
        if (filters.month) {
          const [year, month] = filters.month.split('-');
          const suKienDate = new Date(suKien.ngayToChuc);
          matchDate = matchDate && 
            suKienDate.getFullYear() === parseInt(year) &&
            suKienDate.getMonth() === parseInt(month) - 1;
        }
        
        return matchSearch && matchStatus && matchDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.ngayToChuc);
        const dateB = new Date(b.ngayToChuc);
        return filters.sort === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [suKiens, searchTerm, filters]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + (2 * 24 * 60 * 60 * 1000));
    
    return suKiens
      .filter(suKien => {
        const eventDate = new Date(`${suKien.ngayToChuc}T${suKien.gioToChuc}`);
        return eventDate > now && eventDate <= twoDaysFromNow;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.ngayToChuc}T${a.gioToChuc}`);
        const dateB = new Date(`${b.ngayToChuc}T${b.gioToChuc}`);
        return dateA - dateB;
      });
  }, [suKiens]);

  useEffect(() => {
    if (upcomingEvents.length > 1) {
      const interval = setInterval(() => {
        setCurrentEventIndex(prev => 
          prev === upcomingEvents.length - 1 ? 0 : prev + 1
        );
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [upcomingEvents.length]);

  const handleViewDetail = useCallback((suKien) => {
    setSelectedSuKien(suKien);
    setIsViewModalOpen(true);
  }, []);

  const handleEdit = useCallback((suKien) => {
    setSelectedSuKien(suKien);
    setEditFormData(suKien);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      await capNhatSuKien(selectedSuKien.id, editFormData);
      toast({
        title: "Cập nhật thành công",
        status: "success",
        duration: 3000,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi khi cập nhật",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  }, [selectedSuKien, editFormData, capNhatSuKien, toast]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleActionClick = useCallback((action, suKien) => {
    switch (action) {
      case 'detail':
        handleViewDetail(suKien);
        break;
      case 'edit':
        handleEdit(suKien);
        break;
      case 'delete':
        try {
          xoaSuKien(suKien.id);
          toast({
            title: "Xóa sự kiện thành công",
            status: "success",
            duration: 3000,
            isClosable: true
          });
        } catch (error) {
          toast({
            title: "Lỗi khi xóa sự kiện",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true
          });
        }
        break;
      default:
        break;
    }
  }, [handleViewDetail, handleEdit, xoaSuKien, toast]);

  const renderItem = useCallback((suKien) => (
    <ScaleFade in={true} initialScale={0.9} key={suKien.id}>
      <ChakraBox
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2 }}
        width="100%"
        position="relative"
      >
        <ItemSuKien suKien={suKien} />
        <Flex
          position="absolute"
          top={4}
          right={4}
          gap={2}
          zIndex={1}
        >
          <IconButton
            icon={<ExternalLink size={16} />}
            aria-label="Xem chi tiết"
            size="sm"
            colorScheme="blue"
            variant="ghost"
            onClick={() => handleActionClick('detail', suKien)}
          />
          <IconButton
            icon={<Edit size={16} />}
            aria-label="Chỉnh sửa"
            size="sm"
            colorScheme="green"
            variant="ghost"
            onClick={() => handleActionClick('edit', suKien)}
          />
          <IconButton
            icon={<Trash size={16} />}
            aria-label="Xóa"
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={() => handleActionClick('delete', suKien)}
          />
        </Flex>
      </ChakraBox>
    </ScaleFade>
  ), [handleActionClick]);

  if (loading) {
    return (
      <Center py={12} minHeight="60vh">
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color={spinnerColor}
            size="xl"
          />
          <Text color="gray.500" fontSize="lg">Đang tải danh sách sự kiện...</Text></VStack>
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <FilterSection onFilterChange={handleFilterChange} />
        
        <Fade in={isOpen}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            borderWidth="2px"
            borderColor={borderColor}
            borderRadius="2xl"
            overflow="hidden"
            bg={bgColor}
            boxShadow="2xl"
            _hover={{
              boxShadow: '3xl',
              transform: 'translateY(-4px)',
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <CardHeader
              bg={headerBgColor}
              borderBottomWidth="2px"
              borderColor={borderColor}
              py={8}
              px={6}
            >
              <Flex justify="space-between" align="center" direction="column" gap={4}>
                <Heading
                  size="xl"
                  color={headingColor}
                  letterSpacing="wider"
                  fontWeight="bold"
                  bgGradient="linear(to-r, blue.400, purple.500)"
                  bgClip="text"
                  textTransform="uppercase"
                  alignSelf="flex-start"
                >
                  Danh sách sự kiện
                </Heading>
                <EventStats />
              </Flex>
            </CardHeader>

            <CardBody p={8}>
              <VStack spacing={8} align="stretch">
                <SlideFade in={isOpen} offsetY={20}>
                  {filteredSuKiens.length === 0 ? (
                    <Center py={16}>
                      <VStack spacing={4}>
                        <Text
                          fontSize="2xl"
                          color="gray.500"
                          fontWeight="medium"
                          textAlign="center"
                        >
                          Không có sự kiện nào
                        </Text>
                        <Text color="gray.400">
                          Vui lòng thêm sự kiện mới hoặc thay đổi bộ lọc
                        </Text>
                      </VStack>
                    </Center>
                  ) : (
                    <SimpleGrid
                      columns={{ base: 1, lg: 1 }}
                      spacing={8}
                      width="100%"
                    >
                      {filteredSuKiens.map(renderItem)}
                    </SimpleGrid>
                  )}
                </SlideFade>
              </VStack>
            </CardBody>
          </MotionCard>
        </Fade>

        {/* Event countdown banner */}
        {upcomingEvents.length > 0 && (
          <Box
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="gray.800"
            borderTopWidth={2}
            borderColor="gray.700"
            py={3}
            overflow="hidden"
            zIndex={999}
            boxShadow="0 -2px 10px rgba(0,0,0,0.3)"
          >
            <EventCountdown suKien={upcomingEvents[currentEventIndex]} />
          </Box>
        )}

        {/* View Modal */}
        <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Chi tiết sự kiện</ModalHeader>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Text><strong>Tên sự kiện:</strong> {selectedSuKien?.tenSuKien}</Text>
                <Text><strong>Đơn vị tổ chức:</strong> {selectedSuKien?.donViToChuc}</Text>
                <Text><strong>Địa điểm:</strong> {selectedSuKien?.diaDiem}</Text>
                <Text><strong>Thời gian:</strong> {formatDateTime(selectedSuKien?.ngayToChuc, selectedSuKien?.gioToChuc)}</Text>
                <Text><strong>Trạng thái:</strong> {selectedSuKien?.trangThai}</Text>
                {selectedSuKien?.ghiChu && (
                  <Text><strong>Ghi chú:</strong> {selectedSuKien.ghiChu}</Text>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsViewModalOpen(false)}>Đóng</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cập nhật sự kiện</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Tên sự kiện</FormLabel>
                  <Input
                    value={editFormData.tenSuKien || ''}
                    onChange={(e) => setEditFormData(prev => ({...prev, tenSuKien: e.target.value}))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Đơn vị tổ chức</FormLabel>
                  <Input
                    value={editFormData.donViToChuc || ''}
                    onChange={(e) => setEditFormData(prev => ({...prev, donViToChuc: e.target.value}))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Địa điểm</FormLabel>
                  <Input
                    value={editFormData.diaDiem || ''}
                    onChange={(e) => setEditFormData(prev => ({...prev, diaDiem: e.target.value}))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Ngày tổ chức</FormLabel>
                  <Input
                    type="date"
                    value={editFormData.ngayToChuc || ''}
                    onChange={(e) => setEditFormData(prev => ({...prev, ngayToChuc: e.target.value}))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Giờ tổ chức</FormLabel>
                  <Input
                    type="time"
                    value={editFormData.gioToChuc || ''}
                    onChange={(e) => setEditFormData(prev => ({...prev, gioToChuc: e.target.value}))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Ghi chú</FormLabel>
                  <Textarea
                    value={editFormData.ghiChu || ''}
                    onChange={(e) => setEditFormData(prev => ({...prev, ghiChu: e.target.value}))}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={3}>
                <Button onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
                <Button colorScheme="blue" onClick={handleSaveEdit}>Lưu</Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
});

DanhSachSuKien.displayName = 'DanhSachSuKien';

export default DanhSachSuKien;