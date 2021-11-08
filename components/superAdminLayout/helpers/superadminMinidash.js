import React , {useState, useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Link from 'next/Link';
import jwt from 'jwt-decode'
import { useRouter } from 'next/router'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));



export default function SimpleMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [picture , setPicture] = useState('')

  const router = useRouter()

  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  //get superadmin photo
  const getSuperAdminPhoto = async() =>{
    const token = localStorage.getItem('token')
    const id = jwt(token)._id
    await axios.get('http://localhost:3000/api/superAdmin/'+ id)
    .then(res => {
     setPicture(res.data.super_admin.picture)
    }).catch(err => {
      console.log(err)
    })
  }



  //logging out the super admin
  const logOut = async() => {
    const token = localStorage.getItem('token')
    const id = jwt(token)._id
    console.log(id)
    await axios.post('http://localhost:3000/api/superAdmin/logout/' + id)
    .then(res => {
      handleClose()
      localStorage.removeItem('token')
      router.push('/superadmin/login')
    })
    .catch(err => console.log(err))
  }

  useEffect (() => {
    getSuperAdminPhoto()
  }, [])

  return (
    <div>
      <Avatar alt="Remy Sharp" src={picture} className={classes.large}  onClick={handleClick}  />
      <Menu
        id="superadmin"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Link href="/superadmin/profile">
           <MenuItem onClick={handleClose}>My Account</MenuItem>
        </Link>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
