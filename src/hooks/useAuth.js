// src/hooks/use_auth.js
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
  const authContext = useProvideAuth();
  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
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
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu người dùng:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
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
      } else {
        throw new Error('Không tìm thấy dữ liệu người dùng trong Firestore');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
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

      await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        role: userData.role,
        department: userData.department,
        fullName: userData.fullName,
        position: userData.position,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const userWithRole = {
        ...newUser,
        ...userData,
        status: 'active',
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