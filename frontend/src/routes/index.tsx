import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/(auth)/login';
import Register from '../pages/(auth)/Register';
import HomePage from '../pages/homepage';
import NotFound from '../pages/NotFound';
import CompletedTasks from '../pages/completedTask';
import UserDetailsPage from '../pages/(auth)/userDetails';
import PasswordChange from '../pages/(auth)/changePassword';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/task-completed',
    element: <CompletedTasks />,
  },
  {
    path: '/user-info',
    element: <UserDetailsPage />,
  },
  {
    path: '/change-password',
    element: <PasswordChange />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
