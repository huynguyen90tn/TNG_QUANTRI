import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Alert, 
  AlertIcon,
  Spinner,
  Container
} from '@chakra-ui/react';
import BaoCaoNgay from '../bao_cao_ngay';
import { useDispatch } from 'react-redux';
import { setBoLoc } from '../store/bao_cao_slice';
import { getTask } from '../../../services/api/taskApi';

const BaoCaoTheoNhiemVu = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (!taskId) {
          setLoading(false);
          return;
        }

        // Lấy thông tin task
        const taskData = await getTask(taskId);
        const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Hoặc lấy từ context/redux

        if (!currentUser?.id) {
          navigate('/login');
          return;
        }

        // Kiểm tra quyền truy cập
        const hasAccess = taskData.assignees?.some(assignee => 
          assignee.id === currentUser.id
        ) || taskData.subTasks?.some(subTask => 
          subTask.assignees?.some(assignee => assignee.id === currentUser.id)
        );

        if (hasAccess) {
          setHasPermission(true);
          dispatch(setBoLoc({
            nhiemVuId: taskId
          }));
        } else {
          setHasPermission(false);
        }

      } catch (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [taskId, dispatch, navigate]);

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

  if (!hasPermission) {
    return (
      <Alert status="warning">
        <AlertIcon />
        Bạn không có quyền xem báo cáo của nhiệm vụ này. Chỉ những người được phân công nhiệm vụ mới có thể xem báo cáo.
      </Alert>
    );
  }

  return (
    <Box>
      <BaoCaoNgay />
    </Box>
  );
};

export default BaoCaoTheoNhiemVu;