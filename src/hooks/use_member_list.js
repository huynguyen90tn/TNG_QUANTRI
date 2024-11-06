// File: src/hooks/use_member_list.js
// Nhánh: main

import { useState, useCallback } from 'react';
import { getAllUsers } from '../services/api/userApi';
import { useToast } from '@chakra-ui/react';

export const useMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await getAllUsers();
      setMembers(data);
    } catch (err) {
      setError(err.message);
      toast({
        title: 'Lỗi',
        description: 'Không thể lấy danh sách người dùng',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getMemberByEmail = useCallback((email) => {
    return members.find(member => member.email === email);
  }, [members]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    getMemberByEmail
  };
};