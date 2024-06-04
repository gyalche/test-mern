import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Navbar } from './components/navbar';

function App() {
  return (
    <div>
      <Navbar />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
