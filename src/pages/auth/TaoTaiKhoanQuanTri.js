// File: src/pages/auth/TaoTaiKhoanQuanTri.js
// Link tham khảo: https://firebase.google.com/docs/auth/web/password-auth
// Link tham khảo: https://firebase.google.com/docs/firestore/manage-data/add-data

import React, { useState, useEffect, useCallback } from "react";
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
  RadioGroup,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { db, auth } from "../../services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  FaUser,
  FaIdCard,
  FaBuilding,
  FaShieldAlt,
  FaImage,
} from "react-icons/fa";

const initialFormData = {
  avatarUrl: '',
  fullName: "",
  memberCode: "",
  idNumber: "",
  department: "",
  permissions: [],
  email: "",
  password: "",
  adminType: "admin-con",
};

const TaoTaiKhoanQuanTri = () => {
  const [formData, setFormData] = useState(initialFormData);
  const { user, loading } = useAuth();
  const toast = useToast();
  const [isAdminTong, setIsAdminTong] = useState(false);
  const [isImageValid, setIsImageValid] = useState(false);

  const bgColor = useColorModeValue("gray.800", "gray.900");
  const textColor = useColorModeValue("white", "gray.100");
  const inputBgColor = useColorModeValue("gray.700", "gray.800");

  const checkAdminStatus = useCallback(async () => {
    if (!user?.id) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.id));
      const userData = userDoc.data();
      setIsAdminTong(userData?.role === "admin-tong");
    } catch (error) {
      console.error("Error checking admin status:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kiểm tra quyền admin",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [user?.id, toast]);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      avatarUrl: url
    }));
    // Reset trạng thái hợp lệ của ảnh khi URL thay đổi
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

  const handlePermissionChange = (checkedItems) => {
    setFormData((prev) => ({ ...prev, permissions: checkedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.avatarUrl) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập link ảnh đại diện",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isImageValid) {
      toast({
        title: "Lỗi hình ảnh",
        description: "Link ảnh không hợp lệ, vui lòng kiểm tra lại",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!user?.id || !isAdminTong) {
      toast({
        title: "Không có quyền",
        description: "Bạn không có quyền thực hiện hành động này",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const adminData = {
        uid: userCredential.user.uid,
        email: formData.email,
        fullName: formData.fullName,
        memberCode: formData.memberCode,
        idNumber: formData.idNumber,
        department: formData.department,
        permissions: formData.permissions,
        avatar: formData.avatarUrl,
        role: formData.adminType,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), adminData);

      toast({
        title: "Đăng ký thành công",
        description: `Tài khoản ${formData.adminType} đã được tạo`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setFormData(initialFormData);
      setIsImageValid(false);
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
          <Heading color={textColor} size="2xl" textAlign="center">
            Đăng ký Quản trị mới
          </Heading>
          
          <Text color={textColor}>
            Người dùng hiện tại: {" "}
            {user ? `${user.email} (${isAdminTong ? "Admin Tổng" : "Không phải Admin Tổng"})` : "Chưa đăng nhập"}
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch" bg={inputBgColor} p={8} borderRadius="xl" boxShadow="xl">
              
              {/* Phần nhập và hiển thị ảnh đại diện */}
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
                  bg="gray.700"
                  color={textColor}
                />
              </FormControl>

              {/* Hiển thị preview ảnh */}
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
                    <Icon as={FaUser} color="blue.400" mr={2} />
                    Họ và tên
                  </FormLabel>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    bg="gray.700"
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaIdCard} color="green.400" mr={2} />
                    Mã số thành viên
                  </FormLabel>
                  <Input
                    name="memberCode"
                    value={formData.memberCode}
                    onChange={handleChange}
                    bg="gray.700"
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaIdCard} color="yellow.400" mr={2} />
                    Số CCCD
                  </FormLabel>
                  <Input
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    bg="gray.700"
                    color={textColor}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color={textColor}>
                    <Icon as={FaBuilding} color="purple.400" mr={2} />
                    Phân hệ
                  </FormLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    bg="gray.700"
                    color={textColor}
                  >
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
                <FormLabel color={textColor}>
                  <Icon as={FaShieldAlt} color="red.400" mr={2} />
                  Phân quyền
                </FormLabel>
                <CheckboxGroup
                  colorScheme="green"
                  value={formData.permissions}
                  onChange={handlePermissionChange}
                >
                  <SimpleGrid columns={2} spacing={4}>
                    <Checkbox value="manage_members" color={textColor}>
                      Quản lý thành viên
                    </Checkbox>
                    <Checkbox value="manage_projects" color={textColor}>
                      Quản lý dự án
                    </Checkbox>
                    <Checkbox value="view_reports" color={textColor}>
                      Xem báo cáo
                    </Checkbox>
                    <Checkbox value="edit_settings" color={textColor}>
                      Chỉnh sửa cài đặt
                    </Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  bg="gray.700"
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
                  bg="gray.700"
                  color={textColor}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Loại Admin</FormLabel>
                <RadioGroup
                  name="adminType"
                  value={formData.adminType}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, adminType: value }))
                  }
                >
                  <VStack align="start">
                    <Radio value="admin-con" color={textColor}>
                      Admin Con
                    </Radio>
                    <Radio value="admin-tong" color={textColor}>
                      Admin Tổng
                    </Radio>
                  </VStack>
                </RadioGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                leftIcon={<FaShieldAlt />}
                isLoading={loading}
                isDisabled={!isAdminTong || !isImageValid}
              >
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