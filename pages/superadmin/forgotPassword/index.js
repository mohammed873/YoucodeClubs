import { Button, TextField } from '@material-ui/core';
import styles from '../../../styles/forgotPassword.module.css'
import React , {useState , useEffect} from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from 'next/link'

export default function ForgotPassword() {
  const [email , setEmail] = useState();


  //send an a reset link in mail
  const SendResetToken = async () => {
    await axios.post ('https://youcode-clubs.vercel.app/api/superAdmin/forgotPassword',{
      email
    }).then(res =>{
      //empty input
      document.querySelector("#email").value = ""

      //send notifaction
      toast.configure()
      toast.success(res.data.message)

    }).catch(err =>{
      toast.configure()
      toast.error(err.response.data.message)
    })
  }


  return (
    <>
       <main className={styles.mainDiv}>
         <div className={styles.formContainer}>
           <h1>Fogot Password</h1>
           <p>Please enter your email address , and wait for an email to reset your password</p>
           <TextField
             label="email"
             type="email"
             fullWidth
             id="email"
             variant='filled'
             onChange={(e)=>setEmail(e.target.value)}
           />
           <br/>  <br/>
         <Button
            onClick={SendResetToken} 
            size="large"
            variant="contained"
            color="primary"
          >
              Reset password
          </Button>
          <br/> 
          <Link href='/superadmin/login'>
            <p className={styles.backLink}> 
            <span>&#8592;</span>
              Back
            </p>
          </Link>
         </div>
       </main>
    </>
  );
}
