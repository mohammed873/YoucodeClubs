import Head from 'next/head';
import React , { useState , useEffect} from 'react';
import styles from '../../../styles/userDashboard.module.css'
import axios from 'axios';
import jwt from 'jwt-decode'

export default function UserDashboard() {
  const [clubsCount , setClubsCount]= useState(0)
  const [CurrentClubUsersCount,setCurrentClubUsersCount] = useState(0)
  const [activitiesCount , setActivitiesCount] = useState(0)

  //get the clubs count
   const fetchClubsCount = async () => {
    axios.get('http://localhost:3000/api/superAdmin/clubsCount')
         .then(res =>{
          setClubsCount(res.data.clubsCount)
         }).catch(err =>{
           console.log(err)
         })
  }

  //fetch all users list
   const fetchUersList = async () => {
    const token = localStorage.getItem('userToken')
    const club_id = jwt(token).club_id

    axios.get('http://localhost:3000/api/user')
         .then(res =>{
          const Data = res.data.users
          const CurrentAdminClubUsers =  Data.filter(user => user.club_id === club_id )
          setCurrentClubUsersCount(CurrentAdminClubUsers.length);
          console.log(CurrentAdminClubUsers.length);
         }).catch(err =>{
           console.log(err)
         })
  }

//fetch all user club activities
  const fetchActivitiesByClubId = async () => {
    const token = localStorage.getItem('userToken')
    const id = jwt(token).club_id
    await axios.get('http://localhost:3000/api/admin/clubActivity/' + id)
            .then(res =>{
                   console.log(res.data);
                   setActivitiesCount(res.data.club_activity.length)
            })
            .catch(err =>{
                   console.log(err);
            })
}


  useEffect(() => {
    fetchClubsCount()
    fetchUersList()
    fetchActivitiesByClubId()
  },[])
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
    <div className={styles.row1_container}>
      <div className={styles.box} id={styles.box_down_Right}>
        <h2>Total Events Count</h2>
        <p>{activitiesCount}</p>
        <img src="https://www.vippng.com/png/detail/220-2201846_air-sensors-international-conference-2018-oakland-blue-event.png" alt />
      </div>
      <div className={styles.box} id={styles.red}>
        <h2>Total Club members</h2>
        <p>{CurrentClubUsersCount}</p>
        <img src="https://static.thenounproject.com/png/186480-200.png" alt />
      </div>
      <div className={styles.box}  id={styles.box_down_Left}>
        <h2>Total Clubs Count</h2>
        <p>{clubsCount}</p>
        <img src="https://cdn-icons-png.flaticon.com/128/4629/4629699.png" alt />
      </div>
    </div>
  </>
  
  );
}
