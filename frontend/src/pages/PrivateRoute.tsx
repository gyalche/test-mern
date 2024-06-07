import React from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../services/redux/slices/user.slice';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(getUserInfo);
  if (!isAuthenticated.name) {
    return <Navigate to="/" replace />;
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default PrivateRoute;
