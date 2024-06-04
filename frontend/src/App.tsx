import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Navbar } from './components/navbar';

function App() {
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
