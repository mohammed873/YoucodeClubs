import React , {useState, useEffect} from 'react';
import Link from 'next/link'
import jwt from 'jwt-decode'
import { useRouter } from 'next/router'
import axios from 'axios'
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

export default function navBar({children}) {
  const [responsive , setResponsive] = useState(false)
  const [admin , setAdmin] = useState()
  const router = useRouter()

  //chekking if admin is logged in
  const checkLogging = () => {
  
    try{
      if(!localStorage.getItem('adminToken')){
          router.push('/admin/login')
        }else{
        
          // const token = localStorage.getItem('token')
          // const isLoggedIn = jwt(token).isLoggedIn
          // const role = jwt(token).role
          // console.log(role, isLoggedIn)  
          // if(role === 'superAdmin' && isLoggedIn === true ) {
          //     // all is goood
          //   }else{
          //     router.push('/superadmin/login')
          // }
        }
    }
    catch (err){
        console.log(err)
    }
  }

  //get admin personel info
  const getAdminInfo = async () => {
    const admin_token = localStorage.getItem('adminToken')
    const id = jwt(admin_token)._id

    await axios.get('http://localhost:3000/api/admin/profile/' + id)
     .then(res => {
       setAdmin(res.data.admin)
     }).catch(err => {
       console.log(err);
     })
  }

 
 
  
  useEffect(() => {
      getAdminInfo();
      checkLogging();  
  }, [])

  return (
    <>
    <main>
       <div className="AdminMainBody">
         <div className={responsive ? 'adminResponsiveNavBar' : 'adminNavBarContainer'}>
            <Link href="/admin/dashboard">
              <div className="adminLogoContainer">
                <img src="/logo.png" alt="logo" />
              </div>
            </Link>
            <span className='closeAdminNavBar' onClick={()=>setResponsive(false)}>
               <CloseIcon/>
            </span>
            <Link href="/admin/dashboard">
              <div className='adminNavRouteContainer'>
                <span className='NavIcons'>
                  <HomeIcon/>
                </span>
                <span className='adminNavRoutesTitle'>
                  Dashboard    
                </span>
              </div>
            </Link>
         </div>
         <div  className="admincontentContainer">
           <div className="adminPersonelDetails">
             <span className='openAdminNavBar'  onClick={()=> setResponsive(true)}>
                <MenuIcon/>
             </span>
             <span>{admin && admin[0].full_name}</span>
             <div className="space"></div>
             <div className="adminImageContainer">
               <img src={admin && admin[0].picture} alt="admin pictre" />
             </div>
           </div>
            {children}
         </div>
       </div>
    </main>
    </>
  );
}
