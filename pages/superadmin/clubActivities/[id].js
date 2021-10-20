import React , {useState , useEffect , useRef} from 'react';
import styles from '../../../styles/superadminClubActivity.module.css'
import { useRouter } from 'next/router'
import axios from 'axios'
import Flip from 'react-reveal/Flip';
import Zoom from 'react-reveal/Zoom';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SuperAdminLayout from '../../../components/superAdminLayout/layout'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt from 'jwt-decode'
import { Button, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SaveIcon from '@material-ui/icons/Save';
import DialogTitle from '@material-ui/core/DialogTitle';
import { db } from '../../../firebase/firebaseConfig';
import {collection, onSnapshot , addDoc , where , orderBy , query , deleteDoc , doc  , setDoc,getDoc } from 'firebase/firestore';


export default function clubActivities() {
const [ activities , setActivities] = useState(null)   
const [singleActivity , setSingleActivity] = useState(null) 
const [dataFound , setDataFound] = useState(false)
const [activity , setActivityComments] = useState(null)
const [comments , setComments] = useState(null);
const [comment , setComment] = useState(null)
const [updatedComment , setUpdatedComment] = useState(null)
const [selectedCommentId , setSelectedCommentId] = useState(null)
const [superAdmin , setSuperAdmin] = useState([])  
//current userid , for setting a specific style while displaying the comments
const [currentUserId , setCurrentUserId] = useState(null) 
//create a ref for comment collection to use in post method
const commentsRef = collection(db , 'comments');

// initial use router  
const router = useRouter()

//intialize useRef for scrolling down into a specific section after sending a comment
const commentDownSection = useRef();

//related to material ui dailog(update comment)
const [openUpdateComment, setOpenUpdateComment] = useState(false);
 
const handleClickOpenUpdateComment = (id , comment) => {
    setSelectedCommentId(id)
    setUpdatedComment(comment);
    setOpenUpdateComment(true);
};

const handleCloseUpdateComment = () => {
   setOpenUpdateComment(false);
}; 

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
   getComments(res.data.singleActivity._id)
  }).catch(err => {
      console.log(err)
  })
}

//get superadmin  info
const getSuperAdminInfo = async () =>{
  const token = localStorage.getItem('token')
  const id = jwt(token)._id
  await axios.get('http://localhost:3000/api/superAdmin/'+ id)
  .then(res => {
    setSuperAdmin(res.data.super_admin)
    setCurrentUserId(id)
  }).catch(err => {
    console.log(err)
  })
}

//get all comment on real time
const getComments = async (id) => {

  try {
      const q = query(collection(db, "comments"), where("eventId", "==", id), orderBy("createdAt", "asc"));
      onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }))
      setComments(data)
  });
  } catch (error) {
      console.log(error);
  }

}

//create comment
const createComment = async () => {
  const date = new Date();

      const payload = {
          userID : superAdmin && superAdmin._id ,
          eventId: singleActivity._id ,
          comment: comment,
          picture : superAdmin && superAdmin.picture,
          userName : superAdmin && superAdmin.full_name,
          role : superAdmin && superAdmin.role,
          createdAt: date,
          updatedAt: date
      }

      if(comment === null || comment === "" ){
          toast.configure()
          toast.error("comment must not be empty")
      }else{
          await addDoc(commentsRef , payload)
          document.querySelector('#comment').value= ''
          setComment(null)
          toast.configure()
          toast.success("comment sent successfully")

          //smooth scrool 
          commentDownSection.current.scrollIntoView({ behavior: 'smooth' })
      }
}

//delete document by id from the comments collection
 const deleteComment = async (docId) => {
  try {
      const docRef = doc(db , "comments" , docId);
      await deleteDoc(docRef);
      toast.configure()
      toast.success("comment deleted successfully")
  } catch (error) {
      toast.configure()
      toast.error("something went wrong , try again later")
  }
}

//update document by id from the comments collection
  const updateComment = async () => {
      const date = new Date();
      const docRef = doc(db , "comments" , selectedCommentId);
          const docSnap =   (await getDoc(docRef)).data();
          const payload = {
              userID : superAdmin && superAdmin._id ,
              eventId: singleActivity._id ,
              comment: updatedComment,
              picture : superAdmin && superAdmin.picture,
              userName : superAdmin && superAdmin.full_name,
              role : superAdmin && superAdmin.role,
              createdAt: docSnap.createdAt,
              updatedAt: date
          }

          console.log(payload);

          if(updatedComment === null || updatedComment === "" ){
              toast.configure()
              toast.error("comment must not be empty")
          }else{
              await setDoc(docRef , payload)
              document.querySelector('#comment').value= ''
              setComment(null)
              toast.configure()
              toast.success("comment sent successfully")
   
              handleCloseUpdateComment()
              setUpdatedComment(null)
          }
}


useEffect (() => {
    getAllClubActivities();
    getSuperAdminInfo()
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
                  {comments && comments.map(comment =>{
                    return (
                      <>
                         <div className={ comment.userID == currentUserId ? styles.ActivityCommetSectionForCurrentUser : styles.ActivityCommetSection} key={comment.id}>
                            <div className={styles.commentUsersContainer}>
                              <img src={comment.picture} alt="user pic" />
                              <span>{comment.userName}</span>
                            </div>
                            <div>
                              <p>{comment.comment}</p>
                            </div>
                            <div className={comment.userID == currentUserId ? styles.commentActionsContainer : styles.commentActionsContainerHide}>
                                <span onClick={() => handleClickOpenUpdateComment(comment.id , comment.comment)}>
                                    <EditIcon/>
                                </span>
                                <span onClick={()=> deleteComment(comment.id)}>
                                    <DeleteIcon/>
                                </span>
                            </div>
                        </div>
                        <br/>
                      </>
                    )
                  })}
                  <div ref={commentDownSection} style={{height:"12vh" , float: "right"}}></div>
                </div>


                  
                <div className={styles.commentFormContainer}>
                  <TextField
                    variant = "filled"
                    id="comment"
                    label="cemment"
                    type="text"
                    fullWidth
                    onChange={(e)=> setComment(e.target.value)}
                  />
                  <br/>  <br/>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={createComment}
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

          {/* update comment dialog */}
         <Dialog open={openUpdateComment} onClose={handleCloseUpdateComment} aria-labelledby="form-dialog-title" fullWidth>
            <DialogTitle style={{backgroundColor: 'darkblue', color: 'white' , textAlign: 'center'}} id="form-dialog-title">Update Comment</DialogTitle>
            <br/>
            <DialogContent>
                <TextField
                    id='updatedComment'
                    defaultValue={updatedComment}
                    autoFocus
                    label="comment"
                    type="text"
                    variant="filled"
                    required
                    fullWidth
                    onChange={(e)=>{setUpdatedComment(e.target.value)}}
                />
                <br/> <br/>
                <Button
                    className={styles.editBtn}
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={updateComment}
                >
                    Update 
                </Button>
            </DialogContent>   
        </Dialog>


        </SuperAdminLayout>
    </>
  );
}
