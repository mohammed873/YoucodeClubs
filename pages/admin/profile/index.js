import React , {useEffect , useState} from 'react';
import styles from '../../../styles/adminProfile.module.css';
import axios from 'axios'
import jwt from 'jwt-decode'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from 'next/head'


export default function Profile() {
    const [admin , setAdmin ] = useState()

    const [full_name , setFullName] = useState('')
    const [email , setEmail] = useState('')
    const [picture , setPicture] = useState('')
    const [club_id , setClub_id] = useState('')

    const[defaultPassword , setDefaultPassword] = useState('')
    const [newPassword , setNewPassword] = useState('')

    //related to material ui dailog (update)
    const [openupdate, setOpenUpdate] = useState(false);

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

    //ResetPassword
    const ressetPassword = async (req, res) => {
        const admin_token = localStorage.getItem('adminToken')
        const id = jwt(admin_token)._id
    
        await axios.put('http://localhost:3000/api/admin/resetPassword/' + id,{
        defaultPassword,
        newPassword
        })
        .then(res => {
            getAdminInfo()
            toast.configure()
            toast.success(res.data.message)
            emptyInputs()
        }).catch(err => {
            toast.configure()
            toast.error(err.response.data.message)
        })
    }

    //emptyInputs
    const emptyInputs = () => {
        document.querySelector('#password').value = ''
        document.querySelector('#NewPassword').value = ''
    }

    //close update dialog
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    }; 

    //show update model and fetch data 
    const handleClickOpenUpdate = async (id) => {

        //open the modal
        setOpenUpdate(true);
    
        //set the admins attributes to be update
        setFullName(admin[0].full_name)
        setEmail(admin[0].email)
        setPicture(admin[0].picture)
        setClub_id(admin[0].club_id)
    };

    //update admin information
    const updateAdminInfo = async () => {
        const admin_token = localStorage.getItem('adminToken')
        const id = jwt(admin_token)._id

        const picture =  await pictureUpload()

        await axios.put('http://localhost:3000/api/admin/profile/' + id ,{
            full_name,
            email,
            club_id,
            picture
        }).then(res =>{
            
            //recal the get all admins function
            getAdminInfo()

            //fire up success notifications
            toast.configure()
            toast.success(res.data.message)

            //close the update modal
            handleCloseUpdate()
        }).catch(err =>{
            toast.configure()
            toast.error(err.response.data.message)
        })
    }

    //uploading image using cloudinary
    const pictureUpload = async () => {

        const data = new FormData()
        data.append("file", picture)
        data.append("upload_preset", "youcodeClubs")
        data.append("cloud_name", "dtq13h9rg" )
    
    
        const res = await fetch("	https://api.cloudinary.com/v1_1/dtq13h9rg/image/upload",{
        method : "POST",
        body : data
        })
        const res2 = await res.json() 
        return res2.url
    }


    useEffect(() => {
        getAdminInfo()
    },[])
  return (
    <>
       <Head>
        <title>Youcode Clubs || edit admin profile</title>
        <meta name="description" content="this page is fo edditing admin information" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
       <main>
           <div className={styles.profileContainer}>
               <div className={styles.profileImageContainer}>
                   <img src={admin && admin[0].picture} alt="profile picture" />
               </div>
               <div className={styles.adminInfo}>
                   <span className={styles.editProfileIcon} onClick={handleClickOpenUpdate}> 
                       <EditIcon/>
                   </span>
                   <h3> 
                       <span>Full Name</span> : {admin && admin[0].full_name}
                    </h3>
                    <h3>
                       <span>Club Name</span> : {admin && admin[0].club[0].name}                 
                    </h3>
                    <h3>
                       <span>Email Address</span> : {admin && admin[0].email}                 
                    </h3>
               </div>
               <div className={styles.adminResetPasswordContainer}>
                    <h3>Reset Password</h3>
                    <TextField 
                    label="Current Password"
                    variant="filled"
                    fullWidth
                    id="password"
                    type="password"
                    onChange={(e)=>{setDefaultPassword(e.target.value)}}
                    />
                    <br/><br/>
                    <TextField 
                    label="New Password"
                    variant="filled"
                    fullWidth
                    id="NewPassword"
                    type="password"
                    onChange={(e)=>{setNewPassword(e.target.value)}}
                    />
                    <br/> <br/>
                    <Button
                        className={styles.resetAdminPasswordBtn}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<EditIcon />}
                        onClick={ressetPassword}
                    >
                            Reset Password
                    </Button>
               </div>
               <br/>
           </div>

           <Dialog open={openupdate} onClose={handleCloseUpdate} aria-labelledby="form-dialog-title" fullWidth>
                <DialogTitle id="form-dialog-title" style={{backgroundColor: 'green', color: 'white' , textAlign: 'center'}}>Update Admin details</DialogTitle>
                    <br/>
                    <DialogContent>
                    <TextField
                        defaultValue={admin && admin[0].full_name}
                        id='full_name'
                        autoFocus
                        label="Full Name"
                        type="text"
                        variant="filled"
                        fullWidth
                        onChange={(e)=>{setFullName(e.target.value)}}
                    />
                    <br/> <br/>
                    <TextField 
                    defaultValue={admin && admin[0].email}
                    id='email'
                    label="email" 
                    type="email"
                    variant="filled"
                    fullWidth
                    onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <br/><br/>
                    <div class="mb-3">
                        <label for="formFile" class="form-label">Choose a picture</label>
                        <input style={{width: '85%'}} class="form-control" type="file" id="formFile"  onChange={(e)=>setPicture(e.target.files[0])}/>
                        <div className={styles.edditedPictureContainer}>
                            <img src={admin && admin[0].picture} alt="admin picture" />
                        </div>
                    </div>
                    <Button
                        className={styles.editBtn}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<EditIcon />}
                        onClick={()=>updateAdminInfo()}
                    >
                        Edit
                    </Button>
                </DialogContent>  
           </Dialog>     
           <br/>
       </main>
    </>
  );
}
