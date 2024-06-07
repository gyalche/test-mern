import React from 'react';
import PrivateRoute from '../PrivateRoute';
import ContentWrapper from '../../contentWrapper/contentWrapper';
import TaskCompletedComponent from '../../components/completedTask/TaskCompletedComponent';

const CompletedTasks = () => {
  return (
    <PrivateRoute>
      <ContentWrapper>
        <TaskCompletedComponent />
      </ContentWrapper>
    </PrivateRoute>
  );
};

export default CompletedTasks;
