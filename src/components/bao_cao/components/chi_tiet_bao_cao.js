import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Spinner,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { baoCaoApi } from '../../../services/api/bao_cao_api';
import { getUser } from '../../../services/api/userApi';
import HienThiBaoCao from './hien_thi_bao_cao';

const ChiTietBaoCao = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [baoCao, setBaoCao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBaoCao = async () => {
      if (!reportId) {
        navigate('/bao-cao-ngay');
        return;
      }

      try {
        const data = await baoCaoApi.layChiTiet(reportId);

        // Lấy thông tin người tạo và người duyệt song song
        const [nguoiTaoInfo, nguoiDuyetInfo] = await Promise.all([
          data.nguoiTao ? getUser(data.nguoiTao) : null,
          data.nguoiDuyet ? getUser(data.nguoiDuyet) : null
        ]);

        const enrichedData = {
          ...data,
          nguoiTaoInfo: nguoiTaoInfo ? {
            ten: nguoiTaoInfo.fullName,
            email: nguoiTaoInfo.email
          } : null,
          nguoiDuyetInfo: nguoiDuyetInfo ? {
            ten: nguoiDuyetInfo.fullName,
            email: nguoiDuyetInfo.email
          } : null
        };

        setBaoCao(enrichedData);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: error.message || 'Không thể tải báo cáo',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        navigate('/bao-cao-ngay');
      } finally {
        setLoading(false);
      }
    };

    loadBaoCao();
  }, [reportId, navigate, toast]);

  const handleClose = () => {
    navigate('/bao-cao-ngay');
  };

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Container>
    );
  }

  if (!baoCao) {
    return null;
  }

  return (
    <VStack spacing={6} align="stretch" w="full">
      <HienThiBaoCao
        baoCao={baoCao}
        isOpen={true}
        onClose={handleClose}
      />
    </VStack>
  );
};

export default ChiTietBaoCao;