// src/components/bao_cao/components/bo_loc_bao_cao.js
import React from 'react';
import {
  Card,
  CardBody,
  FormControl,
  Input,
  Select,
  VStack,
  SimpleGrid,
  Button,
  useColorModeValue,
  Collapse,
  useDisclosure,
  HStack,
  Icon,
  Text,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
} from '@chakra-ui/react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  CalendarIcon,
  WarningIcon,
  TimeIcon
} from '@chakra-ui/icons';
import { 
  FaFilter, 
  FaUserTimes, 
  FaCalendarAlt,
  FaBuilding,
  FaTasks,
  FaList
} from 'react-icons/fa';
import { LOAI_BAO_CAO, PHAN_HE } from '../constants/loai_bao_cao';
import { TRANG_THAI_BAO_CAO } from '../constants/trang_thai';
import DanhSachChuaBaoCao from './danh_sach_chua_bao_cao';

const BoLocBaoCao = ({ 
  boLoc, 
  onFilter,
  onResetFilter 
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const { 
    isOpen: isOpenModal, 
    onOpen: onOpenModal, 
    onClose: onCloseModal 
  } = useDisclosure();

  // Theme colors
  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const borderColor = useColorModeValue('gray.600', 'gray.700');
  const textColor = useColorModeValue('gray.100', 'gray.50');
  const iconColor = useColorModeValue('blue.300', 'blue.200');
  const warningColor = useColorModeValue('red.400', 'red.300');

  const [localFilter, setLocalFilter] = React.useState(boLoc);

  const handleChangeFilter = (field, value) => {
    setLocalFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilter = () => {
    onFilter(localFilter);
  };

  const handleResetFilter = () => {
    const resetFilter = {
      ngay: '',
      thang: '',
      nam: new Date().getFullYear(),
      phanHe: '',
      trangThai: '',
      loaiBaoCao: ''
    };
    setLocalFilter(resetFilter);
    onResetFilter(resetFilter);
  };

  return (
    <>
      <Card
        bg={cardBg}
        borderColor={borderColor}
        borderWidth="1px"
        borderRadius="xl"
        mb={4}
        overflow="hidden"
        transition="all 0.3s"
      >
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" wrap="wrap" spacing={4}>
              <HStack>
                <Icon as={FaFilter} color={iconColor} boxSize={5} />
                <Text color={textColor} fontSize="lg" fontWeight="bold">
                  Bộ lọc báo cáo
                </Text>
              </HStack>

              <Button
                leftIcon={<FaUserTimes />}
                colorScheme="red"
                variant="solid"
                onClick={onOpenModal}
                size="md"
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              >
                Danh sách chưa báo cáo
              </Button>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl>
                <HStack spacing={2} mb={2}>
                  <Icon as={FaCalendarAlt} color={iconColor} />
                  <Text color={textColor} fontSize="sm">Thời gian</Text>
                </HStack>
                <SimpleGrid columns={2} spacing={2}>
                  <Input
                    type="date"
                    value={localFilter.ngay}
                    onChange={(e) => handleChangeFilter('ngay', e.target.value)}
                    bg={bgColor}
                    color={textColor}
                    borderColor={borderColor}
                    _hover={{ borderColor: iconColor }}
                  />
                  <Select
                    value={localFilter.thang}
                    onChange={(e) => handleChangeFilter('thang', e.target.value)}
                    placeholder="Chọn tháng"
                    bg={bgColor}
                    color={textColor}
                    borderColor={borderColor}
                    _hover={{ borderColor: iconColor }}
                  >
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                    ))}
                  </Select>
                </SimpleGrid>
              </FormControl>

              <FormControl>
                <HStack spacing={2} mb={2}>
                  <Icon as={FaBuilding} color={iconColor} />
                  <Text color={textColor} fontSize="sm">Phân hệ</Text>
                </HStack>
                <Select
                  value={localFilter.phanHe}
                  onChange={(e) => handleChangeFilter('phanHe', e.target.value)}
                  placeholder="Chọn phân hệ"
                  bg={bgColor}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: iconColor }}
                >
                  {PHAN_HE.map((ph) => (
                    <option key={ph.id} value={ph.id}>
                      {ph.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <HStack spacing={2} mb={2}>
                  <Icon as={FaTasks} color={iconColor} />
                  <Text color={textColor} fontSize="sm">Trạng thái</Text>
                </HStack>
                <Select
                  value={localFilter.trangThai}
                  onChange={(e) => handleChangeFilter('trangThai', e.target.value)}
                  placeholder="Chọn trạng thái"
                  bg={bgColor}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: iconColor }}
                >
                  {Object.values(TRANG_THAI_BAO_CAO).map((trangThai) => (
                    <option key={trangThai.id} value={trangThai.id}>
                      {trangThai.icon} {trangThai.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl gridColumn={{ md: 'span 3' }}>
                <HStack spacing={2} mb={2}>
                  <Icon as={FaList} color={iconColor} />
                  <Text color={textColor} fontSize="sm">Loại báo cáo</Text>
                </HStack>
                <Select
                  value={localFilter.loaiBaoCao}
                  onChange={(e) => handleChangeFilter('loaiBaoCao', e.target.value)}
                  placeholder="Chọn loại báo cáo"
                  bg={bgColor}
                  color={textColor}
                  borderColor={borderColor}
                  _hover={{ borderColor: iconColor }}
                >
                  {LOAI_BAO_CAO.map((loai) => (
                    <option key={loai.id} value={loai.id}>
                      {loai.icon} {loai.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            <HStack justify="flex-end" spacing={4} pt={2}>
              <Button
                variant="outline"
                onClick={handleResetFilter}
                color={textColor}
                borderColor={borderColor}
                _hover={{ bg: `${iconColor}20` }}
              >
                Đặt lại
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleApplyFilter}
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              >
                Áp dụng
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpenModal}
        onClose={onCloseModal}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={bgColor} minH="80vh">
          <DanhSachChuaBaoCao onClose={onCloseModal} />
        </ModalContent>
      </Modal>
    </>
  );
};

export default BoLocBaoCao;