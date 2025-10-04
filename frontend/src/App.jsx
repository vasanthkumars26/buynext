import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Home from './components/Home'
import Navbar from './common/Navbar'
import About from './components/Blogs'
import CartPage from './components/CartPage'
import { CartProvider } from './context/Cartcon'
import OrdersPage from './components/OrdersPage'
import OrderSuccess from './components/OrderSuccess'
import SearchPage from './components/SearchPage'
import Footer from './common/Footer'
import Wishlist from './components/Wishlist'
import Blogs from './components/Blogs'
import CheckoutPage from './components/CheckoutPage'


function App() {

  return (
    <div>
      <CartProvider>
      <BrowserRouter>
            <Navbar/>
          <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/home' element={<Home/>} />
            <Route path='/wishlist' element={<Wishlist/>} />
            <Route path='/cart' element={<CartPage/>} />
            <Route path='/blogs' element={<Blogs/>} />
             <Route path="/orders" element={<OrdersPage />} />
             <Route path="/ordersuccess" element={<OrderSuccess />} />
             <Route path="/search" element={<SearchPage />} />
             <Route path="/checkout" element={<CheckoutPage/>} />
          </Routes>
          <Footer/>
      </BrowserRouter>
      </CartProvider>
     
    </div>
  )
}

export default App
