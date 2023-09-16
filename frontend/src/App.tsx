import React, { Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoleContext, {
  noPrivileges,
  type Privileges,
  getPrivileges,
  Role,
} from "./components/role-context";
import GlimmerPage from "./pages/glimmer";
import NotFoundPage from "./pages/404";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MainCover from "./components/main-cover";
import StorageManager from "./libs/storage-manager";
import getServerData from "./libs/server-data";

interface Profile {
  id: number;
  user: string;
  role?: Role;
}

function App() {
  // privileges state
  const [profile, setProfile] = React.useState<Profile>({ id: 0, user: "" });
  const [privileges, setPrivileges] = React.useState<Privileges>(noPrivileges);

  // side effects to load profile and privileges
  React.useEffect(() => {
    // on app load
    const action = async () => {
      // seting profile
      const result = await getServerData(
        "query { adminByAuth { id user role } }"
      );
      setProfile(result.data.adminByAuth);
    };

    // cheking token
    if (StorageManager.hasToken()) action();
  }, []);

  React.useEffect(() => {
    // profile has changed
    setPrivileges(getPrivileges(profile?.role));
  }, [profile]);

  // lazy load pages
  const LoginPage = React.lazy(() => import("./pages/login"));
  const HomePage = React.lazy(() => import("./pages/home"));
  const ProductsPage = React.lazy(() => import("./pages/products"));
  const AdvertisementsPage = React.lazy(() => import("./pages/advertisements"));
  const CategoriessPage = React.lazy(() => import("./pages/categories"));
  const SubCategoriesPage = React.lazy(() => import("./pages/sub-categories"));
  const ClientsPage = React.lazy(() => import("./pages/clients"));
  const AdminsPage = React.lazy(() => import("./pages/admins"));
  const OrdersPage = React.lazy(() => import("./pages/orders"));
  const MaintenancesPage = React.lazy(() => import("./pages/maintenances"));
  const PasswordPage = React.lazy(() => import("./pages/password"));
  const AddAdminPage = React.lazy(() => import("./pages/add-admin"));
  const AddProductPage = React.lazy(() => import("./pages/add-product"));
  const AddCategoryPage = React.lazy(() => import("./pages/add-category"));
  const AddSubCategoryPage = React.lazy(
    () => import("./pages/add-sub-category")
  );

  // app router
  const routes = [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <MainCover title="System Error!" />,
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/products", element: <ProductsPage /> },
    { path: "/advertisements", element: <AdvertisementsPage /> },
    { path: "/categories", element: <CategoriessPage /> },
    { path: "/sub-categories/:categoryid", element: <SubCategoriesPage /> },
    { path: "/clients", element: <ClientsPage /> },
    { path: "/admins", element: <AdminsPage /> },
    { path: "/orders", element: <OrdersPage /> },
    { path: "/maintenances", element: <MaintenancesPage /> },
    { path: "/password", element: <PasswordPage /> },
    { path: "/add-admin", element: <AddAdminPage /> },
    { path: "/add-product", element: <AddProductPage /> },
    { path: "/add-category", element: <AddCategoryPage /> },
    { path: "/add-sub-category/:categoryid", element: <AddSubCategoryPage /> },

    { path: "*", element: <NotFoundPage /> },
  ];

  const loginRoutes = [{ path: "*", element: <LoginPage /> }];

  const router = createBrowserRouter(
    StorageManager.hasToken() ? routes : loginRoutes,
    {
      basename: "/alardh-alsalba",
    }
  );

  // mui theme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#354141",
      },
      secondary: {
        main: "#007982",
      },
    },
    typography: {
      fontFamily: "roboto",
    },
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
