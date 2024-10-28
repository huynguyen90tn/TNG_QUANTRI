// src/modules/quan_ly_chi_tiet/components/xac_nhan_xoa_modal.js
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
  Text
} from '@chakra-ui/react';

const XacNhanXoaModal = ({ isOpen, onClose, title, message, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Hủy
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Xác nhận xóa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default XacNhanXoaModal;