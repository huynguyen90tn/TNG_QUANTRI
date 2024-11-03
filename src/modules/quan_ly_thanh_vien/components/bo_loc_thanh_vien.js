import React from 'react';
import {
  Box,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  HStack,
  Button,
  VStack,
  useDisclosure,
  Collapse,
  useColorModeValue,
  Card,
  CardBody,
  IconButton,
  Tooltip,
  Text,
  Badge,
  Flex,
  Divider,
  SimpleGrid,
  Tag,
  TagLeftIcon,
  TagLabel,
} from '@chakra-ui/react';
import {
  SearchIcon,
  RepeatIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import {
  FaFilter,
  FaBuilding,
  FaUserTie,
  FaRegClock,
  FaUserGraduate,
  FaSyncAlt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TRANG_THAI_THANH_VIEN,
  TRANG_THAI_LABEL,
  PHONG_BAN,
  PHONG_BAN_LABEL,
  CAP_BAC,
  CAP_BAC_LABEL,
  CHUC_VU,
  CHUC_VU_LABEL
} from '../constants/trang_thai_thanh_vien';
import { useThanhVien } from '../hooks/use_thanh_vien';

const MotionBox = motion(Box);

const FilterTag = ({ label, onRemove, colorScheme = "blue" }) => (
  <Tag 
    size="md" 
    borderRadius="full" 
    variant="solid" 
    colorScheme={colorScheme}
    boxShadow="sm"
  >
    <TagLabel>{label}</TagLabel>
    <IconButton
      size="xs"
      ml={1}
      icon={<CloseIcon />}
      variant="ghost"
      colorScheme={colorScheme}
      onClick={onRemove}
      aria-label="Xóa lọc"
      _hover={{ bg: 'whiteAlpha.300' }}
    />
  </Tag>
);

const BoLocThanhVien = () => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { boLoc, locDanhSach, datLaiDanhSach } = useThanhVien();
  const [boLocTamThoi, setBoLocTamThoi] = React.useState(boLoc);
  const [activeFilters, setActiveFilters] = React.useState([]);

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const handleLocThayDoi = (ten, giaTri) => {
    setBoLocTamThoi(prev => ({
      ...prev,
      [ten]: giaTri
    }));

    if (giaTri) {
      const filterLabel = getFilterLabel(ten, giaTri);
      if (filterLabel) {
        setActiveFilters(prev => [...prev.filter(f => f.key !== ten), { key: ten, label: filterLabel }]);
      }
    } else {
      setActiveFilters(prev => prev.filter(f => f.key !== ten));
    }
  };

  const getFilterLabel = (key, value) => {
    switch(key) {
      case 'phongBan':
        return PHONG_BAN_LABEL[value];
      case 'trangThai':
        return TRANG_THAI_LABEL[value];
      case 'capBac':
        return CAP_BAC_LABEL[value];
      case 'chucVu':
        return CHUC_VU_LABEL[value];
      case 'tuKhoa':
        return `Tìm kiếm: ${value}`;
      default:
        return '';
    }
  };

  const handleApDungLoc = () => {
    locDanhSach(boLocTamThoi);
  };

  const handleDatLai = () => {
    setBoLocTamThoi({
      tuKhoa: '',
      phongBan: '',
      chucVu: '',
      trangThai: '',
      capBac: ''
    });
    setActiveFilters([]);
    datLaiDanhSach();
  };

  const removeFilter = (key) => {
    setBoLocTamThoi(prev => ({
      ...prev,
      [key]: ''
    }));
    setActiveFilters(prev => prev.filter(f => f.key !== key));
  };

  return (
    <Card
      bg={cardBg}
      boxShadow="sm"
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      mb={6}
    >
      <CardBody p={0}>
        <Flex 
          p={4}
          justify="space-between" 
          align="center"
          borderBottomWidth={isOpen ? "1px" : "0"}
          borderColor={borderColor}
        >
          <HStack spacing={4}>
            <Box as={FaFilter} color="blue.500" />
            <Text fontWeight="medium" color={textColor}>Bộ lọc tìm kiếm</Text>
            {activeFilters.length > 0 && (
              <Badge colorScheme="blue" borderRadius="full">
                {activeFilters.length}
              </Badge>
            )}
          </HStack>
          
          <HStack spacing={2}>
            <Tooltip label="Làm mới bộ lọc">
              <IconButton
                icon={<FaSyncAlt />}
                variant="ghost"
                onClick={handleDatLai}
                aria-label="Đặt lại"
                size="sm"
              />
            </Tooltip>
            <Tooltip label={isOpen ? "Thu gọn" : "Mở rộng"}>
              <IconButton
                icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                variant="ghost"
                onClick={onToggle}
                aria-label="Toggle filters"
                size="sm"
              />
            </Tooltip>
          </HStack>
        </Flex>

        <AnimatePresence>
          {activeFilters.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              px={4}
              py={2}
              borderBottomWidth={isOpen ? "1px" : "0"}
              borderColor={borderColor}
            >
              <Flex wrap="wrap" gap={2}>
                {activeFilters.map(filter => (
                  <FilterTag
                    key={filter.key}
                    label={filter.label}
                    onRemove={() => removeFilter(filter.key)}
                    colorScheme={
                      filter.key === 'trangThai' ? 'green' :
                      filter.key === 'phongBan' ? 'purple' :
                      filter.key === 'capBac' ? 'orange' :
                      filter.key === 'chucVu' ? 'cyan' : 'blue'
                    }
                  />
                ))}
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>

        <Collapse in={isOpen}>
          <Box p={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email"
                  value={boLocTamThoi.tuKhoa}
                  onChange={(e) => handleLocThayDoi('tuKhoa', e.target.value)}
                  bg={inputBg}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaBuilding} color="gray.400" />
                </InputLeftElement>
                <Select
                  pl={10}
                  placeholder="Phòng ban"
                  value={boLocTamThoi.phongBan}
                  onChange={(e) => handleLocThayDoi('phongBan', e.target.value)}
                  bg={inputBg}
                >
                  {Object.entries(PHONG_BAN).map(([key, value]) => (
                    <option key={key} value={value}>
                      {PHONG_BAN_LABEL[value]}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaRegClock} color="gray.400" />
                </InputLeftElement>
                <Select
                  pl={10}
                  placeholder="Trạng thái"
                  value={boLocTamThoi.trangThai}
                  onChange={(e) => handleLocThayDoi('trangThai', e.target.value)}
                  bg={inputBg}
                >
                  {Object.entries(TRANG_THAI_THANH_VIEN).map(([key, value]) => (
                    <option key={key} value={value}>
                      {TRANG_THAI_LABEL[value]}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaUserGraduate} color="gray.400" />
                </InputLeftElement>
                <Select
                  pl={10}
                  placeholder="Cấp bậc"
                  value={boLocTamThoi.capBac}
                  onChange={(e) => handleLocThayDoi('capBac', e.target.value)}
                  bg={inputBg}
                >
                  {Object.entries(CAP_BAC).map(([key, value]) => (
                    <option key={key} value={value}>
                      {CAP_BAC_LABEL[value]}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Box as={FaUserTie} color="gray.400" />
                </InputLeftElement>
                <Select
                  pl={10}
                  placeholder="Chức vụ"
                  value={boLocTamThoi.chucVu}
                  onChange={(e) => handleLocThayDoi('chucVu', e.target.value)}
                  bg={inputBg}
                >
                  {Object.entries(CHUC_VU).map(([key, value]) => (
                    <option key={key} value={value}>
                      {CHUC_VU_LABEL[value]}
                    </option>
                  ))}
                </Select>
              </InputGroup>

              <Button
                colorScheme="blue"
                leftIcon={<FaFilter />}
                onClick={handleApDungLoc}
                w="full"
                h="40px"
              >
                Áp dụng bộ lọc
              </Button>
            </SimpleGrid>
          </Box>
        </Collapse>
      </CardBody>
    </Card>
  );
};

export default BoLocThanhVien;