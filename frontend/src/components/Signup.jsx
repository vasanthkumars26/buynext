import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import auth from '../../config/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth"


const Signup = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [cpass, setCpass] = useState('')
  const navigate = useNavigate()

  const [err, setErr] = useState('')

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home")
      }
    })

  }, []);

  const handleuser = (e) => {
    e.preventDefault()
    if (pass != cpass) {
      setErr("Passwords mismatch..")
      return
    }
    createUserWithEmailAndPassword(auth, email, pass).then((res) => {
      console.log(res)
    }).catch((error) => {
      console.log("Error")
      setErr(error.message)
    })

    console.log("User Registered!!", { name, email })
    navigate("/", { state: { name } })

  }

  return (
    <div className='mt-[22%] md:mt-[8%]'>

      <form onSubmit={handleuser} >
        <h2 className='mb-5 text-3xl font-bold p-2 ' >SignUp</h2>
        <div className='flex flex-col text-start ml-[30%] '>
          <label className='text-start '>Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder='Name..'
            className='outline-none p-2  border border-gray-200 rounded-xl w-[60%]' required /><br /><br />
        </div>
        <div className='flex flex-col text-start ml-[30%] '>
          <label className='text-start '>Email:</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email..'
            className='outline-none p-2  border border-gray-200 rounded-xl w-[60%]' required /><br /><br />
        </div>
        <div className='flex flex-col text-start ml-[30%] '>
          <label className='text-start'>Password:</label>
          <input value={pass} onChange={(e) => setPass(e.target.value)} type="text" placeholder='Password..'
            className='outline-none p-2 border border-gray-200 rounded-xl w-[60%]' required /><br /><br />
        </div>

        <div className='flex flex-col text-start ml-[30%] '>
          <label className='text-start'>Confirm password:</label>
          <input value={cpass} onChange={(e) => setCpass(e.target.value)} type="text" placeholder='Confirm password..'
            className=' outline-none p-2 border border-gray-200 rounded-xl w-[60%]' required /></div>

        {err && <p className='text-red-500 mt-2 animate-pulse' >{err}</p>}

        <button type='submit' className=' mt-4 bg-gradient-to-r from-green-300 to-green-500 hover:from-green-500 hover:to-green-300 hover:shadow-xl hover:animate-pulse hover:-translate-y-1 p-2 rounded-md' >Signup</button>

      </form>

      <p className='mt-3'>Already account exists?<Link to="/" className='text-blue-500 underline' >Login here!</Link> </p>
    </div>
  )
}

export default Signup