import { Outlet } from "react-router-dom"
import TopHeader from "./components/Header/TopHeader"
import Footer from "./components/Footer/Footer"

const Layout: React.FC = () => {
    return (
        <>
        <TopHeader />

        <main>
            <Outlet />
        </main>

        <Footer />
        </>
    )
}

export default Layout;