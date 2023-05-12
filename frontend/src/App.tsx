import React, { Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlimmerPage from './pages/glimmer';
import NotFoundPage from './pages/404';

function App() {
  const Login = React.lazy(() => import("./pages/login"));

  const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    { path: '*', element: <NotFoundPage /> },
  ])

  return (
    <Suspense fallback={<GlimmerPage/>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
