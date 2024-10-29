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
  Heading
} from '@chakra-ui/react';

const ThemKiemThu = () => {
  return (
    <Box p={4}>
      <Card>
        <CardHeader>
          <Heading size="lg">Thêm mới kiểm thử</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Tính năng kiểm thử</FormLabel>
              <Input placeholder="Nhập tên tính năng" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Loại kiểm thử</FormLabel>
              <Select placeholder="Chọn loại kiểm thử">
                <option value="unit">Unit Test</option>
                <option value="integration">Integration Test</option>
                <option value="e2e">End-to-End Test</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Người thực hiện</FormLabel>
              <Input placeholder="Nhập tên người thực hiện" />
            </FormControl>

            <FormControl>
              <FormLabel>Mô tả</FormLabel>
              <Textarea placeholder="Nhập mô tả chi tiết" />
            </FormControl>

            <Button colorScheme="blue" width="full">
              Thêm mới
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ThemKiemThu;