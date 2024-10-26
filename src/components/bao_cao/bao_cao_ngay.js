 
// src/components/bao_cao/bao_cao_ngay.js
import React, { useState, useCallback, useEffect } from 'react';
import {
  Container,
  Button,
  useDisclosure,
  useToast,
  VStack,
  Heading,
  Text,
  Card,
  useColorModeValue,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useAuth } from '../../hooks/useAuth';
import { baoCaoApi } from '../../services/api/bao_cao_api';
import { QUYEN } from './constants/loai_bao_cao';

import BoLocBaoCao from './components/bo_loc_bao_cao';
import DanhSachBaoCao from './components/danh_sach_bao_cao';
import FormBaoCao from './components/form_bao_cao';
import HienThiBaoCao from './components/hien_thi_bao_cao';

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

  const [danhSachBaoCao, setDanhSachBaoCao] = useState([]);
  const [dangTai, setDangTai] = useState(false);
  const [baoCaoHienTai, setBaoCaoHienTai] = useState(null);
  const [ghiChuTuChoi, setGhiChuTuChoi] = useState('');

  // State cho phân trang và sắp xếp
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

  // Xác định quyền của user
  const quyen = {
    taoBaoCao: true,
    suaBaoCao: user.role !== QUYEN.THANH_VIEN,
    xoaBaoCao: user.role === QUYEN.ADMIN_TONG,
    duyetBaoCao: user.role !== QUYEN.THANH_VIEN
  };

  // Load danh sách báo cáo
  const loadDanhSachBaoCao = useCallback(async () => {
    try {
      setDangTai(true);
      const response = await baoCaoApi.layDanhSach(boLoc, sapXep, {
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

  // Xử lý các hành động
  const handleSubmitBaoCao = async (data) => {
    try {
      setDangTai(true);
      if (baoCaoHienTai) {
        await baoCaoApi.capNhat(baoCaoHienTai.id, data);
      } else {
        await baoCaoApi.taoMoi(data);
      }

      toast({
        title: `${baoCaoHienTai ? 'Cập nhật' : 'Tạo'} báo cáo thành công`,
        status: 'success',
        duration: 3000,
      });

      onFormClose();
      setBaoCaoHienTai(null);
      loadDanhSachBaoCao();
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
  };

  const handleDuyetBaoCao = async (baoCao) => {
    try {
      await baoCaoApi.duyetBaoCao(baoCao.id, '', user.uid);
      toast({
        title: 'Duyệt báo cáo thành công',
        status: 'success',
        duration: 3000,
      });
      loadDanhSachBaoCao();
      onDetailClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

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
      await baoCaoApi.tuChoiBaoCao(baoCaoHienTai.id, ghiChuTuChoi, user.uid);
      toast({
        title: 'Từ chối báo cáo thành công',
        status: 'success',
        duration: 3000,
      });
      onRefuseClose();
      onDetailClose();
      loadDanhSachBaoCao();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleXoaBaoCao = async (baoCao) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) return;

    try {
      await baoCaoApi.xoa(baoCao.id);
      toast({
        title: 'Xóa báo cáo thành công',
        status: 'success',
        duration: 3000,
      });
      loadDanhSachBaoCao();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={5}>
      <VStack spacing={6} align="stretch">
        <Card p={6}>
          <HStack justify="space-between" mb={6}>
            <VStack align="start" spacing={1}>
              <Heading size="lg">Báo Cáo Ngày</Heading>
              <Text color="gray.600">
                Quản lý và theo dõi các báo cáo công việc
              </Text>
            </VStack>
            
            {quyen.taoBaoCao && (
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                onClick={() => {
                  setBaoCaoHienTai(null);
                  onFormOpen();
                }}
              >
                Tạo Báo Cáo
              </Button>
            )}
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

      {/* Modal Form Tạo/Sửa */}
      {isFormOpen && (
        <FormBaoCao
          initialData={baoCaoHienTai}
          isOpen={isFormOpen}
          onClose={() => {
            onFormClose();
            setBaoCaoHienTai(null);
          }}
          onSubmit={handleSubmitBaoCao}
          isSubmitting={dangTai}
        />
      )}

      {/* Modal Xem Chi Tiết */}
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
            <Button colorScheme="red" onClick={handleTuChoiBaoCao}>
              Xác nhận từ chối
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default BaoCaoNgay;