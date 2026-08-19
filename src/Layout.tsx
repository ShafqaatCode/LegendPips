import { Outlet } from "react-router-dom";

import CompareBar from "./components/Broker/CompareBar";
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
            <CompareBar />
        </>
    )
}

export default Layout;