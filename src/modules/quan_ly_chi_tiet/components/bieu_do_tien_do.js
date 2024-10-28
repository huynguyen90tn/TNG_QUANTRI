// src/modules/quan_ly_chi_tiet/components/bieu_do_tien_do.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Select,
  Card,
  CardBody,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTinhNang } from '../hooks/use_tinh_nang';

const BieuDoTienDo = ({ nhiemVuId }) => {
  const [timeRange, setTimeRange] = useState('7days');
  const { layTienDoTheoNgay } = useTinhNang();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let startDate = new Date();
      let endDate = new Date();

      switch (timeRange) {
        case '7days':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          break;
      }

      const result = await layTienDoTheoNgay(nhiemVuId, startDate, endDate);
      setData(result);
    };

    if (nhiemVuId) {
      fetchData();
    }
  }, [nhiemVuId, timeRange, layTienDoTheoNgay]);

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="medium">
          Biểu đồ tiến độ theo thời gian
        </Text>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          width="200px"
        >
          <option value="7days">7 ngày qua</option>
          <option value="30days">30 ngày qua</option>
          <option value="90days">90 ngày qua</option>
        </Select>
      </HStack>

      <Card>
        <CardBody>
          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ngay" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="frontend"
                  stroke="#3182CE"
                  name="Frontend"
                />
                <Line
                  type="monotone"
                  dataKey="backend"
                  stroke="#38A169"
                  name="Backend"
                />
                <Line
                  type="monotone"
                  dataKey="kiemThu"
                  stroke="#805AD5"
                  name="Kiểm thử"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default BieuDoTienDo;