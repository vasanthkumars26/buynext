import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link,useLocation, useNavigate } from 'react-router-dom'
import auth from '../../config/firebase'

const Login = () => {

const location = useLocation()
  const passedname = location.state?.name || ""

  const navigate = useNavigate()

  const [name,setName] = useState(passedname)
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const [err,setErr] = useState('')
  
useEffect(()=>{
  window.scrollTo(0,0)

  auth.onAuthStateChanged((user)=>{
    if(user){
      navigate("/home")
    }
  })
},[])

  const handlelogin = (e)=>{
    e.preventDefault()

    signInWithEmailAndPassword(auth,email,pass).then((res)=>{
      navigate("/home")
      console.log("User Logged in!")
  }).catch((err)=>{
    setErr("Passwords mismatch..")
    console.log("Error Logging in..",err)
  })
  }

  return (
    <div className='mt-[28%] md:mt-[8%]'>
      <form onSubmit={handlelogin}>
        <h2 className='mb-5 text-3xl font-bold p-2 ' >Hey {name}!You Can Login Here👇🏼</h2>

        <div className='flex flex-col text-start ml-[30%]'> 
        <label  className='text-start '>Name:</label>
        <input value={name} onChange={(e)=>setName(e.target.value)} type="text" 
        placeholder='Name..' className='outline-none p-2  border border-gray-200
         rounded-xl w-[60%]' required/><br/><br />
       </div>

        <div className='flex flex-col text-start ml-[30%] '> 
        <label  className='text-start '>Email:</label>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" 
        placeholder='Email..' className='outline-none p-2  border border-gray-200
         rounded-xl w-[60%]' required/><br/><br />
       </div>

       <div className='flex flex-col text-start ml-[30%] '>
        <label className='text-start'>Password:</label>
        <input value={pass} onChange={(e)=>setPass(e.target.value)} type="text"
         placeholder='Password..'className='outline-none p-2 border border-gray-200 
         rounded-xl w-[60%]' required/><br/><br />
       </div>

        {err && <p className='text-red-500 mt-2 animate-pulse' >{err}</p>}

          <button type='submit' className=' mt-4 bg-gradient-to-r
           from-green-300 to-green-500 hover:from-green-500 hover:to-green-300 p-2 
           rounded-md' >Login</button>
      
      </form>

        <p>Don't have an account? <Link to="/signup" className='text-blue-500 underline' >Register here!</Link></p>
    </div>

  )
}

export default Login