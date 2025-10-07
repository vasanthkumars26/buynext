import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OrderSuccess = () => {
    const navigate = useNavigate()

useEffect(()=>{
    const timer = setTimeout(()=>{
    navigate("/orders")
},3000)
return()=>clearTimeout(timer)

},[navigate])

  return (
    <div className='mt-[30%] md:mt-[20%]' >OrderSuccess! <span className= ' text-2xl animate-bounce text-white bg-gradient-to-r from-green-500 to-white rounded-full p-2'  >✔️</span></div>
  )
}

export default OrderSuccess