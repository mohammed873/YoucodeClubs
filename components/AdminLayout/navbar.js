import React , {useState, useEffect} from 'react';
import Link from 'next/link'
import jwt from 'jwt-decode'
import { useRouter } from 'next/router'
import axios from 'axios'
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import CategoryIcon from '@material-ui/icons/Category';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function navBar({children}) {
  const [responsive , setResponsive] = useState(false)
  const [shrink , setShrink] = useState(false)
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

   //logging out the  admin
   const logOut = async() => {
    const token = localStorage.getItem('adminToken')
    const id = jwt(token)._id
    console.log(id)
    await axios.post('http://localhost:3000/api/admin/logout/' + id)
    .then(res => {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    })
    .catch(err => console.log(err))
  }
 
 
  
  useEffect(() => {
      getAdminInfo();
      checkLogging();  
  }, [])

  return (
    <>
    <main>
       <div className="AdminMainBody">
         <div className={responsive ? 'adminResponsiveNavBar' : shrink ? 'shrinkMode' : 'adminNavBarContainer'}>
            <Link href="/admin/dashboard">
              <div className={shrink ? 'adminLogoContainerInShrinMode' : 'adminLogoContainer'}>
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
            <Link href="/admin/club">
              <div className='adminNavRouteContainer'>
                <span className='NavIcons'>
                  <CategoryIcon/>
                </span>
                <span className='adminNavRoutesTitle'>
                  Club Info    
                </span>
              </div>
            </Link>
              <div className={shrink ? "adminLogOutInShrinkMode" : "adminLogOut"} onClick={logOut}>
                <span className='NavIcons'>
                  <ExitToAppIcon/>
                </span>
                <span className='adminlogOutTitle'>
                  Log Out    
                </span>
              </div>
         </div>
         <div  className={shrink ? 'admincontentContainerInshrinkMode' : 'admincontentContainer'}>
           <div className={shrink ? 'adminPersonelDetailsInshrinkMode' : 'adminPersonelDetails'}>
             <span className='openAdminNavBar'  onClick={()=> setResponsive(true)}>
                <MenuIcon/>
             </span>
             {shrink ? 
                 <span className='shrinkModeIcons' onClick={()=> setShrink(false)}>
                  <UnfoldLessIcon/>
                </span>    
             :
                <span className='shrinkModeIcons' onClick={()=> setShrink(true)}>
                   <UnfoldMoreIcon/>
                </span>
              }
             <span>{admin && admin[0].full_name}</span>
             <div className="space"></div>
              <Link href="/admin/profile">
                <div className="adminImageContainer">
                  <img src={admin && admin[0].picture} alt="admin pictre" />
                </div>
               </Link>
           </div>
           <div className="blankDiv"></div>
            {children}
         </div>
       </div>
    </main>
    </>
  );
}
