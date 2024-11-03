// File: src/hooks/use_auth.js
import React, { useState, useEffect, useContext, createContext } from 'react';
import { auth, db } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return (
    <AuthContext.Provider value={auth}>
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              ...firebaseUser,
              role: userData.role,
              department: userData.department,
              fullName: userData.fullName,
              position: userData.position,
              status: userData.status,
            });
          } else {
            console.error('Không tìm thấy dữ liệu người dùng trong Firestore');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Không tìm thấy dữ liệu người dùng trong Firestore');
      }

      const userData = userDoc.data();
      const userWithRole = {
        ...userCredential.user,
        role: userData.role,
        department: userData.department,
        fullName: userData.fullName,
        position: userData.position,
        status: userData.status,
      };

      setUser(userWithRole);
      return userWithRole;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (email, password, userData) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      const userDataToSave = {
        email: newUser.email,
        role: userData.role,
        department: userData.department,
        fullName: userData.fullName,
        position: userData.position,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', newUser.uid), userDataToSave);

      const userWithRole = {
        ...newUser,
        ...userDataToSave,
      };

      setUser(userWithRole);
      return userWithRole;
    } catch (error) {
      console.error('Lỗi tạo người dùng:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    createUser,
  };
}

export default useAuth;