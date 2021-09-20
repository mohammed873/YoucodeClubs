import Head from 'next/head';
import React from 'react';
import styles from '../../../styles/userLogin.module.css'
import Link from 'next/link';


export default function verifyAcount() {
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
            <img src="https://is4-ssl.mzstatic.com/image/thumb/Purple125/v4/60/23/9d/60239d01-4fdf-fb7b-e2d2-a1d3bf4835b0/source/512x512bb.jpg" alt = "youcode logo  picture" />
            <br/>    <br/>
            <div className={styles.text}>
                verify your acound
            </div>
            <div className={styles.field}>
                <span className="fa fa-check-circle"></span>
                <input type="text" required placeholder="verification code" />
            </div>
            <br/>
            <button>verify</button>    
            </div>
       </main>
    </>
  );
}