import { createBrowserRouter } from "react-router";
import Main from "../layouts/Main";
import Home from "../pages/regular_pages/Home/Home";
import About from "../pages/regular_pages/About/About";
import Contact from "../pages/regular_pages/Contact/Contact";
import LogIn from "../pages/customer_pages/LogIn/LogIn";
import Register from "../pages/customer_pages/Register/Register";

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