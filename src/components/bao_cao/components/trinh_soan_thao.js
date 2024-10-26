 // src/components/bao_cao/components/trinh_soan_thao.js
import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useColorModeValue,
} from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TrinhSoanThao = ({
  value,
  onChange,
  error,
  label = 'Nội dung',
  height = '200px',
  isRequired = false
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <FormControl isInvalid={error} isRequired={isRequired}>
      {label && <FormLabel>{label}</FormLabel>}
      <Box
        className="quill-wrapper"
        bg={bgColor}
        borderRadius="md"
        border="1px solid"
        borderColor={error ? 'red.500' : borderColor}
        _hover={{
          borderColor: error ? 'red.500' : 'blue.500'
        }}
        transition="all 0.3s"
        sx={{
          '.ql-toolbar': {
            borderTopRadius: 'md',
            borderColor: 'inherit',
            bg: bgColor
          },
          '.ql-container': {
            borderBottomRadius: 'md',
            borderColor: 'inherit',
            bg: bgColor,
            height: height,
            fontSize: '16px',
          },
          '.ql-editor': {
            minHeight: height,
            maxHeight: '500px',
            overflowY: 'auto'
          }
        }}
      >
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Nhập nội dung báo cáo..."
        />
      </Box>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default TrinhSoanThao;
