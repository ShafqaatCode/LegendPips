import { Outlet } from "react-router-dom";

import CompareBar from "./components/Broker/CompareBar";
import Footer from "./components/Footer/Footer";
import Header from "./components/Navbar/Navbar";
import AutoTranslateRoot from "./components/i18n/AutoTranslateRoot";
import { usePageMeta } from "./contexts/SiteConfigContext";

const Layout: React.FC = () => {
    usePageMeta();
    return (
        <>
            <div className="notranslate">
              <Header />
            </div>

            <main>
              <AutoTranslateRoot>
                <Outlet />
              </AutoTranslateRoot>
            </main>

            <div className="notranslate">
              <Footer />
            </div>
            <div className="notranslate">
              <CompareBar />
            </div>
        </>
    )
}

export default Layout;