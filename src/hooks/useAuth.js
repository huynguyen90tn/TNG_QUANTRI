import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export const useAuth = () => {
  const dispatch = useDispatch();

  const login = async (email, password) => {
    dispatch(loginStart());
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Kiểm tra email để xác định vai trò
      let role = 'member';
      if (email === 'gin@tng.com') {
        role = 'adminTong';
      } else if (email.endsWith('@admin.tng.com')) {
        role = 'adminCon';
      }

      dispatch(loginSuccess({ ...user, role }));
      return role;
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  };

  const logoutUser = () => {
    auth.signOut();
    dispatch(logout());
  };

  return { login, logout: logoutUser };
};