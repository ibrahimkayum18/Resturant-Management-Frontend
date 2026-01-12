import { NavLink, Outlet } from "react-router";
import { useState } from "react";
import adminMenu from "../assets/adminDashboardMenu.json";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`
            fixed lg:sticky top-0 z-50
            h-screen w-64
            bg-gray-900 text-gray-300
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          {/* LOGO */}
          <div className="h-16 flex items-center justify-between px-6">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Bengal Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* MENU */}
          <nav className="px-4 py-6 space-y-1">
            {adminMenu.map((item, index) => (
              <NavLink
              key={index}
                to={item.path}
                end={item.path === "/dashboard"} // 👈 IMPORTANT
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all
    ${
      isActive
        ? "bg-gray-800 text-white shadow"
        : "hover:bg-gray-800 hover:text-white"
    }`
                }
              >
                <span className="w-2 h-2 rounded-full bg-gray-500" />
                <span className="text-sm font-medium tracking-wide">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* FOOTER */}
          <div className="absolute bottom-0 w-full px-6 py-4 border-t border-gray-800 text-xs text-gray-400">
            © {new Date().getFullYear()} Bengal Spicy Food
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* HEADER */}
          <header className="sticky top-0 z-30 h-16 bg-[#f5f5f5] shadow-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden text-gray-700"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>
              <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden md:block text-sm text-gray-600">
                Admin
              </span>
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                👤
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 p-6 bg-[#f5f5f5]">
            <div className=" mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
