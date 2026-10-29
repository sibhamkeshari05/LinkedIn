import React, { useContext, useEffect, useState } from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5"
import { TiHome } from "react-icons/ti"
import { FaUserGroup } from "react-icons/fa6"
import {IoNotificationsSharp} from "react-icons/io5"
import dp from "../assets/dp.jpg"
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AthContext'
import axios from 'axios'

function Nav() {
  
  let [activeSearch,setActiveSearch]=useState(false)
  let {userData,setUserData,handleGetProfile}=useContext(userDataContext)
  let [showPopup,setShowPopup]=useState(false)
  let navigate = useNavigate()
  let {serverUrl}=useContext(authDataContext)
  let [searchInput,setSearchInput]=useState("")
  let [searchData,setSearchData]=useState([])
  let [query, setQuery] = useState("");

  const handleSignOut = async()=>{
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout",{withCredentials:true})
      setUserData(null)
      navigate("/login")
      console.log(result);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  const handleSearch=async(query)=>{
    if (!query?.trim()) {
      setSearchData([])
      return;
    }
      try {
        let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials:true})
        setSearchData(result.data)
      } catch (error) {
        setSearchData([])
        console.log(error);
      }
  }

  useEffect(()=>{
      handleSearch(searchInput)
  },[searchInput])
 
  return (
    <div className="w-full h-[80px] bg-[white] fixed top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]">
      <div className="flex justify-center items-center gap-[10px] ">
        <div onClick={()=>{
          setActiveSearch(false)
          navigate("/")
        }}>
          <img src={logo2} alt="" className="w-[50px]" />
        </div>

        {!activeSearch && 
         <div>
           <IoSearchSharp className="w-[23px] h-[23px] text-gray-600 lg:hidden" onClick={()=>{setActiveSearch(true)}} />
         </div>
        }
        
        {searchData.length>0 &&
          <div className='absolute top-[90px] min-h-[100px] lg:h-[400px] rounded-lg overflow-auto left-0 lg:left-[20px] shadow-lg w-[100%] lg:w-[500px] bg-white flex flex-col p-[20px] '>
            {searchData.map((sea) => (
                <div className='flex gap-[15px] items-center border-b-2 rounded-lg border-b-gray-300 p-[10px] hover:bg-gray-200 cursor-pointer' key={sea._id}
                 onClick={()=>handleGetProfile(sea.userName)}>
                    <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                        <img src={sea.profileImg || dp} alt='' className='w-full h-full' />
                    </div>
                    <div>
                      <div className='text-[17px] font-semibold text-gray-700'>{`${sea.firstName} ${sea.lastName}`}</div>
                      <div className='text-[12px] font-semibold text-gray-700'>{`${sea.headline}`}</div>
                    </div>
                </div>
            ))}
        </div>
        }
        


        <form className={`w-[190px] lg:w-[350px] h-[40px] bg-[#f0efef] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activeSearch?"hidden":"flex"} `}>

          <div>
            <IoSearchSharp className="w-[23px] h-[23px] text-gray-600" />
          </div>

          <input
            type="text"
            className="w-[80%] h-full bg-transparent outline-none border-0"
            placeholder="search users..."
            value={searchInput} 
            onChange={(e)=>setSearchInput(e.target.value)}/>

        </form>
      </div>
      
      <div className="flex justify-center items-center gap-[20px] ">
        {showPopup && 
          <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[90px]  rounded-lg flex flex-col items-center p-[20px] gap-[20px] right-[20px] lg:right-[160px] '>
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
              <img src={userData.profileImg || dp} alt="" className="w-full h-full" />
            </div>

            <div className='text-[19px] font-semibold text-gray-700'>
              {`${userData?.firstName} ${userData?.lastName}`}
            </div>

            <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]'
             onClick={()=>handleGetProfile(userData.userName)}>
              View Profile
            </button>

            <div className='w-full h-[1px] bg-gray-700'></div>

            <div className="flex w-full items-center justify-start text-gray-600 gap-[10px]"
             onClick={()=>navigate("/network")}>
              <FaUserGroup className="w-[23px] h-[23px] text-gray-600" />
              <div className="cursor-pointer">My Networks</div>
            </div>

            <button className='w-[100%] h-[40px] rounded-full border-2 border-[#e03737] text-[#e03737]'
            onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        }
        
        <div className="lg:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer" onClick={()=>navigate("/")}>
          <TiHome className="w-[23px] h-[23px] text-gray-600" />
          <div>Home</div>
        </div>

        <div className="md:flex flex-col items-center justify-center text-gray-600 hidden"
         onClick={()=>navigate("/network")}>
          <FaUserGroup className="w-[23px] h-[23px] text-gray-600" />
          <div className="cursor-pointer">My Networks</div>
        </div>

        <div className="flex flex-col items-center justify-center cursor-pointer text-gray-600 "
         onClick={()=>navigate("/notification")}>
          <IoNotificationsSharp className="w-[23px] h-[23px] text-gray-600" />
          <div className='hidden md:block'>Notifications</div>
        </div>

        <div className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer" onClick={()=>setShowPopup(prev=>!prev)} >
          <img src={userData.profileImg || dp} alt="" className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}

export default Nav