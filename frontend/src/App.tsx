import { Outlet, RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Outlet />
    </>
  );
}

export default App;
