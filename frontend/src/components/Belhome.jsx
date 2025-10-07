import React, { useState } from 'react'
import { FaShoppingCart, FaTemperatureHigh, FaWater, FaShoppingBag, FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { useCart } from "../context/Cartcon";
import Wishlist from './Wishlist';

const Belhome = () => {
  const { addToWishlist, removeFromWishlist, addtoCart, allproducts, wishlist } = useCart()

  const costumes = [
    {
      _id: 1,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Product10.jpg?v=1597047059",
      desc: "Structured Fedora Hat",
      price: 18.47,
      category: "Caps",
      btn1: "Wishlist",
      btn2: "Add to Cart"
    },
    {
      _id: 2,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Product9.jpg?v=1597046790",
      desc: "Regular Fit T-Shirt",
      price: 8.47,
      category: "T-Shirts",
      btn1: "Wishlist",
      btn2: "Add to Cart"
    },
    {
      _id: 3,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Product11_329e9eaa-7056-4ee4-a8f8-1b6cd01a4ffe.jpg?v=1597047746",
      desc: "Long Sleeve Sweatshirts",
      price: 15.47,
      category: "Hoodies",
      btn1: "Wishlist",
      btn2: "Add to Cart"
    },
    {
      _id: 4,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Product12_90960967-e37e-4f11-ab69-4e876a3704ff.jpg?v=1597047912",
      desc: "Cotton Adjustable Caps",
      price: 23.47,
      category: "Caps",
      btn1: "Wishlist",
      btn2: "Add to Cart"
    },
  ];

  const fimage1 = [
    {
      img: "https://lacozt.myshopify.com/cdn/shop/files/section-bgimage1.jpg?v=1614294611",
      desc: "BigSale up to 30% off",
      titl: "Shop for great Selection of T-Shirts",
      btna: "Shop now"
    },
  ]

  const fimage = [
    {
      img: "https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg",
      desc: "NEW ARRIVALS",
      titl: "TOUCH OF COLOR",
      btna: "Shop now"
    },
    {
      img: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg",
      desc: "DISCOVER THEM ALL",
      titl: "THIS SEASON'S BOMBER JACKETS",
      btna: "Shop now"
    },
  ];

  const imagefooter = [{
    heading: "Order online & get it today",
    btn: "Shop now >",
  }, {
    heading: "BACO 50% off Branded Tees",
    btn: "Shop now >",
  }, {
    heading: "20% off on Export Tees",
    btn: "Shop now >",
  }];

  const imagefooter2 = [{
    heading: "FREE SHIPPING",
    subhead: "Gentle or Delicate Washing",
    icon: <FaWater />
  }, {
    heading: "Ironing Temparature",
    subhead: "Iron at maximum 150C or 300F",
    icon: <FaTemperatureHigh />
  }, {
    heading: "Water Temparature",
    subhead: "Wash at Below 30C or 80F",
    icon: <FaWater />
  }
  ]

  const pow = [{
    _id: 5,
    img: "https://images.pexels.com/photos/8217308/pexels-photo-8217308.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    desc: "Pull Over Hoodie",
    price: 12.47,
    category: "Hoodies",
    btn1: "Wishlist",
    btn2: "Add to Cart"
  },
  {
    _id: 6,
    img: "https://diesel.ie/cdn/shop/files/FadiaTeeT25061FF_4_533x.jpg?v=1741710096",
    desc: "Women's Ribbed T-Shirt",
    price: 19.37,
    category: "T-Shirts",
    btn1: "Wishlist",
    btn2: "Add to Cart"
  },
  {
    _id: 7,
    img: "https://cdn11.bigcommerce.com/s-1xod74bove/images/stencil/1280x1280/attribute_rule_images/23931_source_1736466569.jpg",
    desc: "Men's Sweat Pullover Hoodie",
    price: 13.67,
    category: "Hoodies",
    btn1: "Wishlist",
    btn2: "Add to Cart"
  },
  {
    _id: 8,
    img: "https://crocodile.in/cdn/shop/files/2_16ad7d02-38c1-4b86-9905-c15ea4983f6a.jpg?crop=region&crop_height=2090&crop_left=0&crop_top=209&crop_width=1672&v=1756898176&width=1672",
    desc: "Performance T-Shirt",
    price: 10.47,
    category: "T-Shirts",
    btn1: "Wishlist",
    btn2: "Add to Cart"
  },
  ]

  const [filter, setFilter] = useState("All")

  const filtered =
    filter === "All" ? allproducts : allproducts.filter((item) => item.category === filter)

  const WishlistButton = ({ product }) => {
    const isWishlisted = wishlist.find((item) => item._id === product._id);
    return (
      <button
        onClick={() =>
          isWishlisted
            ? removeFromWishlist(product._id)
            : addToWishlist(product)
        }
        className={`flex items-center gap-1 p-2 rounded-2xl ${isWishlisted
          ? "bg-red-500 text-white"
          : "bg-gradient-to-r from-green-300 to-green-600"
          }`}
      >
        {isWishlisted ? "Wishlisted" : "Wishlist"} <FaHeart />
      </button>
    );
  };

  return (
    <div className='mt-5 text-lg'>
      <h1>Summer Collection</h1>
      <p className='text-xl md:text-3xl font-bold mt-2'>Clothes & Accessories</p>
      <div className='flex gap-5 justify-center mt-2'>
        {["All", "Hoodies", "T-Shirts", "Caps"].map((cat) => (
          <span key={cat} onClick={() => setFilter(cat)} className={`hover:cursor-pointer border-b-4 ${filter === cat ? "border-b-black" : "border-b-transparent"}`} >{cat}</span>
        ))}
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 mt-4 text-start  gap-x-4 gap-y-2'>
        {filtered.map((costume) => (
          <div key={costume._id}>
            <img className='w-full aspect-[4/4] overflow-hidden ' src={costume.img} alt="collections" />
            <h1 className='mt-2'>{costume.desc}</h1>
            <p className='text-green-600 font-semibold'>${costume.price}</p>
            <div className='flex gap-4 text-sm mt-2'>
              <WishlistButton product={costume} />
              <button onClick={() => addtoCart(costume)} className='flex items-center gap-1 border border-green-600 p-2 rounded-3xl hover:bg-green-300 hover:transition-transform transition-all'>Add to Cart<FaShoppingCart /> </button>
            </div>
          </div>
        ))}
      </div>

      {fimage1.map((img, index) => (
        <div key={index} className='relative mt-10 w-[100%]'>
          <img src={img.img} alt="fimage" />
          <div className='absolute top-3 md:top-24 md:left-72 lg:top-44 lg:left-96 ml-52'>
            <p className='text-sm md:text-5xl font-bold text-black'>{img.desc}</p>
            <p className='text-sm md:text-2xl mt-3 font-semibold mb-6'>{img.titl}</p>
            <Link to="/" className='text-sm md:text-xl bg-green-950 p-2 rounded-2xl text-white hover:from-black hover:to-green-800'>{img.btna}</Link>
          </div>
        </div>
      ))}

      <div className='grid-cols-1 md:flex justify-center md:grid-cols-3 bg-gradient-to-r from-green-900 to-purple-900 gap-10 py-1 shadow-xl shadow-gray-400'>
        {imagefooter.map((item, index) => (
          <div key={index} className='border-b border-b-gray-400 md:border-r border-r-gray-400'>
            <h1 className='text-gray-300 font-semibold md:text-xl p-2 '>{item.heading}</h1>
            <button className='text-gray-300'>{item.btn}</button>
          </div>
        ))}
      </div>

      <div className='mt-10'>
        <h1>Top View in This Week</h1>
        <p className='text-xl font-semibold md:text-3xl mt-2'>Product of the Week</p>

        <div className='grid grid-cols-2 md:grid-cols-4 mt-4 text-start gap-x-4 gap-y-2'>
          {costumes.map((costume) => (
            <div key={costume._id}>
              <img className='w-full aspect-[4/4] overflow-hidden' src={costume.img} alt="collections" />
              <h1 className='mt-2'>{costume.desc}</h1>
              <p className='text-green-600 font-semibold'>${costume.price}</p>
              <div className='flex gap-4 text-sm mt-2'>
                <WishlistButton product={costume} />
                <button onClick={() => addtoCart(costume)} className='flex items-center gap-1 border border-green-600 p-2 rounded-3xl hover:bg-green-300 hover:transition-transform transition-all'>{costume.btn2}<FaShoppingCart /> </button>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 mt-4 text-start gap-x-4 gap-y-2'>
          {pow.map((costume) => (
            <div key={costume._id}>
              <img className='w-full aspect-[4/4] overflow-hidden' src={costume.img} alt="collections" />
              <h1 className='mt-2'>{costume.desc}</h1>
              <p className='text-green-600 font-semibold'>${costume.price}</p>
              <div className='flex gap-4 text-sm mt-2'>
                <WishlistButton product={costume} />
                <button onClick={() => addtoCart(costume)} className='flex items-center gap-1 border border-green-600 p-2 rounded-3xl hover:bg-green-300 hover:transition-transform transition-all'>{costume.btn2}<FaShoppingCart /> </button>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-2'>
          {fimage.map((img, index) => (
            <div key={index} className='relative mt-10 w-[100%] text-white'>
              <img src={img.img} alt="fimage" />
              <div className='absolute w-40 md:w-[60%] top-1 right-20 md:top-24 md:left-72 lg:top-34 lg:left-0 ml-52'>
                <p className='text-sm md:text-5xl font-bold'>{img.desc}</p>
                <p className='hidden md:block text-sm md:text-2xl mt-3 font-semibold mb-6'>{img.titl}</p>
                <Link to="/" className='text-sm md:text-xl bg-green-950 p-2 rounded-2xl mt-7 text-white hover:from-black hover:to-green-800'>{img.btna}</Link>
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 justify-center md:grid-cols-3 bg-gradient-to-r from-green-900 to-purple-900 gap-10 py-1 shadow-xl shadow-gray-400'>
          {imagefooter2.map((item, index) => (
            <div key={index} className='border-b flex gap-5 items-center justify-center border-b-gray-400 md:border-r border-r-gray-400'>
              <p>{item.icon}</p>
              <div>
                <h1 className='text-gray-300 font-semibold md:text-xl p-2 '>{item.heading}</h1>
                <p className='text-sm md:text-lg text-gray-300'>{item.subhead}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Belhome