// File: src/components/su_kien_review/components/chi_tiet_su_kien.js
// Nhánh: main

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Link,
  VStack,
  HStack,
  Container,
  Badge,
  Image,
  Grid,
  GridItem,
  Button,
  useColorModeValue,
  Divider,
  AspectRatio,
  Tooltip,
  Icon,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import {
  Calendar,
  MapPin,
  Building2,
  Clock,
  Users,
  Phone,
  Mail,
  Link as LinkIcon,
  PlayCircle,
  ArrowLeft,
  Edit2,
  Trash2
} from 'lucide-react';
import { useSuKien } from '../hooks/use_su_kien';

const ChiTietSuKien = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { layChiTietSuKien, capNhatSuKien, xoaSuKien } = useSuKien();
  const [suKien, setSuKien] = useState(null);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.200', 'blue.700');
  const headerBgColor = useColorModeValue('blue.50', 'blue.900');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await layChiTietSuKien(id);
        setSuKien(data);
      } catch (error) {
        toast({
          title: "Lỗi khi tải thông tin sự kiện",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, layChiTietSuKien, toast]);

  const statusColor = useMemo(() => {
    switch (suKien?.trangThai) {
      case 'HOAN_THANH': return 'green';
      case 'DANG_DIEN_RA': return 'yellow';
      case 'CHUA_DIEN_RA': return 'blue';
      default: return 'gray';
    }
  }, [suKien?.trangThai]);

  const handleDelete = async () => {
    try {
      await xoaSuKien(id);
      toast({
        title: "Xóa sự kiện thành công",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      navigate(-1);
    } catch (error) {
      toast({
        title: "Lỗi khi xóa sự kiện",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const renderThumbnail = (url) => {
    if (url?.includes('youtube.com') || url?.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([^&\s]+)/)?.[1];
      if (videoId) {
        return (
          <AspectRatio ratio={16/9}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allowFullScreen
            />
          </AspectRatio>
        );
      }
    }
    return (
      <Image
        src={url}
        alt="Media"
        objectFit="cover"
        width="100%"
        fallback={<Box p={4} bg="gray.100" textAlign="center">Không thể tải ảnh</Box>}
      />
    );
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={8}>
        <Card>
          <CardBody>
            <Text>Đang tải thông tin sự kiện...</Text>
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (!suKien) {
    return (
      <Container maxW="container.lg" py={8}>
        <Card>
          <CardBody>
            <Text>Không tìm thấy sự kiện</Text>
            <Button
              leftIcon={<ArrowLeft />}
              mt={4}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Card
        bg={bgColor}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
      >
        <CardHeader
          bg={headerBgColor}
          borderBottomWidth="1px"
          borderColor={borderColor}
          py={6}
        >
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <Badge
                colorScheme={statusColor}
                px={3}
                py={1}
                borderRadius="full"
              >
                {suKien.trangThai}
              </Badge>
              <Heading
                size="lg"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                {suKien.tenSuKien}
              </Heading>
            </VStack>
            <HStack>
              <Button
                leftIcon={<ArrowLeft />}
                onClick={() => navigate(-1)}
                variant="outline"
              >
                Quay lại
              </Button>
              <Button
                leftIcon={<Edit2 />}
                colorScheme="blue"
                onClick={() => navigate(`/su-kien/${id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button
                leftIcon={<Trash2 />}
                colorScheme="red"
                onClick={onOpen}
              >
                Xóa
              </Button>
            </HStack>
          </HStack>
        </CardHeader>

        <CardBody p={8}>
          <VStack spacing={8} align="stretch">
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <HStack>
                  <Icon as={Building2} color="blue.500" />
                  <Text fontWeight="bold">Đơn vị tổ chức:</Text>
                  <Text>{suKien.donViToChuc}</Text>
                </HStack>
              </GridItem>

              <GridItem>
                <HStack>
                  <Icon as={MapPin} color="green.500" />
                  <Text fontWeight="bold">Địa điểm:</Text>
                  <Text>{suKien.diaDiem}</Text>
                </HStack>
              </GridItem>

              <GridItem>
                <HStack>
                  <Icon as={Calendar} color="purple.500" />
                  <Text fontWeight="bold">Bắt đầu:</Text>
                  <Text>{suKien.ngayToChuc} {suKien.gioToChuc}</Text>
                </HStack>
              </GridItem>

              <GridItem>
                <HStack>
                  <Icon as={Clock} color="orange.500" />
                  <Text fontWeight="bold">Kết thúc:</Text>
                  <Text>{suKien.ngayKetThuc} {suKien.gioKetThuc}</Text>
                </HStack>
              </GridItem>
            </Grid>

            <Divider />

            {suKien.thanhVienThamGia?.length > 0 && (
              <Box>
                <HStack mb={2}>
                  <Icon as={Users} color="teal.500" />
                  <Text fontWeight="bold">Thành viên tham gia:</Text>
                </HStack>
                <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                  {suKien.thanhVienThamGia.map((member, idx) => (
                    <Badge key={idx} colorScheme="teal" variant="subtle">
                      {member}
                    </Badge>
                  ))}
                </Grid>
              </Box>
            )}

            {suKien.nguoiLienHe?.length > 0 && (
              <Box>
                <HStack mb={2}>
                  <Icon as={Phone} color="red.500" />
                  <Text fontWeight="bold">Người liên hệ:</Text>
                </HStack>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {suKien.nguoiLienHe.map((contact, idx) => (
                    <Card key={idx} size="sm" variant="outline">
                      <CardBody>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{contact.hoTen}</Text>
                          <Text fontSize="sm">Chức vụ: {contact.chucVu}</Text>
                          <Text fontSize="sm">SĐT: {contact.soDienThoai}</Text>
                          {contact.ghiChu && (
                            <Text fontSize="sm">Ghi chú: {contact.ghiChu}</Text>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </Box>
            )}

            {suKien.media?.length > 0 && (
              <Box>
                <HStack mb={4}>
                  <Icon as={PlayCircle} color="blue.500" />
                  <Text fontWeight="bold">Media:</Text>
                </HStack>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  {suKien.media.map((item, idx) => (
                    <Box key={idx}>
                      {renderThumbnail(item.url)}
                      {item.caption && (
                        <Text fontSize="sm" mt={2}>{item.caption}</Text>
                      )}
                    </Box>
                  ))}
                </Grid>
              </Box>
            )}

            {suKien.links?.length > 0 && (
              <Box>
                <HStack mb={2}>
                  <Icon as={LinkIcon} color="blue.500" />
                  <Text fontWeight="bold">Links:</Text>
                </HStack>
                <VStack align="start">
                  {suKien.links.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.url}
                      isExternal
                      color="blue.500"
                    >
                      {link.ghiChu || link.url}
                    </Link>
                  ))}
                </VStack>
              </Box>
            )}

            {suKien.ghiChu && (
              <Box>
                <HStack mb={2}>
                  <Text fontWeight="bold">Ghi chú:</Text>
                </HStack>
                <Text>{suKien.ghiChu}</Text>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Modal xác nhận xóa */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Xác nhận xóa sự kiện</ModalHeader>
          <ModalBody>
            Bạn có chắc chắn muốn xóa sự kiện này không?
            Hành động này không thể hoàn tác.
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ChiTietSuKien;