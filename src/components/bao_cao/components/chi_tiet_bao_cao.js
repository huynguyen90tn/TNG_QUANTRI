// src/components/bao_cao/components/chi_tiet_bao_cao.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Spinner,
  useToast,
  VStack
} from '@chakra-ui/react';
import { baoCaoApi } from '../../../services/api/bao_cao_api';
import HienThiBaoCao from './hien_thi_bao_cao';

const ChiTietBaoCao = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [baoCao, setBaoCao] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBaoCao = async () => {
      try {
        const data = await baoCaoApi.layChiTiet(reportId);
        setBaoCao(data);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: error.message,
          status: 'error',
          duration: 3000
        });
        navigate('/bao-cao-ngay');
      } finally {
        setLoading(false);
      }
    };

    loadBaoCao();
  }, [reportId, toast, navigate]);

  if (loading) {
    return (
      <Container centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (!baoCao) return null;

  return (
    <VStack spacing={6} align="stretch" w="full">
      <HienThiBaoCao 
        baoCao={baoCao}
        isOpen={true}
        onClose={() => navigate('/bao-cao-ngay')}
      />
    </VStack>
  );
};

export default ChiTietBaoCao;