import React, { useContext, useState } from 'react'
import logo from "../src/assets/logo.svg"
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../src/context/AthContext'
import axios from 'axios'
import { userDataContext } from '../src/context/UserContext'

function Login() {
    let [show,setShow]=useState(false)
    let {serverUrl}=useContext(authDataContext)
    let {userData,setUserData,getPost}=useContext(userDataContext)
    let navigate = useNavigate()

    let [email,setEmail]=useState("")
    let [password,setPassword]=useState("")
    let[loading,setLoading]=useState(false)
    let [err,setErr]=useState("")
    
    const handleLogIn= async(e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(serverUrl + "/api/auth/login",{
                email,
                password
            },{withCredentials:true})

            setUserData(result.data)

            await getPost()
            
            navigate("/")
            setErr("")
            setLoading(false)
            setEmail("")
            setPassword("")

        } catch (error) {
            console.log(error);
            setErr(error.response.data.message)
            setLoading(false)
            }
    }

  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
            <div className='p-[30px] lg:p-[35px] w-full flex items-center'>
              <img src={logo} alt="" />
            </div>
            <form className="w-[90%] max-w-[400px] h-[400px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]"
                onSubmit={handleLogIn}>
                <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px]">
                    Log In               
                </h1>
    
                <input
                    type="email"
                    placeholder="email"
                    required
                    className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
                    value={email} onChange={(e)=>setEmail(e.target.value)}
                />
    
                <div className="w-[100%] h-[50px]  text-gray-800 text-[18px] rounded-md relative "  >
                    <input
                        type={show?"text":"password"}
                        placeholder="password"
                        required
                        className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md"
                        value={password} onChange={(e)=>setPassword(e.target.value)}
                    />
                    <span 
                      className='absolute right-[20px] top-[10px] font-semibold text-[#0A66C2] cursor-pointer' 
                      onClick={()=>setShow(prev=>!prev)}>
                        {show?"hide":"show"}
                    </span>
                </div>
    
                {err && <p className='text-center text-red-500'>
                  *{err}
                </p>}
                <button className="w-[100%] h-[50px] rounded-full bg-[#0A66C2] mt-[35px] text-white" disabled={loading}>
                  {loading?"loading...":"Log In"}
                </button>
                <p className="mt-2 text-center text-sm text-gray-700 cursor-pointer"
                    onClick={()=>navigate("/signup")}>
                    Create an account?{" "}
                    <a href="/signup" className="font-semibold text-[#0A66C2] hover:underline">
                        Sign Up
                    </a>
                </p>
              
            </form>
        </div>
  )
}

export default Login