import { Outlet } from "react-router-dom"

import Footer from "./components/Footer/Footer"

import Header from "./components/Header/Header"
import NavbarComp from "./components/Navbar/Navbar"


const Layout: React.FC = () => {
    return (
        <>
       
        <Header />
        {/* <NavbarComp /> */}
        <main>
            <Outlet />
        </main>

        <Footer />
        </>
    )
}

export default Layout;