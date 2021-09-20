import React , {useState , useEffect} from 'react';
import styles from '../../../styles/userGuestClubActivity.module.css'
import { Button } from '@material-ui/core';
import {
  Timeline,
  Events,
  ImageEvent,
} from '@merc/react-timeline';
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/Link'
 
export default function discoverClubActivities() {
    const [ activities , setActivities] = useState(null)  
    const [ dataFound , setDataFound] = useState(false)

    // initial use router  
    const router = useRouter()

    //get all club activity by club id
    const getAllClubActivities = async () => {
        //get the club _id  from the url parameters
        const {id} = router.query
        await axios.get('http://localhost:3000/api/admin/clubActivity/' + id)
        .then( res =>{
            setActivities(res.data.club_activity);

            if(res.data.club_activity.length > 0){
            setDataFound(true)
            }else{
            setDataFound(false)
            }

        }).catch( err =>{
            console.log(err);
        })
    }

    //redirecting to join page
    const redirectToJoinClubPage = () => {
        const {id} = router.query
        router.push('/user/joinClub/' + id)
    }

    useEffect (() => {
        getAllClubActivities();
    }, [])

 
  return (
      <>
       <div className={styles.navbar}>
           <Link href="/">
              <img src="/logo.png" alt="youcode logo" />
           </Link>
           <Button onClick={redirectToJoinClubPage}>Join now</Button>
       </div>
       <div className={styles.intro}>
           This is all the events that was hold and created by This club , if you are interested and you want to learn more , make sure to join now , and enjoy free chat rooms with all members , so that you can spread your ideas freely
       </div>
       {
           dataFound ? 
           <Timeline className={styles.tabline}>
            <Events>
             {activities.map((activity) =>{
               return (
                    
                       
                            <ImageEvent
                                date={activity.date}
                                text={activity.name}
                                src={activity.picture}
                                alt="activity picture"
                            >
                            <div>
                                {activity.description}
                            </div>
                            </ImageEvent>
                      
                   
               )
        })}
          </Events>
          </Timeline>
            : 
            <div className={styles.loading}>
                <img src="/error-page.gif" alt="Loading..."  />
                <h3>Sorry! , This club has no activities yet , but you can change this by joining now</h3>
            </div>
       }
        
    </>
  );
}
