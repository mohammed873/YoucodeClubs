
import Head from 'next/head';
import React , {useEffect , useState} from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import jwt from 'jwt-decode'

export default function userProfileImage() {
    const[user , setUser] = useState([])

    //intialize
    const router = useRouter()

    //fetch user info
    const fetchUserInfo = async () => {
        const token = localStorage.getItem('userToken')
        const id = jwt(token)._id

        await axios.get('https://youcode-clubs.vercel.app/api/user/profile/' + id)
            .then (res => {
            setUser(res.data.fetched_user);
            }).catch(err => {
            console.log(err.response.data.message);
        })
    }


    //redirect to user profile page
    const redirectToUserProfile = async () => {
        await router.push('/user/profile/')
    }

    useEffect (() => {
        fetchUserInfo()
    },[])
  return (
    <>
        <img 
            src={user && user.picture} 
            alt = "user  picture" 
            onClick={()=> redirectToUserProfile(1)} 
        /> 
    </>
  );
}
