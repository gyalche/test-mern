import React from 'react';
import PrivateRoute from '../PrivateRoute';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../services/redux/slices/user.slice';

const HomePage = () => {
    const user = useSelector(getUserInfo);
    console.log('the user', user);
  return (
    <PrivateRoute>
      <h1>HELLOW WORLD</h1>
    </PrivateRoute>
  );
};

export default HomePage;
