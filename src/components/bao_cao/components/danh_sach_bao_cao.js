// src/components/bao_cao/components/danh_sach_bao_cao.js
import React from 'react';
import {
  VStack,
  Text,
  Spinner,
  Center,
  Button,
  HStack,
  Select,
  Box,
  useColorModeValue,
  Card,
  CardBody,
  Icon,
  Flex,
  Tooltip,
  Badge,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  TimeIcon,
  ArrowUpDownIcon,
  CheckIcon,
  StarIcon
} from '@chakra-ui/icons';
import { 
  FaSort, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaCalendarCheck,
  FaClock,
  FaListUl,
  FaChartBar
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ItemBaoCao from './item_bao_cao';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const DanhSachBaoCao = ({
  danhSachBaoCao = [],
  dangTai = false,
  onXem,
  onSua,
  onXoa,
  onDuyet,
  onTuChoi,
  quyen = {},
  trangHienTai = 1,
  tongSoTrang = 1,
  onChangeTrang,
  soBanGhiMoiTrang = 10,
  onChangeSoBanGhi,
  sapXep = {
    truong: 'ngayTao',
    huong: 'desc'
  },
  onChangeSapXep
}) => {
  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const borderColor = useColorModeValue('gray.600', 'gray.700');
  const textColor = useColorModeValue('gray.100', 'gray.50');
  const accentColor = useColorModeValue('blue.400', 'blue.300');
  const subtleColor = useColorModeValue('gray.400', 'gray.500');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  if (dangTai) {
    return (
      <Center py={12}>
        <VStack spacing={4}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.600"
            color={accentColor}
            size="xl"
          />
          <Text color={textColor} fontSize="lg">
            Đang tải dữ liệu...
          </Text>
        </VStack>
      </Center>
    );
  }

  const renderSortOptions = () => (
    <MotionCard
      variants={itemVariants}
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="xl"
      mb={6}
      overflow="hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <CardBody>
        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={4}
        >
          <GridItem>
            <HStack spacing={3}>
              <Icon 
                as={sapXep.huong === 'asc' ? FaSortAmountUp : FaSortAmountDown} 
                color={accentColor}
                boxSize={5}
              />
              <Select
                size="md"
                value={sapXep.truong}
                onChange={(e) => onChangeSapXep({ ...sapXep, truong: e.target.value })}
                bg={bgColor}
                color={textColor}
                borderColor={borderColor}
                _hover={{ borderColor: accentColor }}
                icon={<FaSort color={subtleColor} />}
              >
                <option value="ngayTao">Ngày tạo</option>
                <option value="ngayCapNhat">Ngày cập nhật</option>
                <option value="trangThai">Trạng thái</option>
              </Select>
            </HStack>
          </GridItem>

          <GridItem>
            <HStack spacing={3}>
              <Icon as={ArrowUpDownIcon} color={accentColor} boxSize={5} />
              <Select
                size="md"
                value={sapXep.huong}
                onChange={(e) => onChangeSapXep({ ...sapXep, huong: e.target.value })}
                bg={bgColor}
                color={textColor}
                borderColor={borderColor}
                _hover={{ borderColor: accentColor }}
              >
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </Select>
            </HStack>
          </GridItem>
        </Grid>
      </CardBody>
    </MotionCard>
  );

  const renderPagination = () => (
    <MotionCard
      variants={itemVariants}
      bg={cardBg}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="xl"
      mt={6}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <CardBody>
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="center"
          align="center"
          gap={4}
        >
          <HStack spacing={4}>
            <Tooltip label="Trang trước">
              <Button
                leftIcon={<ChevronLeftIcon />}
                onClick={() => onChangeTrang(trangHienTai - 1)}
                isDisabled={trangHienTai === 1}
                size="md"
                variant="ghost"
                color={textColor}
                _hover={{ bg: `${accentColor}20` }}
              >
                Trước
              </Button>
            </Tooltip>

            <Badge
              px={4}
              py={2}
              borderRadius="lg"
              bg={bgColor}
              color={textColor}
              fontSize="md"
              display="flex"
              alignItems="center"
            >
              <Icon as={FaChartBar} color={accentColor} mr={2} />
              {trangHienTai} / {tongSoTrang}
            </Badge>

            <Tooltip label="Trang sau">
              <Button
                rightIcon={<ChevronRightIcon />}
                onClick={() => onChangeTrang(trangHienTai + 1)}
                isDisabled={trangHienTai === tongSoTrang}
                size="md"
                variant="ghost"
                color={textColor}
                _hover={{ bg: `${accentColor}20` }}
              >
                Sau
              </Button>
            </Tooltip>
          </HStack>

          <Box>
            <Select
              width="auto"
              size="md"
              value={soBanGhiMoiTrang}
              onChange={(e) => onChangeSoBanGhi(Number(e.target.value))}
              bg={bgColor}
              color={textColor}
              borderColor={borderColor}
              _hover={{ borderColor: accentColor }}
              icon={<FaListUl color={accentColor} />}
            >
              <option value={5}>5 / trang</option>
              <option value={10}>10 / trang</option>
              <option value={20}>20 / trang</option>
              <option value={50}>50 / trang</option>
            </Select>
          </Box>
        </Flex>
      </CardBody>
    </MotionCard>
  );

  if (danhSachBaoCao.length === 0) {
    return (
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="xl"
      >
        <CardBody>
          <Center py={12} flexDirection="column" gap={4}>
            <Icon as={StarIcon} color={accentColor} boxSize={10} />
            <Text color={textColor} fontSize="lg" fontWeight="medium">
              Không có báo cáo nào
            </Text>
          </Center>
        </CardBody>
      </MotionCard>
    );
  }

  return (
    <AnimatePresence>
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout
      >
        {renderSortOptions()}
        
        <VStack spacing={4} align="stretch">
          {danhSachBaoCao.map((baoCao, index) => (
            <MotionBox
              key={baoCao.id}
              variants={itemVariants}
              custom={index}
              layoutId={baoCao.id}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <ItemBaoCao
                baoCao={baoCao}
                onXem={onXem}
                onSua={onSua}
                onXoa={onXoa}
                onDuyet={onDuyet}
                onTuChoi={onTuChoi}
                quyen={quyen}
              />
            </MotionBox>
          ))}
        </VStack>

        {renderPagination()}
      </MotionBox>
    </AnimatePresence>
  );
};

export default DanhSachBaoCao;