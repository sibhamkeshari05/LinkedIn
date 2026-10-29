import React, { useContext, useEffect, useState } from 'react'
import Nav from '../src/components/Nav'
import dp from "../src/assets/dp.jpg"
import {FiPlus} from "react-icons/fi"
import {FiCamera} from "react-icons/fi"
import {HiPencil} from "react-icons/hi2"
import { RxCross1 } from "react-icons/rx"
import {BsImage} from "react-icons/bs"
import { userDataContext } from '../src/context/UserContext'
import EditProfile from '../src/components/EditProfile'
import axios from 'axios'
import { authDataContext } from '../src/context/AthContext'
import Post from '../src/components/Post'
import ConnectionButton from '../src/components/ConnectionButton'

function Profile() {
    
    let {serverUrl}=useContext(authDataContext)
    let {userData,setUserData,edit,setEdit,postData,setPostData,profileData,setProfileData}=useContext(userDataContext)
    let [profilePost,setProfilePost]=useState([])

    useEffect(()=>{
        setProfilePost(postData.filter((post)=>post.auther._id==profileData._id))
    },[profileData])


  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px]">
        <Nav/>
        { edit && 
         <EditProfile/>
         }
        
        <div className="w-full max-w-[800px] min-h-[100vh] flex flex-col gap-[10px]">

            <div className="relative bg-[white] pb-[10px] rounded-lg shadow-lg">
                <div className='w-[100%] h-[200px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer'
                    onClick={()=>{setEdit(true)}}>
                    <img src={profileData.coverImg || ""} alt="" className='w-full'/>
                    <FiCamera className=' absolute right-[20px] top-[20px] w-[25px] h-[25px] text-white cursor-pointer'/>
                </div>
                
                <div className='w-[100px] h-[100px] rounded-full overflow-hidden items-center justify-center absolute top-[135px] left-[90px]'
                    onClick={()=>{setEdit(true)}}>
                    <img src={profileData.profileImg || dp} alt="" className='h-full' />
                </div>
                
                <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[205px] left-[167px] rounded-full flex justify-center items-center cursor-pointer'>
                    <FiPlus className='text-white'onClick={()=>{setEdit(true)}}/>
                </div>
                
                <div className='mt-[45px] pl-[30px] gap-[50px] text-[19px] font-semibold text-gray-700 '>

                    <div className='font-bold text-[25px]'>{`${profileData.firstName} ${profileData.lastName}`}</div>
                
                    <div className='text-[17px] font-semibold text-gray-700'>
                    {profileData.headline || ""}
                    </div>
                
                    <div className='text-[16px] text-gray-500'>
                    {profileData.location}
                    </div>

                    <div className='text-[16px] text-gray-500'>
                    {`${profileData.connection.length} connection`}
                    </div>

                </div>

                {profileData._id==userData._id &&
                 <button className='min-w-[140px] ml-[30px] h-[35px] my-[10px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]'
                    onClick={()=>{setEdit(true)}}>
                    Edit Profile <HiPencil/>
                </button>
                }
                
                {profileData._id != userData._id &&
                 <div className='ml-[65px] my-[10px]'>
                  <ConnectionButton userId={profileData._id} />
                 </div>
                }
                
            </div>
            <div className='w-full h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>
                {`Post (${profilePost.length})`}
            </div>
            {profilePost.map((post,index)=>(
                <Post key={index} id={post._id} description={post.description} auther={post.auther} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt}/>
            ))}

            {profileData.skills.length>0 && 
                <div className='w-full min-h-[100px] flex p-[20px] flex-col gap-[10px] justify-center  font-semibold bg-white shadow-lg rounded-lg'>

                    <div className='flex flex-row items-center justify-between'>
                        <div className='text-[22px] text-gray-600'>
                            Skills
                        </div>

                        {profileData._id==userData._id &&
                         <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]'
                         onClick={()=>{setEdit(true)}}>
                            Add Skills
                        </button>
                         }
                    </div>
                    
                    <div className='flex flex-wrap p-[20px] justify-start items-center gap-[20px] text-gray-600'>
                        {profileData.skills.map((skill)=>(
                            <div className='text-[18px]'>{skill}</div>
                        ))}
                    </div>
                </div> 
            }

            {profileData.education.length>0 && 
                <div className='w-full min-h-[100px] flex p-[20px] flex-col gap-[10px] justify-center  font-semibold bg-white shadow-lg rounded-lg'>

                    <div className='flex flex-row items-center justify-between'>
                        <div className='text-[22px] text-gray-600'>
                            Education
                        </div>
                         {profileData._id==userData._id &&
                          <button className='min-w-[140px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]'
                            onClick={()=>{setEdit(true)}}>
                            Add Educatoin
                          </button>
                         }
                    </div>
                    
                    <div className='flex flex-col p-[20px] justify-start  gap-[20px] text-gray-600'>
                        {profileData.education.map((edu)=>(
                            <>
                            <div className='text-[18px]'>College  :  {edu.college}</div>
                            <div className='text-[18px]'>Degree  :  {edu.degree}</div>
                            <div className='text-[18px]'>Field Of Study  :  {edu.fieldOfStudy}</div>
                            </>
                        ))}
                    </div>
                </div> 
            }

            {profileData.experience.length>0 && 
                <div className='w-full min-h-[100px] flex p-[20px] flex-col gap-[10px] justify-center  font-semibold bg-white shadow-lg rounded-lg'>

                    <div className='flex flex-row items-center justify-between'>
                        <div className='text-[22px] text-gray-600'>
                            Experience
                        </div>
                         {profileData._id==userData._id &&
                         <button className='min-w-[140px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[10px]'
                         onClick={()=>{setEdit(true)}}>
                            Add Experience
                        </button>
                         }
                        
                    </div>
                    
                    <div className='flex flex-col p-[20px] justify-start  gap-[20px] text-gray-600'>
                        {profileData.experience.map((exp)=>(
                            <>
                            <div className='text-[18px]'>Title  :  {exp.title}</div>
                            <div className='text-[18px]'>Company  :  {exp.company}</div>
                            <div className='text-[18px]'>Discription  :  {exp.description}</div>
                            </>
                        ))}
                    </div>
                </div> 
            }
        </div>
    </div>
  )
}

export default Profile
