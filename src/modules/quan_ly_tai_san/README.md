# Module Quản Lý Tài Sản

Module quản lý tài sản cho phép quản lý thông tin các tài sản trong công ty, bao gồm thiết bị, phần mềm, giấy phép và các tài sản khác.

## Tính năng chính

- Quản lý danh sách tài sản với phân trang và bộ lọc
- Thêm mới/cập nhật thông tin tài sản 
- Cấp phát và thu hồi tài sản
- Quản lý bảo trì tài sản
- Kiểm kê định kỳ tài sản
- Phân quyền theo vai trò người dùng

## Cài đặt

1. Cài đặt các dependencies:

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

2. Import module vào App:

```jsx
import taiSanRoutes from './routes/tai_san_routes';
import taiSanReducer from './modules/quan_ly_tai_san/store/tai_san_slice';

// Add routes
const routes = [
  ...taiSanRoutes
];

// Add reducer
const rootReducer = {
  taiSan: taiSanReducer
};
```

3. Thêm rules vào Firebase:

```javascript
match /tai_san/{taiSanId} {
  allow read: if isAuthenticated();
  allow write: if isAdmin();
}
```

## Sử dụng

```jsx
import QuanLyTaiSanPage from './modules/quan_ly_tai_san/pages/quan_ly_tai_san_page';

function App() {
  return (
    <QuanLyTaiSanPage />
  );
}
```

## API

### Components

- `QuanLyTaiSanPage`: Component chính của module
- `DanhSachTaiSan`: Hiển thị danh sách tài sản
- `ThemTaiSan`: Form thêm/sửa tài sản
- `CapPhatTaiSan`: Quản lý cấp phát/thu hồi
- `BaoTriTaiSan`: Quản lý bảo trì 
- `KiemKeTaiSan`: Quản lý kiểm kê

### Hooks

- `useTaiSan`: Hook quản lý state và thao tác với tài sản
- `useAuth`: Hook xác thực và phân quyền

### Redux

- `taiSanSlice`: Quản lý state của module
- Actions: `layDanhSachTaiSanAsync`, `themTaiSanAsync`, etc.

## Phân quyền

- Admin tổng: Tất cả quyền
- Admin con: Xem, thêm/sửa, cấp phát, kiểm kê
- Kỹ thuật: Xem, bảo trì
- Thành viên: Chỉ xem

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details