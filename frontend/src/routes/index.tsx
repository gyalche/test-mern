import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/(auth)/login';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,

    children: [{}],
  },
]);
