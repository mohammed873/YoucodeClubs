import React from 'react'
import styles from '../../../styles/login.module.css'
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import Flip from 'react-reveal/Flip';



export default function Admin_login() { 

    const router = useRouter()

  function Login(){
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    axios.post('http://localhost:3000/api/superAdmin/login',{
       email:email,
       password:password
    }).then(res=> {
      
      const token = res.data.token
      localStorage.setItem('token', token )

      router.push("/superadmin/dashboard");
     
    }).catch(err=>{
      toast.configure()
      toast.error(err.response.data.message)
      // console.log(err.response.data.message);
    })
  }

    return (
    <div>
        <div className="App">
            <Grid container >
                <Grid item md={7} sm={12} className={styles.right_slide}>
                <img src='/YouCode.gif' alt="Logo" />
                </Grid>
                <Grid item md={5} sm={12} className={styles.left_side}>
                 <Flip>
                    <h1 style={{color:'white'}}>Super Admin Zone </h1>
                 </Flip>
                <hr/>
                <form id={styles.form}>
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
                    xl={7}
                    fullWidth
                    id="password"
                    label="password"
                    type="password"
                    placeholder="Enter your password"
                    variant="filled"
                />
                <br/><br/><br/>
                <Button
                    onClick={Login} 
                    size="large"
                    variant="contained"
                    fullWidth
                    >
                    log in
                </Button>
                <br/>
                 <Link href="http://localhost:3000/superadmin/forgotPassword">
                   <p className={styles.forgotPasswordLink}>I forgot my password</p>
                 </Link>
                </form>
                </Grid>
            </Grid>
        </div>
    </div>
    )
}
