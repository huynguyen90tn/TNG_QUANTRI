// File: src/hooks/use_auth.js
// Link tham khảo: https://firebase.google.com/docs/auth
// Link tham khảo: https://firebase.google.com/docs/firestore

import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { auth, db } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

const mapUserData = (firebaseUser, userData) => ({
  id: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: userData?.fullName || firebaseUser.displayName || '',
  role: userData?.role || 'member',
  department: userData?.department || '',
  position: userData?.position || '',
  status: userData?.status || 'active',
  phoneNumber: userData?.phoneNumber || '',
  avatar: userData?.avatar || '',
  memberCode: userData?.memberCode || '',
  createdAt: userData?.createdAt || new Date().toISOString(),
  updatedAt: userData?.updatedAt || new Date().toISOString(),
});

const formatErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Email không hợp lệ';
    case 'auth/user-disabled':
      return 'Tài khoản đã bị vô hiệu hóa';
    case 'auth/user-not-found':
      return 'Không tìm thấy tài khoản';
    case 'auth/wrong-password':
      return 'Mật khẩu không đúng';
    case 'auth/email-already-in-use':
      return 'Email đã được sử dụng';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu';
    default:
      return error.message || 'Đã có lỗi xảy ra';
  }
};

export const AuthProvider = ({ children }) => {
  const authContextValue = useProvideAuth();
  const memoizedValue = useMemo(() => authContextValue, [authContextValue]);

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!mounted) return;

        setLoading(true);
        setError(null);

        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const mappedUser = mapUserData(firebaseUser, userData);
            setUser(mappedUser);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setError('Không tìm thấy dữ liệu người dùng');
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Lỗi xác thực:', err);
        setError(formatErrorMessage(err));
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (!userDoc.exists()) {
        throw new Error('Không tìm thấy dữ liệu người dùng');
      }

      const userData = userDoc.data();
      const mappedUser = mapUserData(userCredential.user, userData);
      setUser(mappedUser);
      setIsAuthenticated(true);
      return mappedUser;

    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi đăng nhập:', err);
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi đăng xuất:', err);
      setError(formatErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (email, password, userData) => {
    try {
      setLoading(true);
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const userDataToSave = {
        email: userCredential.user.email,
        role: userData.role || 'member',
        department: userData.department || '',
        fullName: userData.fullName || '',
        position: userData.position || '',
        status: 'active',
        phoneNumber: userData.phoneNumber || '',
        avatar: userData.avatar || '',
        memberCode: userData.memberCode || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDataToSave);

      const mappedUser = mapUserData(userCredential.user, userDataToSave);
      setUser(mappedUser);
      setIsAuthenticated(true);
      return mappedUser;

    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Lỗi tạo người dùng:', err);
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    createUser,
  };
}

export default useProvideAuth;