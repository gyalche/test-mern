import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/(auth)/login';
import Register from '../pages/(auth)/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,

    children: [{}],
  },
  {
    path: '/register',
    element: <Register />,
  },
]);
