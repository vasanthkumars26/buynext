import React from 'react'

const Footer = () => {
  return (
    <div  >
    <div className=' bottom-0 text-gray-300 lg:pl-24 text-start gap-10 md:gap-x-64 lg:gap-x-96 mt-5  sm:gap-x-52 grid grid-cols-2  bg-gradient-to-r from-green-900 to-gray-700 p-5 w-full'>
        <div>
            <h1 className='font-bold mb-2 text-lg' >About Us</h1>
            <p>Pellentesque posuere orci lobortis scelerisque blandit. Donec id tellus lacinia an, tincidunt risus ac, consequat velit.Donec id tellus lacinia an, tincidunt risus.</p>
        </div>
    <div>
        <h1 className='font-bold mb-2 text-lg' >Information</h1>
        <p>Search</p>
        <p>Store Location</p>
        <p>Order & Return</p>
        <p>Privacy Policy</p>
    </div>
    <div>
        <h1 className='font-bold mb-2 text-lg'>Support</h1>
        <p>Contact Us</p>
        <p>About Us</p>
        <p>Career</p>
        <p>Delivery</p>
    </div>
    <div>
        <h1 className='font-bold mb-2 text-lg'>Help</h1>
        <p>Help & FAQ'S</p>
        <p>Information</p>
        <p>Shipping Details</p>
        <p>Online Payment</p>
    </div>
    </div></div>
  )
}

export default Footer