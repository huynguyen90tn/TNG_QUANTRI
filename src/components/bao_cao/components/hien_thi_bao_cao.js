 
// src/components/bao_cao/components/hien_thi_bao_cao.js
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Link,
  Button,
  Divider,
  Box,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { ExternalLinkIcon, TimeIcon, CheckIcon, InfoIcon } from '@chakra-ui/icons';
import DOMPurify from 'dompurify';
import { TRANG_THAI_BAO_CAO } from '../constants/trang_thai';
import { LOAI_BAO_CAO, PHAN_HE } from '../constants/loai_bao_cao';

const HienThiBaoCao = ({
  baoCao,
  isOpen,
  onClose,
  onDuyet,
  onTuChoi,
  onSua,
  quyen = {}
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const renderHTML = (htmlContent) => {
    return {
      __html: DOMPurify.sanitize(htmlContent)
    };
  };

  const trangThai = TRANG_THAI_BAO_CAO[baoCao?.trangThai];
  const loaiBaoCao = LOAI_BAO_CAO.find(l => l.id === baoCao?.loaiBaoCao);
  const phanHe = PHAN_HE.find(p => p.id === baoCao?.phanHe);

  const renderMetadata = () => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      <VStack align="start" spacing={2}>
        <HStack>
          <Icon as={TimeIcon} color={textColor} />
          <Text color={textColor} fontSize="sm">
            Ngày tạo: {new Date(baoCao?.ngayTao).toLocaleDateString('vi-VN')}
          </Text>
        </HStack>
        {baoCao?.ngayCapNhat && (
          <HStack>
            <Icon as={TimeIcon} color={textColor} />
            <Text color={textColor} fontSize="sm">
              Cập nhật: {new Date(baoCao.ngayCapNhat).toLocaleDateString('vi-VN')}
            </Text>
          </HStack>
        )}
      </VStack>

      <VStack align="start" spacing={2}>
        <HStack>
          <Icon as={InfoIcon} color={textColor} />
          <Text color={textColor} fontSize="sm">
            Người tạo: {baoCao?.nguoiTaoInfo?.ten}
          </Text>
        </HStack>
        {baoCao?.nguoiDuyet && (
          <HStack>
            <Icon as={CheckIcon} color={textColor} />
            <Text color={textColor} fontSize="sm">
              Người duyệt: {baoCao.nguoiDuyet}
            </Text>
          </HStack>
        )}
      </VStack>
    </SimpleGrid>
  );

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
    <VStack align="start" spacing={2}>
      {baoCao?.duAnInfo && (
        <Link href={`/du-an/${baoCao.duAnInfo.id}`} isExternal>
          <HStack>
            <ExternalLinkIcon />
            <Text>Dự án: {baoCao.duAnInfo.ten}</Text>
          </HStack>
        </Link>
      )}
      {baoCao?.nhiemVuInfo && (
        <Link href={`/nhiem-vu/${baoCao.nhiemVuInfo.id}`} isExternal>
          <HStack>
            <ExternalLinkIcon />
            <Text>Nhiệm vụ: {baoCao.nhiemVuInfo.ten}</Text>
          </HStack>
        </Link>
      )}
    </VStack>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>
          <Text fontSize="2xl" fontWeight="bold">
            {baoCao?.tieuDe}
          </Text>
          {renderBadges()}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {renderMetadata()}
            
            <Divider borderColor={borderColor} />
            
            {renderLinks()}

            <Box
              className="report-content"
              bg={bgColor}
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              dangerouslySetInnerHTML={renderHTML(baoCao?.noiDung)}
              sx={{
                'img': {
                  maxWidth: '100%',
                  height: 'auto'
                },
                'a': {
                  color: 'blue.500',
                  textDecoration: 'underline'
                },
                'ul, ol': {
                  paddingLeft: '2rem'
                }
              }}
            />

            {baoCao?.ghiChu && (
              <Box>
                <Text fontWeight="bold" mb={2}>Ghi chú:</Text>
                <Text color={textColor}>{baoCao.ghiChu}</Text>
              </Box>
            )}

            {baoCao?.fileDinhKem?.length > 0 && (
              <Box>
                <Text fontWeight="bold" mb={2}>File đính kèm:</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                  {baoCao.fileDinhKem.map((file) => (
                    <Link 
                      key={file.id}
                      href={file.url}
                      isExternal
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        width="full"
                        leftIcon={<ExternalLinkIcon />}
                      >
                        {file.ten}
                      </Button>
                    </Link>
                  ))}
                </SimpleGrid>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <HStack spacing={2}>
            {quyen.suaBaoCao && baoCao?.trangThai !== 'da_duyet' && (
              <Tooltip label="Chỉnh sửa báo cáo">
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onClose();
                    onSua(baoCao);
                  }}
                >
                  Chỉnh sửa
                </Button>
              </Tooltip>
            )}

            {quyen.duyetBaoCao && baoCao?.trangThai === 'cho_duyet' && (
              <>
                <Tooltip label="Duyệt báo cáo">
                  <Button
                    colorScheme="green"
                    onClick={() => onDuyet(baoCao)}
                  >
                    Duyệt
                  </Button>
                </Tooltip>
                <Tooltip label="Từ chối báo cáo">
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={() => onTuChoi(baoCao)}
                  >
                    Từ chối
                  </Button>
                </Tooltip>
              </>
            )}

            <Button variant="ghost" onClick={onClose}>
              Đóng
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HienThiBaoCao;