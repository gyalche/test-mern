import React from 'react';
import PrivateRoute from '../PrivateRoute';
import { useSelector } from 'react-redux';
import { getUserInfo } from '../../services/redux/slices/user.slice';
import ContentWrapper from '../../contentWrapper/contentWrapper';
import Dashboard from '../../components/homePage/dashboard';

const HomePage = () => {
  const user = useSelector(getUserInfo);
  console.log('the user', user);
  return (
    <PrivateRoute>
      <ContentWrapper>
        <Dashboard />
      </ContentWrapper>
    </PrivateRoute>
  );
};

export default HomePage;
