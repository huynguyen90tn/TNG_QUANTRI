import React, { useState, useEffect } from 'react';
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
  useColorModeValue,
  Radio,
  RadioGroup
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { storage, db, auth } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FaUser, FaIdCard, FaBuilding, FaShieldAlt, FaUpload } from 'react-icons/fa';

const TaoTaiKhoanQuanTri = () => {
  const [formData, setFormData] = useState({
    avatar: null,
    fullName: '',
    memberCode: '',
    idNumber: '',
    department: '',
    permissions: [],
    email: '',
    password: '',
    adminType: 'admin-con'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { user, loading } = useAuth();
  const toast = useToast();
  const [isAdminTong, setIsAdminTong] = useState(false);

  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const textColor = useColorModeValue('white', 'gray.100');
  const inputBgColor = useColorModeValue('gray.700', 'gray.800');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setIsAdminTong(userData?.role === 'admin-tong');
      }
    };
    checkAdminStatus();
  }, [user]);

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
    console.log("Form submitted. Current user:", user);

    if (loading) {
      console.log("Authentication is still loading");
      toast({
        title: "Đang tải",
        description: "Vui lòng đợi trong giây lát.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!user || !isAdminTong) {
      console.log("User is not an admin tong");
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
      console.log("Starting registration process");
      
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const newUser = userCredential.user;

      let avatarUrl = '';
      if (formData.avatar) {
        console.log("Uploading avatar");
        const avatarRef = ref(storage, `avatars/${newUser.uid}`);
        await uploadBytes(avatarRef, formData.avatar);
        avatarUrl = await getDownloadURL(avatarRef);
        console.log("Avatar uploaded successfully");
      }

      const adminData = {
        uid: newUser.uid,
        email: formData.email,
        fullName: formData.fullName,
        memberCode: formData.memberCode,
        idNumber: formData.idNumber,
        department: formData.department,
        permissions: formData.permissions,
        avatar: avatarUrl,
        role: formData.adminType,
        createdBy: user.uid,
        createdAt: new Date().toISOString()
      };

      console.log("Admin data prepared:", adminData);

      await setDoc(doc(db, "users", newUser.uid), adminData);
      console.log("Document successfully written!");

      toast({
        title: "Đăng ký thành công",
        description: `Tài khoản ${formData.adminType} đã được tạo.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setFormData({
        avatar: null,
        fullName: '',
        memberCode: '',
        idNumber: '',
        department: '',
        permissions: [],
        email: '',
        password: '',
        adminType: 'admin-con'
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
          <Text color={textColor}>Current user: {user ? `${user.email} (${isAdminTong ? 'Admin Tong' : 'Not Admin Tong'})` : 'Not logged in'}</Text>
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

              <FormControl isRequired>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} bg="gray.700" color={textColor} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Mật khẩu</FormLabel>
                <Input name="password" type="password" value={formData.password} onChange={handleChange} bg="gray.700" color={textColor} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Loại Admin</FormLabel>
                <RadioGroup name="adminType" value={formData.adminType} onChange={(value) => setFormData(prev => ({ ...prev, adminType: value }))}>
                  <VStack align="start">
                    <Radio value="admin-con" color={textColor}>Admin Con</Radio>
                    <Radio value="admin-tong" color={textColor}>Admin Tổng</Radio>
                  </VStack>
                </RadioGroup>
              </FormControl>

              <Button type="submit" colorScheme="blue" size="lg" leftIcon={<FaShieldAlt />} isLoading={loading} isDisabled={!isAdminTong}>
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