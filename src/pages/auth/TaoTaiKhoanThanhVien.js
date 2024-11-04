import React, { useState } from "react";
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
} from "@chakra-ui/react";
import {
  FaUser,
  FaHome,
  FaPhone,
  FaFacebook,
  FaTelegram,
  FaImage,
  FaIdCard,
  FaBuilding,
} from "react-icons/fa";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

// Constants cho department
const DEPARTMENTS = {
  'thien-minh-duong': 'Thiên Minh Đường',
  'tay-van-cac': 'Tây Vân Các',
  'hoa-tam-duong': 'Họa Tam Đường',
  'ho-ly-son-trang': 'Hồ Ly Sơn trang',
  'hoa-van-cac': 'Hoa Vân Các',
  'tinh-van-cac': 'Tinh Vân Các'
};

const TaoTaiKhoanThanhVien = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [isImageValid, setIsImageValid] = useState(false);
  
  const [formData, setFormData] = useState({
    avatarUrl: '',
    fullName: "",
    dateOfBirth: "",
    idNumber: "",
    address: "",
    memberCode: "",
    department: "",
    departmentId: "", // Thêm trường departmentId để lưu key của department
    joinDate: "",
    email: "",
    password: "",
    phoneNumber: "",
    licensePlate: "",
    education: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    cvLink: "",
    facebookLink: "",
    zaloPhone: "",
    telegramId: "",
  });

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const inputBgColor = useColorModeValue("white", "gray.700");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Xử lý đặc biệt cho trường department
    if (name === "department") {
      const departmentId = Object.keys(DEPARTMENTS).find(
        key => DEPARTMENTS[key] === value
      );
      setFormData(prev => ({
        ...prev,
        [name]: value,
        departmentId: departmentId || ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      avatarUrl: url
    }));
    setIsImageValid(false);
  };

  const handleImageLoad = () => {
    setIsImageValid(true);
  };

  const handleImageError = () => {
    setIsImageValid(false);
    toast({
      title: "Lỗi hình ảnh",
      description: "Link ảnh không hợp lệ hoặc không thể truy cập",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.avatarUrl || !isImageValid) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng kiểm tra lại ảnh đại diện",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Tạo tài khoản authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Chuẩn bị dữ liệu member
      const memberData = {
        userId: user.uid,
        avatarUrl: formData.avatarUrl,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
        idNumber: formData.idNumber,
        address: formData.address,
        memberCode: formData.memberCode,
        department: formData.department,
        departmentId: formData.departmentId,
        joinDate: formData.joinDate ? new Date(formData.joinDate) : null,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        licensePlate: formData.licensePlate || null,
        education: formData.education || null,
        fatherName: formData.fatherName || null,
        fatherPhone: formData.fatherPhone || null,
        motherName: formData.motherName || null,
        motherPhone: formData.motherPhone || null,
        cvLink: formData.cvLink || null,
        facebookLink: formData.facebookLink || null,
        zaloPhone: formData.zaloPhone || null,
        telegramId: formData.telegramId || null,
        status: "DANG_CONG_TAC",
        level: "THU_SINH",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Lưu thông tin member
      await setDoc(doc(db, "members", user.uid), memberData);

      // Lưu thông tin user
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "member",
        department: formData.departmentId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
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
        avatarUrl: '',
        fullName: "",
        dateOfBirth: "",
        idNumber: "",
        address: "",
        memberCode: "",
        department: "",
        departmentId: "",
        joinDate: "",
        email: "",
        password: "",
        phoneNumber: "",
        licensePlate: "",
        education: "",
        fatherName: "",
        fatherPhone: "",
        motherName: "",
        motherPhone: "",
        cvLink: "",
        facebookLink: "",
        zaloPhone: "",
        telegramId: "",
      });
      setIsImageValid(false);

      navigate("/admin-con");
    } catch (error) {
      console.error("Lỗi khi đăng ký thành viên:", error);
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
          <Heading color={textColor} size="2xl" textAlign="center">
            Đăng ký Thành viên Mới
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack
              spacing={6}
              align="stretch"
              bg={inputBgColor}
              p={8}
              borderRadius="xl"
              boxShadow="xl"
            >
              <FormControl isRequired>
                <FormLabel color={textColor}>
                  <Icon as={FaImage} color="blue.400" mr={2} />
                  Link ảnh đại diện
                </FormLabel>
                <Input
                  name="avatarUrl"
                  placeholder="Nhập link ảnh (URL)"
                  value={formData.avatarUrl}
                  onChange={handleImageUrlChange}
                  bg={inputBgColor}
                  color={textColor}
                />
              </FormControl>

              {formData.avatarUrl && (
                <Flex justifyContent="center" mb={4}>
                  <Box
                    borderRadius="xl"
                    boxSize="200px"
                    overflow="hidden"
                    borderWidth={2}
                    borderColor={isImageValid ? "green.400" : "red.400"}
                  >
                    <Image
                      src={formData.avatarUrl}
                      alt="Avatar preview"
                      boxSize="200px"
                      objectFit="cover"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </Box>
                </Flex>
              )}

              <SimpleGrid columns={2} spacing={6}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaUser} color="blue.500" mr={2} />
                    Họ và tên
                  </FormLabel>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Ngày sinh</FormLabel>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaIdCard} color="yellow.500" mr={2} />
                    Số CCCD
                  </FormLabel>
                  <Input
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaHome} color="purple.500" mr={2} />
                    Địa chỉ hiện tại
                  </FormLabel>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaIdCard} color="green.500" mr={2} />
                    Mã số thành viên
                  </FormLabel>
                  <Input
                    name="memberCode"
                    value={formData.memberCode}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaBuilding} color="pink.500" mr={2} />
                    Phân hệ
                  </FormLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  >
                    <option value="">Chọn phân hệ</option>
                    {Object.values(DEPARTMENTS).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Ngày gia nhập</FormLabel>
                  <Input
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Email đăng nhập</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>Mật khẩu</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaPhone} color="orange.500" mr={2} />
                    Số điện thoại
                  </FormLabel>
                  <Input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Biển số xe</FormLabel>
                  <Input
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>
                    Trường đại học/cao đẳng đã học
                  </FormLabel>
                  <Input
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Họ tên bố</FormLabel>
                  <Input
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Số điện thoại bố</FormLabel>
                  <Input
                    name="fatherPhone"
                    value={formData.fatherPhone}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Họ tên mẹ</FormLabel>
                  <Input
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Số điện thoại mẹ</FormLabel>
                  <Input
                    name="motherPhone"
                    value={formData.motherPhone}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Link CV</FormLabel>
                  <Input
                    name="cvLink"
                    value={formData.cvLink}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>
                    <Icon as={FaFacebook} color="blue.600" mr={2} />
                    Link Facebook
                  </FormLabel>
                  <Input
                    name="facebookLink"
                    value={formData.facebookLink}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>Số điện thoại Zalo</FormLabel>
                  <Input
                    name="zaloPhone"
                    value={formData.zaloPhone}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color={textColor}>
                    <Icon as={FaTelegram} color="blue.500" mr={2} />
                    ID Telegram
                  </FormLabel>
                  <Input
                    name="telegramId"
                    value={formData.telegramId}
                    onChange={handleChange}
                    bg={inputBgColor}
                    color={textColor}
                  />
                </FormControl>
              </SimpleGrid>

              <Button 
                type="submit" 
                colorScheme="blue" 
                size="lg" 
                width="full"
                isDisabled={!isImageValid}
              >
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