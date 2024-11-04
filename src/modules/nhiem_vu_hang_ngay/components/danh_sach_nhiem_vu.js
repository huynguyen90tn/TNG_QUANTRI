// File: src/modules/nhiem_vu_hang_ngay/components/danh_sach_nhiem_vu.js
// Link tham khảo: https://chakra-ui.com/docs
// Link tham khảo: https://react-redux.js.org/api/hooks

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Progress,
  Text,
  HStack,
  VStack,
  Heading,
  Grid,
  GridItem,
  Select,
  FormControl,
  FormLabel,
  List,
  ListItem,
  useToast,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  IconButton,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';
import { ExternalLinkIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getAllUsers } from '../../../services/api/userApi';
import { useAuth } from '../../../hooks/useAuth';
import {
  batDauKiemTraAsync,
  hoanThanhKiemTraAsync,
  layDanhSachNhiemVuAsync,
  xoaNhiemVuAsync,
  clearError,
  clearKiemTraHienTai
} from '../store/nhiem_vu_slice';

const FILTER_OPTIONS = {
  DAY: 'day',
  MONTH: 'month'
};

const COOLDOWN_TIME = 120; // 2 phút (seconds)
const VERIFICATION_TIME = 60; // 1 phút (seconds)

const initialState = {
  danhSachNhiemVu: [],
  kiemTraHienTai: null,
  loading: false,
  error: null
};

const DanhSachNhiemVu = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const toast = useToast();

  // Local states  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState(FILTER_OPTIONS.DAY);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Selectors with default values
  const { 
    danhSachNhiemVu = [],
    kiemTraHienTai,
    loading: storeLoading,
    error: storeError 
  } = useSelector(state => state.nhiemVu || initialState);

  // Derived states
  const memberUsers = useMemo(() => {
    return (users || []).filter(u => u?.role === 'member');
  }, [users]);

  const isAdminTong = user?.role === 'admin-tong';
  const isMember = user?.role === 'member';

  // Load data
  const handleLoadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading data with date:', selectedDate, 'filterType:', filterType);

      const startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);

      let endDate = new Date(selectedDate);
      if (filterType === FILTER_OPTIONS.MONTH) {
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      }
      endDate.setHours(23, 59, 59, 999);

      console.log('Date range:', {startDate, endDate});

      // Load users first
      const usersData = await getAllUsers();
      console.log('Loaded users:', usersData);
      setUsers(usersData?.data || []);

      // Then load tasks
      const result = await dispatch(layDanhSachNhiemVuAsync({ startDate, endDate })).unwrap();
      console.log('Loaded tasks:', result);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
      toast({
        title: "Lỗi",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [dispatch, filterType, selectedDate, toast]);

  useEffect(() => {
    handleLoadData();
    return () => {
      setError(null);
      dispatch(clearError());
    };
  }, [handleLoadData, dispatch]);

  // Verification timer
  useEffect(() => {
    let interval;
    if (kiemTraHienTai && verificationTimer > 0) {
      setIsVerifying(true);
      interval = setInterval(() => {
        setVerificationTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsVerifying(false);
            handleVerificationComplete(kiemTraHienTai);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
        setIsVerifying(false);
      }
    };
  }, [kiemTraHienTai, verificationTimer]);

  // Cooldown timer
  useEffect(() => {
    let interval;
    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [cooldownTimer]);

  const handleStartVerification = useCallback(async (nhiemVu) => {
    if (!nhiemVu?.id) {
      console.error('Invalid task:', nhiemVu);
      return;
    }

    if (cooldownTimer > 0) {
      toast({
        title: "Không thể thực hiện",
        description: `Vui lòng đợi ${cooldownTimer} giây nữa trước khi thực hiện nhiệm vụ tiếp theo`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('Starting verification for task:', nhiemVu.id);
      await dispatch(batDauKiemTraAsync({
        nhiemVuId: nhiemVu.id,
        userId: user?.id
      })).unwrap();

      setVerificationTimer(VERIFICATION_TIME);
      onOpen();
    } catch (err) {
      console.error('Verification error:', err);
      toast({
        title: "Lỗi",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [cooldownTimer, dispatch, onOpen, toast, user?.id]);

  const handleVerificationComplete = useCallback(async (kiemTraInfo) => {
    if (!kiemTraInfo?.nhiemVuId || !kiemTraInfo?.userId) {
      console.error('Invalid verification info:', kiemTraInfo);
      return;
    }

    try {
      console.log('Completing verification:', kiemTraInfo);
      await dispatch(hoanThanhKiemTraAsync({
        nhiemVuId: kiemTraInfo.nhiemVuId,
        userId: kiemTraInfo.userId,
        ketQua: true
      })).unwrap();

      setCooldownTimer(COOLDOWN_TIME);
      dispatch(clearKiemTraHienTai());
      onClose();

      toast({
        title: "Thành công",
        description: "Bạn đã hoàn thành nhiệm vụ!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Completion error:', err);
      toast({
        title: "Lỗi",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [dispatch, onClose, toast]);

  const handleDeleteTask = useCallback(async (nhiemVuId) => {
    if (!nhiemVuId) {
      console.error('Invalid task ID');
      return;
    }

    try {
      console.log('Deleting task:', nhiemVuId);
      await dispatch(xoaNhiemVuAsync(nhiemVuId)).unwrap();
      toast({
        title: "Thành công",
        description: "Đã xóa nhiệm vụ",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: "Lỗi",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [dispatch, toast]);

  const tinhTienDo = useCallback((nhiemVu) => {
    if (!memberUsers?.length || !nhiemVu?.danhSachHoanThanh) return 0;
    
    const completedCount = nhiemVu.danhSachHoanThanh.filter(
      hoanthanh => memberUsers.some(member => member.id === hoanthanh.userId)
    ).length;
    
    const progress = (completedCount / memberUsers.length) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }, [memberUsers]);

  const layDanhSachChuaHoanThanh = useCallback((nhiemVu) => {
    if (!nhiemVu?.danhSachHoanThanh || !memberUsers?.length) return [];
    
    const danhSachHoanThanh = new Set(
      nhiemVu.danhSachHoanThanh.map(item => item.userId)
    );
    
    return memberUsers.filter(user => !danhSachHoanThanh.has(user.id));
  }, [memberUsers]);

  const renderActionButton = useCallback((nhiemVu) => {
    if (!isMember || !nhiemVu) return null;

    const isCompleted = nhiemVu.danhSachHoanThanh?.some(
      item => item.userId === user?.id
    );
    const isCurrentlyVerifying = kiemTraHienTai?.nhiemVuId === nhiemVu.id;
    const isCooldown = cooldownTimer > 0;
    
    if (isCompleted) {
      return (
        <Badge colorScheme="green" p={2} borderRadius="md">
          Đã hoàn thành
        </Badge>
      );
    }

    if (isCurrentlyVerifying) {
      return (
        <HStack>
          <CircularProgress 
            value={(VERIFICATION_TIME - verificationTimer) / VERIFICATION_TIME * 100} 
            color="blue.400"
          >
            <CircularProgressLabel>{verificationTimer}s</CircularProgressLabel>
          </CircularProgress>
          <Text fontSize="sm">Đang kiểm tra...</Text>
        </HStack>
      );
    }

    return (
      <Button
        colorScheme="blue"
        size="sm"
        onClick={() => handleStartVerification(nhiemVu)}
        isDisabled={isCooldown}
      >
        {isCooldown 
          ? `Chờ ${cooldownTimer}s` 
          : 'Xác nhận thực hiện'
        }
      </Button>
    );
  }, [
    isMember,
    user?.id,
    kiemTraHienTai,
    cooldownTimer,
    verificationTimer,
    handleStartVerification
  ]);

  const handleFilterChange = useCallback((event) => {
    setFilterType(event.target.value);
  }, []);

  const handleDateChange = useCallback((event) => {
    setSelectedDate(event.target.value);
  }, []);

  // Loading state
  if (loading || storeLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  // No data state
  if (!Array.isArray(danhSachNhiemVu) || danhSachNhiemVu.length === 0) {
    console.log('No tasks found:', danhSachNhiemVu);
    return (
      <Box textAlign="center" py={10}>
        <Text>Không có nhiệm vụ nào trong khoảng thời gian này</Text>
        {(error || storeError) && (
          <Text color="red.500" mt={2}>
            Lỗi: {error || storeError}
          </Text>
        )}
      </Box>
    );
  }

  // Main render
  return (
    <Box overflowX="auto">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Nhiệm vụ hằng ngày</Heading>
          <Text>Tổng số thành viên cần thực hiện: {memberUsers?.length || 0}</Text>
        </HStack>

        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl>
              <FormLabel>Xem theo</FormLabel>
              <Select value={filterType} onChange={handleFilterChange}>
                <option value={FILTER_OPTIONS.DAY}>Theo ngày</option>
                <option value={FILTER_OPTIONS.MONTH}>Theo tháng</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl>
              <FormLabel>
                {filterType === FILTER_OPTIONS.DAY ? 'Chọn ngày' : 'Chọn tháng'}
              </FormLabel>
              <input
                type={filterType === FILTER_OPTIONS.DAY ? 'date' : 'month'}
                value={selectedDate}
                onChange={handleDateChange}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  borderWidth: '1px',
                  width: '100%'
                }}
              />
            </FormControl>
          </GridItem>
        </Grid>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Tiêu đề</Th><Th>Loại nhiệm vụ</Th>
              <Th>Đường dẫn</Th>
              <Th>Tiến độ</Th>
              <Th>Trạng thái</Th>
              <Th>Chưa hoàn thành</Th>
              {(isAdminTong || isMember) && <Th>Thao tác</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {danhSachNhiemVu.map((nv) => {
              if (!nv?.id) return null;
              
              const tienDo = tinhTienDo(nv);
              const chuaHoanThanh = layDanhSachChuaHoanThanh(nv);
              
              return (
                <Tr key={nv.id}>
                  <Td>{nv.tieuDe}</Td>
                  <Td>
                    <Badge colorScheme={nv.loaiNhiemVu === 'like' ? 'blue' : 'purple'}>
                      {nv.loaiNhiemVu === 'like' ? 'Thích' : nv.loaiNhiemVu === 'share' ? 'Chia sẻ' : 'Bình luận'}
                    </Badge>
                  </Td>
                  <Td>
                    <Link href={nv.duongDan} isExternal>
                      Đi đến <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      <HStack justify="space-between" width="full">
                        <Text fontSize="sm">{Math.round(tienDo)}%</Text>
                        <Text fontSize="sm">
                          ({nv.danhSachHoanThanh?.length || 0}/{memberUsers?.length || 0})
                        </Text>
                      </HStack>
                      <Progress
                        value={tienDo}
                        width="full"
                        colorScheme={tienDo === 100 ? 'green' : 'blue'}
                        size="sm"
                        borderRadius="full"
                      />
                    </VStack>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={tienDo === 100 ? 'green' : 'orange'}
                      variant="solid"
                      borderRadius="full"
                      px={3}
                    >
                      {tienDo === 100 ? 'Đã hoàn thành' : 'Đang thực hiện'}
                    </Badge>
                  </Td>
                  <Td maxW="300px">
                    {chuaHoanThanh.length > 0 ? (
                      <List spacing={1}>
                        {chuaHoanThanh.map(user => (
                          <ListItem key={user.id}>
                            <FaTimesCircle color="red" style={{ display: 'inline', marginRight: '8px' }} />
                            {user.email}
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <HStack>
                        <FaCheckCircle color="green" />
                        <Text>Tất cả đã hoàn thành</Text>
                      </HStack>
                    )}
                  </Td>
                  <Td>
                    {isMember && renderActionButton(nv)}
                    {isAdminTong && (
                      <IconButton
                        aria-label="Xóa nhiệm vụ"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteTask(nv.id)}
                      />
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
          <ModalOverlay backdropFilter="blur(5px)" />
          <ModalContent>
            <ModalHeader>Đang kiểm tra nhiệm vụ</ModalHeader>
            {!isVerifying && <ModalCloseButton />}
            <ModalBody pb={6}>
              <VStack spacing={4} align="center" py={4}>
                <CircularProgress 
                  value={(VERIFICATION_TIME - verificationTimer) / VERIFICATION_TIME * 100} 
                  size="120px" 
                  thickness="8px"
                >
                  <CircularProgressLabel fontSize="lg">
                    {verificationTimer}s
                  </CircularProgressLabel>
                </CircularProgress>
                <Text align="center" fontWeight="medium">
                  Hệ thống đang tiến hành kiểm tra việc thực hiện nhiệm vụ của bạn
                </Text>
                <Text align="center" color="white.600">
                  Yêu cầu bạn thực hiện đúng quy định, Bộ phận Hoa Vân Các sẽ kiểm tra.
                  Nếu bạn vi phạm hoặc gian lận sẽ đánh giá vào kết quả thực hiện nhiệm vụ của bạn.
                </Text>
                <Text align="center" color="red.500">
                  Bạn cần chụp ảnh màn hình và Upload vào thư mục báo cáo ngày để hoàn tất quá trình thực hiện nhiệm vụ ngày
                </Text>
                {cooldownTimer > 0 && (
                  <Text fontWeight="bold" color="orange.500">
                    Thời gian chờ nhiệm vụ tiếp theo: {cooldownTimer}s
                  </Text>
                )}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {(error || storeError) && (
          <Modal 
            isOpen={!!(error || storeError)}
            onClose={() => {
              setError(null);
              dispatch(clearError());
            }}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader color="red.500">Lỗi</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Text>{error || storeError}</Text>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </VStack>
    </Box>
  );
};

export default DanhSachNhiemVu;