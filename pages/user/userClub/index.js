import React , {useState , useEffect} from 'react';
import styles from '../../../styles/userClub.module.css'
import axios from 'axios'
import jwt from 'jwt-decode'
import { useRouter } from 'next/router';

export default function userClub() {
    const [activities , setActivities] = useState(null)

    // initial use router  
    const router = useRouter()

    //fetch all user club activities
    const fetchActivitiesByClubId = async () => {
        const token = localStorage.getItem('userToken')
        const id = jwt(token).club_id
        await axios.get('https://youcode-clubs.vercel.app/api/admin/clubActivity/' + id)
                .then(res =>{
                       console.log(res.data);
                       setActivities(res.data.club_activity)
                })
                .catch(err =>{
                       console.log(err);
                })
    }

    //redirect to single event details page
    const redirectToClubActivityPage = (id) => {
         router.push('/user/userClubSingleEvent/' + id);
    }

    useEffect (() => {
        fetchActivitiesByClubId()
    }, [])
  return (
    <>
        <div className={styles.container}>
            {activities && activities.map(activity =>{
                return (
                    <div className={styles.card} key={activity._id} onClick={() => redirectToClubActivityPage(activity._id)}>
                        <div className={styles.card__image_container}>
                        <img
                            className={styles.card__image}
                            src={activity.picture}
                            alt
                        />
                        </div>
                        <svg className={styles.card__svg} viewBox="0 0 800 500">
                        <path
                            d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400 L 800 500 L 0 500"
                            stroke="transparent"
                            fill="#333"
                        />
                        <path
                            className={styles.card__line}
                            d="M 0 100 Q 50 200 100 250 Q 250 400 350 300 C 400 250 550 150 650 300 Q 750 450 800 400"
                            stroke="pink"
                            strokeWidth={3}
                            fill="transparent"
                        />
                        </svg>
                        <div className={styles.card__content}>
                        <h1 className={styles.card__title}>{activity.name}</h1>
                        <p>{activity.description}</p>
                        </div>
                    </div>     
                )
            })}
        </div>

    </>
  );
}
