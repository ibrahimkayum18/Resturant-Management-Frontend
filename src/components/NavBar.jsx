import { Link, NavLink, useNavigate } from "react-router";
import menuData from "../assets/main_menu.json";
import logo from "./../assets/logo.png";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { AuthContext } from "../Routes/AuthProvider";
import toast from "react-hot-toast";
import { BsCart3 } from "react-icons/bs";
import axios from "axios";

const NavBar = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [menuStatus, setMenuStatus] = useState(false);
  const navigate = useNavigate();
  const { logOut, user } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success("Sign out successful");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/cart?email=${user.email}`)
        .then((res) => setCartProducts(res.data))
        .catch((err) => console.error(err.message));
    }
  }, [user]);

  const navLinks = (
    <>
      {menuData.map((menu) => (
        <li key={`${menu.path}-${menu.name}`} className="text-xl">
          <NavLink
            to={menu.path}
            onClick={() => setMenuStatus(false)}
            className={({ isActive }) =>
              isActive ? "text-[#8F0000] font-semibold" : "font-semibold"
            }
          >
            {menu.name}
          </NavLink>
        </li>
      ))}
    </>
  );

  return (
    <div className="relative">
      {/* TOP BAR */}
      <div className="flex justify-between items-center py-3 px-4 md:px-0 default-width">
        <div className="flex items-center gap-4">
          {/* MOBILE MENU ICON */}
          <div className="md:hidden text-2xl cursor-pointer">
            {menuStatus ? (
              <RxCross1 onClick={() => setMenuStatus(false)} />
            ) : (
              <IoMenuOutline onClick={() => setMenuStatus(true)} />
            )}
          </div>

          {/* LOGO */}
          <Link to={"/"}>
            <img
              src={logo}
              alt="logo"
              className="w-28 md:w-40 cursor-pointer"
              onClick={() => navigate("/")}
            />
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-6">{navLinks}</ul>

        {/* ACCOUNT DROPDOWN */}
        <div className="sm:text-2xl md:text-3xl cursor-pointer flex gap-3">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button">
              <MdOutlineAccountCircle />
            </div>

            {user ? (
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm"
              >
                <li>
                  <a>Account</a>
                </li>
                <li>
                  <Link to={"/dashboard"}>Dashboard</Link>
                </li>
                <li>
                  <button onClick={handleLogOut}>Sign Out</button>
                </li>
              </ul>
            ) : (
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-sm"
              >
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            )}
          </div>
          <div className="">
            <Link className="relative" to={"/cart"}>
              <BsCart3 />
              {cartProducts.length > 0 && (
                <div className="text-[12px] bg-red-900 text-white w-5 h-5 flex justify-center items-center rounded-full absolute -top-2 -right-2">
                  {cartProducts.length}
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300
        ${menuStatus ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5">
          <ul className="flex flex-col gap-4">{navLinks}</ul>
        </div>
      </div>

      {/* OVERLAY */}
      {menuStatus && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuStatus(false)}
        />
      )}
    </div>
  );
};

export default NavBar;
