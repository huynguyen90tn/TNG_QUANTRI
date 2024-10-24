// File: src/components/attendance/AttendanceTable.js
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Input,
  Select,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaUserClock,
  FaBuilding,
  FaLaptop,
  FaRegClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";

const DEPARTMENTS = [
  "Thiên Minh Đường",
  "Tây Vân Các",
  "Họa Tam Đường",
  "Hồ Ly Sơn trang",
  "Hoa Vân Các",
  "Tinh Vân Các",
];

const CURRENT_YEAR = new Date().getFullYear();

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: `Tháng ${i + 1}`,
}));

const YEARS = Array.from({ length: 5 }, (_, i) => ({
  value: CURRENT_YEAR - 2 + i,
  label: `Năm ${CURRENT_YEAR - 2 + i}`,
}));

const STAT_ITEMS = [
  {
    label: "Tổng điểm danh",
    icon: FaUserClock,
    color: "blue.500",
    getValue: (stats) => stats.totalRecords,
  },
  {
    label: "Đúng giờ",
    icon: FaCheckCircle,
    color: "green.500",
    getValue: (stats) => stats.onTime,
  },
  {
    label: "Đi muộn",
    icon: FaExclamationTriangle,
    color: "red.500",
    getValue: (stats) => stats.late,
  },
  {
    label: "Tỷ lệ muộn",
    icon: FaRegClock,
    color: "purple.500",
    getValue: (stats) => `${stats.latePercentage}%`,
  },
];

const formatDate = (date) => {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getMonthRange = (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const StatItem = React.memo(({ icon: IconComponent, label, value, color }) => {
  const statBg = useColorModeValue("white", "gray.700");

  return (
    <Stat bg={statBg} p={4} borderRadius="lg" shadow="sm">
      <HStack spacing={3}>
        <Icon as={IconComponent} w={6} h={6} color={color} />
        <Box>
          <StatLabel>{label}</StatLabel>
          <StatNumber>{value}</StatNumber>
        </Box>
      </HStack>
    </Stat>
  );
});

const WorkLocationBadge = React.memo(({ location }) => {
  const onlineTextColor = useColorModeValue("blue.500", "blue.300");
  const onlineBgColor = useColorModeValue("blue.50", "blue.900");

  if (location === "online") {
    return (
      <HStack spacing={2} bg={onlineBgColor} p={2} borderRadius="md">
        <Icon as={FaLaptop} color={onlineTextColor} />
        <Text color={onlineTextColor} fontStyle="italic">
          Online
        </Text>
      </HStack>
    );
  }

  return (
    <HStack spacing={2}>
      <Icon as={FaBuilding} color="gray.500" />
      <Text>Tại tổng đàn</Text>
    </HStack>
  );
});

const StatusBadge = React.memo(({ isLate }) => (
  <Badge
    colorScheme={isLate ? "red" : "green"}
    variant="subtle"
    px={2}
    py={1}
    borderRadius="full"
  >
    <HStack spacing={1}>
      <Icon as={isLate ? FaExclamationTriangle : FaCheckCircle} />
      <Text>{isLate ? "Đi muộn" : "Đúng giờ"}</Text>
    </HStack>
  </Badge>
));

const TableContent = React.memo(({ isLoading, records }) => {
  if (isLoading) {
    return (
      <Tr>
        <Td colSpan={8}>
          <Center py={4}>
            <Spinner size="lg" color="blue.500" />
          </Center>
        </Td>
      </Tr>
    );
  }

  if (records.length === 0) {
    return (
      <Tr>
        <Td colSpan={8}>
          <Center py={4}>
            <Text color="gray.500">Không có dữ liệu</Text>
          </Center>
        </Td>
      </Tr>
    );
  }

  return records.map((record) => (
    <Tr key={record.id}>
      <Td fontWeight="bold">{record.memberCode}</Td>
      <Td>{record.fullName}</Td>
      <Td>{record.department}</Td>
      <Td>{formatDate(record.checkInTime)}</Td>
      <Td>
        <StatusBadge isLate={record.isLate} />
      </Td>
      <Td>
        <WorkLocationBadge location={record.workLocation} />
      </Td>
      <Td>{record.isLate ? record.lateReason : "-"}</Td>
      <Td>
        {record.isLate && record.hasReported && (
          <Text color="green.500" fontSize="sm">
            Đã báo cáo ({record.reportedTo?.fullName})
          </Text>
        )}
      </Td>
    </Tr>
  ));
});

function AttendanceTable({ userRole, userId, department }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: CURRENT_YEAR,
    department: "",
    search: "",
  });

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const tableBg = useColorModeValue("white", "gray.700");

  const stats = useMemo(() => {
    const total = records.length;
    const onTime = records.filter((r) => !r.isLate).length;
    const late = records.filter((r) => r.isLate).length;

    return {
      totalRecords: total,
      onTime,
      late,
      latePercentage: total > 0 ? ((late / total) * 100).toFixed(1) : 0,
    };
  }, [records]);

  const fetchRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      const { start, end } = getMonthRange(filters.month, filters.year);

      let baseQuery = query(
        collection(db, "attendance"),
        where("checkInTime", ">=", start),
        where("checkInTime", "<=", end),
        orderBy("checkInTime", "desc"),
      );

      if (userRole === "member" && userId) {
        baseQuery = query(baseQuery, where("userId", "==", userId));
      }

      if (userRole === "admin-con" && department) {
        baseQuery = query(baseQuery, where("department", "==", department));
      }

      if (filters.department) {
        baseQuery = query(
          baseQuery,
          where("department", "==", filters.department),
        );
      }

      const snapshot = await getDocs(baseQuery);
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        checkInTime: doc.data().checkInTime.toDate(),
      }));

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        data = data.filter(
          (record) =>
            record.memberCode?.toLowerCase().includes(searchLower) ||
            record.fullName?.toLowerCase().includes(searchLower),
        );
      }

      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, userRole, userId, department]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <VStack spacing={6} w="full" bg={bgColor} p={4} borderRadius="lg">
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
        {STAT_ITEMS.map((item, index) => (
          <StatItem
            key={index}
            icon={item.icon}
            label={item.label}
            value={item.getValue(stats)}
            color={item.color}
          />
        ))}
      </SimpleGrid>

      <HStack spacing={4} w="full">
        <InputGroup>
          <InputLeftElement>
            <Icon as={FaCalendarAlt} color="gray.500" />
          </InputLeftElement>
          <Select
            value={filters.month}
            onChange={(e) =>
              handleFilterChange("month", parseInt(e.target.value))
            }
            pl={10}
          >
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </Select>
        </InputGroup>

        <Select
          value={filters.year}
          onChange={(e) => handleFilterChange("year", parseInt(e.target.value))}
        >
          {YEARS.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </Select>

        {userRole === "admin-tong" && (
          <InputGroup>
            <InputLeftElement>
              <Icon as={FaUsers} color="gray.500" />
            </InputLeftElement>
            <Select
              placeholder="Tất cả bộ phận"
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              pl={10}
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>
          </InputGroup>
        )}

        <InputGroup flex={1}>
          <InputLeftElement>
            <Icon as={FaSearch} color="gray.500" />
          </InputLeftElement>
          <Input
            placeholder="Tìm kiếm theo mã số hoặc tên..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </InputGroup>
      </HStack>

      <Box w="full" overflowX="auto">
        <Table
          variant="simple"
          bg={tableBg}
          borderRadius="lg"
          overflow="hidden"
        >
          <Thead>
            <Tr>
              <Th>Mã số</Th>
              <Th>Họ và tên</Th>
              <Th>Bộ phận</Th>
              <Th>Thời gian</Th>
              <Th>Trạng thái</Th>
              <Th>Địa điểm</Th>
              <Th>Lý do</Th>
              <Th>Báo cáo</Th>
            </Tr>
          </Thead>
          <Tbody>
            <TableContent isLoading={isLoading} records={records} />
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
}

export default AttendanceTable;
