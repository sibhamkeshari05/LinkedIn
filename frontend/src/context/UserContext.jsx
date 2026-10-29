import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
export const userDataContext=createContext()
import io, { Socket } from "socket.io-client"

export let socket = io("https://linkedin-backend-kcwx.onrender.com")

function UserContext({children}) {

    let [userData,setUserData]=useState(null)
    let [edit,setEdit]=useState(false)
    let {serverUrl}=useContext(authDataContext)
    let [postData,setPostData]=useState([])
    let [profileData,setProfileData]=useState([])
    let navigate=useNavigate()

    const getCurrentUser=async()=>{
        try {
            let result = await axios.get(serverUrl + "/api/user/currentuser",
            {withCredentials:true})
            setUserData(result.data)
            console.log("API response:",result.data);
            

        } catch (error) {
            console.log(error);
            setUserData(null)
        }
    }

    const getPost=async ()=>{
        try {
            let result = await axios.get(serverUrl + "/api/post/getpost",{withCredentials:true})
            console.log(result);
            setPostData(result.data)
            
        } catch (error) {
            
        }
    }

    const handleGetProfile =async(userName)=>{
        try {
            let result = await axios.get(serverUrl +`/api/user/profile/${userName}`,{withCredentials:true})
            setProfileData(result.data)
            navigate("/profile")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getCurrentUser()
        getPost()
    },[])

    const value ={
        userData,setUserData,
        edit,setEdit,
        postData,setPostData,
        getPost,
        handleGetProfile,
        profileData,setProfileData
    }

  return (
    <div>
        <userDataContext.Provider value={value}>
           {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext
