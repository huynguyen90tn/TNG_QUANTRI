// src/components/bao_cao/components/item_bao_cao.js
import React, { useMemo } from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Tooltip,
  Box,
  Link,
  useColorModeValue,
  Flex,
  Spacer,
  Avatar,
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  EditIcon, 
  DeleteIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
  EmailIcon,
} from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { TRANG_THAI_BAO_CAO } from '../constants/trang_thai';
import { LOAI_BAO_CAO, PHAN_HE } from '../constants/loai_bao_cao';

const MotionCard = motion(Card);

const ItemBaoCao = ({ 
  baoCao, 
  onXem, 
  onSua, 
  onXoa,
  onDuyet,
  onTuChoi,
  quyen = {}
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const userInfoBg = useColorModeValue('gray.50', 'gray.700');
  const timeBg = useColorModeValue('blue.50', 'blue.900');

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -4,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      transition: { duration: 0.2 }
    }
  };

  const { trangThai, loaiBaoCao, phanHe } = useMemo(() => ({
    trangThai: TRANG_THAI_BAO_CAO[baoCao.trangThai],
    loaiBaoCao: LOAI_BAO_CAO.find(l => l.id === baoCao.loaiBaoCao),
    phanHe: PHAN_HE.find(p => p.id === baoCao.phanHe)
  }), [baoCao.trangThai, baoCao.loaiBaoCao, baoCao.phanHe]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    const formatTime = date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (date.toDateString() === today.toDateString()) {
      return `Hôm nay, ${formatTime}`;
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Hôm qua, ${formatTime}`;
    }

    return `${date.toLocaleDateString('vi-VN')} ${formatTime}`;
  };

  const renderBadges = () => (
    <HStack spacing={2} wrap="wrap">
      <Badge colorScheme="blue" fontSize="sm">
        {loaiBaoCao?.icon} {loaiBaoCao?.label}
      </Badge>
      <Badge colorScheme={trangThai?.color} fontSize="sm">
        {trangThai?.icon} {trangThai?.label}
      </Badge>
      <Badge colorScheme="purple" fontSize="sm">
        {phanHe?.name}
      </Badge>
    </HStack>
  );

  const renderLinks = () => (
    <HStack spacing={2} color={textColor} fontSize="sm">
      {baoCao.duAnInfo && (
        <Link href={`/du-an/${baoCao.duAnInfo.id}`} isExternal>
          <HStack>
            <ExternalLinkIcon boxSize={3} />
            <Text>Dự án: {baoCao.duAnInfo.ten}</Text>
          </HStack>
        </Link>
      )}
      {baoCao.nhiemVuInfo && (
        <Link href={`/nhiem-vu/${baoCao.nhiemVuInfo.id}`} isExternal>
          <HStack>
            <ExternalLinkIcon boxSize={3} />
            <Text>Nhiệm vụ: {baoCao.nhiemVuInfo.ten}</Text>
          </HStack>
        </Link>
      )}
    </HStack>
  );

  const renderUserInfo = () => (
    <Flex
      bg={userInfoBg}
      p={2}
      borderRadius="md"
      align="center"
      gap={2}
      wrap="wrap"
    >
      <Avatar 
        size="sm" 
        name={baoCao.nguoiTaoInfo?.ten || 'User'} 
        src={baoCao.nguoiTaoInfo?.avatar} 
      />
      <VStack spacing={0} align="start">
        <Text fontWeight="medium" fontSize="sm">
          {baoCao.nguoiTaoInfo?.ten || 'Chưa xác định'}
        </Text>
        <HStack spacing={1} color={textColor} fontSize="xs">
          <EmailIcon />
          <Text>{baoCao.nguoiTaoInfo?.email || 'Không có email'}</Text>
        </HStack>
      </VStack>
      <Spacer />
      <Box 
        bg={timeBg} 
        px={3} 
        py={1} 
        borderRadius="full"
      >
        <Text fontSize="xs" fontWeight="medium">
          {formatDateTime(baoCao.ngayTao)}
        </Text>
      </Box>
    </Flex>
  );

  const renderActions = () => (
    <HStack spacing={2}>
      <Tooltip label="Xem chi tiết">
        <IconButton
          icon={<ViewIcon />}
          variant="ghost"
          colorScheme="blue"
          aria-label="Xem báo cáo"
          onClick={() => onXem(baoCao)}
          size="sm"
        />
      </Tooltip>

      {(quyen.suaBaoCao && baoCao.trangThai !== 'da_duyet') && (
        <Tooltip label="Chỉnh sửa">
          <IconButton
            icon={<EditIcon />}
            variant="ghost"
            colorScheme="green"
            aria-label="Sửa báo cáo"
            onClick={() => onSua(baoCao)}
            size="sm"
          />
        </Tooltip>
      )}

      {quyen.xoaBaoCao && (
        <Tooltip label="Xóa">
          <IconButton
            icon={<DeleteIcon />}
            variant="ghost"
            colorScheme="red"
            aria-label="Xóa báo cáo"
            onClick={() => onXoa(baoCao)}
            size="sm"
          />
        </Tooltip>
      )}

      {(quyen.duyetBaoCao && baoCao.trangThai === 'cho_duyet') && (
        <>
          <Tooltip label="Duyệt báo cáo">
            <IconButton
              icon={<CheckIcon />}
              variant="ghost"
              colorScheme="green"
              aria-label="Duyệt báo cáo"
              onClick={() => onDuyet(baoCao)}
              size="sm"
            />
          </Tooltip>
          <Tooltip label="Từ chối">
            <IconButton
              icon={<CloseIcon />}
              variant="ghost"
              colorScheme="red"
              aria-label="Từ chối báo cáo"
              onClick={() => onTuChoi(baoCao)}
              size="sm"
            />
          </Tooltip>
        </>
      )}
    </HStack>
  );

  return (
    <MotionCard
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      bg={bgColor}
      borderColor={borderColor}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      onClick={(e) => {
        // Chỉ mở xem chi tiết khi click vào vùng không phải button
        if (e.target.tagName !== 'BUTTON') {
          onXem(baoCao);
        }
      }}
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Thông tin người tạo và thời gian */}
          {renderUserInfo()}

          {/* Tiêu đề và badges */}
          <Flex align="center" gap={4} wrap="wrap">
            <VStack align="start" spacing={2} flex={1}>
              <Text fontSize="lg" fontWeight="bold">
                {baoCao.tieuDe}
              </Text>
              {renderBadges()}
            </VStack>
            <Spacer />
            {renderActions()}
          </Flex>

          {/* Links dự án và nhiệm vụ */}
          {(baoCao.duAnInfo || baoCao.nhiemVuInfo) && (
            <Box>{renderLinks()}</Box>
          )}

          {/* Ghi chú */}
          {baoCao.ghiChu && (
            <Text 
              color={textColor} 
              fontSize="sm" 
              noOfLines={2}
            >
              {baoCao.ghiChu}
            </Text>
          )}
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

export default ItemBaoCao;