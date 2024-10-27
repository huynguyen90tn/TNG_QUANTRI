// src/components/quan_ly_nhiem_vu_chi_tiet/quan_ly_nhiem_vu_chi_tiet.js (tiếp)
import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  useToast,
  VStack,
  HStack,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import BangTinhNang from './components/bang_tinh_nang';
import BangBackend from './components/bang_backend';
import BangKiemThu from './components/bang_kiem_thu';
import BangTongHop from './components/bang_tong_hop';
import { useQuanLyNhiemVu } from './hooks/useQuanLyNhiemVu';
import ThemMoiModal from './components/them_moi_modal';

const QuanLyNhiemVuChiTiet = ({ projectId }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const toast = useToast();
  const { error } = useQuanLyNhiemVu();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loaiNhiemVu, setLoaiNhiemVu] = useState('');

  // Handle error notifications
  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Lỗi',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleThemMoi = (loai) => {
    setLoaiNhiemVu(loai);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Box bg="white" p={5} borderRadius="lg" shadow="base">
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="lg">
              Quản Lý Nhiệm Vụ Chi Tiết
              {projectId && ` - Dự án: ${projectId}`}
            </Heading>
            
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => handleThemMoi(tabIndex === 0 ? 'tinhNang' : 
                                         tabIndex === 1 ? 'backend' : 
                                         tabIndex === 2 ? 'kiemThu' : null)}
              isDisabled={tabIndex === 3} // Disable for Summary tab
            >
              Thêm {tabIndex === 0 ? 'Tính Năng' : 
                    tabIndex === 1 ? 'Backend' :
                    tabIndex === 2 ? 'Kiểm Thử' : ''}
            </Button>
          </HStack>

          <Tabs index={tabIndex} onChange={setTabIndex} isLazy variant="enclosed">
            <TabList>
              <Tab>Tính Năng</Tab>
              <Tab>Backend</Tab>
              <Tab>Kiểm Thử</Tab>
              <Tab>Tổng Hợp</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <BangTinhNang projectId={projectId} />
              </TabPanel>
              <TabPanel>
                <BangBackend projectId={projectId} />
              </TabPanel>
              <TabPanel>
                <BangKiemThu projectId={projectId} />
              </TabPanel>
              <TabPanel>
                <BangTongHop projectId={projectId} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>

        {/* Modal for adding new items */}
        <ThemMoiModal 
          isOpen={isOpen}
          onClose={() => {
            onClose();
            setLoaiNhiemVu('');
          }}
          loaiNhiemVu={loaiNhiemVu}
          projectId={projectId}
        />
      </Box>
    </Container>
  );
};

export default QuanLyNhiemVuChiTiet;

// src/components/quan_ly_nhiem_vu_chi_tiet/components/them_moi_modal.js
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast
} from '@chakra-ui/react';
import { useQuanLyNhiemVu } from '../hooks/useQuanLyNhiemVu';
import { TRANG_THAI } from '../constants/trang_thai';

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  trangThai: TRANG_THAI.DANG_PHAT_TRIEN,
  nguoiPhuTrach: '',
  ghiChu: ''
};

const ThemMoiModal = ({ isOpen, onClose, loaiNhiemVu, projectId }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { 
    createTinhNang, 
    createBackend, 
    createKiemThu 
  } = useQuanLyNhiemVu();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const submitData = {
        ...formData,
        projectId,
        createdAt: new Date()
      };

      switch(loaiNhiemVu) {
        case 'tinhNang':
          await createTinhNang(submitData);
          break;
        case 'backend':
          await createBackend(submitData);
          break;
        case 'kiemThu':
          await createKiemThu(submitData);
          break;
        default:
          throw new Error('Loại nhiệm vụ không hợp lệ');
      }

      toast({
        title: 'Thành công',
        description: 'Đã thêm mới thành công',
        status: 'success',
        duration: 3000
      });

      handleClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_STATE);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Thêm {loaiNhiemVu === 'tinhNang' ? 'Tính Năng' :
                loaiNhiemVu === 'backend' ? 'Backend' :
                loaiNhiemVu === 'kiemThu' ? 'Kiểm Thử' : ''} Mới
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Tiêu đề</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                placeholder="Nhập tiêu đề"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Nhập mô tả"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Trạng thái</FormLabel>
              <Select
                value={formData.trangThai}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  trangThai: e.target.value
                }))}
              >
                {Object.values(TRANG_THAI).map(trangThai => (
                  <option key={trangThai} value={trangThai}>
                    {trangThai}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Người phụ trách</FormLabel>
              <Input
                value={formData.nguoiPhuTrach}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  nguoiPhuTrach: e.target.value
                }))}
                placeholder="Nhập tên người phụ trách"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Ghi chú</FormLabel>
              <Textarea
                value={formData.ghiChu}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ghiChu: e.target.value
                }))}
                placeholder="Nhập ghi chú"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Hủy
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Thêm mới
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ThemMoiModal;