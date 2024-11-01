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
  Tooltip,
  Grid,
  GridItem,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { 
  ExternalLinkIcon, 
  TimeIcon, 
  CheckIcon, 
  InfoIcon,
  CalendarIcon,
  LinkIcon,
  WarningIcon,
  CopyIcon
} from '@chakra-ui/icons';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { TRANG_THAI_BAO_CAO } from '../constants/trang_thai';
import { LOAI_BAO_CAO, PHAN_HE } from '../constants/loai_bao_cao';

const MotionBox = motion(Box);

const HienThiBaoCao = ({
  baoCao,
  isOpen,
  onClose,
  onDuyet,
  onTuChoi,
  onSua,
  quyen = {}
}) => {
  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const textColor = useColorModeValue('gray.100', 'gray.50');
  const borderColor = useColorModeValue('gray.700', 'gray.600');
  const accentColor = useColorModeValue('blue.400', 'blue.300');
  const inputBg = useColorModeValue('gray.600', 'gray.700');

  const handleCopyLink = () => {
    if (baoCao?.linkBaoCao) {
      navigator.clipboard.writeText(baoCao.linkBaoCao);
    }
  };

  const renderHTML = (htmlContent) => {
    return {
      __html: DOMPurify.sanitize(htmlContent)
    };
  };

  const trangThai = TRANG_THAI_BAO_CAO[baoCao?.trangThai];
  const loaiBaoCao = LOAI_BAO_CAO.find(l => l.id === baoCao?.loaiBaoCao);
  const phanHe = PHAN_HE.find(p => p.id === baoCao?.phanHe);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderLinkBaoCao = () => {
    if (!baoCao?.linkBaoCao) return null;
    
    return (
      <Card bg={cardBg} borderRadius="lg">
        <CardBody>
          <VStack spacing={3} align="stretch">
            <Text fontWeight="bold">
              <Icon as={LinkIcon} mr={2} color={accentColor} />
              Link báo cáo
            </Text>
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <LinkIcon color="gray.500" />
              </InputLeftElement>
              <Input
                value={baoCao.linkBaoCao}
                isReadOnly
                bg={inputBg}
                color={textColor}
                border="none"
                _focus={{ borderColor: accentColor }}
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  icon={<CopyIcon />}
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                  colorScheme="blue"
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            <Link 
              href={baoCao.linkBaoCao} 
              isExternal 
              color={accentColor}
              fontSize="sm"
              display="inline-flex"
              alignItems="center"
            >
              Mở link trong tab mới
              <ExternalLinkIcon mx={2} />
            </Link>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} color={textColor}>
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
          <VStack align="start" spacing={4}>
            <HStack justify="space-between" width="full">
              <Text fontSize="2xl" fontWeight="bold">
                {baoCao?.tieuDe}
              </Text>
              <Badge
                colorScheme={trangThai?.color}
                p={2}
                borderRadius="md"
                fontSize="md"
              >
                {trangThai?.icon} {trangThai?.label}
              </Badge>
            </HStack>
            <HStack spacing={4} wrap="wrap">
              <Badge colorScheme="blue" p={2}>
                {loaiBaoCao?.icon} {loaiBaoCao?.label}
              </Badge>
              <Badge colorScheme="purple" p={2}>
                {phanHe?.name}
              </Badge>
              <Text fontSize="sm" color="gray.400">
                ID: {baoCao?.reportId}
              </Text>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton color={textColor} />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Grid layout for user info */}
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              {/* Người tạo */}
              <GridItem>
                <Card bg={cardBg} borderRadius="lg">
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.400">Người tạo báo cáo</Text>
                      <HStack>
                        <Icon as={InfoIcon} color={accentColor} />
                        <Text fontWeight="bold">{baoCao?.nguoiTaoInfo?.ten}</Text>
                      </HStack>
                      <Text fontSize="sm">Mã số: {baoCao?.nguoiTaoInfo?.maSo}</Text>
                      <Text fontSize="sm">Email: {baoCao?.nguoiTaoInfo?.email}</Text>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Người nhận */}
              <GridItem>
                <Card bg={cardBg} borderRadius="lg">
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      <Text color="gray.400">Người nhận báo cáo</Text>
                      <HStack>
                        <Icon as={InfoIcon} color={accentColor} />
                        <Text fontWeight="bold">{baoCao?.nguoiNhanInfo?.ten}</Text>
                      </HStack>
                      <Text fontSize="sm">Mã số: {baoCao?.nguoiNhanInfo?.maSo}</Text>
                      <Text fontSize="sm">Email: {baoCao?.nguoiNhanInfo?.email}</Text>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            {/* Thời gian */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <HStack>
                <Icon as={CalendarIcon} color={accentColor} />
                <Text>Ngày tạo: {formatDateTime(baoCao?.ngayTao)}</Text>
              </HStack>
              {baoCao?.ngayCapNhat && (
                <HStack>
                  <Icon as={TimeIcon} color={accentColor} />
                  <Text>Cập nhật: {formatDateTime(baoCao?.ngayCapNhat)}</Text>
                </HStack>
              )}
            </SimpleGrid>

            {/* Link báo cáo */}
            {renderLinkBaoCao()}

            <Divider borderColor={borderColor} />

            {/* Nội dung báo cáo */}
            <Box
              className="report-content"
              bg={cardBg}
              p={6}
              borderRadius="lg"
              dangerouslySetInnerHTML={renderHTML(baoCao?.noiDung)}
              sx={{
                'img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 'md',
                  my: 4
                },
                'a': {
                  color: accentColor,
                  textDecoration: 'none',
                  _hover: { textDecoration: 'underline' }
                },
                'ul, ol': {
                  paddingLeft: '2rem',
                  my: 4
                },
                color: textColor
              }}
            />

            {/* Ghi chú */}
            {baoCao?.ghiChu && (
              <Card bg={cardBg} borderRadius="lg">
                <CardBody>
                  <Text fontWeight="bold" mb={2}>Ghi chú:</Text>
                  <Text color="gray.300">{baoCao.ghiChu}</Text>
                </CardBody>
              </Card>
            )}

            {/* File đính kèm */}
            {baoCao?.fileDinhKem?.length > 0 && (
              <Card bg={cardBg} borderRadius="lg">
                <CardBody>
                  <Text fontWeight="bold" mb={4}>File đính kèm:</Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {baoCao.fileDinhKem.map((file) => (
                      <Link 
                        key={file.id}
                        href={file.url}
                        isExternal
                        _hover={{ textDecoration: 'none' }}
                      >
                        <Button
                          variant="outline"
                          size="md"
                          width="full"
                          leftIcon={<LinkIcon />}
                          color={accentColor}
                          borderColor={accentColor}
                          _hover={{ bg: `${accentColor}20` }}
                        >
                          {file.ten}
                        </Button>
                      </Link>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>
            )}

            {/* Thông tin duyệt */}
            {baoCao?.nguoiDuyetInfo && (
              <Card bg={cardBg} borderRadius="lg">
                <CardBody>
                  <HStack spacing={4}>
                    <Icon
                      as={baoCao.trangThai === 'da_duyet' ? CheckIcon : WarningIcon}
                      color={baoCao.trangThai === 'da_duyet' ? 'green.400' : 'yellow.400'}
                      boxSize={5}
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">
                        Người duyệt: {baoCao.nguoiDuyetInfo.ten}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Email: {baoCao.nguoiDuyetInfo.email}
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
          <HStack spacing={3}>
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

            <Button 
              variant="ghost" 
              onClick={onClose}
              _hover={{ bg: `${accentColor}20` }}
            >
              Đóng
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HienThiBaoCao;