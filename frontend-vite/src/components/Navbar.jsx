import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className='bg-black text-white pl-5 flex justify-between h-15 pt-4 font-bold'>
            <Link to={'/'} className=' hover:text-amber-100'>Home</Link>
            <div className='space-x-4 pr-5'>
                <Link to={'/cart'} className=' hover:text-amber-100'>Cart</Link>
                <Link to={'/login'} className=' hover:text-amber-100'>login</Link>
                <Link to={'/register'} className=' hover:text-amber-100'>Signup</Link>

            </div>
        </nav>
    );
}

export default Navbar;