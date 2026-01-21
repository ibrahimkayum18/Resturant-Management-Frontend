import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";


const Main = () => {
    return (
        <div className="bg-white text-black">
            <NavBar />
            <div className="min-h-screen ">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Main;