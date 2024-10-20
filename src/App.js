import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminTongLogin from './pages/auth/AdminTongLogin';
import AdminConLogin from './pages/auth/AdminConLogin';
import MemberLogin from './pages/auth/MemberLogin';
import AdminTongDashboard from './pages/dashboard/AdminTongDashboard';
import AdminConDashboard from './pages/dashboard/AdminConDashboard';
import MemberDashboard from './pages/dashboard/MemberDashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import { Box } from '@chakra-ui/react';

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/admin-tong/login" element={<AdminTongLogin />} />
        <Route path="/admin-con/login" element={<AdminConLogin />} />
        <Route path="/member/login" element={<MemberLogin />} />

        <Route element={<ProtectedRoute allowedRoles={['adminTong']} />}>
          <Route path="/admin-tong/dashboard" element={<AdminTongDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['adminCon']} />}>
          <Route path="/admin-con/dashboard" element={<AdminConDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['member']} />}>
          <Route path="/member/dashboard" element={<MemberDashboard />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;