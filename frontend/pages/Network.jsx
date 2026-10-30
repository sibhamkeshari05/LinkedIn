import React, { useContext, useEffect, useState } from 'react'
import Nav from '../src/components/Nav'
import axios from 'axios'
import { authDataContext } from '../src/context/AthContext'
import { userDataContext } from '../src/context/UserContext'
import dp from "../src/assets/dp.jpg"
import {RxCrossCircled} from "react-icons/rx"
import {IoIosCheckmarkCircleOutline} from "react-icons/io"
import io from "socket.io-client"

const socket = io(import.meta.env.VITE_SERVER_URL, {
    withCredentials: true
});

function Network() {

    let {serverUrl}= useContext(authDataContext)
    let {userData,setUserData}=useContext(userDataContext)
    let [connections,setConnections]=useState([])

    const handleGetRequest= async()=>{
        try {
            let result = await axios.get(`${serverUrl}/api/connection/requests`,{withCredentials:true})
            setConnections(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAcceptConnection=async(requestId)=>{
        try {
            let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`,{},{withCredentials:true})
            setConnections(connections.filter((con) => con._id !== requestId));
        } catch (error) {
            console.log("Accept Connection Error:", error);
            console.log("Backend Response:", error.response?.data);
            console.log("Status Code:", error.response?.status);


        }
    }

    const handleRejectConnection=async(requestId)=>{
        try {
            let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`,{},{withCredentials:true})
            setConnections(connections.filter((con) => con._id !== requestId));
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        handleGetRequest()
    },[])

  return (
    <div className='w-screen overflow-auto h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]'>
        <Nav />

        <div className='w-[90%] h-[100px] bg-[white] shadow-lg rounded-lg flex items-center px-[95px] py-[20px] text-[22px] text-gray-600'>
            Invitations {connections.length}
        </div>

        {connections.length>0 && 
         <div className="w-[100%] max-w-[800px] shadow-lg rounded-lg flex flex-col gap-[20px] min-h-[100px]">
            {connections.map((connection, index) => (
                <div className="w-full min-h-[100px] flex justify-between bg-white items-center">

                    <div className="flex justify-center items-center gap-[20px] pl-[20px]">
                        <div className="w-[60px] h-[60px] rounded-full overflow-hidden cursor-pointer" >
                            <img src={connection.sender.profileImg || dp} alt="" className="w-full h-full" />
                        </div>
                        <div className='text-[19px] font-semibold text-gray-700'>
                            {`${connection.sender.firstName} ${connection.sender.lastName}`}
                        </div>
                    </div>

                    <div className="flex justify-center items-center gap-[10px] pr-[15px]">
                        <button className='text-[#ff4d00] font-semibold 'onClick={()=>handleRejectConnection(connection._id)}>
                            <RxCrossCircled className='w-[35px] h-[35px]'/>
                        </button>
                        <button className='text-[#18c5ff] font-semibold ' onClick={()=>handleAcceptConnection(connection._id)}>
                            <IoIosCheckmarkCircleOutline className='w-[40px] h-[40px] ' />
                        </button>
                    </div>

                </div>
            ))}
         </div>
         }

        
    </div>
  )
}

export default Network
