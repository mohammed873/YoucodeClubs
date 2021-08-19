import React from 'react';
import styles from '../../../styles/AdminLogin.module.css'
import Link from 'next/link'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/router'
import axios from 'axios'
import jwt from 'jwt-decode'

export default function AdminLogin() {
    const router = useRouter()

  //login the admins 
  function Login(){
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    axios.post('http://localhost:3000/api/admin/login',{
       email:email,
       password:password
    }).then(res=> {
      
      const token = res.data.token
      localStorage.setItem('adminToken', token )

      const isRessted = jwt(token).isRessted
      console.log(isRessted)

       if(isRessted) {
        router.push("/admin/dashboard");
       }else{
        router.push("/admin/resetPasswordFirstTimeLogin");
       }

    }).catch(err=>{
      toast.configure()
      toast.error(err.response.data.message)
    })
  }
  return (
    <>
     <main>
         <div className={styles.mainLoginContainer}>
             <div className={styles.loginContainer}>
                 <div className={styles.loginFormContainer}>
                 <h1>Admins Zone </h1>
                <hr className={styles.line}/>
                <br/>
                    <TextField  
                        className={styles.customInput}
                        xl={7}
                        fullWidth
                        id="email"
                        label="email"
                        type="email"
                        placeholder="Enter your email"
                        variant="filled"
                    />
                    <br/><br/>
                    <TextField 
                        className={styles.customInput}
                        xl={7}
                        fullWidth
                        id="password"
                        label="password"
                        type="password"
                        placeholder="Enter your password"
                        variant="filled"
                    />
                    <br/><br/>
                    <Button
                        onClick={Login} 
                        size="large"
                        variant="contained"
                        fullWidth
                        color="primary"
                        >
                        log in
                    </Button>
                    <Link href="http://localhost:3000/admin/forgotPassword">
                      <p className={styles.forgotPasswordLink}>I forgot my password</p>
                    </Link>
                 </div>
                 <div className={styles.loginImageContainer}>
                   <img src='/YouCode.gif' alt="Logo" />
                 </div>
             </div>
         </div>
     </main>
    </>
  );
}
