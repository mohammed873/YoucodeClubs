import { Button, TextField } from '@material-ui/core';
import styles from '../../../styles/resetPassword.module.css'
import React , {useState , useEffect} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {

// initial use router  
const router = useRouter()

//grt the reset token from the url parameters
const {id} = router.query

//password state   
const [password , setPassword] = useState()

//update password
const updatePassword = async () => {
  const resetToken = id
  console.log(router.query)

  console.log(resetToken)
  await axios.put('http://localhost:3000/api/superAdmin/forgotPassword/' + resetToken,{
    password
  }).then(res =>{
    //empty password field
    document.querySelector('#password').value = '';

    //send success message
    toast.configure()
    toast.success(res.data.message)

    //redirect to login home 
    setTimeout(() =>{
      router.push("/superadmin/login");
    }, 1500)
  }).catch(err =>{
    toast.configure()
    toast.error(err.response.data.message)
  })
}


  return (
    <>
       <main className={styles.mainDiv}>
         <div className={styles.formContainer}>
           <h1>Reset Password</h1>
           <p>please enter your new password, and make sure to remember it </p>
           <TextField
             label="Password"
             type="password"
             fullWidth
             id="password"
             variant='filled'
             onChange={(e)=> setPassword(e.target.value)}
           />
           <br/>  <br/>
         <Button
            onClick={updatePassword} 
            className={styles.resetBtn}
            size="large"
            variant="contained"
          >
              Reset password
          </Button>
         </div>
       </main>
    </>
  );
}
