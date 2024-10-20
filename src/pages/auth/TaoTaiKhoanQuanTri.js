import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Select,
  Checkbox,
  CheckboxGroup,
  Text,
  useToast,
  Image,
  SimpleGrid,
  Container,
  Flex,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { storage, db } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { FaUser, FaIdCard, FaBuilding, FaShieldAlt, FaUpload } from 'react-icons/fa';

const TaoTaiKhoanQuanTri = () => {
  const [formData, setFormData] = useState({
    avatar: null,
    fullName: '',
    memberCode: '',
    idNumber: '',
    department: '',
    permissions: []
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useAuth();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const textColor = useColorModeValue('white', 'gray.100');
  const inputBgColor = useColorModeValue('gray.700', 'gray.800');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePermissionChange = (checkedItems) => {
    setFormData(prev => ({ ...prev, permissions: checkedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.role !== 'admin-tong') {
      toast({
        title: "Không có quyền",
        description: "Bạn không có quyền thực hiện hành động này.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      let avatarUrl = '';
      if (formData.avatar) {
        const avatarRef = ref(storage, `avatars/${formData.memberCode}`);
        await uploadBytes(avatarRef, formData.avatar);
        avatarUrl = await getDownloadURL(avatarRef);
      }

      const adminData = {
        ...formData,
        avatar: avatarUrl,
        role: 'admin-con',
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", formData.memberCode), adminData);

      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản quản trị đã được tạo.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        avatar: null,
        fullName: '',
        memberCode: '',
        idNumber: '',
        department: '',
        permissions: []
      });
      setImagePreview(null);
    } catch (error) {
      console.error("Lỗi khi đăng ký quản trị:", error);
      toast({
        title: "Đăng ký thất bại",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <Heading color={textColor} size="2xl" textAlign="center">Đăng ký Quản trị mới</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch" bg={inputBgColor} p={8} borderRadius="xl" boxShadow="xl">
              <Flex justifyContent="center" mb={4}>
                <FormControl width="200px">
                  <FormLabel htmlFor="avatar" cursor="pointer">
                    <VStack spacing={2} align="center">
                      <Box
                        borderRadius="full"
                        boxSize="150px"
                        bg={imagePreview ? 'transparent' : 'gray.600'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        overflow="hidden"
                      >
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Avatar preview"
                            boxSize="150px"
                            objectFit="cover"
                          />
                        ) : (
                          <Icon as={FaUpload} w={10} h={10} color="gray.400" />
                        )}
                      </Box>
                      <Text color={textColor} fontSize="sm">Tải lên ảnh đại diện</Text>
                    </VStack>
                  </FormLabel>
                  <Input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleImageChange}
                    display="none"
                  />
                </FormControl>
              </Flex>

              <SimpleGrid columns={2} spacing={6}>
                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaUser} color="blue.400" mr={2} />Họ và tên</FormLabel>
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} bg="gray.700" color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaIdCard} color="green.400" mr={2} />Mã số thành viên</FormLabel>
                  <Input name="memberCode" value={formData.memberCode} onChange={handleChange} bg="gray.700" color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaIdCard} color="yellow.400" mr={2} />Số CCCD</FormLabel>
                  <Input name="idNumber" value={formData.idNumber} onChange={handleChange} bg="gray.700" color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaBuilding} color="purple.400" mr={2} />Phân hệ</FormLabel>
                  <Select name="department" value={formData.department} onChange={handleChange} bg="gray.700" color={textColor}>
                    <option value="">Chọn phân hệ</option>
                    <option value="Thiên Minh Đường">Thiên Minh Đường</option>
                    <option value="Tây Vân Các">Tây Vân Các</option>
                    <option value="Họa Tam Đường">Họa Tam Đường</option>
                    <option value="Hồ Ly sơn trang">Hồ Ly Sơn trang</option>
                    <option value="Hoa Vân Các">Hoa Vân Các</option>
                    <option value="Tinh Vân Các">Tinh Vân Các</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel color={textColor}><Icon as={FaShieldAlt} color="red.400" mr={2} />Phân quyền</FormLabel>
                <CheckboxGroup colorScheme="green" value={formData.permissions} onChange={handlePermissionChange}>
                  <SimpleGrid columns={2} spacing={4}>
                    <Checkbox value="manage_members" color={textColor}>Quản lý thành viên</Checkbox>
                    <Checkbox value="manage_projects" color={textColor}>Quản lý dự án</Checkbox>
                    <Checkbox value="view_reports" color={textColor}>Xem báo cáo</Checkbox>
                    <Checkbox value="edit_settings" color={textColor}>Chỉnh sửa cài đặt</Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>

              <Button type="submit" colorScheme="blue" size="lg" leftIcon={<FaShieldAlt />}>
                Đăng ký Quản trị
              </Button>
            </VStack>
          </form>

          <Text color="gray.400" fontSize="sm" textAlign="center">
            Lưu ý: Bạn vẫn ở trang Admin và không bị đăng xuất sau khi đăng ký thành công.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default TaoTaiKhoanQuanTri;