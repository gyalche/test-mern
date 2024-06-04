import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div>HELLOW WORLD</div>,

    children: [{}],
  },
]);
