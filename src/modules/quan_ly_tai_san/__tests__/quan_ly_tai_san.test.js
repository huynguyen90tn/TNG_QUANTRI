// File: src/modules/quan_ly_tai_san/__tests__/quan_ly_tai_san.test.js
// Link tham khảo: https://jestjs.io/docs/getting-started
// Link tham khảo: https://testing-library.com/docs/react-testing-library/intro
// Nhánh: main

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import QuanLyTaiSanPage from '../pages/quan_ly_tai_san_page';
import { taiSanTheme } from '../../../styles/themes/tai_san_theme';
import { AuthProvider } from '../../../hooks/use_auth';

const mockStore = configureStore([thunk]);

describe('Quản lý tài sản module', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      taiSan: {
        danhSachTaiSan: [],
        loading: false,
        error: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        },
        filters: {}
      }
    });
  });

  test('renders quản lý tài sản page', () => {
    render(
      <Provider store={store}>
        <ChakraProvider theme={taiSanTheme}>
          <AuthProvider>
            <QuanLyTaiSanPage />
          </AuthProvider>
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText('Quản lý tài sản')).toBeInTheDocument();
  });

  test('shows loading state', () => {
    store = mockStore({
      taiSan: {
        danhSachTaiSan: [],
        loading: true,
        error: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        },
        filters: {}
      }
    });

    render(
      <Provider store={store}>
        <ChakraProvider theme={taiSanTheme}>
          <AuthProvider>
            <QuanLyTaiSanPage />
          </AuthProvider>
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('shows error state', () => {
    store = mockStore({
      taiSan: {
        danhSachTaiSan: [],
        loading: false,
        error: 'Test error message',
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0
        },
        filters: {}
      }
    });

    render(
      <Provider store={store}>
        <ChakraProvider theme={taiSanTheme}>
          <AuthProvider>
            <QuanLyTaiSanPage />
          </AuthProvider>
        </ChakraProvider>
      </Provider>
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('filters work correctly', async () => {
    render(
      <Provider store={store}>
        <ChakraProvider theme={taiSanTheme}>
          <AuthProvider>
            <QuanLyTaiSanPage />
          </AuthProvider>
        </ChakraProvider>
      </Provider>
    );

    const filterSelect = screen.getByLabelText('Loại tài sản');
    fireEvent.change(filterSelect, { target: { value: 'thiet_bi' } });

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: 'taiSan/setFilters',
          payload: expect.objectContaining({
            loaiTaiSan: 'thiet_bi'
          })
        })
      );
    });
  });

  test('pagination works correctly', async () => {
    store = mockStore({
      taiSan: {
        danhSachTaiSan: Array(40).fill({}),
        loading: false,
        error: null,
        pagination: {
          page: 1,
          limit: 20,
          total: 40,
          totalPages: 2
        },
        filters: {}
      }
    });

    render(
      <Provider store={store}>
        <ChakraProvider theme={taiSanTheme}>
          <AuthProvider>
            <QuanLyTaiSanPage />
          </AuthProvider>
        </ChakraProvider>
      </Provider>
    );

    const nextButton = screen.getByText('Sau');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(
        expect.objectContaining({
          type: 'taiSan/setPage',
          payload: 2
        })
      );
    });
  });
});