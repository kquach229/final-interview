'use client';
import React, { useEffect } from 'react';

const UserInit = () => {
  useEffect(() => {
    fetch('/api/users/create', { method: 'POST' });
  }, []);
  return null;
};

export default UserInit;
