import React, { Suspense } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProfileContext, { getPrivileges, Profile, noProfile } from "./components/profile-context";
import GlimmerPage from "./pages/glimmer";
import NotFoundPage from "./pages/404";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MainCover from "./components/main-cover";
import StorageManager from "./libs/storage-manager";
import getServerData from "./libs/server-data";

function App() {
  // privileges state
  const [profile, setProfile] = React.useState<Profile>(noProfile);

  // side effects to load profile and privileges
  React.useEffect(() => {
    // on app load
    const action = async () => {
      // seting profile
      const result = await getServerData("query { userByAuth { id user userRoles { roleId role { name } } centerId center { name } } }");
      const privileges = getPrivileges(result.data.userByAuth.userRoles?.map((userRole: any) => userRole.role.name) ?? []);
      if (result.data.userByAuth.centerId === 1 || result.data.userByAuth.centerId === 2) privileges.createTicket = true;
      setProfile({
        id: result.data.userByAuth.id,
        name: result.data.userByAuth.user,
        centerId: result.data.userByAuth.centerId,
        center: { name: result.data.userByAuth.center?.name ?? "<no center>" },
        privileges
      });
    };

    // cheking token
    if (StorageManager.hasToken()) action();
  }, [profile.userRoles]);

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
  const TicketsPage = React.lazy(() => import("./pages/tickets"));
  const CentersPage = React.lazy(() => import("./pages/centers"));
  const PasswordPage = React.lazy(() => import("./pages/password"));
  const AddAdminPage = React.lazy(() => import("./pages/add-admin"));
  const AddClientPage = React.lazy(() => import("./pages/add-client"));
  const AddOrderPage = React.lazy(() => import("./pages/add-order"));
  const AddProductPage = React.lazy(() => import("./pages/add-product"));
  const AddCategoryPage = React.lazy(() => import("./pages/add-category"));
  const AddSubCategoryPage = React.lazy(() => import("./pages/add-sub-category"));
  const AddTicketPage = React.lazy(() => import("./pages/add-ticket"));
  const AddCenterPage = React.lazy(() => import("./pages/add-center"));

  // app router
  const allRoutes = [
    {
      path: "/",
      element: <HomePage />,
      errorElement: <MainCover title="System Error!" />
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/products", element: <ProductsPage /> },
    { path: "/advertisements", element: <AdvertisementsPage /> },
    { path: "/categories", element: <CategoriessPage /> },
    { path: "/sub-categories/:categoryid", element: <SubCategoriesPage /> },
    { path: "/clients", element: <ClientsPage /> },
    { path: "/admins", element: <AdminsPage /> },
    { path: "/orders", element: <OrdersPage /> },
    { path: "/tickets", element: <TicketsPage /> },
    { path: "/centers/:parentId?", element: <CentersPage /> },
    { path: "/password", element: <PasswordPage /> },
    { path: "/add-admin", element: <AddAdminPage /> },
    { path: "/add-client", element: <AddClientPage /> },
    { path: "/add-product", element: <AddProductPage /> },
    { path: "/add-order", element: <AddOrderPage /> },
    { path: "/add-category", element: <AddCategoryPage /> },
    { path: "/add-sub-category/:categoryid", element: <AddSubCategoryPage /> },
    { path: "/add-ticket", element: <AddTicketPage /> },
    { path: "/add-center/:parentId?", element: <AddCenterPage /> },
    { path: "*", element: <NotFoundPage /> }
  ];

  const ticketRoutes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/add-client", element: <AddClientPage /> },
    { path: "/password", element: <PasswordPage /> },
    { path: "*", element: <TicketsPage /> }
  ];

  const orderRoutes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/add-client", element: <AddClientPage /> },
    { path: "/add-order", element: <AddOrderPage /> },
    { path: "/password", element: <PasswordPage /> },
    { path: "*", element: <OrdersPage /> }
  ];

  const loginRoutes = [{ path: "*", element: <LoginPage /> }];

  let routes = loginRoutes;
  if (StorageManager.hasToken()) {
    if (!profile.privileges.updateClient && profile.privileges.createTicket) routes = ticketRoutes;
    else if (!profile.privileges.updateClient && profile.privileges.createOrder) routes = orderRoutes;
    else routes = allRoutes;
  } else routes = loginRoutes;

  const router = createBrowserRouter(routes, {
    basename: "/alardh-alsalba"
  });

  // mui theme
  const theme = createTheme({
    palette: {
      primary: {
        main: "#354141"
      },
      secondary: {
        main: "#007982"
      }
    },
    typography: {
      fontFamily: "roboto"
    }
  });

  // render
  return (
    <Suspense fallback={<GlimmerPage />}>
      <ProfileContext.Provider value={profile}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ProfileContext.Provider>
    </Suspense>
  );
}

export default App;
