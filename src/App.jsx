import { Routes, Route, RouterProvider } from 'react-router-dom';
import './styles/App.css';
import { router } from './routes/routes';

function App() {
  return (
    <>
    <RouterProvider router={router}/>
    </>
  );
}

export default App;