import React , {useState, useEffect} from 'react';
import Link from 'next/link'
import jwt from 'jwt-decode'
import { useRouter } from 'next/router'
import axios from 'axios'
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import CategoryIcon from '@material-ui/icons/Category';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ChatIcon from '@material-ui/icons/Chat';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';


export default function navBar({children}) {
  const [responsive , setResponsive] = useState(false)
  const [shrink , setShrink] = useState(false)
  const [admin , setAdmin] = useState()
  const router = useRouter()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      handleClose()
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
            <Link href="/admin/activity">
              <div className='adminNavRouteContainer'>
                <span className='NavIcons'>
                  <BurstModeIcon/>
                </span>
                <span className='adminNavRoutesTitle'>
                  Club Activity    
                </span>
              </div>
            </Link>
            <Link href="/admin/activity">
              <div className='adminNavRouteContainer'>
                <span className='NavIcons'>
                  <ChatIcon/>
                </span>
                <span className='adminNavRoutesTitle'>
                  Groub Chat    
                </span>
              </div>
            </Link>
         </div>
         <div  className={shrink ? 'admincontentContainerInshrinkMode' : 'admincontentContainer'}>
           <div className={shrink ? 'adminPersonelDetailsInshrinkMode' : 'adminPersonelDetails'}>
             <span className='openAdminNavBar'  onClick={()=> setResponsive(true)}>
                <MenuIcon/>
             </span>
             {shrink ? 
                 <span className='shrinkModeIcons' onClick={()=> setShrink(false)}>
                  <FullscreenIcon/>
                </span>    
             :
                <span className='shrinkModeIcons' onClick={()=> setShrink(true)}>
                   <FullscreenExitIcon/>
                </span>
              }
             <span>{admin && admin[0].full_name}</span>
             <div className="space"></div>
           
                <div className="adminImageContainer"  onClick={handleClick}>
                  <img src={admin && admin[0].picture} alt="admin pictre" />
                </div>
    
               <Menu
                  id="fade-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <Link href="/admin/profile">
                     <MenuItem>My account</MenuItem>
                  </Link>
                  <MenuItem onClick={logOut}>Logout</MenuItem>
                </Menu>
           </div>
           <div className="blankDiv"></div>
            {children}
         </div>
       </div>
    </main>
    </>
  );
}
