// File: src/components/bao_cao/bao_cao_ngay.js
// Link tham khảo: https://chakra-ui.com/docs/components
// Nhánh: main

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Container,
  Button,
  useDisclosure,
  useToast, 
  VStack,
  Text,
  Card,
  useColorModeValue,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  ButtonGroup,
  Tabs,
  TabList,
  Tab, 
  TabPanels,
  TabPanel,
  Icon,
  Box,
} from '@chakra-ui/react';
import { 
  AddIcon, 
  ViewIcon,
  CheckCircleIcon,
  WarningIcon 
} from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import { baoCaoApi } from '../../services/api/bao_cao_api';
import { ROLES } from '../../constants/roles';

import BoLocBaoCao from './components/bo_loc_bao_cao';
import DanhSachBaoCao from './components/danh_sach_bao_cao';
import FormBaoCao from './components/form_bao_cao';
import HienThiBaoCao from './components/hien_thi_bao_cao';
import DanhSachChuaBaoCao from './components/danh_sach_chua_bao_cao';
import DanhSachDaBaoCao from './components/danh_sach_da_bao_cao';

const BaoCaoNgay = () => {
  const { user } = useAuth();
  const toast = useToast();

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen, 
    onClose: onFormClose
  } = useDisclosure();

  const {
    isOpen: isDetailOpen,
    onOpen: onDetailOpen,
    onClose: onDetailClose
  } = useDisclosure();

  const {
    isOpen: isRefuseOpen,
    onOpen: onRefuseOpen,
    onClose: onRefuseClose
  } = useDisclosure();

  const {
    isOpen: isUnreportedOpen,
    onOpen: onUnreportedOpen,
    onClose: onUnreportedClose
  } = useDisclosure();

  // State declarations
  const [danhSachBaoCao, setDanhSachBaoCao] = useState([]);
  const [dangTai, setDangTai] = useState(false);
  const [baoCaoHienTai, setBaoCaoHienTai] = useState(null);
  const [ghiChuTuChoi, setGhiChuTuChoi] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);

  // Filtering, pagination and sorting states
  const [boLoc, setBoLoc] = useState({
    tuKhoa: '',
    loaiBaoCao: '',
    phanHe: '',
    trangThai: '',
  });

  const [phanTrang, setPhanTrang] = useState({
    trang: 1,
    soLuong: 10,
    tongSo: 0
  });

  const [sapXep, setSapXep] = useState({
    truong: 'ngayTao',
    huong: 'desc'
  });

  // User permissions
  const quyen = useMemo(() => ({
    taoBaoCao: true,
    suaBaoCao: user?.role !== ROLES.MEMBER,
    xoaBaoCao: user?.role === ROLES.ADMIN_TONG,
    duyetBaoCao: user?.role !== ROLES.MEMBER
  }), [user?.role]);

  // Load reports list
  const loadDanhSachBaoCao = useCallback(async () => {
    try {
      setDangTai(true);
      
      const response = await baoCaoApi.layDanhSach({
        ...boLoc,
        loaiBaoCao: 'bao-cao-ngay'
      }, sapXep, {
        trang: phanTrang.trang,
        soLuong: phanTrang.soLuong
      });

      setDanhSachBaoCao(response.data);
      setPhanTrang(prev => ({
        ...prev,
        tongSo: Math.ceil(response.total / prev.soLuong)
      }));

    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setDangTai(false);
    }
  }, [boLoc, sapXep, phanTrang.trang, phanTrang.soLuong, toast]);

  useEffect(() => {
    loadDanhSachBaoCao();
  }, [loadDanhSachBaoCao]);

  // Handle report submission
  const handleSubmitBaoCao = async (data) => {
    try {
      setDangXuLy(true);

      const baoCaoData = {
        ...data,
        loaiBaoCao: 'bao-cao-ngay',
        nguoiTaoInfo: {
          ...data.nguoiTaoInfo,
          userId: user.id,
          email: user.email,
          department: user.department,
          memberCode: user.memberCode
        }
      };

      if (baoCaoHienTai) {
        await baoCaoApi.capNhat(baoCaoHienTai.id, baoCaoData);
      } else {
        await baoCaoApi.taoMoi(baoCaoData);
      }

      toast({
        title: `${baoCaoHienTai ? 'Cập nhật' : 'Tạo'} báo cáo thành công`,
        status: 'success',
        duration: 3000,
      });

      onFormClose();
      setBaoCaoHienTai(null);
      await loadDanhSachBaoCao();

    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setDangXuLy(false);
    }
  };

  // Handle report approval
  const handleDuyetBaoCao = async (baoCao) => {
    try {
      setDangXuLy(true);
      await baoCaoApi.duyetBaoCao(baoCao.id, '', {
        id: user.id,
        email: user.email,
        fullName: user.displayName,
        memberCode: user.memberCode
      });
      
      toast({
        title: 'Duyệt báo cáo thành công',
        status: 'success',
        duration: 3000,
      });
      
      await loadDanhSachBaoCao();
      onDetailClose();
      
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setDangXuLy(false);
    }
  };

  // Handle report rejection
  const handleTuChoiBaoCao = async () => {
    if (!ghiChuTuChoi.trim()) {
      toast({
        title: 'Vui lòng nhập lý do từ chối',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setDangXuLy(true);
      await baoCaoApi.tuChoiBaoCao(
        baoCaoHienTai.id,
        ghiChuTuChoi,
        {
          id: user.id,
          email: user.email,
          fullName: user.displayName,
          memberCode: user.memberCode
        }
      );
      
      toast({
        title: 'Từ chối báo cáo thành công',
        status: 'success',
        duration: 3000,
      });
      
      onRefuseClose();
      onDetailClose();
      await loadDanhSachBaoCao();
      
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setDangXuLy(false);
    }
  };

  // Handle report deletion
  const handleXoaBaoCao = async (baoCao) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) return;

    try {
      setDangXuLy(true);
      await baoCaoApi.xoa(baoCao.id);
      
      toast({
        title: 'Xóa báo cáo thành công',
        status: 'success',
        duration: 3000,
      });
      
      await loadDanhSachBaoCao();
      
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={6} align="stretch">
        <Card p={6}>
          <HStack justify="space-between" mb={6}>
            <VStack align="start" spacing={1}>
              <Text fontSize="xl" fontWeight="bold">Báo Cáo Ngày</Text>
              <Text color="gray.600">
                Quản lý và theo dõi các báo cáo công việc
              </Text>
            </VStack>
            
            <ButtonGroup spacing={4}>
              {quyen.taoBaoCao && (
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={() => {
                    setBaoCaoHienTai(null);
                    onFormOpen();
                  }}
                  isDisabled={dangXuLy}
                >
                  Tạo Báo Cáo
                </Button>
              )}
              <Button
                leftIcon={<ViewIcon />}
                colorScheme="teal"
                onClick={onUnreportedOpen}
                isDisabled={dangXuLy}
              >
                Danh sách báo cáo
              </Button>
            </ButtonGroup>
          </HStack>

          <BoLocBaoCao
            boLoc={boLoc}
            onFilter={setBoLoc}
            onResetFilter={() => {
              setBoLoc({
                tuKhoa: '',
                loaiBaoCao: '',
                phanHe: '',
                trangThai: '',
              });
              setPhanTrang(prev => ({ ...prev, trang: 1 }));
            }}
          />

          <DanhSachBaoCao
            danhSachBaoCao={danhSachBaoCao}
            dangTai={dangTai}
            onXem={(baoCao) => {
              setBaoCaoHienTai(baoCao);
              onDetailOpen();
            }}
            onSua={(baoCao) => {
              setBaoCaoHienTai(baoCao);
              onFormOpen();
            }}
            onXoa={handleXoaBaoCao}
            onDuyet={handleDuyetBaoCao}
            onTuChoi={(baoCao) => {
              setBaoCaoHienTai(baoCao);
              setGhiChuTuChoi('');
              onRefuseOpen();
            }}
            quyen={quyen}
            trangHienTai={phanTrang.trang}
            tongSoTrang={phanTrang.tongSo}
            onChangeTrang={(trang) => setPhanTrang(prev => ({ ...prev, trang }))}
            soBanGhiMoiTrang={phanTrang.soLuong}
            onChangeSoBanGhi={(soLuong) => 
              setPhanTrang(prev => ({ ...prev, soLuong, trang: 1 }))
            }
            sapXep={sapXep}
            onChangeSapXep={setSapXep}
          />
        </Card>
      </VStack>

      {/* Modals */}
      {isFormOpen && (
        <FormBaoCao
          initialData={baoCaoHienTai}
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setBaoCaoHienTai(null);
          }}
          onSubmit={handleSubmitBaoCao}
          isSubmitting={dangXuLy}
          userId={user.id}
          userEmail={user.email}
          department={user.department}
          memberCode={user.memberCode}
        />
      )}

      {isDetailOpen && baoCaoHienTai && (
        <HienThiBaoCao
          baoCao={baoCaoHienTai}
          isOpen={isDetailOpen}
          onClose={() => {
            onDetailClose();
            setBaoCaoHienTai(null);
          }}
          onDuyet={handleDuyetBaoCao}
          onTuChoi={(baoCao) => {
            setGhiChuTuChoi('');
            onRefuseOpen();
          }}
          onSua={(baoCao) => {
            onDetailClose();
            onFormOpen();
          }}
          quyen={quyen}
        />
      )}

      {/* Modal Từ Chối */}
      <Modal isOpen={isRefuseOpen} onClose={onRefuseClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Từ Chối Báo Cáo</ModalHeader>
          <ModalBody>
            <Textarea
              value={ghiChuTuChoi}
              onChange={(e) => setGhiChuTuChoi(e.target.value)} 
              placeholder="Nhập lý do từ chối..."
              rows={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRefuseClose}>
              Hủy
            </Button>
            <Button
              colorScheme="red"
              onClick={handleTuChoiBaoCao}
              isLoading={dangXuLy}
            >
              Xác nhận từ chối
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

     {/* Modal Danh sách báo cáo */}     
     <Modal         
        isOpen={isUnreportedOpen}         
        onClose={onUnreportedClose}        
        size="6xl"        
        scrollBehavior="inside"      
      >         
        <ModalOverlay backdropFilter="blur(10px)" />         
        <ModalContent           
          bg={useColorModeValue('gray.50', 'gray.800')}           
          maxH="90vh"         
        >           
          <ModalHeader borderBottomWidth="1px" py={4}>             
            <Text fontSize="lg" fontWeight="bold">               
              Danh sách báo cáo ngày          
            </Text>           
          </ModalHeader>           
          <ModalCloseButton />                     
          
          <ModalBody p={0}>             
            <Tabs variant="enclosed" colorScheme="blue" isLazy>
              <TabList px={4} pt={4}>
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={WarningIcon} color="red.500" />
                    <Text>Chưa báo cáo</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}> 
                    <Icon as={CheckCircleIcon} color="green.500" />
                    <Text>Đã báo cáo</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Panel chưa báo cáo */}
                <TabPanel p={0}>
                  <DanhSachChuaBaoCao 
                    isOpen={isUnreportedOpen}
                    onClose={onUnreportedClose}
                  />
                </TabPanel>

                {/* Panel đã báo cáo */}
                <TabPanel p={0}>
                  <Box p={4}>
                    <DanhSachDaBaoCao 
                      ngayBaoCao={new Date()} 
                    />
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>           

          <ModalFooter borderTopWidth="1px">             
            <Button onClick={onUnreportedClose}>              
              Đóng             
            </Button>           
          </ModalFooter>         
        </ModalContent>       
      </Modal>     
    </Container>   
  ); 
};

export default BaoCaoNgay;