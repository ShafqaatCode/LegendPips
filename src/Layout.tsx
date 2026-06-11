import { Outlet } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Header from "./components/Navbar/Navbar";
import { usePageMeta } from "./contexts/SiteConfigContext";

const Layout: React.FC = () => {
    usePageMeta();
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