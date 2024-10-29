import React from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';

const ChinhSuaKiemThu = () => {
  return (
    <Box p={4}>
      <Card>
        <CardHeader>
          <Heading size="lg">Chỉnh sửa kiểm thử</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Tính năng kiểm thử</FormLabel>
              <Input placeholder="Nhập tên tính năng" defaultValue="Login System" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Loại kiểm thử</FormLabel>
              <Select defaultValue="unit">
                <option value="unit">Unit Test</option>
                <option value="integration">Integration Test</option>
                <option value="e2e">End-to-End Test</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Người thực hiện</FormLabel>
              <Input placeholder="Nhập tên người thực hiện" defaultValue="John Doe" />
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea 
                placeholder="Nhập mô tả chi tiết"
                defaultValue="Kiểm thử chức năng đăng nhập"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Kết quả kiểm thử</FormLabel>
              <Textarea 
                placeholder="Nhập kết quả kiểm thử"
                defaultValue="Tất cả test case đều pass"
              />
            </FormControl>

            <Button colorScheme="blue" width="full">
              Cập nhật
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ChinhSuaKiemThu;