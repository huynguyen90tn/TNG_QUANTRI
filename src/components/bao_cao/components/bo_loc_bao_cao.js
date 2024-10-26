 
// src/components/bao_cao/components/bo_loc_bao_cao.js
import React from 'react';
import {
  Card,
  CardBody,
  FormControl,
  Input,
  Select,
  useMediaQuery,
  VStack,
  SimpleGrid,
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
  Collapse,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { LOAI_BAO_CAO, PHAN_HE } from '../constants/loai_bao_cao';
import { TRANG_THAI_BAO_CAO } from '../constants/trang_thai';

const BoLocBaoCao = ({ 
  boLoc, 
  onFilter,
  onResetFilter 
}) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: !isMobile });
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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
      tuKhoa: '',
      loaiBaoCao: '',
      phanHe: '',
      trangThai: '',
      tuNgay: '',
      denNgay: '',
    };
    setLocalFilter(resetFilter);
    onResetFilter(resetFilter);
  };

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      mb={4}
      shadow="sm"
      transition="all 0.3s"
      _hover={{ shadow: 'md' }}
    >
      <CardBody>
        <VStack spacing={4} align="stretch">
          {/* Thanh tìm kiếm luôn hiển thị */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <Input
                placeholder="Tìm kiếm báo cáo..."
                value={localFilter.tuKhoa}
                onChange={(e) => handleChangeFilter('tuKhoa', e.target.value)}
                leftElement={
                  <SearchIcon color="gray.500" ml={2} />
                }
              />
            </FormControl>
            <SimpleGrid columns={2} spacing={2}>
              <Button
                colorScheme="blue"
                onClick={handleApplyFilter}
                leftIcon={<SearchIcon />}
                isFullWidth={isMobile}
              >
                Tìm kiếm
              </Button>
              <Button
                variant="outline"
                onClick={handleResetFilter}
                leftIcon={<CloseIcon />}
                isFullWidth={isMobile}
              >
                Đặt lại
              </Button>
            </SimpleGrid>
          </SimpleGrid>

          {/* Nút mở rộng/thu gọn bộ lọc */}
          <Button
            onClick={onToggle}
            variant="ghost"
            width="full"
            rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          >
            {isOpen ? 'Thu gọn bộ lọc' : 'Mở rộng bộ lọc'}
          </Button>

          {/* Bộ lọc mở rộng */}
          <Collapse in={isOpen}>
            <SimpleGrid 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={4}
              pt={4}
            >
              <FormControl>
                <Select
                  value={localFilter.loaiBaoCao}
                  onChange={(e) => handleChangeFilter('loaiBaoCao', e.target.value)}
                  placeholder="Chọn loại báo cáo"
                >
                  {LOAI_BAO_CAO.map((loai) => (
                    <option key={loai.id} value={loai.id}>
                      {loai.icon} {loai.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <Select
                  value={localFilter.phanHe}
                  onChange={(e) => handleChangeFilter('phanHe', e.target.value)}
                  placeholder="Chọn phân hệ"
                >
                  {PHAN_HE.map((ph) => (
                    <option key={ph.id} value={ph.id}>
                      {ph.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <Select
                  value={localFilter.trangThai}
                  onChange={(e) => handleChangeFilter('trangThai', e.target.value)}
                  placeholder="Chọn trạng thái"
                >
                  {Object.values(TRANG_THAI_BAO_CAO).map((trangThai) => (
                    <option key={trangThai.id} value={trangThai.id}>
                      {trangThai.icon} {trangThai.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <Input
                  type="date"
                  value={localFilter.tuNgay}
                  onChange={(e) => handleChangeFilter('tuNgay', e.target.value)}
                  placeholder="Từ ngày"
                />
              </FormControl>

              <FormControl>
                <Input
                  type="date"
                  value={localFilter.denNgay}
                  onChange={(e) => handleChangeFilter('denNgay', e.target.value)}
                  placeholder="Đến ngày"
                />
              </FormControl>
            </SimpleGrid>
          </Collapse>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default BoLocBaoCao;