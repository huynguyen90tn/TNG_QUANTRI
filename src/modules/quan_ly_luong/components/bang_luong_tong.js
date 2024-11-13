// File: src/modules/quan_ly_luong/components/bang_luong_tong.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BangDanhSachLuong } from './bang_danh_sach_luong';
import { BangLamLuong } from './bang_lam_luong';
import { useToast } from '@chakra-ui/react';
import { useLuong } from '../hooks/use_luong';

export const BangLuongTong = () => {
 const toast = useToast();
 const { layDanhSach } = useLuong();
 const [tabIndex, setTabIndex] = useState(0);
 const [isRefreshing, setIsRefreshing] = useState(false);

 // Hàm refresh data
 const refreshData = useCallback(async () => {
   try {
     setIsRefreshing(true);
     await layDanhSach();
   } catch (err) {
     toast({
       title: 'Lỗi',
       description: 'Không thể cập nhật dữ liệu',
       status: 'error',
       duration: 3000,
       isClosable: true,
     });
   } finally {
     setIsRefreshing(false);
   }
 }, [layDanhSach, toast]);

 // Tự động refresh khi chuyển tab
 useEffect(() => {
   if (tabIndex === 0) {
     refreshData();
   }
 }, [tabIndex, refreshData]);

 // Xử lý khi hoàn thành làm lương
 const handleComplete = useCallback(async () => {
   await refreshData();
   setTabIndex(0);
 }, [refreshData]);

 return (
   <Box>
     <Tabs
       variant="enclosed"
       colorScheme="blue"
       index={tabIndex}
       onChange={setTabIndex}
       isLazy={false}
     >
       <TabList>
         <Tab fontWeight="medium" _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
           Danh Sách Lương
         </Tab>
         <Tab fontWeight="medium" _selected={{ color: 'blue.500', borderColor: 'blue.500' }}>
           Làm Lương Mới
         </Tab>
       </TabList>

       <TabPanels>
         <TabPanel px={0}>
           <BangDanhSachLuong 
             isRefreshing={isRefreshing}
             onRefresh={refreshData}
           />
         </TabPanel>
         <TabPanel px={0}>
           <BangLamLuong 
             onComplete={handleComplete}
             onRefresh={refreshData} 
           />
         </TabPanel>
       </TabPanels>
     </Tabs>
   </Box>
 );
};

BangLuongTong.propTypes = {};

export default BangLuongTong;