import React from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '../components/navbar';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = true;
  if (!isAuthenticated) {
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
