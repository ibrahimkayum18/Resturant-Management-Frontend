import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";


const Main = () => {
    return (
        <div className="default-width">
            <NavBar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default Main;