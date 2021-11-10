import React , {useState, useEffect} from 'react';
import Link from 'next/link'
import MenuIcon from '@material-ui/icons/Menu';
import Menu from './helpers/superadminMinidash'
import CancelIcon from '@material-ui/icons/Cancel';
import HomeIcon from '@material-ui/icons/Home';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ChatIcon from '@material-ui/icons/Chat';
import CategoryIcon from '@material-ui/icons/Category';
import Image from 'next/image'
import jwt from 'jwt-decode'
import { useRouter } from 'next/router'
import axios from 'axios'


export default function Navbar({children}) {
    const [responsive, setResponsive] = useState(false)
    const [isLoggedIn , setIsloggedIn] = useState(false)

    const router = useRouter()

    //chekking if super admin is logged in
    const checkLogging = () => {
      try{
        if(!localStorage.getItem('token')){
            setIsloggedIn(false)
            router.push('/superadmin/login')
          }else{
            const token = localStorage.getItem('token')
            const isLoggedIn = jwt(token).isLoggedIn
            const role = jwt(token).role
            console.log(role, isLoggedIn)  
            if(role === 'superAdmin' && isLoggedIn === true ) {
                setIsloggedIn(true)
              }else{
                router.push('/superadmin/login')
            }
          }
      }
      catch (err){
          console.log(err)
      }
    }


    useEffect(() => {
        checkLogging();
    }, [])
  return (
    <>
       { isLoggedIn
         ?
         <div className="navContainer">
           <div className={responsive ? 'superAdminSlideSectionResponsive' : 'superAdminSlideSection'}>
             <div  className='iconsContainer'>
                 <span>
                    <Link href="/superadmin/dashboard">
                       <Image src="/logo.png" width={128} height={35} alt="youcode logo"/>
                    </Link>
                 </span>
                 <span className='icon' onClick={()=>setResponsive(false)}>
                    <CancelIcon/>
                 </span>
             </div>
             <div className='blankDiv'></div>
                <Link href="/superadmin/dashboard">
                    <div className='NavRouteContainer'>
                        <span className='NavIcons'>
                        <HomeIcon/>
                        </span>
                        <span className='NavRoutesTitle'>
                            Dashboard    
                        </span>
                    </div>
                </Link>
                <Link href="/superadmin/clubs">
                    <div className='NavRouteContainer'>
                        <span className='NavIcons'>
                            <CategoryIcon/>
                        </span>
                        <span className='NavRoutesTitle'>
                            Clubs
                        </span>
                    </div>
                </Link>
                <Link href="/superadmin/admins">
                    <div className='NavRouteContainer'>
                        <span className='NavIcons'>
                            <SupervisorAccountIcon/>
                        </span>
                        <span className='NavRoutesTitle'>
                            Admins
                        </span>
                    </div>
                </Link>
                <Link href="/superadmin/chat">
                    <div className='NavRouteContainer'>
                        <span className='NavIcons'>
                            <ChatIcon/>
                        </span>
                        <span className='NavRoutesTitle'>
                            Chat
                        </span>
                    </div>
                </Link>
           </div>
           <div className='superAdminContentSection' >
               <div className='superAdminMiniDashbordContainer'>
                  <div className='iconsContainer'>
                      <span className='icon' onClick={()=> setResponsive(true)}>
                         <MenuIcon/>
                      </span>
                      <span>
                          <Menu/>
                      </span>
                  </div>
               </div>
              <main className='superAdminMainContainer'>
                 <div className='blankDiv'></div>
                 {children}
              </main>
              <br/>
           </div>
       </div>
       : 
       null

       }
    </>
  );
}