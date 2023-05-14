import React, { Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoleContext, { noPrivileges, type Privileges, getPrivileges } from "./components/role-context";
import GlimmerPage from "./pages/glimmer";
import NotFoundPage from "./pages/404";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MainCover from "./components/main-cover";
import StorageManager from "./libs/storage-manager";
import getServerData from "./libs/server-data";

interface Profile {
  id: number
  user: string
  role: string
}

function App() {
  // privileges state
  const [profile, setProfile] = React.useState<Profile>({ id: 0, user: "", role: "" });
  const [privileges, setPrivileges] = React.useState<Privileges>(noPrivileges);

  // side effects to load profile and privileges
  React.useEffect(() => {
    // on app load
    const action = async () => {
      // seting profile
      const result = await getServerData("query { adminByAuth { id user role } }");
      setProfile(result.data.adminByAuth);
    };

    // cheking token
    if (StorageManager.hasToken()) action();
  }, []);

  React.useEffect(() => {
    // profile has changed
    console.log("profile has changed, setting privileges as: ", profile.role);
    setPrivileges(getPrivileges(profile.role));
  }, [profile]);

  // lazy load pages
  const Login = React.lazy(() => import("./pages/login"));
  const Home = React.lazy(() => import("./pages/home"));

  // app router
  const routes =[
    { path: "/", element: <Home />, errorElement: <MainCover title="System Error!" /> },
    { path: "/login", element: <Login /> },
    { path: "*", element: <NotFoundPage /> },
  ];

  const loginRoutes = [{ path: "*", element: <Login /> }];

  const router = createBrowserRouter(StorageManager.hasToken() ? routes : loginRoutes, {
    basename: "/gree"
  });

  // mui theme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#0035ff",
      },
      secondary: {
        main: "#f30",
      },
    },
    typography: {
      fontFamily: "roboto",
    }
  });

  // render
  return (
    <Suspense fallback={<GlimmerPage />}>
      <RoleContext.Provider value={privileges}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </RoleContext.Provider>
    </Suspense>
  );
}

export default App;