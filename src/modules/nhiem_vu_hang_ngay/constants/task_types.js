// File: src/modules/nhiem_vu_hang_ngay/constants/task_types.js

export const TASK_TYPES = {
    LIKE: 'like',
    SHARE: 'share',
    COMMENT: 'comment',
    SUBSCRIBE: 'subscribe'
  };
  
  export const TASK_LABELS = {
    [TASK_TYPES.LIKE]: 'Thích',
    [TASK_TYPES.SHARE]: 'Chia sẻ',
    [TASK_TYPES.COMMENT]: 'Bình luận',
    [TASK_TYPES.SUBSCRIBE]: 'Đăng ký kênh'
  };
  
  export const TASK_REQUIREMENTS = {
    [TASK_TYPES.LIKE]: {
      description: 'Like chính thức từ tài khoản cá nhân, không sử dụng tài khoản clone',
      instructions: 'Đăng nhập vào tài khoản cá nhân > Nhấn nút like > Kiểm tra đã chuyển sang màu xanh',
      verificationSteps: [
        'Kiểm tra xác thực tài khoản người dùng',
        'Xác nhận lượt like được thực hiện trong thời gian quy định',
        'Đảm bảo like được thực hiện từ tài khoản chính thức'
      ]
    },
    [TASK_TYPES.COMMENT]: {
      description: 'Bình luận tích cực, có nội dung liên quan, tối thiểu 5 từ',
      instructions: 'Đọc nội dung > Để lại bình luận có ý nghĩa > Kiểm tra bình luận đã xuất hiện',
      verificationSteps: [
        'Kiểm tra độ dài bình luận',
        'Phân tích nội dung bình luận có liên quan',
        'Xác nhận thời gian bình luận phù hợp'
      ]
    },
    [TASK_TYPES.SHARE]: {
      description: 'Chia sẻ công khai trên trang cá nhân, kèm nội dung giới thiệu',
      instructions: 'Nhấn nút chia sẻ > Chọn chia sẻ công khai > Thêm lời giới thiệu > Đăng',
      verificationSteps: [
        'Kiểm tra chế độ chia sẻ là công khai',
        'Xác nhận có nội dung giới thiệu kèm theo', 
        'Đảm bảo link chia sẻ hoạt động'
      ]
    },
    [TASK_TYPES.SUBSCRIBE]: {
      description: 'Đăng ký kênh và bật thông báo',
      instructions: 'Nhấn Đăng ký > Bật chuông thông báo > Kiểm tra trạng thái đăng ký',
      verificationSteps: [
        'Xác nhận đã đăng ký kênh',
        'Kiểm tra cài đặt thông báo',
        'Đảm bảo đăng ký từ tài khoản chính thức'
      ]
    }
  };
  