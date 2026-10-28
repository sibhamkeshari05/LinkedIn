import React, { useContext, useEffect, useState } from 'react'
import dp from "../assets/dp.jpg"
import moment from "moment"
import {BiLike} from "react-icons/bi"
import {BiSolidLike} from "react-icons/bi"
import {FaRegCommentDots} from "react-icons/fa"
import {LuSendHorizontal} from "react-icons/lu"
import { authDataContext } from '../context/AthContext'
import axios from 'axios'
import { socket, userDataContext } from '../context/UserContext'
import ConnectionButton from './ConnectionButton'

function Post({id,auther,like,comment,description,image,createdAt}) {

    let [more,setMore]=useState(false)
    let {serverUrl}=useContext(authDataContext)
    let {userData,setUserData,getPost,handleGetProfile}=useContext(userDataContext)
    let [likes,setLikes]=useState(like || [])
    let [commentContent,setCommentContent]=useState("")
    let [comments,setComments]=useState(comment || [])
    let [showComment,setShowComment]=useState(false)

    const handleComment= async(e)=>{
        e.preventDefault()
       try {
        let result = await axios.post(serverUrl + `/api/post/comment/${id}`,{content:commentContent},{withCredentials:true})
        setComments(result.data.comment)
        setCommentContent("")
        
       } catch (error) {
        console.log("Comment Error:", error.response?.data);
        
       }
    }

    const handleLike= async()=>{
       try {
        let result = await axios.get(serverUrl + `/api/post/like/${id}`,
            {withCredentials:true})
        setLikes(result.data.like)
        
       } catch (error) {
        console.log(error);
        
       }
    }

    useEffect(()=>{
        socket.on("likeUpdated",({postId,likes})=>{
            if(postId==id){
                setLikes(likes)
            }
        })
        return ()=>{
            socket.off("likeUpdated")
        }
    },[id])

    useEffect(()=>{
        socket.on("commentAdded",({postId,comm})=>{
            if(postId==id){
                setComments(comm)
            }
        })
        return ()=>{
            socket.off("commentAdded")
        }
    },[id])

    useEffect(()=>{
        setLikes(like)
        setComments(comment)
    },[like,comment])

  return (
    <div className='w-full min-h-[2 00px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg p-[20px]'>
        <div className='flex justify-between items-center'>
            <div className='flex justify-center items-start gap-[10px]'
             onClick={()=>handleGetProfile(auther.userName)}>
                <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer'>
                    <img src={auther.profileImg || dp} alt="" className='h-full' />
                </div>
                <div>
                    <div className='text-[22px] font-semibold'>{`${auther.firstName} ${auther.lastName}`}</div>
                    <div className='text-[16px]'>{auther.headline}</div>
                    <div className='text-[16px]'>{moment(createdAt).fromNow()}</div>
                </div>
            </div>
            <div>
                {userData._id!=auther._id && 
                 <ConnectionButton userId={auther._id}/>
                 }
            </div>
        </div>
        <div className={`w-full ${!more?"max-h-[100px] overflow-hidden":""} pl-[40px]`}>{description}</div>
        <div className='pl-[40px] text-[17px] font-semibold cursor-pointer' onClick={()=>setMore(prev=>!prev)}>{more?"read less...":"read more...    "}</div>

        {image && 
        <div className='w-full h-[300px] overflow-hidden flex justify-center rounded-lg'>
            <img src={image} alt="" className='h-full rounded-lg'/>
        </div>
        }

        <div>
            <div className="w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500">
                <div className="flex items-center justify-center gap-[5px] text-[18px]">
                    <BiLike className="text-[#1ebbff] w-[20px] h-[20px]" />
                    <span>{likes?.length || 0}</span>
                </div>

                <div className="flex items-center justify-center gap-[5px] text-[18px] cursor-pointer"
                 onClick={()=>setShowComment(prev=>!prev)}>
                    <span>{comment?.length || 0}</span>
                    <span>comments</span>
                </div>
            </div>

            <div className='flex justify-start items-center w-full p-[20px] gap-[20px]'>
                {!likes.includes(userData._id) && 
                 <div className='flex justify-center items-center gap-[5px] cursor-pointer'>
                    <BiLike className='w-[24px] h-[24px]'
                    onClick={handleLike}/>
                    <span onClick={handleLike}>Like</span>
                 </div>
                }
                {likes.includes(userData._id) && 
                 <div className='flex justify-center items-center gap-[5px]'>
                    <BiSolidLike className='w-[24px] h-[24px] text-[#1ebbff]'
                    onClick={handleLike}/>
                    <span className="cursor-pointer text-[#1ebbff]" onClick={handleLike}>Liked</span>
                 </div>
                }
                
                <div className='flex justify-center items-center gap-[5px] cursor-pointer'
                 onClick={()=>setShowComment(prev=>!prev)}>
                    <FaRegCommentDots className='w-[24px] h-[24px]'/>
                    <span >comment</span>
                </div>
            </div>

            {showComment && 
             <div>
                <form className="w-full flex justify-between items-center border-b-2 border-gray-300 p-[10px]"
                 onSubmit={handleComment}>
                    <input
                        type="text"
                        placeholder="leave a comment"
                        className="outline-none border-none"
                        value={commentContent} onChange={(e)=>setCommentContent(e.target.value)}
                    />

                    <button>
                        <LuSendHorizontal className="text-[#07a4ff] w-[22px] h-[22px]" onClick={handleComment}/>
                    </button>
                </form>
                <div className='flex flex-col gap-[20px]'>
                    {comments.map((com) => (
                        <div className='flex flex-col gap-[20px] border-b-2 p-[20px] border-b-gray-300'>
                            <div className="w-full flex justify-start items-center gap-[10px]">
                                <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
                                    <img
                                        src={com.user.profileImg || dp}
                                        alt=""
                                        className="h-full"
                                    />
                                </div>
                                <div>
                                    <div className="text-[16px] font-semibold">
                                        {`${com.user.firstName} ${com.user.lastName}`}
                                    </div>
                                    <div>{moment(com.createdAt).fromNow()}</div>
                                </div>
                            </div>
                            <div className='pl-[50px]'>{com.content}</div>
                        </div>
                    ))}
                </div>
             </div>
            }
        </div> 
    </div>
  )
}

export default Post