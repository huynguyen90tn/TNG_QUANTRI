// File: src/modules/quan_ly_luong/components/bang_lam_luong.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
 Box,
 Table,
 Thead,
 Tbody,
 Tr,
 Th,
 Td,
 Button,
 VStack,
 HStack,
 Select,
 Input,
 useToast,
 Text,
 Alert,
 AlertIcon,  
 Spinner,
 Badge,
 IconButton,
 Menu,
 MenuButton,  
 MenuList,
 MenuItem
} from '@chakra-ui/react';
import { FiMoreVertical } from 'react-icons/fi'; 
import { useAuth } from '../../../hooks/useAuth';
import { useLuong } from '../hooks/use_luong';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { FormTinhLuong } from './form_tinh_luong';
import { CAP_BAC_LABEL, PHONG_BAN } from '../constants/loai_luong';

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

 // Filter states
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedDepartment, setSelectedDepartment] = useState('');
 const [selectedMonth] = useState(new Date().getMonth() + 1);
 const [selectedYear] = useState(new Date().getFullYear());  

 // Action states
 const [selectedEmployee, setSelectedEmployee] = useState(null);
 const [isCalculating, setIsCalculating] = useState(false);
 const [isProcessing, setIsProcessing] = useState(false);

 // Get processed members for current month
 const getProcessedMembers = useCallback(async () => {
   try {
     console.log('Getting processed members...');
     const salaryRef = collection(db, 'salary');
     const q = query(
       salaryRef,
       where('kyLuong.thang', '==', selectedMonth),
       where('kyLuong.nam', '==', selectedYear)  
     );

     const snapshot = await getDocs(q);
     const processedIds = snapshot.docs.map(doc => doc.data().userId);
     console.log('Processed members:', processedIds);
     setProcessedMembers(processedIds);
   } catch (err) {
     console.error('Error getting processed members:', err);
   }
 }, [selectedMonth, selectedYear]);

 // Get all active members from users collection
 const getMembers = useCallback(async () => {
   try {
     console.log('Getting members...');
     const membersRef = collection(db, 'users');
     let q = query(
       membersRef,
       where('status', '==', 'active'),
       where('role', '==', 'member')
     );

     const snapshot = await getDocs(q);
     const membersList = snapshot.docs.map(doc => ({
       id: doc.id,
       ...doc.data()
     }));
     console.log('Members found:', membersList.length);
     setMembers(membersList);
   } catch (err) {
     console.error('Error getting members:', err);
     setError(err.message);
   }
 }, []);

 // Initial data load
 useEffect(() => {
   const loadData = async () => {
     setLoading(true);
     try {
       await Promise.all([
         getMembers(),
         getProcessedMembers()
       ]);
     } catch (err) {
       toast({
         title: 'Lỗi',
         description: err.message,
         status: 'error',
         duration: 3000,
         isClosable: true
       });
     } finally {
       setLoading(false);
     }
   };

   loadData();
 }, [getMembers, getProcessedMembers, toast]);

 // Filter members whenever dependencies change
 useEffect(() => {
   console.log('Filtering members...');
   console.log('Total members:', members.length);
   console.log('Processed members:', processedMembers.length);
   
   const filtered = members.filter(member => {
     // Check if already processed
     const isNotProcessed = !processedMembers.includes(member.id);
     
     // Check search term
     const matchesSearch = !searchTerm || 
       member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       member.memberCode?.toLowerCase().includes(searchTerm.toLowerCase());
       
     // Check department  
     const matchesDepartment = !selectedDepartment || 
       member.department === selectedDepartment;

     return isNotProcessed && matchesSearch && matchesDepartment;
   });

   console.log('Filtered members:', filtered.length);
   setFilteredMembers(filtered);

 }, [members, processedMembers, searchTerm, selectedDepartment]);

 // Handle salary calculation
 const handleCalculate = useCallback((employee) => {
   setSelectedEmployee(employee);
   setIsCalculating(true);
 }, []);

 // Handle salary submission
 const handleSubmitSalary = useCallback(async (salaryData) => {
   try {
     setIsProcessing(true);

     await taoMoi({
       ...salaryData,
       kyLuong: {
         thang: selectedMonth,
         nam: selectedYear
       },
       trangThai: 'CHO_DUYET',
       nguoiTao: user.id
     });

     // Show success message
     toast({
       title: 'Thành công',
       description: 'Đã tạo bảng lương mới',
       status: 'success', 
       duration: 3000,
       isClosable: true
     });

     // Update processed members list
     await getProcessedMembers();
     setSelectedEmployee(null);
     setIsCalculating(false);

     if (onComplete) {
       onComplete();
     }

   } catch (error) {
     toast({
       title: 'Lỗi',
       description: error.message,
       status: 'error',
       duration: 3000, 
       isClosable: true
     });
   } finally {
     setIsProcessing(false);
   }
 }, [selectedMonth, selectedYear, taoMoi, user.id, toast, onComplete, getProcessedMembers]);

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
       {error}
     </Alert>
   );
 }

 return (
   <Box>
     <VStack spacing={6} align="stretch">
       {/* Filters */}
       <HStack spacing={4}>
         <Select
           value={selectedDepartment}
           onChange={(e) => setSelectedDepartment(e.target.value)}
           w="200px"
           placeholder="Tất cả phòng ban"
         >
           {PHONG_BAN.map(pb => (
             <option key={pb.id} value={pb.id}>{pb.ten}</option>
           ))}
         </Select>

         <Input
           placeholder="Tìm kiếm theo tên/mã số..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)} 
           w="300px"
         />
       </HStack>

       {/* Members table */}
       <Box overflowX="auto">
         <Table variant="simple">
           <Thead>
             <Tr>
               <Th>MÃ SỐ</Th>
               <Th>HỌ TÊN</Th>
               <Th>PHÒNG BAN</Th>
               <Th>CẤP BẬC</Th>
               <Th>TRẠNG THÁI</Th>
               <Th>THAO TÁC</Th>
             </Tr>
           </Thead>
           <Tbody>
             {filteredMembers.length > 0 ? (
               filteredMembers.map((member) => (
                 <Tr key={member.id}>
                   <Td>{member.memberCode}</Td>
                   <Td>{member.fullName}</Td>
                   <Td>
                     {PHONG_BAN.find(pb => pb.id === member.department)?.ten}
                   </Td>
                   <Td>{CAP_BAC_LABEL[member.level]}</Td>
                   <Td>
                     <Badge colorScheme="green">
                       Hoạt động
                     </Badge>
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
               ))
             ) : (
               <Tr>
                 <Td colSpan={6} textAlign="center">
                   Không tìm thấy nhân viên nào cần tính lương
                 </Td>
               </Tr>
             )}
           </Tbody>
         </Table>
       </Box>

       {/* Salary calculation modal */}
       {selectedEmployee && (
         <FormTinhLuong
           isOpen={isCalculating}
           onClose={() => {
             setSelectedEmployee(null);
             setIsCalculating(false);
           }}
           thanhVien={selectedEmployee}
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

export default BangLamLuong;