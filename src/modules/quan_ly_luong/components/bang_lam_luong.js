// File: src/modules/quan_ly_luong/components/bang_lam_luong.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  Thead, 
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  HStack,
  Select,
  Input,
  useToast,
  Text,
  Alert,
  AlertIcon,
  Spinner,
  IconButton,
  Menu,
  MenuButton, 
  MenuList,
  MenuItem,
  Tooltip
} from '@chakra-ui/react';
import { FiMoreVertical } from 'react-icons/fi';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

import { useAuth } from '../../../hooks/useAuth';
import { useLuong } from '../hooks/use_luong';
import { db } from '../../../services/firebase';
import { FormTinhLuong } from './form_tinh_luong';
import { PHONG_BAN, LUONG_THEO_CAP_BAC } from '../constants/loai_luong';

export const BangLamLuong = ({ onComplete }) => {
  const toast = useToast();
  const { user } = useAuth();
  const { taoMoi } = useLuong();

  // States
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [processedMembers, setProcessedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deductionDetails, setDeductionDetails] = useState({});

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const currentDate = useMemo(() => new Date(), []);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Action states
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper functions
  const formatDate = useCallback((date) => {
    const days = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3', 
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7'
    ];
    const d = new Date(date);
    return `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }, []);

  const calculateDailySalary = useCallback((level) => {
    const baseSalary = LUONG_THEO_CAP_BAC[level?.toUpperCase()] || 0;
    return Math.round(baseSalary / 26); // 26 ngày làm việc/tháng
  }, []);

  // Kiểm tra báo cáo ngày
  const checkDailyReport = useCallback(async (email, date) => {
    try {
      if (!email) return false;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const reportQuery = query(
        collection(db, 'bao_cao'),
        where('nguoiTaoInfo.email', '==', email.toLowerCase().trim()),
        where('ngayTao', '>=', Timestamp.fromDate(startOfDay))
      );

      const snapshot = await getDocs(reportQuery);

      return snapshot.docs.some((doc) => {
        const reportDate = doc.data().ngayTao.toDate();
        return reportDate <= endOfDay;
      });
    } catch (error) {
      console.error('Error checking daily report:', error);
      return false;
    }
  }, []);

  // Tính toán khấu trừ lương
  const calculateDeductions = useCallback(async (member) => {
    const deductions = {
      totalDays: 0,
      totalAmount: 0,
      details: []
    };

    try {
      if (!member?.email) {
        throw new Error('Member email is required');
      }

      const monthStart = new Date(selectedYear, selectedMonth - 1, 1);
      const monthEnd = new Date(selectedYear, selectedMonth, 0);
      const isCurrentMonth = selectedMonth === currentDate.getMonth() + 1 && 
                           selectedYear === currentDate.getFullYear();
      const endDate = isCurrentMonth ? currentDate : monthEnd;

      // Query leave requests
      const leaveRequestsRef = collection(db, 'leave_requests');
      const leaveQuery = query(
        leaveRequestsRef,
        where('userId', '==', member.id),
        where('status', '==', 'DA_DUYET'),
        where('startDate', '<=', Timestamp.fromDate(endDate))
      );
      const leaveSnapshot = await getDocs(leaveQuery);

      const leaveRequests = leaveSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate()
          };
        })
        .filter((leave) => leave.endDate >= monthStart);

      // Process each day
      for (let date = new Date(monthStart); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0) continue; // Bỏ qua Chủ nhật

        const isLeaveDay = leaveRequests.some(
          (leave) => date >= leave.startDate && date <= leave.endDate
        );

        const dailySalary = calculateDailySalary(member.level);

        if (isLeaveDay) {
          deductions.totalDays += 1;
          deductions.totalAmount += dailySalary;
          deductions.details.push({
            date: date.toISOString(),
            type: 'Nghỉ phép',
            amount: dailySalary,
            dayOfWeek
          });
        } else {
          const hasReport = await checkDailyReport(member.email, date);
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
      }

      return deductions;
    } catch (error) {
      console.error('Error calculating deductions:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tính khấu trừ lương: ' + error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return deductions;
    }
  }, [selectedMonth, selectedYear, currentDate, toast, checkDailyReport, calculateDailySalary]);

  // Lấy danh sách thành viên đã xử lý lương
  const getProcessedMembers = useCallback(async () => {
    try {
      const salaryRef = collection(db, 'salary');
      const salaryQuery = query(
        salaryRef,
        where('kyLuong.thang', '==', selectedMonth),
        where('kyLuong.nam', '==', selectedYear)
      );

      const snapshot = await getDocs(salaryQuery);
      const processedIds = snapshot.docs.map((doc) => doc.data().userId);
      setProcessedMembers(processedIds);
    } catch (err) {
      console.error('Error getting processed members:', err);
      setError(err.message);
    }
  }, [selectedMonth, selectedYear]);

  // Lấy danh sách thành viên
  const getMembers = useCallback(async () => {
    try {
      setLoading(true);
      const membersRef = collection(db, 'users');
      const q = query(
        membersRef,
        where('status', '==', 'active'),
        where('role', '==', 'member')
      );

      const snapshot = await getDocs(q);
      const membersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setMembers(membersList);

      // Tính toán khấu trừ cho mỗi thành viên
      const deductions = {};
      for (const member of membersList) {
        deductions[member.id] = await calculateDeductions(member);
      }
      setDeductionDetails(deductions);
    } catch (err) {
      console.error('Error getting members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [calculateDeductions]);

  // Load dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getMembers(), getProcessedMembers()]);
    };
    fetchData().catch((err) => {
      console.error('Error initializing:', err);
      setError(err.message);
    });
  }, [getMembers, getProcessedMembers]);

  // Lọc thành viên
  useEffect(() => {
    const filtered = members.filter((member) => {
      const isNotProcessed = !processedMembers.includes(member.id);
      const matchesSearch = !searchTerm ||
        member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.memberCode?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = !selectedDepartment || 
        member.department === selectedDepartment;

      return isNotProcessed && matchesSearch && matchesDepartment;
    });

    setFilteredMembers(filtered);
  }, [members, processedMembers, searchTerm, selectedDepartment]);

  const handleCalculate = useCallback((employee) => {
    setSelectedEmployee(employee);
    setIsCalculating(true);
  }, []);

  const handleSubmitSalary = useCallback(async (salaryData) => {
    try {
      setIsProcessing(true);

      const memberDeductions = deductionDetails[selectedEmployee.id];

      const finalSalaryData = {
        ...salaryData,
        kyLuong: {
          thang: selectedMonth,
          nam: selectedYear
        },
        thucLinh: salaryData.thucLinh - (memberDeductions?.totalAmount || 0),
        khauTru: {
          nghiPhepKhongPhep: memberDeductions?.totalAmount || 0,
          chiTiet: memberDeductions?.details || []
        },
        trangThai: 'CHO_DUYET',
        nguoiTao: user.id
      };

      await taoMoi(finalSalaryData);

      toast({
        title: 'Thành công',
        description: 'Đã tạo bảng lương mới',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      await getProcessedMembers();
      setSelectedEmployee(null);
      setIsCalculating(false);

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error creating salary:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo bảng lương',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsProcessing(false);
    }
  }, [
    selectedEmployee,
    deductionDetails,
    selectedMonth,
    selectedYear,
    user.id,
    taoMoi,
    toast,
    getProcessedMembers,
    onComplete
  ]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Text>{error}</Text>
      </Alert>
    );
  }

  // Danh sách tháng và năm
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 10 },
    (_, i) => currentDate.getFullYear() - 5 + i
  );

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack justify="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="bold">
            Làm Lương Tháng {selectedMonth}/{selectedYear}
          </Text>
        </HStack>

        {/* Filters */}
        <HStack spacing={4}>
          <Select
            w="150px"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                Tháng {month}
              </option>
            ))}
          </Select>

          <Select
            w="150px"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </Select>

          <Select
            w="200px"
            placeholder="Tất cả phòng ban"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            {PHONG_BAN.map((pb) => (
              <option key={pb.id} value={pb.id}>
                {pb.ten}
              </option>
            ))}
          </Select>

          <Input
            placeholder="Tìm kiếm theo tên/mã số..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            w="300px"
          />
        </HStack>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>MÃ SỐ</Th>
                <Th>HỌ TÊN</Th>
                <Th>PHÒNG BAN</Th>
                <Th>NGÀY TRỪ LƯƠNG</Th>
                <Th>THAO TÁC</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredMembers.map((member) => {
                const deduction = deductionDetails[member.id];
                return (
                  <Tr key={member.id}>
                    <Td>{member.memberCode}</Td>
                    <Td>{member.fullName}</Td>
                    <Td>
                      {PHONG_BAN.find((pb) => pb.id === member.department)?.ten}
                    </Td>
                    <Td>
                      <Tooltip
                        label={deduction?.details
                          ?.map(
                            (d) =>
                              `${formatDate(d.date)}: ${d.type} (-${d.amount.toLocaleString()} VNĐ)`
                          )
                          .join('\n')}
                        hasArrow
                      >
                        <Text>
                          {deduction?.totalDays || 0} ngày
                          {deduction?.totalAmount
                            ? ` (-${deduction.totalAmount.toLocaleString()} VNĐ)`
                            : ''}
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            onClick={() => handleCalculate(member)}
                            isDisabled={isProcessing}
                          >
                            Tính lương
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                );
              })}
              {filteredMembers.length === 0 && (
                <Tr>
                  <Td colSpan={5}>
                    <Text textAlign="center" py={4}>
                      Không có thành viên nào cần tính lương
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        {selectedEmployee && (
          <FormTinhLuong
            isOpen={isCalculating}
            onClose={() => {
              setSelectedEmployee(null);
              setIsCalculating(false);
            }}
            thanhVien={selectedEmployee}
            khauTru={deductionDetails[selectedEmployee.id]}
            onSubmit={handleSubmitSalary}
          />
        )}
      </VStack>
    </Box>
  );
};

BangLamLuong.propTypes = {
  onComplete: PropTypes.func
};

BangLamLuong.defaultProps = {
  onComplete: () => {}
};

export default BangLamLuong;