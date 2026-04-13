import { Outlet } from "react-router-dom";
import '../css/Layout.css'

const Layout = () => {
    return(
        <div className="app-container">
            <main id="main-content">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
