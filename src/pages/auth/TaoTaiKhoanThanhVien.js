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
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FaUser, FaHome, FaPhone, FaFacebook, FaTelegram } from 'react-icons/fa';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from '../../services/firebase';

const TaoTaiKhoanThanhVien = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const memberData = { ...formData };
      delete memberData.password;

      await setDoc(doc(db, "members", user.uid), memberData);

      toast({
        title: "Đăng ký thành công!",
        description: "Tài khoản thành viên mới đã được tạo.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setFormData({
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
    <Box maxW="container.md" mx="auto">
      <Heading mb={6}>Đăng ký Thành viên Mới</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Họ và tên</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaUser />} />
              <Input name="fullName" value={formData.fullName} onChange={handleChange} />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Ngày sinh</FormLabel>
            <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Số CCCD</FormLabel>
            <Input name="idNumber" value={formData.idNumber} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Địa chỉ hiện tại</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaHome />} />
              <Input name="address" value={formData.address} onChange={handleChange} />
            </InputGroup>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mã số thành viên</FormLabel>
            <Input name="memberCode" value={formData.memberCode} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phân hệ</FormLabel>
            <Select name="department" value={formData.department} onChange={handleChange}>
              <option value="Thiên Minh Đường">Thiên Minh Đường</option>
              <option value="Tây Vân Các">Tây Vân Các</option>
              <option value="Họa Tam Đường">Họa Tam Đường</option>
              <option value="Hồ Ly sơn trang">Hồ Ly Sơn trang</option>
              <option value="Hoa Vân Các">Hoa Vân Các</option>
              <option value="Tinh Vân Các">Tinh Vân Các</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Ngày gia nhập</FormLabel>
            <Input name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email đăng nhập</FormLabel>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Mật khẩu</FormLabel>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Số điện thoại</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaPhone />} />
              <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Biển số xe</FormLabel>
            <Input name="licensePlate" value={formData.licensePlate} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Trường đại học/cao đẳng đã học</FormLabel>
            <Input name="education" value={formData.education} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Họ tên bố</FormLabel>
            <Input name="fatherName" value={formData.fatherName} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Số điện thoại bố</FormLabel>
            <Input name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Họ tên mẹ</FormLabel>
            <Input name="motherName" value={formData.motherName} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Số điện thoại mẹ</FormLabel>
            <Input name="motherPhone" value={formData.motherPhone} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Link CV</FormLabel>
            <Input name="cvLink" value={formData.cvLink} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Link Facebook</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaFacebook />} />
              <Input name="facebookLink" value={formData.facebookLink} onChange={handleChange} />
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Số điện thoại Zalo</FormLabel>
            <Input name="zaloPhone" value={formData.zaloPhone} onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>ID Telegram</FormLabel>
            <InputGroup>
              <InputLeftElement children={<FaTelegram />} />
              <Input name="telegramId" value={formData.telegramId} onChange={handleChange} />
            </InputGroup>
          </FormControl>

          <Button type="submit" colorScheme="blue" size="lg" width="full">
            Đăng ký Thành viên
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TaoTaiKhoanThanhVien;