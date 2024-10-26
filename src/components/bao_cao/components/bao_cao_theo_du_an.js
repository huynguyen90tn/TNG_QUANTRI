// src/components/bao_cao/components/bao_cao_theo_du_an.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import BaoCaoNgay from '../bao_cao_ngay';
import { useDispatch } from 'react-redux';
import { setBoLoc } from '../store/bao_cao_slice';

const BaoCaoTheoDuAn = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (projectId) {
      dispatch(setBoLoc({
        duAnId: projectId
      }));
    }
  }, [projectId, dispatch]);

  return (
    <Box>
      <BaoCaoNgay />
    </Box>
  );
};

export default BaoCaoTheoDuAn;