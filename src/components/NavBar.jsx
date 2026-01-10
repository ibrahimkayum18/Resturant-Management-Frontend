import { NavLink, useNavigate } from "react-router";
import menuData from "../assets/main_menu.json";
import logo from "./../assets/logo.png";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useState } from "react";
import { IoMenuOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

const NavBar = () => {
  const [menuStatus, setMenuStatus] = useState(false);
  const navigate = useNavigate();

  const navLinks = (
    <>
      {menuData.map((menu) => (
        <li key={menu.path} className="text-xl">
          <NavLink
            to={menu.path}
            onClick={() => setMenuStatus(false)} // auto close on click
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
              <RxCross1 onClick={() => setMenuStatus(false)} className=""/>
            ) : (
              <IoMenuOutline onClick={() => setMenuStatus(true)} />
            )}
          </div>

          {/* LOGO */}
          <img
            src={logo}
            alt="logo"
            className="w-28 md:w-40 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex gap-6 ">{navLinks}</ul>

        {/* ACCOUNT ICON */}
        <div className="sm:text-2xl md:text-3xl cursor-pointer">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className=""><MdOutlineAccountCircle /></div>
            <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li><a>Account</a></li>
              <li><a>Dashboard</a></li>
              <li><a>Login</a></li>
              <li><a>Register</a></li>
              <li><a>Sign Out</a></li>
            </ul>
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
        ></div>
      )}
    </div>
  );
};

export default NavBar;
