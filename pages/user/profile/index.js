import Head from 'next/head';
import React , {useState , useEffect} from 'react';
import styles from '../../../styles/userProfile.module.css';
import axios from 'axios';
import jwt from 'jwt-decode';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from '@material-ui/core/Dialog';
import SaveIcon from '@material-ui/icons/Save';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function Pofile() {
  const [editStyleForEmail , setEditStyleForEmail] = useState(false);
  const [editStyleForName , setEditStyleForName] = useState(false);
  const [user , setUser] = useState([]);
  const [club , setClub] = useState([]);
  const [clubs , setClubs] = useState([]);
  const [picture , setPicture] = useState("")

  const [club_id , setClub_id] = useState("")

  const[password , setPassword] = useState('')
  const [newPassword , setNewPassword] = useState("")


  //related to material ui dailog
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
      setOpen(true);
  };
  
  const handleClose = () => {
      setOpen(false);
  };  


  //fetch user info 
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('userToken')
    const id = jwt(token)._id

    await axios.get('http://localhost:3000/api/user/profile/' + id)
         .then (res => {
           setUser(res.data.fetched_user);
         }).catch(err => {
           console.log(err.response.data.message);
         })
  }

  const updateUserInfo = async () => {
    const token = localStorage.getItem('userToken')
    const id = jwt(token)._id

   const  full_name = document.getElementById('full_name').value;
   const email = document.getElementById('email').value;
   const picture = await pictureUpload();

     await axios.put('http://localhost:3000/api/user/profile/' + id,{
       full_name,
       email,
       picture
     }).then(res =>{
       toast.configure()
       toast.success(res.data.message)
       fetchUserInfo()
     }).catch(err => {
      toast.configure()
      toast.error(err.response.data.message)
     })
  }

  
  //fetch user club info
  const fetchClubInfo = async () => {
     const token = localStorage.getItem('userToken')
     const id = jwt(token).club_id

     await axios.get('http://localhost:3000/api/superAdmin/clubs/' + id)
          .then(res =>{
            setClub(res.data.club)
          }).catch(err => {
            console.log(err)
          })
  }


  //uploading image using cloudinary
  const pictureUpload = async () => {

      const data = new FormData()
      data.append("file", picture ||user && user.picture)
      data.append("upload_preset", "youcodeClubs")
      data.append("cloud_name", "dtq13h9rg" )


      const res = await fetch("	https://api.cloudinary.com/v1_1/dtq13h9rg/image/upload",{
      method : "POST",
      body : data
      })
      const res2 = await res.json() 
      return res2.url
  } 

//emptyInputs
const emptyInputs = () => {
  document.querySelector('#password').value = ''
  document.querySelector('#NewPassword').value = ''
}
  
//ResetPassword
const ressetPassword = async (req, res) => {
  const token = localStorage.getItem('userToken')
  const id = jwt(token)._id
   await axios.put('http://localhost:3000/api/user/resetPassword/' + id,{
     password,
     newPassword
   })
   .then(res => {
      fetchUserInfo()
      emptyInputs()
      toast.configure()
      toast.success(res.data.message)
   }).catch(err => {
      toast.configure()
      toast.error(err.response.data.message)
   })
}

 const fetchAllClubs = async() => {
     await axios.get('http://localhost:3000/api/superAdmin/clubs')
     .then(res =>{
       setClubs(res.data.clubs)
     }).catch(err => {
       console.log(err)
     })
 }

 const changeClub = async () => {
    const token = localStorage.getItem('userToken')
    const id = jwt(token)._id
    await axios.put('http://localhost:3000/api/user/changeClub/' + id,{
      club_id,
    }).then(res => {
      toast.configure()
      toast.success(res.data.message)
    }).catch(err => {
      toast.configure()
      toast.error(err.response.data.message)
    })
 }

  useEffect(() => {
    fetchAllClubs();
    fetchUserInfo();
    fetchClubInfo();
  }, [])
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.userProfileContainer}>
          <div className={styles.userProfileClubImgContainer}>
            <span>{club && club.name}</span>
            <img src={club && club.picture} alt="club image" />
          </div>
          <div className={styles.userProfileImgContainer}>
            <div class={styles.upload_btn_wrapper}>
              <button class={styles.btn}><i class="fa fa-camera"></i></button>
              <input 
                type="file" name="myfile" 
                onChange={(e) => setPicture(e.target.files[0])}
                id="picture"
              />
            </div>
            <img src={user && user.picture} alt="user image" />
          </div>
          <div className={styles.userProfileInfoContainer}>
              <div class={styles.field}>
                 <button onClick={()=> setEditStyleForName(!editStyleForName)}>
                   <i class="fa fa-edit"></i>
                 </button>
                 {/* <span class="fa fa-user"></span> */}
                 <input
                    className={ editStyleForName ? styles.editStyle : styles.normalStyle} 
                    id="full_name"
                    type="text" placeholder="user name" 
                    defaultValue={user && user.full_name}
                    // onChange={(e) => setFullName(e.target.value)}
                 />
              </div>
              <br/>
              <div class={styles.field}>
                 <button onClick={()=> setEditStyleForEmail(!editStyleForEmail)}>
                   <i class="fa fa-edit"></i>
                 </button>
                 {/* <span class="fa fa-envelope-square"></span> */}
                 <input  
                    className={ editStyleForEmail ? styles.editStyle : styles.normalStyle} 
                    id="email"
                    type="email" placeholder="email" 
                    defaultValue={user && user.email} 
                    // onChange={(e) => setEmail(e.target.value)}
                  />
              </div>
              <br/>
              <button 
                className={styles.editProfileBtn}
                onClick={updateUserInfo}
              >
                Save
              </button>
              <br/><br/>
              <button 
                className={styles.deleteProfileBtn}
                onClick={handleClickOpen}
              >
                Delete Account
              </button>
              <br/><br/>
          </div>
        </div>

        <div className={styles.userMoreAction}>
            <div className={styles.resetPasswordContainer}>
                <p>Change Club</p>
                <p className ={styles.ClubChangeNote}>
                  Note :  <span>
                     you have the right to join only one club , so if you changed your current club you will be removed from it
                  </span>
                </p>
                
                 <select className={styles.customSelectStyle} onChange={(e) => setClub_id(e.target.value)}>
                   {clubs && clubs.map(club =>{
                     return (
                       <option value={club._id}>{club.name}</option>
                     )
                   })}
                 </select>
                <br/><br/>
                <button 
                  className={styles.resetPasswordBtn}
                  onClick={changeClub}
                >
                  Change Club
                </button>
            </div>
            <br/>
            <div className={styles.resetPasswordContainer}>
                <p>Reset Your Password</p>
                <div class={styles.field}>
                  <input  
                    className={styles.editStyle} 
                    type="password" 
                    placeholder="Current password" 
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <br/>
                <div class={styles.field}>
                    <input 
                      className={styles.editStyle} 
                      type="password" 
                      id="NewPassword"
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="new password" 
                    />
                </div>
                <br/>
                <button 
                  className={styles.resetPasswordBtn}
                  onClick={ressetPassword}
                >
                  Reset Password
                </button>
            </div>
        </div>
        <br/>


         {/* delte account */}
         <Dialog open={open} onClose={handleClose} 
            aria-labelledby="form-dialog-title" 
            fullWidth
          >
            <DialogTitle 
              style={{backgroundColor: 'darkblue', color: 'white' , textAlign: 'center'}} 
              id="form-dialog-title">
                Confirm delete Account
            </DialogTitle>
            <br/>
            <DialogContent>
                <Button
                    className={styles.saveBtn}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    // onClick={()=> addAdmin()}
                >
                    Save
                </Button>
                <Button
                    className={styles.cancelBtn}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleClose}
                >
                    Cancel
                </Button>
            </DialogContent>
        </Dialog>
        
      </main>
    </>
  );
}
