// File: src/components/su_kien_review/components/item_su_kien.js
// Nhánh: main

import React, { memo, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  Image,
  useColorModeValue,
  chakra,
  Icon,
  AspectRatio,
  Grid,
  GridItem,
  HStack,
  VStack,
  Link,
  Tooltip,
  Heading
} from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { 
  Calendar,
  MapPin,
  Building2,
  Link as LinkIcon,
  PlayCircle,
  Clock,
  Users,
  Phone,
  Bookmark
} from 'lucide-react';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

const ThumbnailWrapper = memo(({ children }) => (
  <Box
    position="relative"
    width="250px"
    height="140px"
    flexShrink={0}
    borderRadius="xl"
    overflow="hidden"
    boxShadow="lg"
  >
    {children}
  </Box>
));

ThumbnailWrapper.displayName = 'ThumbnailWrapper';

const ItemSuKien = memo(({ suKien }) => {
  const borderColor = useColorModeValue('blue.200', 'blue.700');
  const bgColor = useColorModeValue('white', 'gray.800');
  const glowColor = useColorModeValue('blue.400', 'blue.500');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  
  const getThumbnail = useMemo(() => (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu.be\/)([^&\s]+)/)?.[1];
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return url;
  }, []);

  const formatDateTime = useMemo(() => (date, time) => {
    try {
      const dateObj = new Date(`${date}T${time}`);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(dateObj);
    } catch {
      return 'Invalid Date';
    }
  }, []);

  // Memoize status badge color
  const statusColorScheme = useMemo(() => {
    switch (suKien.trangThai) {
      case 'HOAN_THANH': return 'green';
      case 'DANG_DIEN_RA': return 'yellow';
      default: return 'blue';
    }
  }, [suKien.trangThai]);

  return (
    <ChakraBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Flex
        bg={bgColor}
        borderRadius="xl"
        borderWidth="2px"
        borderColor={borderColor}
        p={6}
        gap={6}
        position="relative"
        overflow="hidden"
        boxShadow="lg"
        _hover={{
          borderColor: glowColor,
          boxShadow: 'xl',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <ThumbnailWrapper>
          {suKien.links?.[0]?.url ? (
            <>
              <Image
                src={getThumbnail(suKien.links[0].url)}
                alt={suKien.links[0].ghiChu || suKien.tenSuKien}
                objectFit="cover"
                width="100%"
                height="100%"
              />
              {suKien.links[0].url.includes('youtube') && (
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  bgColor="rgba(0,0,0,0.7)"
                  borderRadius="full"
                  p={2}
                >
                  <PlayCircle size={30} color="white" />
                </Box>
              )}
            </>
          ) : (
            <Flex
              width="100%"
              height="100%"
              bgGradient="linear(to-r, blue.400, purple.500)"
              align="center"
              justify="center"
            >
              <Text color="white" fontWeight="bold" fontSize="lg">
                {suKien.tenSuKien?.slice(0, 2).toUpperCase() || 'SK'}
              </Text>
            </Flex>
          )}
        </ThumbnailWrapper>

        <VStack align="stretch" flex={1} spacing={4}>
          <Box>
            <HStack spacing={3}>
              <Badge 
                colorScheme={statusColorScheme}
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {suKien.trangThai}
              </Badge>
              <Heading
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                {suKien.tenSuKien}
              </Heading>
            </HStack>
          </Box>

          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <HStack spacing={2}>
                <Icon as={Building2} color="blue.500" />
                <Text fontSize="sm">{suKien.donViToChuc}</Text>
              </HStack>
            </GridItem>

            <GridItem>
              <HStack spacing={2}>
                <Icon as={MapPin} color="green.500" />
                <Text fontSize="sm">{suKien.diaDiem}</Text>
              </HStack>
            </GridItem>

            <GridItem>
              <HStack spacing={2}>
                <Icon as={Calendar} color="purple.500" />
                <Text fontSize="sm">
                  Bắt đầu: {formatDateTime(suKien.ngayToChuc, suKien.gioToChuc)}
                </Text>
              </HStack>
            </GridItem>

            <GridItem>
              <HStack spacing={2}>
                <Icon as={Clock} color="orange.500" />
                <Text fontSize="sm">
                  Kết thúc: {formatDateTime(suKien.ngayKetThuc, suKien.gioKetThuc)}
                </Text>
              </HStack>
            </GridItem>
          </Grid>

          {suKien.thanhVienThamGia?.length > 0 && (
            <Box>
              <HStack spacing={2} mb={1}>
                <Icon as={Users} color="teal.500" />
                <Text fontSize="sm" fontWeight="medium">Thành viên:</Text>
              </HStack>
              <Flex gap={2} flexWrap="wrap">
                {suKien.thanhVienThamGia.map((member, idx) => (
                  <Badge key={idx} colorScheme="teal" variant="subtle">
                    {member}
                  </Badge>
                ))}
              </Flex>
            </Box>
          )}

          {suKien.nguoiLienHe?.length > 0 && (
            <Box>
              <HStack spacing={2} mb={1}>
                <Icon as={Phone} color="red.500" />
                <Text fontSize="sm" fontWeight="medium">Liên hệ:</Text>
              </HStack>
              <HStack spacing={4}>
                {suKien.nguoiLienHe.map((contact, idx) => (
                  <Tooltip key={idx} label={`${contact.chucVu} - ${contact.soDienThoai}`}>
                    <Badge colorScheme="red" variant="subtle">
                      {contact.hoTen}
                    </Badge>
                  </Tooltip>
                ))}
              </HStack>
            </Box>
          )}

          {suKien.links?.length > 0 && (
            <Box>
              <HStack spacing={2} mb={1}>
                <Icon as={LinkIcon} color="blue.500" />
                <Text fontSize="sm" fontWeight="medium">Links:</Text>
              </HStack>
              <VStack align="stretch" spacing={1}>
                {suKien.links.map((link, idx) => (
                  <Link 
                    key={idx}
                    href={link.url}
                    isExternal
                    color="blue.500"
                    fontSize="sm"
                  >
                    {link.ghiChu || link.url}
                  </Link>
                ))}
              </VStack>
            </Box>
          )}

          {suKien.ghiChu && (
            <Box>
              <HStack spacing={2}>
                <Icon as={Bookmark} color="gray.500" />
                <Text fontSize="sm" color={secondaryTextColor}>
                  {suKien.ghiChu}
                </Text>
              </HStack>
            </Box>
          )}
        </VStack>
      </Flex>
    </ChakraBox>
  );
});

ItemSuKien.displayName = 'ItemSuKien';

export default ItemSuKien;