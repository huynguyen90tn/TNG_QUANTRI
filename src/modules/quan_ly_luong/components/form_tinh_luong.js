// File: src/modules/quan_ly_luong/components/form_tinh_luong.js
// Link tham khảo: https://chakra-ui.com/docs/components 
// Nhánh: main

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader, 
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Button,
  Text,
  useToast,
  Divider,
  Switch,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  Tooltip,
  Box,
  Stack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, InfoIcon } from '@chakra-ui/icons';
import { FiCalendar, FiDollarSign, FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useLuong } from '../hooks/use_luong';
import { formatCurrency, formatNumber, parseFormattedNumber } from '../../../utils/format';
import { db } from '../../../services/firebase';
import { doc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../../hooks/useAuth';
import { getLuongByCapBac, getTenCapBac } from '../constants/luong_cap_bac';
import { useThemeStyles } from '../hooks/use_theme_styles';


// Constants
const INIT_PHU_CAP = {
  anUong: 0,
  diLai: 0,
  dienThoai: 0,
  khac: 0,
};

const INIT_BAO_HIEM = {
  bhyt: 0,
  bhxh: 0,
  bhtn: 0,
  dongBaoHiem: false,
};

const ThuongPhatItem = ({
  items,
  title,
  onAdd,
  onDelete,
  onChangeAmount,
  onChangeReason,
  readOnly = false,
}) => {
  const styles = useThemeStyles();
  const isReward = title === 'Thưởng';
  const cardStyles = isReward ? styles.thuongCard : styles.phatCard;

  return (
    <Card
      bg={styles.bgCard}
      borderWidth="1px"
      borderColor={styles.borderColor}
      boxShadow="sm"
      borderRadius="lg"
      overflow="hidden"
    >
      <CardHeader>
        <Stack direction="row" justify="space-between" align="center">
          <HStack>
            <FiDollarSign size={20} color={cardStyles.iconColor} />
            <Text fontSize="lg" fontWeight="semibold">
              {title}
            </Text>
          </HStack>

          {!readOnly && (
            <Button
              leftIcon={<FiPlus />}
              size="sm"
              colorScheme={cardStyles.colorScheme}
              variant="ghost"
              onClick={onAdd}
              _hover={{
                bg: cardStyles.hoverBg,
              }}
            >
              Thêm {title.toLowerCase()}
            </Button>
          )}
        </Stack>
      </CardHeader>

      <CardBody>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Số tiền</Th>
                <Th>Lý do</Th>
                {!readOnly && <Th width="10%">Thao tác</Th>}
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, index) => (
                <Tr key={index}>
                  <Td>
                    <Input
                      variant="filled"
                      type="text"
                      value={formatNumber(item.amount)}
                      onChange={(e) => onChangeAmount(index, e.target.value)}
                      readOnly={readOnly}
                      bg={styles.bgInput}
                      borderColor={styles.borderColor}
                      _hover={{
                        bg: styles.bgInputHover,
                      }}
                      _focus={{
                        bg: 'white',
                        borderColor: `${cardStyles.colorScheme}.500`,
                      }}
                    />
                  </Td>
                  <Td>
                    <Input
                      variant="filled"
                      value={item.reason}
                      onChange={(e) => onChangeReason(index, e.target.value)}
                      readOnly={readOnly}
                      bg={styles.bgInput}
                      borderColor={styles.borderColor}
                      _hover={{
                        bg: styles.bgInputHover,
                      }}
                      _focus={{
                        bg: 'white',
                        borderColor: `${cardStyles.colorScheme}.500`,
                      }}
                    />
                  </Td>
                  {!readOnly && (
                    <Td>
                      <IconButton
                        aria-label="Xóa"
                        icon={<DeleteIcon />}
                        onClick={() => onDelete(index)}
                        size="sm"
                        variant="ghost"
                        colorScheme={cardStyles.colorScheme}
                        _hover={{
                          bg: cardStyles.hoverBg,
                        }}
                      />
                    </Td>
                  )}
                </Tr>
              ))}{items.length === 0 && (
                <Tr>
                  <Td colSpan={readOnly ? 2 : 3} textAlign="center">
                    <Text color="gray.500">Chưa có {title.toLowerCase()} nào được thêm</Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  );
};

ThuongPhatItem.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number,
      reason: PropTypes.string,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChangeAmount: PropTypes.func.isRequired,
  onChangeReason: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

ThuongPhatItem.defaultProps = {
  readOnly: false,
};

const ChiTietKhauTruModal = ({ isOpen, onClose, chiTietKhauTru, luongMotNgay }) => {
  const styles = useThemeStyles();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <Box
          p={6}
          bg={styles.bgCard}
          borderColor={styles.borderColor}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="lg"
        >
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <Stack direction="row" align="center" spacing={3}>
                <FiCalendar size={24} color="#E53E3E" />
                <Text fontSize="xl" fontWeight="bold">
                  Chi Tiết Khấu Trừ
                </Text>
              </Stack>
              <Card p={3} bg="red.50" borderRadius="md">
                <Text fontSize="sm" color="red.600" fontWeight="medium">
                  Lương 1 ngày: {formatCurrency(luongMotNgay)}
                </Text>
              </Card>
            </HStack>

            <Box
              overflowY="auto"
              maxH="60vh"
              borderWidth="1px"
              borderColor={styles.borderColor}
              borderRadius="md"
            >
              <Table variant="simple">
                <Thead
                  position="sticky"
                  top={0}
                  bg={styles.bgCard}
                  borderBottomWidth="1px"
                  borderColor={styles.borderColor}
                >
                  <Tr>
                    <Th>Ngày</Th>
                    <Th>Thứ</Th>
                    <Th>Lý do</Th>
                    <Th isNumeric>Số tiền trừ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {chiTietKhauTru.map((item, index) => {
                    const ngay = new Date(item.date);
                    const thu = format(ngay, 'EEEE', { locale: vi });
                    return (
                      <Tr key={index}>
                        <Td>{format(ngay, 'dd/MM/yyyy')}</Td>
                        <Td style={{ textTransform: 'capitalize' }}>{thu}</Td>
                        <Td>
                          <HStack>
                            <Box w={2} h={2} borderRadius="full" bg="red.500" />
                            <Text>{item.type}</Text>
                          </HStack>
                        </Td>
                        <Td isNumeric>
                          <Text color="red.500" fontWeight="medium">
                            -{formatCurrency(item.amount)}
                          </Text>
                        </Td>
                      </Tr>
                    );
                  })}
                  <Tr fontWeight="bold" bg={styles.bgInput}>
                    <Td colSpan={3}>Tổng cộng</Td>
                    <Td isNumeric>
                      <Text color="red.500" fontSize="lg">
                        -{formatCurrency(chiTietKhauTru.reduce((sum, item) => sum + item.amount, 0))}
                      </Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Button
              onClick={onClose}
              alignSelf="flex-end"
              size="lg"
              colorScheme="blue"
              leftIcon={<FiCalendar />}
            >
              Đóng
            </Button>
          </VStack>
        </Box>
      </ModalContent>
    </Modal>
  );
};

ChiTietKhauTruModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  chiTietKhauTru: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      dayOfWeek: PropTypes.number.isRequired,
    })
  ).isRequired,
  luongMotNgay: PropTypes.number.isRequired,
};

export const FormTinhLuong = ({
  isOpen,
  onClose,
  thanhVien = null,
  onSubmit: handleSubmitExternal,
  readOnly = false,
}) => {
  const toast = useToast();
  const { user } = useAuth();
  const { tinhToanLuong } = useLuong();
  const styles = useThemeStyles();
  const [isChiTietKhauTruOpen, setIsChiTietKhauTruOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    memberCode: '',
    level: '',
    department: '',
    luongCoBan: 0,
    phuCap: { ...INIT_PHU_CAP },
    baoHiem: { ...INIT_BAO_HIEM },
    khauTru: {
      nghiPhepKhongPhep: 0,
      chiTiet: [],
    },
  });

  const [thuongList, setThuongList] = useState([]);
  const [phatList, setPhatList] = useState([]);
  const [dongBaoHiem, setDongBaoHiem] = useState(false);
  const [dongThue, setDongThue] = useState(false);

  const tinhTienTruLuong = useCallback((luongCoBan) => {
    return Math.round(luongCoBan / 26);
  }, []);const checkDailyReport = useCallback(async (email, date) => {
    try {
      if (!email) return false;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const reportQuery = query(
        collection(db, 'bao_cao'),
        where('nguoiTaoInfo.email', '==', email.toLowerCase().trim()),
        where('ngayTao', '>=', Timestamp.fromDate(startOfDay)),
        where('ngayTao', '<=', Timestamp.fromDate(endOfDay))
      );

      const snapshot = await getDocs(reportQuery);
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking daily report:', error);
      return false;
    }
  }, []);

  const calculateDeductions = useCallback(async (member) => {
    if (!member?.email || !member?.luongCoBan) return null;

    const deductions = {
      totalDays: 0,
      totalAmount: 0,
      details: []
    };

    try {
      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const monthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const endDate = new Date();

      for (let date = new Date(monthStart); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0) continue; // Bỏ qua Chủ nhật

        const hasReport = await checkDailyReport(member.email, date);
        const dailySalary = tinhTienTruLuong(member.luongCoBan);

        if (!hasReport) {
          deductions.totalDays += 1;
          deductions.totalAmount += dailySalary;
          deductions.details.push({
            date: date.toISOString(),
            type: 'Không báo cáo ngày',
            amount: dailySalary,
            dayOfWeek 
          });
        }
      }
      return deductions;
    } catch (error) {
      console.error('Error calculating deductions:', error);
      return null;
    }
  }, [checkDailyReport, tinhTienTruLuong]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        userId: '',
        userName: '',
        memberCode: '',
        level: '',
        department: '', 
        luongCoBan: 0,
        phuCap: { ...INIT_PHU_CAP },
        baoHiem: { ...INIT_BAO_HIEM },
        khauTru: {
          nghiPhepKhongPhep: 0,
          chiTiet: [],
        },
      });
      setThuongList([]);
      setPhatList([]);
      setDongBaoHiem(false);
      setDongThue(false);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const loadThanhVienInfo = async () => {
      if (!thanhVien?.id) return;

      try {
        const docRef = doc(db, 'members', thanhVien.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const luongCoBan = getLuongByCapBac(data.level) || 0;
          
          // Tính khấu trừ
          const deductions = await calculateDeductions({
            ...data,
            luongCoBan
          });

          setFormData(prev => ({
            ...prev,
            userId: thanhVien.id,
            userName: data.fullName || '',
            memberCode: data.memberCode || '',
            level: data.level || 'THU_SINH',
            department: data.department || '',
            luongCoBan,
            khauTru: {
              nghiPhepKhongPhep: deductions?.totalAmount || 0,
              chiTiet: deductions?.details || []
            },
          }));

          if (deductions?.totalAmount > 0) {
            setPhatList([{
              amount: deductions.totalAmount,
              reason: `Trừ lương ${deductions.totalDays} ngày không báo cáo`
            }]);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin thành viên');
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin thành viên',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      }
    };

    loadThanhVienInfo();
  }, [thanhVien, calculateDeductions, toast]);

  const handleChange = useCallback((field, value) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: parseFormattedNumber(value),
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  const handleAddThuong = useCallback(() => {
    setThuongList(prev => [...prev, { amount: 0, reason: '' }]);
  }, []);

  const handleDeleteThuong = useCallback((index) => {
    setThuongList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleChangeThuong = useCallback((index, field, value) => {
    setThuongList(prev => {
      const newList = [...prev];
      if (field === 'amount') {
        newList[index][field] = parseFormattedNumber(value);
      } else {
        newList[index][field] = value;
      }
      return newList;
    });
  }, []);

  const handleAddPhat = useCallback(() => {
    setPhatList(prev => [...prev, { amount: 0, reason: '' }]);
  }, []);

  const handleDeletePhat = useCallback((index) => {
    setPhatList(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleChangePhat = useCallback((index, field, value) => {
    setPhatList(prev => {
      const newList = [...prev];
      if (field === 'amount') {
        newList[index][field] = parseFormattedNumber(value);
      } else {
        newList[index][field] = value;
      }
      return newList;
    });
  }, []);

  const tongThuong = useMemo(() => 
    thuongList.reduce((sum, item) => sum + (item.amount || 0), 0),
    [thuongList]
  );

  const tongPhat = useMemo(() =>
    phatList.reduce((sum, item) => sum + (item.amount || 0), 0),
    [phatList]  
  );

  // Tính toán tổng lương 
  const { tongThuNhap, thueTNCN, baoHiem, thucLinh } = useMemo(() => 
    tinhToanLuong(
      formData.luongCoBan,
      tongThuong - tongPhat,
      formData.phuCap,
      dongBaoHiem,
      dongThue,
      { nghiPhepKhongPhep: 0, chiTiet: [] }
    ),
    [
      formData.luongCoBan,
      formData.phuCap,
      tongThuong,
      tongPhat, 
      dongBaoHiem,
      dongThue,
      tinhToanLuong
    ]
  );

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.userId || !formData.userName || !formData.memberCode) {
        throw new Error('Vui lòng chọn thành viên');
      }

      const luongData = {
        ...formData,
        tongThuNhap,
        thueTNCN: dongThue ? thueTNCN : 0,
        baoHiem: {
          ...baoHiem,
          dongBaoHiem
        },
        thucLinh,
        thuongList: thuongList.map(item => ({
          amount: Number(item.amount) || 0,
          reason: item.reason || ''
        })),
        phatList: phatList.map(item => ({
          amount: Number(item.amount) || 0,
          reason: item.reason || ''  
        })),
        dongThue,
        khauTru: {
          nghiPhepKhongPhep: formData.khauTru.nghiPhepKhongPhep,
          chiTiet: formData.khauTru.chiTiet || []
        },
        kyLuong: {
          thang: new Date().getMonth() + 1,
          nam: new Date().getFullYear()
        },
        trangThai: 'CHO_DUYET',
        nguoiTao: user.id
      };

      await handleSubmitExternal(luongData);
      
      toast({
        title: 'Thành công',
        description: 'Đã tạo bảng lương mới',
        status: 'success',
        duration: 3000,
        isClosable: true  
      });

      onClose();
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      toast({
        title: 'Lỗi',
        description: err.message || 'Không thể tạo bảng lương',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  }, [
    formData,
    tongThuNhap,
    thueTNCN,
    baoHiem,
    thucLinh,
    dongBaoHiem,
    dongThue,
    thuongList,
    phatList,
    user.id,
    handleSubmitExternal,
    onClose,
    toast
  ]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl"> 
      <ModalOverlay />
      <ModalContent bg={styles.bgCard}>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {readOnly ? 'Chi Tiết Lương' : 'Tính Lương'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Mã thành viên</FormLabel>
                <Input
                  value={formData.memberCode}
                  isReadOnly
                  bg={styles.bgInput}
                  _hover={{ bg: styles.bgInputHover }} 
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontWeight="medium">Cấp bậc</FormLabel>
                <Input
                  value={`${getTenCapBac(formData.level)} - ${formatCurrency(getLuongByCapBac(formData.level))}`}
                  isReadOnly
                  bg={styles.bgInput}
                  _hover={{ bg: styles.bgInputHover }}
                />
              </FormControl>

              {formData.khauTru?.nghiPhepKhongPhep > 0 && (
                <Alert status="warning" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack justify="space-between" w="full">
                      <Text>
                        Thông báo: {formData.khauTru.chiTiet.length} ngày không báo cáo
                      </Text>
                      <Button
                        leftIcon={<FiCalendar />}
                        size="sm"
                        colorScheme="orange"
                        variant="solid"
                        onClick={() => {
                          setIsChiTietKhauTruOpen(true);
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      Lương 1 ngày: {formatCurrency(tinhTienTruLuong(formData.luongCoBan))}
                    </Text>
                  </VStack>
                </Alert>
              )}

              <ThuongPhatItem
                title="Thưởng"
                items={thuongList}
                onAdd={handleAddThuong}
                onDelete={handleDeleteThuong}
                onChangeAmount={(index, value) => handleChangeThuong(index, 'amount', value)}
                onChangeReason={(index, value) => handleChangeThuong(index, 'reason', value)}
                readOnly={readOnly}
              />

              <ThuongPhatItem
                title="Trừ lương"
                items={phatList}
                onAdd={handleAddPhat}
                onDelete={handleDeletePhat}
                onChangeAmount={(index, value) => handleChangePhat(index, 'amount', value)}
                onChangeReason={(index, value) => handleChangePhat(index, 'reason', value)}
                readOnly={readOnly}
              />

              <FormControl>
                <FormLabel fontWeight="medium">Phụ cấp</FormLabel>
                <VStack spacing={3}>
                  <HStack spacing={4} w="full">
                    <FormControl>
                      <FormLabel>Ăn uống</FormLabel>
                      <Input
                        type="text"
                        value={formatNumber(formData.phuCap.anUong)}
                        onChange={(e) => handleChange('phuCap.anUong', e.target.value)}
                        readOnly={readOnly}
                        bg={styles.bgInput}
                        _hover={{ bg: styles.bgInputHover }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Đi lại</FormLabel>
                      <Input
                        type="text"
                        value={formatNumber(formData.phuCap.diLai)}
                        onChange={(e) => handleChange('phuCap.diLai', e.target.value)}
                        readOnly={readOnly}
                        bg={styles.bgInput}
                        _hover={{ bg: styles.bgInputHover }}
                      />
                    </FormControl>
                  </HStack>

                  <HStack spacing={4} w="full">
                    <FormControl>
                      <FormLabel>Điện thoại</FormLabel>
                      <Input
                        type="text"
                        value={formatNumber(formData.phuCap.dienThoai)}
                        onChange={(e) => handleChange('phuCap.dienThoai', e.target.value)}
                        readOnly={readOnly}
                        bg={styles.bgInput}
                        _hover={{ bg: styles.bgInputHover }}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Khác</FormLabel>
                      <Input
                        type="text"
                        value={formatNumber(formData.phuCap.khac)}
                        onChange={(e) => handleChange('phuCap.khac', e.target.value)}
                        readOnly={readOnly}
                        bg={styles.bgInput}
                        _hover={{ bg: styles.bgInputHover }}
                      />
                    </FormControl>
                  </HStack>
                </VStack>
              </FormControl>

              <Card bg={styles.bgCard} borderColor={styles.borderColor}>
                <CardHeader>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      <HStack spacing={2}>
                        <Text fontWeight="medium">Đóng bảo hiểm</Text>
                        <Tooltip
                          label="BHXH (8%), BHYT (1.5%), BHTN (1%)"
                          placement="right"
                          hasArrow
                        >
                          <InfoIcon color="blue.500" />
                        </Tooltip>
                      </HStack>
                    </FormLabel>
                    <Switch
                      isChecked={dongBaoHiem}
                      onChange={(e) => setDongBaoHiem(e.target.checked)}
                      isReadOnly={readOnly}
                      colorScheme="blue"
                    />
                  </FormControl>
                </CardHeader>
                {dongBaoHiem && (
                  <CardBody>
                    <VStack spacing={3}>
                      <HStack justify="space-between" w="full">
                        <Text>BHYT (1.5%):</Text>
                        <Text color="blue.500" fontWeight="medium">
                          {formatCurrency(baoHiem.bhyt)}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text>BHXH (8%):</Text>
                        <Text color="blue.500" fontWeight="medium">
                          {formatCurrency(baoHiem.bhxh)}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text>BHTN (1%):</Text>
                        <Text color="blue.500" fontWeight="medium">
                          {formatCurrency(baoHiem.bhtn)}
                        </Text>
                      </HStack>
                      <Divider />
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="bold">Tổng bảo hiểm:</Text>
                        <Text color="blue.500" fontWeight="bold" fontSize="lg">
                          {formatCurrency(
                            baoHiem.bhyt + baoHiem.bhxh + baoHiem.bhtn
                          )}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                )}
              </Card>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontWeight="medium">
                  <HStack spacing={2}>
                    <Text>Đóng thuế TNCN</Text>
                    <Tooltip
                      label="Thuế thu nhập cá nhân sẽ được tính dựa trên thang thuế lũy tiến"
                      placement="right"
                      hasArrow
                    >
                      <InfoIcon color="green.500" />
                    </Tooltip>
                  </HStack>
                </FormLabel>
                <Switch
                  isChecked={dongThue}
                  onChange={(e) => setDongThue(e.target.checked)}
                  isReadOnly={readOnly}
                  colorScheme="green"
                />
              </FormControl>

              <Divider />

              <VStack spacing={4} align="stretch" w="full">
                <Card p={4} bg={styles.bgCard} borderColor={styles.borderColor}>
                  <HStack justify="space-between">
                    <Text color="gray.600">Tổng thu nhập:</Text>
                    <Text fontWeight="semibold" fontSize="lg">
                      {formatCurrency(tongThuNhap)}
                    </Text>
                  </HStack>

                  {dongThue && (
                    <HStack justify="space-between" mt={2}>
                      <Text color="gray.600">Thuế TNCN:</Text>
                      <Text color="green.500" fontWeight="medium">
                        -{formatCurrency(thueTNCN)}
                      </Text>
                    </HStack>
                  )}

                  {dongBaoHiem && (
                    <HStack justify="space-between" mt={2}>
                      <Text color="gray.600">Tổng bảo hiểm:</Text>
                      <Text color="blue.500" fontWeight="medium">
                        -{formatCurrency(
                          baoHiem.bhyt + baoHiem.bhxh + baoHiem.bhtn
                        )}
                      </Text>
                    </HStack>
                  )}
                </Card>

                <Card
                  p={4}
                  bg="green.50"
                  _dark={{ bg: 'green.900' }}
                  borderWidth="2px"
                  borderColor="green.500"
                >
                  <HStack justify="space-between">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="green.700"
                      _dark={{ color: 'green.200' }}
                    >
                      Thực lĩnh:
                    </Text>
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="green.600"
                      _dark={{ color: 'green.200' }}
                    >
                      {formatCurrency(thucLinh)}
                    </Text>
                  </HStack>
                </Card>
              </VStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} size="lg">
              {readOnly ? 'Đóng' : 'Hủy'}
            </Button>
            {!readOnly && (
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={loading}
                loadingText="Đang xử lý..."
                disabled={!formData.userId || !formData.userName || loading}
                size="lg"
                leftIcon={<FiDollarSign />}
              >
                Xác nhận
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>

      <ChiTietKhauTruModal
        isOpen={isChiTietKhauTruOpen}
        onClose={() => setIsChiTietKhauTruOpen(false)}
        chiTietKhauTru={formData.khauTru.chiTiet}
        luongMotNgay={tinhTienTruLuong(formData.luongCoBan)}
      />
    </Modal>
  );
};

FormTinhLuong.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  thanhVien: PropTypes.shape({
    id: PropTypes.string,
    memberCode: PropTypes.string,
    level: PropTypes.string,
    department: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

FormTinhLuong.defaultProps = {
  thanhVien: null,
  readOnly: false,
};

export default FormTinhLuong;