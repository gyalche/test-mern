import React from 'react';
import PrivateRoute from '../PrivateRoute';
import ContentWrapper from '../../contentWrapper/contentWrapper';
import Dashboard from '../../components/homePage/dashboard';

const HomePage = () => {
  return (
    <PrivateRoute>
      <ContentWrapper>
        <Dashboard />
      </ContentWrapper>
    </PrivateRoute>
  );
};

export default HomePage;
