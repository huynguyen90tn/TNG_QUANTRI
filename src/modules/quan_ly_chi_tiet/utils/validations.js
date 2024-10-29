// src/modules/quan_ly_chi_tiet/utils/validations.js
import * as yup from 'yup';

export const duAnSchema = yup.object().shape({
  tenDuAn: yup
    .string()
    .required('Vui lòng nhập tên dự án')
    .min(3, 'Tên dự án phải có ít nhất 3 ký tự'),
  moTa: yup.string(),
  phongBan: yup.string().required('Vui lòng chọn phòng ban'),
  trangThai: yup.string().required('Vui lòng chọn trạng thái'),
  ngayBatDau: yup.date().required('Vui lòng chọn ngày bắt đầu'),
  ngayKetThuc: yup
    .date()
    .required('Vui lòng chọn ngày kết thúc')
    .min(yup.ref('ngayBatDau'), 'Ngày kết thúc phải sau ngày bắt đầu')
});

export const nhiemVuSchema = yup.object().shape({
  tenNhiemVu: yup
    .string()
    .required('Vui lòng nhập tên nhiệm vụ')
    .min(3, 'Tên nhiệm vụ phải có ít nhất 3 ký tự'),
  moTa: yup.string(),
  nguoiPhuTrach: yup.string().required('Vui lòng nhập người phụ trách'),
  trangThai: yup.string().required('Vui lòng chọn trạng thái'),
  tienDo: yup
    .number()
    .required('Vui lòng nhập tiến độ')
    .min(0, 'Tiến độ tối thiểu là 0%')
    .max(100, 'Tiến độ tối đa là 100%'),
  deadline: yup.date().required('Vui lòng chọn deadline'),
  ghiChu: yup.string()
});

export const tinhNangSchema = yup.object().shape({
  tenTinhNang: yup
    .string()
    .required('Vui lòng nhập tên tính năng')
    .min(3, 'Tên tính năng phải có ít nhất 3 ký tự'),
  moTa: yup.string(),
  frontend: yup.object().shape({
    nguoiPhuTrach: yup.string().required('Vui lòng nhập người phụ trách frontend'),
    trangThai: yup.string().required('Vui lòng chọn trạng thái frontend'),
    tienDo: yup
      .number()
      .required('Vui lòng nhập tiến độ frontend')
      .min(0, 'Tiến độ tối thiểu là 0%')
      .max(100, 'Tiến độ tối đa là 100%'),
    ghiChu: yup.string()
  }),
  backend: yup.object().shape({
    nguoiPhuTrach: yup.string().required('Vui lòng nhập người phụ trách backend'),
    trangThai: yup.string().required('Vui lòng chọn trạng thái backend'),
    tienDo: yup
      .number()
      .required('Vui lòng nhập tiến độ backend')
      .min(0, 'Tiến độ tối thiểu là 0%')
      .max(100, 'Tiến độ tối đa là 100%'),
    ghiChu: yup.string(),
    apiEndpoints: yup.array().of(
      yup.string().matches(/^\/[a-zA-Z0-9\-\_\/]*$/, 'API endpoint không hợp lệ')
    )
  }),
  kiemThu: yup.object().shape({
    nguoiKiemThu: yup.string().required('Vui lòng nhập người kiểm thử'),
    trangThai: yup.string().required('Vui lòng chọn trạng thái kiểm thử'),
    tienDo: yup
      .number()
      .required('Vui lòng nhập tiến độ kiểm thử')
      .min(0, 'Tiến độ tối thiểu là 0%')
      .max(100, 'Tiến độ tối đa là 100%'),
    ghiChu: yup.string(),
    loaiTest: yup.array().when('trangThai', {
      is: 'HOAN_THANH',
      then: yup
        .array()
        .min(1, 'Vui lòng chọn ít nhất một loại test khi hoàn thành')
    })
  })
});