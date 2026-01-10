import { createBrowserRouter } from "react-router";
import Main from "../layouts/Main";
import Home from "../pages/regular_pages/Home/Home";
import About from "../pages/regular_pages/About/About";
import Contact from "../pages/regular_pages/Contact/Contact";
import LogIn from "../pages/customer_pages/LogIn/LogIn";
import Register from "../pages/customer_pages/Register/Register";
import PrivateRouter from "./PrivateRoute";
import Menu from "../pages/regular_pages/Menus/Menu";

const Route = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/menu',
            element: <PrivateRouter><Menu /></PrivateRouter>
        },
        {
            path: '/about',
            Component: About
        },
        {
            path: '/contact',
            Component: Contact
        },
        {
            path: '/login',
            Component: LogIn
        },
        {
            path: '/register',
            Component: Register
        }
    ]
  },
])

export default Route;