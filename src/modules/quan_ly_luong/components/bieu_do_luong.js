// File: src/modules/quan_ly_luong/components/bieu_do_luong.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Text,
  Select,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  Tab,
  Button,
  Flex,
  Icon,
} from '@chakra-ui/react';
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FiDollarSign, FiUsers, FiTrendingUp, FiFilter } from 'react-icons/fi';
import { useLuong } from '../hooks/use_luong';
import { PHONG_BAN } from '../constants/loai_luong';
import { formatCurrency } from '../../../utils/format';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9146FF'];

export const BieuDoLuong = () => {
  const { danhSachLuong = [] } = useLuong();
  const [filter, setFilter] = useState({
    nam: new Date().getFullYear(),
    thang: new Date().getMonth() + 1,
    phongBan: ''
  });

  const [currentFilter, setCurrentFilter] = useState({
    nam: new Date().getFullYear(),
    thang: new Date().getMonth() + 1,
    phongBan: ''
  });

  const [activeTab, setActiveTab] = useState("luong");

  // Thống kê tổng quát
  const thongKe = useMemo(() => {
    const luongThang = danhSachLuong.filter(
      item => 
        item.kyLuong.nam === currentFilter.nam &&
        item.kyLuong.thang === currentFilter.thang &&
        (!currentFilter.phongBan || item.department === currentFilter.phongBan)
    );

    const thangTruoc = danhSachLuong.filter(
      item =>
        item.kyLuong.nam === (currentFilter.thang === 1 ? currentFilter.nam - 1 : currentFilter.nam) &&
        item.kyLuong.thang === (currentFilter.thang === 1 ? 12 : currentFilter.thang - 1) &&
        (!currentFilter.phongBan || item.department === currentFilter.phongBan)
    );

    const tongLuongHienTai = luongThang.reduce((sum, item) => sum + item.thucLinh, 0);
    const tongLuongThangTruoc = thangTruoc.reduce((sum, item) => sum + item.thucLinh, 0);
    const percentChange = tongLuongThangTruoc === 0 ? 0 : 
      ((tongLuongHienTai - tongLuongThangTruoc) / tongLuongThangTruoc) * 100;

    const luongTB = luongThang.length ? tongLuongHienTai / luongThang.length : 0;
    const luongTBThangTruoc = thangTruoc.length ? tongLuongThangTruoc / thangTruoc.length : 0;
    const percentChangeLuongTB = luongTBThangTruoc === 0 ? 0 :
      ((luongTB - luongTBThangTruoc) / luongTBThangTruoc) * 100;

    // Tính tổng thưởng và phạt
    const tongThuong = luongThang.reduce((sum, item) => {
      const thuong = item.thuongList?.reduce((t, i) => t + (i.amount || 0), 0) || 0;
      return sum + thuong;
    }, 0);

    const tongThuongThangTruoc = thangTruoc.reduce((sum, item) => {
      const thuong = item.thuongList?.reduce((t, i) => t + (i.amount || 0), 0) || 0;
      return sum + thuong;
    }, 0);

    const percentChangeThuong = tongThuongThangTruoc === 0 ? 0 :
      ((tongThuong - tongThuongThangTruoc) / tongThuongThangTruoc) * 100;

    const tongPhat = luongThang.reduce((sum, item) => {
      const phat = item.phatList?.reduce((p, i) => p + (i.amount || 0), 0) || 0;
      return sum + phat;
    }, 0);

    const tongPhatThangTruoc = thangTruoc.reduce((sum, item) => {
      const phat = item.phatList?.reduce((p, i) => p + (i.amount || 0), 0) || 0;
      return sum + phat;
    }, 0);

    const percentChangePhat = tongPhatThangTruoc === 0 ? 0 :
      ((tongPhat - tongPhatThangTruoc) / tongPhatThangTruoc) * 100;

    return {
      tongLuong: tongLuongHienTai,
      percentChange,
      luongTB,
      percentChangeLuongTB,
      tongThuong,
      percentChangeThuong,
      tongPhat,
      percentChangePhat,
      tongNhanVien: luongThang.length,
      percentChangeNhanVien: thangTruoc.length === 0 ? 0 :
        ((luongThang.length - thangTruoc.length) / thangTruoc.length) * 100
    };
  }, [danhSachLuong, currentFilter]);

  // Dữ liệu biểu đồ theo phòng ban
  const dataPhongBan = useMemo(() => {
    const groupByDept = danhSachLuong.reduce((acc, item) => {
      if (item.kyLuong.nam === currentFilter.nam && 
          item.kyLuong.thang === currentFilter.thang) {
        if (!acc[item.department]) {
          acc[item.department] = {
            phongBan: item.department,
            tongLuong: 0,
            soNhanVien: 0,
            luongTrungBinh: 0,
            tongThuong: 0,
            tongPhat: 0,
            thucLinh: 0
          };
        }
        // Tính tổng thưởng của phòng ban
        const thuong = item.thuongList?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
        // Tính tổng phạt của phòng ban  
        const phat = item.phatList?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        acc[item.department].tongLuong += item.luongCoBan || 0;
        acc[item.department].tongThuong += thuong;
        acc[item.department].tongPhat += phat;
        acc[item.department].thucLinh += item.thucLinh || 0;
        acc[item.department].soNhanVien += 1;
      }
      return acc;
    }, {});

    return Object.values(groupByDept).map(dept => ({
      ...dept,
      luongTrungBinh: dept.soNhanVien > 0 ? dept.tongLuong / dept.soNhanVien : 0,
      label: PHONG_BAN.find(pb => pb.id === dept.phongBan)?.ten || dept.phongBan
    }));
  }, [danhSachLuong, currentFilter]);

  // Dữ liệu biểu đồ theo tháng 
  const dataTheoThang = useMemo(() => {
    const monthData = new Array(12).fill(0).map((_, index) => ({
      thang: index + 1,
      tongLuong: 0,
      luongTrungBinh: 0,
      tongThuong: 0,
      tongPhat: 0,
      thucLinh: 0,
      soNhanVien: 0
    }));

    danhSachLuong.forEach(item => {
      if (item.kyLuong.nam === currentFilter.nam &&
          (!currentFilter.phongBan || item.department === currentFilter.phongBan)) {
        const monthIndex = item.kyLuong.thang - 1;
        
        // Tính tổng thưởng
        const thuong = item.thuongList?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
        // Tính tổng phạt
        const phat = item.phatList?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        monthData[monthIndex].tongLuong += item.luongCoBan || 0;
        monthData[monthIndex].tongThuong += thuong;
        monthData[monthIndex].tongPhat += phat;
        monthData[monthIndex].thucLinh += item.thucLinh || 0;
        monthData[monthIndex].soNhanVien += 1;
      }
    });

    return monthData.map(item => ({
      ...item,
      luongTrungBinh: item.soNhanVien > 0 ? item.tongLuong / item.soNhanVien : 0
    }));
  }, [danhSachLuong, currentFilter]);

  const handleApplyFilter = () => {
    setCurrentFilter(filter);
  };return (
    <VStack spacing={6}>
      {/* Navigation Tabs */}
      <Tabs w="full">
        <TabList>
          <Tab 
            onClick={() => setActiveTab("luong")} 
            isSelected={activeTab === "luong"}
          >
            Quản Lý Lương
          </Tab>
          <Tab 
            onClick={() => setActiveTab("luongCuaToi")} 
            isSelected={activeTab === "luongCuaToi"}
          >
            Lương Của Tôi
          </Tab>
          <Tab 
            onClick={() => setActiveTab("thongKe")} 
            isSelected={activeTab === "thongKe"}
          >
            Thống Kê
          </Tab>
        </TabList>
      </Tabs>

      {/* Filters */}
      <HStack spacing={4} alignSelf="flex-start" bg="gray.800" p={4} borderRadius="lg" w="full">
        <Select
          w="120px"
          value={filter.nam}
          onChange={(e) => setFilter(prev => ({
            ...prev,
            nam: parseInt(e.target.value)
          }))}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>Năm {year}</option>
            );
          })}
        </Select>

        <Select
          w="120px"
          value={filter.thang}
          onChange={(e) => setFilter(prev => ({
            ...prev,
            thang: parseInt(e.target.value)
          }))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
          ))}
        </Select>

        <Select
          w="200px"
          placeholder="Tất cả phòng ban"
          value={filter.phongBan}
          onChange={(e) => setFilter(prev => ({
            ...prev,
            phongBan: e.target.value
          }))}
        >
          {PHONG_BAN.map((pb) => (
            <option key={pb.id} value={pb.id}>{pb.ten}</option>
          ))}
        </Select>

        <Button
          leftIcon={<FiFilter />}
          colorScheme="blue"
          onClick={handleApplyFilter}
        >
          Áp dụng
        </Button>
      </HStack>

      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Tổng chi lương</StatLabel>
              <StatNumber>{formatCurrency(thongKe.tongLuong)}</StatNumber>
              <StatHelpText>
                <StatArrow type={thongKe.percentChange >= 0 ? "increase" : "decrease"} />
                {thongKe.percentChange.toFixed(2)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Lương trung bình</StatLabel>
              <StatNumber>{formatCurrency(thongKe.luongTB)}</StatNumber>
              <StatHelpText>
                <StatArrow type={thongKe.percentChangeLuongTB >= 0 ? "increase" : "decrease"} />
                {thongKe.percentChangeLuongTB.toFixed(2)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Thưởng & Phạt</StatLabel>
              <Flex justify="space-between">
                <Box>
                  <StatNumber color="green.500">+{formatCurrency(thongKe.tongThuong)}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={thongKe.percentChangeThuong >= 0 ? "increase" : "decrease"} />
                    {thongKe.percentChangeThuong.toFixed(2)}%
                  </StatHelpText>
                </Box>
                <Box>
                  <StatNumber color="red.500">-{formatCurrency(thongKe.tongPhat)}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={thongKe.percentChangePhat >= 0 ? "increase" : "decrease"} />
                    {thongKe.percentChangePhat.toFixed(2)}%
                  </StatHelpText>
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Số nhân viên</StatLabel>
              <StatNumber>{thongKe.tongNhanVien}</StatNumber>
              <StatHelpText>
                <StatArrow type={thongKe.percentChangeNhanVien >= 0 ? "increase" : "decrease"} />
                {thongKe.percentChangeNhanVien.toFixed(2)}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Charts */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="full">
        {/* Biểu đồ theo phòng ban */}
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="medium">
              Biểu Đồ Lương Theo Phòng Ban
            </Text>
          </CardHeader>
          <CardBody>
            <Box h="400px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataPhongBan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={value => `${value/1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar 
                    name="Tổng lương" 
                    dataKey="tongLuong" 
                    fill={COLORS[0]} 
                    stackId="luong"
                  />
                  <Bar 
                    name="Thưởng" 
                    dataKey="tongThuong" 
                    fill={COLORS[1]} 
                    stackId="luong"
                  />
                  <Bar 
                    name="Phạt" 
                    dataKey="tongPhat" 
                    fill={COLORS[2]} 
                    stackId="tru"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        {/* Biểu đồ theo tháng */}
        <Card>
          <CardHeader>
            <Text fontSize="lg" fontWeight="medium">
              Biểu Đồ Lương Theo Tháng
            </Text>
          </CardHeader>
          <CardBody>
            <Box h="400px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataTheoThang}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="thang" />
                  <YAxis tickFormatter={value => `${value/1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    name="Tổng lương"
                    dataKey="tongLuong"
                    stroke={COLORS[0]}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    name="Thưởng"
                    dataKey="tongThuong"
                    stroke={COLORS[1]}
                  />
                  <Line
                    type="monotone"
                    name="Phạt"
                    dataKey="tongPhat" 
                    stroke={COLORS[2]}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Biểu đồ phân bổ */}
      <Card w="full">
        <CardHeader>
          <Text fontSize="lg" fontWeight="medium">
            Phân Bổ Lương Theo Phòng Ban
          </Text>
        </CardHeader>
        <CardBody>
          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPhongBan}
                  dataKey="thucLinh"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={(entry) => `${entry.label}: ${formatCurrency(entry.thucLinh)}`}
                >
                  {dataPhongBan.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default BieuDoLuong;