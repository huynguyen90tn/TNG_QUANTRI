// File: src/modules/quan_ly_tai_chinh/utils/xu_ly_loi.js
// Nhánh: main

export const xuLyLoiFirebase = (error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  
    switch (errorCode) {
      case 'permission-denied':
        return 'Bạn không có quyền thực hiện thao tác này';
      case 'not-found':
        return 'Không tìm thấy dữ liệu yêu cầu';
      case 'already-exists':
        return 'Dữ liệu đã tồn tại trong hệ thống';
      case 'failed-precondition':
        return 'Điều kiện tiên quyết không được đáp ứng';
      case 'resource-exhausted':
        return 'Đã vượt quá giới hạn tài nguyên';
      default:
        return errorMessage || 'Đã có lỗi xảy ra';
    }
  };
  
  export const xuLyLoiValidation = (errors) => {
    const loiFormatted = {};
    
    Object.keys(errors).forEach(key => {
      const error = errors[key];
      loiFormatted[key] = {
        message: error.message || 'Trường này không hợp lệ',
        type: error.type || 'validation'
      };
    });
    
    return loiFormatted;
  };