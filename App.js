
import './App.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Sign from './pages/sign'
import Login from './pages/login'
import Home from './components/home'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Home />
        </>
      )
    },
    {
      path: "login",
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "sign",
      element: (
        <Sign />
      ),
    },
  ]);





  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
