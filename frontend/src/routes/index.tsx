import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/(auth)/login';
import Register from '../pages/(auth)/Register';
import HomePage from '../pages/homepage';
import NotFound from '../pages/NotFound';

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
    children: [{}],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
