import Head from 'next/head';
import React , {useEffect , useState} from 'react';
import styles from '../../../styles/userJoinClub.module.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios'

export default function joinClub() {
  const [club , setClub ] = useState([])

  // initial use router  
  const router = useRouter()

  //get the admin club 
    const getClubInfo = async () => {

        const {id} = await router.query
        await axios.get('http://localhost:3000/api/admin/club/' + id)
        .then(res =>{
            setClub(res.data.club);
        }).catch(err =>{
            console.log(err);
        })
  }

  //join a club
  const joinClub = async () => {
     router.push('/user/verifyAcount')
  }

useEffect(() => {
    getClubInfo()
},[])
  return (
    <>
       <Head>
        <title>Create Next App</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.body}>
        <div className={styles.content}>
        <img src={club.picture} alt = "club picture" />
        <br/> <br/>
        <div className={styles.text}>Join <span>{club.name}</span> now</div>
               <div className={styles.field}>
                    <span className="fa fa-user"></span>
                    <input type="text" required placeholder="full name" />
                </div>
                <br/>
               <div className={styles.field}>
                    <span className="fa fa-envelope-square"></span>
                    <input type="text" required placeholder="email address" />
                </div>
                <br/>
                <div class={styles.field}>
                    <span class="fa fa-lock"></span>
                    <input type="password" placeholder="password"/>
                </div>
                <button onClick={joinClub}>Join now</button>
                <Link href="/">
                  <p className={styles.goBackLink}>&larr; Back</p>
                </Link>
                <p>already have an acount , 
                  <span>
                    <Link href="/user/login"> log in </Link>
                  </span>
                </p>
                
        </div>
      </main>
    </>
  );
}