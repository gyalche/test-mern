import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/(auth)/login';
import Register from '../pages/(auth)/Register';
import HomePage from '../pages/homepage';
import NotFound from '../pages/NotFound';
import CompletedTasks from '../pages/completedTask';

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
    path: '*',
    element: <NotFound />,
  },
]);
