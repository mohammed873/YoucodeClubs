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


export default function AdminInfo() {
   const [admin , setAdmin] = useState()
    //intialize
    const router = useRouter()

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
    setAnchorEl(null);
    };

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

  useEffect (() => {
    getAdminInfo()
  },[])
  return (
    <>
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
    </>
  );
}
