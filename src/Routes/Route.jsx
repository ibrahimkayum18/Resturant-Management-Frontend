import { createBrowserRouter } from "react-router";

import Main from "../layouts/Main";
import Home from "../pages/regular_pages/Home/Home";
import About from "../pages/regular_pages/About/About";
import Contact from "../pages/regular_pages/Contact/Contact";
import LogIn from "../pages/customer_pages/LogIn/LogIn";
import Register from "../pages/customer_pages/Register/Register";
import Menu from "../pages/regular_pages/Menus/Menu";

import Dashboard from "../layouts/Dashboard";
import Overview from "../pages/admin_pages/Overview/Overview";
import AddProduct from "../pages/admin_pages/AddProduct/AddProduct";
import AllCustomers from "../pages/admin_pages/AllCustomers/AllCustomers";
import AllProducts from "../pages/admin_pages/AllProducts/AllProducts";
import CustomerMessages from "../pages/admin_pages/CustomerMessage/CustomerMessages";
import Orders from "../pages/admin_pages/Orders/Orders";
import Subscribers from "../pages/admin_pages/Subscribers/Subscribers";
import Users from "../pages/admin_pages/Users/Users";
import UpdateFood from "../pages/admin_pages/UpdatFoodMenu/UpdateFood";
import ProductPage from "../components/ProductPage";

const Route = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { index: true, element: <Home /> },
      { path: "menu", element: <Menu /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <LogIn /> },
      { path: "register", element: <Register /> },
      { path: "/food-menu/:id", loader: ({params}) => fetch(`http://localhost:5000/food-menu/${params.id}`) ,element: <ProductPage /> },
    ]
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { index: true, element: <Overview /> }, // 👈 DEFAULT PAGE
      { path: "add_products", element: <AddProduct /> },
      { path: "all_customers", element: <AllCustomers /> },
      { path: "all_products", element: <AllProducts /> },
      { path: "customer_message", element: <CustomerMessages /> },
      { path: "all_orders", element: <Orders /> },
      { path: "subscribers", element: <Subscribers /> },
      { path: "users", element: <Users /> },
      { path: "food_menu/:id", element: <UpdateFood /> }
    ]
  }
]);

export default Route;
