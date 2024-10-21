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
  useToast,
  Image,
  SimpleGrid,
  Container,
  Flex,
  Icon,
  useColorModeValue,
  Text
} from '@chakra-ui/react';
import { FaUser, FaHome, FaPhone, FaFacebook, FaTelegram, FaUpload, FaIdCard, FaBuilding } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

const TaoTaiKhoanThanhVien = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: null,
    fullName: '',
    dateOfBirth: '',
    idNumber: '',
    address: '',
    memberCode: '',
    department: '',
    joinDate: '',
    email: '',
    password: '',
    phoneNumber: '',
    licensePlate: '',
    education: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
    cvLink: '',
    facebookLink: '',
    zaloPhone: '',
    telegramId: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const inputBgColor = useColorModeValue('white', 'gray.700');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      let avatarUrl = '';
      if (formData.avatar) {
        // Upload avatar to storage
        const avatarRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(avatarRef, formData.avatar);
        avatarUrl = await getDownloadURL(avatarRef);
      }

      const memberData = { ...formData, avatar: avatarUrl };
      delete memberData.password;
      delete memberData.avatar;

      // Add member data to Firestore
      await setDoc(doc(db, "members", user.uid), memberData);

      // Add user role to the "users" collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "member"
      });

      toast({
        title: "Đăng ký thành công!",
        description: "Tài khoản thành viên mới đã được tạo.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        avatar: null,
        fullName: '',
        dateOfBirth: '',
        idNumber: '',
        address: '',
        memberCode: '',
        department: '',
        joinDate: '',
        email: '',
        password: '',
        phoneNumber: '',
        licensePlate: '',
        education: '',
        fatherName: '',
        fatherPhone: '',
        motherName: '',
        motherPhone: '',
        cvLink: '',
        facebookLink: '',
        zaloPhone: '',
        telegramId: ''
      });
      setImagePreview(null);

      // Navigate back to admin dashboard
      navigate('/admin-tong');
    } catch (error) {
      console.error("Lỗi khi đăng ký thành viên:", error);
      toast({
        title: "Đăng ký thất bại",
        description: `Đã xảy ra lỗi: ${error.message}`,
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
          <Heading color={textColor} size="2xl" textAlign="center">Đăng ký Thành viên Mới</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch" bg={inputBgColor} p={8} borderRadius="xl" boxShadow="xl">
              <Flex justifyContent="center" mb={4}>
                <FormControl width="200px">
                  <FormLabel htmlFor="avatar" cursor="pointer">
                    <VStack spacing={2} align="center">
                      <Box
                        borderRadius="full"
                        boxSize="150px"
                        bg={imagePreview ? 'transparent' : 'gray.200'}
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
                  <FormLabel color={textColor}><Icon as={FaUser} color="blue.500" mr={2} />Họ và tên</FormLabel>
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Ngày sinh</FormLabel>
                  <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaIdCard} color="yellow.500" mr={2} />Số CCCD</FormLabel>
                  <Input name="idNumber" value={formData.idNumber} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaHome} color="purple.500" mr={2} />Địa chỉ hiện tại</FormLabel>
                  <Input name="address" value={formData.address} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaIdCard} color="green.500" mr={2} />Mã số thành viên</FormLabel>
                  <Input name="memberCode" value={formData.memberCode} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaBuilding} color="pink.500" mr={2} />Phân hệ</FormLabel>
                  <Select name="department" value={formData.department} onChange={handleChange} bg={inputBgColor} color={textColor}>
                    <option value="">Chọn phân hệ</option>
                    <option value="Thiên Minh Đường">Thiên Minh Đường</option>
                    <option value="Tây Vân Các">Tây Vân Các</option>
                    <option value="Họa Tam Đường">Họa Tam Đường</option>
                    <option value="Hồ Ly sơn trang">Hồ Ly Sơn trang</option>
                    <option value="Hoa Vân Các">Hoa Vân Các</option>
                    <option value="Tinh Vân Các">Tinh Vân Các</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Ngày gia nhập</FormLabel>
                  <Input name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Email đăng nhập</FormLabel>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Mật khẩu</FormLabel>
                  <Input name="password" type="password" value={formData.password} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}><Icon as={FaPhone} color="orange.500" mr={2} />Số điện thoại</FormLabel>
                  <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Biển số xe</FormLabel>
                  <Input name="licensePlate" value={formData.licensePlate} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Trường đại học/cao đẳng đã học</FormLabel>
                  <Input name="education" value={formData.education} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Họ tên bố</FormLabel>
                  <Input name="fatherName" value={formData.fatherName} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Số điện thoại bố</FormLabel>
                  <Input name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Họ tên mẹ</FormLabel>
                  <Input name="motherName" value={formData.motherName} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Số điện thoại mẹ</FormLabel>
                  <Input name="motherPhone" value={formData.motherPhone} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Link CV</FormLabel>
                  <Input name="cvLink" value={formData.cvLink} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}><Icon as={FaFacebook} color="blue.600" mr={2} />Link Facebook</FormLabel>
                  <Input name="facebookLink" value={formData.facebookLink} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Số điện thoại Zalo</FormLabel>
                  <Input name="zaloPhone" value={formData.zaloPhone} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}><Icon as={FaTelegram} color="blue.500" mr={2} />ID Telegram</FormLabel>
                  <Input name="telegramId" value={formData.telegramId} onChange={handleChange} bg={inputBgColor} color={textColor} />
                </FormControl>
              </SimpleGrid>

              <Button type="submit" colorScheme="blue" size="lg" width="full">
                Đăng ký Thành viên
              </Button>
            </VStack>
          </form>
        </VStack>
      </Container>
    </Box>
  );
};

export default TaoTaiKhoanThanhVien;