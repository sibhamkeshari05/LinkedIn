import React, { useContext, useEffect, useState } from 'react'
import Nav from '../src/components/Nav'
import { authDataContext } from '../src/context/AthContext'
import axios from 'axios'
import dp from "../src/assets/dp.jpg"
import { RxCross1 } from "react-icons/rx"

function Notification() {

    let {serverUrl}=useContext(authDataContext)
    let [notificationData,setNotificationData]=useState([])

    const handleGetNotification=async()=>{
        try {
            let result = await axios.get(serverUrl + "/api/notification/get",{withCredentials:true})
            setNotificationData(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteNotification=async(id)=>{
        try {
            let result = await axios.delete(serverUrl + `/api/notification/deleteone/${id}`,{withCredentials:true})
            await handleGetNotification()
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteAllNotification=async()=>{
        try {
            let result = await axios.delete(serverUrl + "/api/notification",{withCredentials:true})
            await handleGetNotification()
        } catch (error) {
            console.log(error)
        }
    }

    function handleMessage(type){
        if(type=="like"){
            return "Liked your post."
        }else if(type=="comment"){
            return "Commented on your post."
        }else{
            return "Accepted your request."
        }
    }


    useEffect(()=>{
        handleGetNotification()
    },[])

  return (
    <div className='w-screen  h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]'>
        <Nav/>
        
        <div className='w-[90%]  bg-[white] shadow-lg rounded-lg flex justify-between items-center px-[10px] py-[20px]  text-gray-600'>

            <div className='text-[22px]' >
                Notifcations {notificationData.length}
            </div>
            
            {notificationData.length>0 && 
                <button className='flex justify-center items-center rounded-lg text-[16px] min-w-[90px] border-2 border-gray-500 hover:bg-gray-200 cursor-pointer' onClick={()=>handleDeleteAllNotification()}>Delete all</button>
            }
        </div>

        {notificationData.length>0 && 
            <div className="w-[100%] overflow-auto max-w-[900px] bg-white shadow-lg rounded-lg pt-[10px] px-[10px] gap-[10px] flex flex-col">
                {notificationData.map((noti, index) => (

                    <div className="w-full min-h-[80px] flex justify-between items-center px-[20px] border-b-2 border-b-gray-300 "key={index}>

                        <div className='w-full'>

                            <div className="flex justify-start items-center gap-[15px]  ">

                                <div className="w-[45px] h-[45px] rounded-full overflow-hidden  cursor-pointer" >
                                    <img src={noti.relatedUser?.profileImg || dp} alt="" className="w-full h-full" />
                                </div>

                                <div className='text-[16px] font-semibold text-gray-700'>
                                    {`${noti.relatedUser?.firstName || ""} ${noti.relatedUser?.lastName || ""}`} {handleMessage(noti.type)}
                                </div>  

                            </div>
                            
                            {noti.relatedPost && 

                                <div className='flex justify-start pl-[80px] h-[50px] m-h-[600px] pb-[10px] overflow-hidden'>

                                    <div className='w-[80px] h-[35px]'>
                                        <img src={noti.relatedPost.image || ""} alt="" className='h-full overflow-hidden' />
                                    </div>

                                    <div>
                                        {noti.relatedPost.description}
                                    </div>
                                    
                                </div>
                            }
                        </div>
                        

                        <div className='flex items-center '
                         onClick={()=>handleDeleteNotification(noti._id)}>
                            <RxCross1 className='w-[30px] h-[30px] text-gray-800 font-bold cursor-pointer' />
                        </div>

                    </div>
                ))}

            </div>

        }

    </div>
  )
}

export default Notification
