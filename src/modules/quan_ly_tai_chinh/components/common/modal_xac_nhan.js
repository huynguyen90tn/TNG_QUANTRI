// File: src/modules/quan_ly_tai_chinh/components/common/modal_xac_nhan.js
// Link tham khảo: https://chakra-ui.com/docs/components/modal
// Nhánh: main

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';

const ModalXacNhan = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  type = 'delete'
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const buttonScheme = type === 'delete' ? 'red' : 'blue';
  const buttonText = type === 'delete' ? 'Xóa' : 'Xác nhận';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Text>{message}</Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={buttonScheme}
            mr={3}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {buttonText}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalXacNhan;