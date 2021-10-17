import React , {useState , useEffect} from 'react';
import styles from '../../../styles/superadminClubActivity.module.css'
import { useRouter } from 'next/router'
import axios from 'axios'
import Flip from 'react-reveal/Flip';
import Zoom from 'react-reveal/Zoom';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SuperAdminLayout from '../../../components/superAdminLayout/layout'
import { Button, TextField } from '@material-ui/core';


export default function clubActivities() {
const [ activities , setActivities] = useState(null)   
const [singleActivity , setSingleActivity] = useState(null) 
const [dataFound , setDataFound] = useState(false)
const [activity , setActivityComments] = useState(null)


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

//get single activity details
const getSingleActivityDetails = async (id) => {
  await axios.get(' http://localhost:3000/api/admin/getSingleActivity/' + id)
  .then(res =>{
   setSingleActivity(res.data.singleActivity)
  }).catch(err => {
      console.log(err)
  })
}

useEffect (() => {
    getAllClubActivities();
    // getSingleActivityComments();
}, [])


  return (
    <> 
        <SuperAdminLayout>
          {activities && activities  ?
                <div className={dataFound ? styles.wrapper : styles.wrapperDefult}>
                <div className={styles.carousel}>
                  {activities && activities.map(activity =>{
                      return(
                        <div className={styles.carousel__item} key={activity._id} onClick={()=> getSingleActivityDetails(activity._id)}>
                        <div className={styles.carousel__item_head}>
                          <img src={activity.picture} alt="activity picture" />
                        </div>
                        <div className={styles.carousel__item_body}>
                          <h3>{activity.name}</h3>
                          <p>{activity.description}</p>
                        </div>
                      </div> 
                      )
                  })}  
                </div>
              </div>
                : 
            <div className={styles.loadingImg}>
                <img src="https://static.wixstatic.com/media/d27180_8ba5d7d0d8ce459aa955f57c6ff5782b~mv2.gif" alt="loading ..." />
            </div>
          }
          <br/>

          {singleActivity && 
            <div className={styles.singleActivityContainer}>
              <div className={styles.getSingleActivityDetailsContainer}>
                <Flip>
                  <img src={singleActivity && singleActivity.picture} alt="single activity picture" />
                </Flip>
                <Zoom>
                  <h2>{singleActivity && singleActivity.name}</h2>
                </Zoom>
                <Zoom>
                  <p>{singleActivity && singleActivity.description}</p>
                  <div className={styles.activityReaction}>
                    <FavoriteIcon/>
                    <ThumbUpAltIcon/>
                  </div>
                </Zoom>
              </div>
              <div className={styles.getSingleActivityCommentsContainer}>
                <div className={styles.getSingleActivityCommentSectionContainer}>
                  
                  <div className={styles.ActivityCommetSection}>
                      <div className={styles.commentUsersContainer}>
                        <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png" alt="user pic" />
                        <span>user name</span>
                      </div>
                      <div>
                        <p>lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor lorem lorem</p>
                      </div>
                  </div>
                  <br/>

                  <div className={styles.ActivityCommetSection}>
                      <div className={styles.commentUsersContainer}>
                        <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png" alt="user pic" />
                        <span>user name</span>
                      </div>
                      <div>
                        <p>lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor lorem lorem</p>
                      </div>
                  </div>
                  <br/>

                  <div className={styles.ActivityCommetSection}>
                      <div className={styles.commentUsersContainer}>
                        <img src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/user.png" alt="user pic" />
                        <span>user name</span>
                      </div>
                      <div>
                        <p>lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor lorem lorem</p>
                      </div>
                  </div>
                  <br/>
                </div>


                  
                <div className={styles.commentFormContainer}>
                  <TextField
                    variant = "filled"
                    id="comment"
                    label="cemment"
                    type="text"
                    fullWidth
                  />
                  <br/>  <br/>
                  <Button
                    variant="contained"
                    color="primary"
                  >
                    send
                  </Button>
                </div>
                </div>
              </div>
          }



          {activities && activities.length === 0 &&
            <div>
                <div className={styles.activityNotFound}>
                <img src="https://images.squarespace-cdn.com/content/v1/547de8dde4b0946f52133e85/1508134468421-TF22FW0RU8BZZ7ZCVP01/Oscar_404_not_found_008.gif" alt="activity not found image" />
                </div>
                <h1 className={styles.message}>Sorry This club has no activities yet.</h1>
            </div>
          } 
        </SuperAdminLayout>
    </>
  );
}
