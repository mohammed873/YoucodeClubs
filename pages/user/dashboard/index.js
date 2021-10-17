import Head from 'next/head';
import React from 'react';
import styles from '../../../styles/userDashboard.module.css'

export default function UserDashboard() {
  return (
    <>
    <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="./images/favicon-32x32.png"
        />
        <title>Frontend Mentor | Four card feature section</title>
        <link rel="stylesheet" href="styles.css" />
        <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,400;0,600;1,200;1,400;1,600&display=swap"
        rel="stylesheet"
        />
    </Head>
    <div className={styles.header}>
      <h1>Most Recent Events</h1>
      <h1>Hold by club Art</h1>
    </div>
    <div className={styles.row1_container}>
      <div className={styles.box} id={styles.box_down_Right}>
        <h2>Supervisor</h2>
        <p>Monitors activity to identify project roadblocks</p>
        <img src="https://assets.codepen.io/2301174/icon-supervisor.svg" alt />
      </div>
      <div className={styles.box} id={styles.red}>
        <h2>Team Builder</h2>
        <p>
          Scans our talent network to create the optimal team for your project
        </p>
        <img src="https://assets.codepen.io/2301174/icon-team-builder.svg" alt />
      </div>
      <div className={styles.box}  id={styles.box_down_Left}>
        <h2>Calculator</h2>
        <p>Uses data from past projects to provide better delivery estimates</p>
        <img src="https://assets.codepen.io/2301174/icon-calculator.svg" alt />
      </div>
    </div>
    <div className={styles.row2_container}>
      <div className={styles.box} id={styles.orange}>
        <h2>Karma</h2>
        <p>Regularly evaluates our talent to ensure quality</p>
        <img src="https://assets.codepen.io/2301174/icon-karma.svg" alt />
      </div>
    </div>
  </>
  
  );
}
