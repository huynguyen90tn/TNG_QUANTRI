// src/components/bao_cao/components/bao_cao_theo_nhiem_vu.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import BaoCaoNgay from '../bao_cao_ngay';
import { useDispatch } from 'react-redux';
import { setBoLoc } from '../store/bao_cao_slice';

const BaoCaoTheoNhiemVu = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (taskId) {
      dispatch(setBoLoc({
        nhiemVuId: taskId
      }));
    }
  }, [taskId, dispatch]);

  return (
    <Box>
      <BaoCaoNgay />
    </Box>
  );
};

export default BaoCaoTheoNhiemVu;