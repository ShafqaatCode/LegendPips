import { Outlet } from "react-router-dom";

import Footer from "./components/Footer/Footer";

import Header from "./components/Header/Header";


const Layout: React.FC = () => {
    return (
        <>

            <Header />
            
            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    )
}

export default Layout;