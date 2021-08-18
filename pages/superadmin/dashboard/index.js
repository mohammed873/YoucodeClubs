import react , {useState, useEffect} from 'react'
import Head from 'next/head'
import styles from '../../../styles/dashboard.module.css'
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import CategoryIcon from '@material-ui/icons/Category';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';




export default function dashboard() {
  return (
    <div>
      <Head>
        <title>Youcode Clubs || superAdmin || dashboard</title>
        <meta name="description" content="this dashboard is how a super admin can manage clubs and admins" />
      </Head>

      <main>
         <div className={styles.statsContainer}>
           <div className={styles.stats}>
              <EmojiPeopleIcon/>
              <h2>678</h2>
              <p>All clubs Members</p>
           </div>
           <div  className={styles.stats}>
                <CategoryIcon/>
                <h2>12</h2>
                <p> clubs </p>
           </div>
           <div  className={styles.stats}>
              <SupervisorAccountIcon/>
              <h2>8</h2>
              <p>Admins</p>
           </div>
         </div>

        
      </main>
    </div>
  )
}
