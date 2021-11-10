import { Button, TextField } from '@material-ui/core';
import styles from '../../../styles/resetPasswordForfirstTime.module.css'
import React , {useState , useEffect} from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt from 'jwt-decode'
import { useRouter } from 'next/router'

export default function resetPasswordInFirtTimeLogin() {

  const router = useRouter()  

//password    
const [defaultPassword , setDefaultPassword] = useState('')
const [newPassword , setPassword] = useState('')

//ResetPassword
const ressetPassword = async (req, res) => {
    const token = localStorage.getItem('adminToken')
    const id = jwt(token)._id
  
    console.log(defaultPassword , newPassword , id);
     await axios.put('https://youcode-clubs.vercel.app/api/admin/resetPassword/' + id,{
       defaultPassword,
       newPassword
     })
     .then(res => {
        toast.configure()
        toast.success(res.data.message)

        emptyInputs()
      
        //redirect to admin dashboard
       setTimeout(() => {
         router.push("/admin/dashboard");
       },1500)
     }).catch(err => {
        toast.configure()
        toast.error(err.response.data.message)
     })
  
}

//emptyInputs
const emptyInputs = () => {
    document.querySelector('#defaultPassword').value = ''
    document.querySelector('#NewPassword').value = ''
}

  return (
    <>
      <main className={styles.mainDiv}>
         <div className={styles.formContainer}>
           <h1>Required Reset Password</h1>
           <p>You have not reset your password, please enter the password that was already sent to you in your email, and reset it</p>
           <TextField
             label="default Password"
             type="password"
             fullWidth
             id="defaultPassword"
             variant='filled'
             onChange={(e)=>setDefaultPassword(e.target.value)}
           />
           <br/>  <br/>
           <TextField
             label="New Password"
             type="password"
             fullWidth
             id="NewPassword"
             variant='filled'
             onChange={(e)=>setPassword(e.target.value)}
           />
           <br/>  <br/>
         <Button
            onClick={ressetPassword} 
            size="large"
            variant="contained"
            color="primary"
          >
              Reset password
          </Button>
         </div>
       </main>
    </>
  );
}
