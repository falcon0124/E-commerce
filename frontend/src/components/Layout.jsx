import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function layout() {
    <>
        <Navbar />
        <main>
            <Outlet />
        </main>
    </>
}

export default layout;