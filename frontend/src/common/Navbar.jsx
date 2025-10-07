import { signOut } from 'firebase/auth'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import auth from '../../config/firebase'
import { FaAddressCard, FaShoppingCart, FaHome, FaHeart,FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/Cartcon';
import Wishlist from '../components/Wishlist';


const Navbar = () => {

    const [search, setSearch] = useState('')
    //handlesearchbtn
    const handlesearchbtn = () => {
        if (search.trim !== "") {
            navigate(`/search?query=${encodeURIComponent(search)}`)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handlesearchbtn()
        }
    }

    const { wishlist, cart, orders } = useCart()

    const navigate = useNavigate()
    const [log, setLog] = useState(false)
    const [banner, setBanner] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigate("/home")
                setLog(true)
            }
        })
    }, [])

    const logout = () => {
        signOut(auth).then((res) => {
            setLog(false)
        }).catch((err) => {
            console.log(err)
        })
    }



    return (
        <div >
            {banner && <div className='flex fixed top-0 z-40 w-[100%] justify-center gap-10 bg-green-100 p-1'><p >FREE SHIPPING for orders over $49 - Get some inspirational shirts for your loved one today!</p>
                <p onClick={() => setBanner(false)} className='hover:cursor-pointer'>X</p></div>}

            <div
                className={`fixed w-[100%] top-0 z-40 bg-white shadow-md shadow-green-100 
                p-5 flex items-center justify-between md:justify-around
                ${banner ? "mt-8" : ""}`}>

                    <div className='mr-2 lg:hidden md:block'><FaBars onClick={()=>setMenuOpen(true)} className='cursor-pointer' /></div>

                <div >
                    <Link to="/home" className='mr-2 text-2xl font-bold' >BuyNext</Link>
                </div>
                {log && <div className='hidden md:flex w-[40%] items-center'>
                    <input onKeyDown={handleKeyDown} value={search} onChange={(e) => setSearch(e.target.value)} type="text" className=' border border-gray-400  outline-none p-2 md:w-[100%]' />
                    <button disabled={() => input.length === 0} onClick={handlesearchbtn} className=' bg-gradient-to-r from-green-300 to-green-500 hover:from-green-500 hover:to-green-300 p-2 border border-gray-400    ' >Search</button>
                </div>}

                <div className="hidden gap-16 items-center  lg:flex">

                   {log && <div className="relative group">
                        <Link to="/">
                            <FaHome className="text-2xl" />
                        </Link>
                        <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Home
                        </span>
                    </div>}

                    {log && <div className="relative group">
                        <Link to="/wishlist" className='flex'>
                            <FaHeart className="text-2xl relative z-10" /><span className='absolute -top-2 -right-4 bg-green-200 rounded-full text-red-500 font-bold'>({wishlist.length})</span> 
                        </Link>
                        <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Wishlist
                        </span>
                    </div>}

                   {log && <div className="relative group">
                        <Link to="/cart" className='flex'>
                            <FaShoppingCart className="text-2xl font-normal relative z-10" /><span className='absolute -top-2 -right-4 text-red-600 font-bold bg-green-200 rounded-full' >({cart.length})</span>
                        </Link>
                        <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Cart
                        </span>
                    </div>}


                   {log && <div className="relative group">
                        <Link to="/blogs">
                            <FaAddressCard className="text-2xl" />
                        </Link>
                        <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           Blogs
                        </span>
                    </div>}

                     {log && (
      <div className='bg-green-200 p-2 rounded-xl' >
          <Link to="/orders" className='flex items-center'>
              Your Orders!
              <span className='flex items-center text-red-600 font-extrabold rounded-full'>({orders.length})</span>
          </Link>
      </div>
    )}

                </div>
                <div>
                    {log ? (
                        <button
                            onClick={logout}
                            className="text-sm ml-24 md:ml-28
      bg-gradient-to-r from-green-300 to-green-500
      p-2 rounded-md
      hover:scale-105 hover:shadow-lg
      transition-all duration-500 ease-in-out"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="
      bg-gradient-to-r from-green-300 to-green-500
      p-2 rounded-md
      hover:scale-105 hover:shadow-lg
      transition-all duration-500 ease-in-out"
                        >
                            Login
                        </button>
                    )}

                </div>
            </div>
             <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <FaTimes size={24} onClick={() => setMenuOpen(false)} className="cursor-pointer" />
        </div>
        <ul className="p-4 space-y-6 text-lg">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          {log &&<li><Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist ({wishlist.length})</Link></li>}
          {log && <li><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cart.length})</Link></li>}
          <li><Link to="/blogs" onClick={() => setMenuOpen(false)}>Blogs</Link></li>
         {log && <li><Link to="/orders" onClick={() => setMenuOpen(false)}>Orders ({orders.length})</Link></li>}
          <li>
            {log ? (
              <button onClick={logout} className="text-red-600">Logout</button>
            ) : (
              <button onClick={() => { navigate("/login"); setMenuOpen(false) }}>Login</button>
            )}
          </li>
        </ul>
      </div>
        </div>
    )
}

export default Navbar