import React , {useEffect , useState , useRef} from 'react';
import UserLayout from '../../../components/UserLayout/layout'
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../../../styles/userSingleActivityDetails.module.css'
import { Button, Dialog, TextField } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import { makeStyles } from '@material-ui/core/styles';
import jwt from 'jwt-decode'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from '../../../firebase/firebaseConfig';
import {collection, onSnapshot , addDoc , where , orderBy , query , deleteDoc , doc  , setDoc,getDoc } from 'firebase/firestore';

const useStyles = makeStyles((theme) => ({
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));

export default function singleEventDetails() {
    const [singleEventDetails , setSingleEventDetails] = useState(null)
    const [comment , setcomment]= useState(null)
    const [comments , setComments] = useState([]);
    const [user , setUser] = useState(null)
    const [updatedComment , setUpdatedComment] = useState(null)
    const [selectedCommentId , setSelectedCommentId] = useState(null)


    //create a ref for comment collection to use in post method
    const commentsRef = collection(db , 'comments');

    //intialize useRef for scrolling down into a specific section after sending a comment
    const commentDownSection = useRef();
  
    // initial use router  
    const router = useRouter()

    //current userid , for setting a specific style while displaying the comments
    const currentUserId = user && user._id;

    //related to material ui dailog updating comment
    const [open, setOpen] = useState(false);
    const classes = useStyles();

    const handleClickOpen = (id , comment) => {
        setSelectedCommentId(id)
        setUpdatedComment(comment);
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };  

    //get single activity details
    const getSingleActivityDetails = async () => {
        const {id} = router.query
        await axios.get(' https://youcode-clubs.vercel.app/api/admin/getSingleActivity/' + id)
        .then(res =>{
            setSingleEventDetails(res.data.singleActivity)
        }).catch(err => {
            console.log(err)
        })
    }

    
    //fetch user info 
    const fetchUserInfo = async () => {
        const token = localStorage.getItem('userToken')
        const id = jwt(token)._id

        await axios.get('https://youcode-clubs.vercel.app/api/user/profile/' + id)
            .then (res => {
            setUser(res.data.fetched_user);
            }).catch(err => {
            console.log(err.response.data.message);
            })
    }

    //create comment
    const createComment = async () => {
         const date = new Date();
        if(comment === null || comment === "" ){
            toast.configure()
            toast.error("comment must not be empty")
        }else{
            const {id} = router.query
            await addDoc(commentsRef , {
                userID : user._id ,
                eventId: id,
                comment: comment,
                picture : user.picture,
                userName : user.full_name,
                role : user.role,
                createdAt: date,
                updatedAt: date

            })
            document.querySelector('#comment').value= ''
            setcomment(null)
            toast.configure()
            toast.success("comment sent successfully")

            //smooth scrool 
            commentDownSection.current.scrollIntoView({ behavior: 'smooth' })
        }
    }
 
    //get all comment on real time
    const getComments = async () => {
        const {id} = router.query;

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
        if(updatedComment == null || updatedComment === ""){
            toast.configure()
            toast.error("comment field must not be empty")
        }else{
            const date = new Date();
            const {id} = router.query
            try {
                const docRef = doc(db , "comments" , selectedCommentId);
                //get origin date  
                const docSnap =   (await getDoc(docRef)).data();
    
                await setDoc(docRef ,  {
                    userID : user._id ,
                    eventId: id,
                    comment: updatedComment,
                    picture : user.picture,
                    userName : user.full_name,
                    role : user.role,
                    createdAt: docSnap.createdAt,
                    updatedAt: date
                });
                toast.configure()
                toast.success("comment updated successfully")
                handleClose()
                setUpdatedComment(null)
            } catch (error) {
                toast.configure()
                toast.error("something went wrong , try again later")
            }
        }
    }


    useEffect(() => {
        getSingleActivityDetails()
        getComments()
        fetchUserInfo()
    }, [])

  return (
    <>
        
       <UserLayout>
      
          <main>
              <br />
              <div className={styles.singleActivitycontainer}>
                  <div className={styles.getSingleActivityDetailsContainer}>
                     <img src={singleEventDetails && singleEventDetails.picture} alt="activity picture" />
                     <h1>{singleEventDetails && singleEventDetails.name}</h1>
                     <p>{singleEventDetails && singleEventDetails.description}</p>
                  </div>
                  <br/>
                  <div className={styles.singleActivityCommentsContainer}>
                      <div>
                            <div className={styles.commentsContainer}>
                                {comments && comments.map(comment  => {
                                    return (
                                        <div key={comment.id}>
                                        <div className={ comment.userID == currentUserId ? styles.ActivityCommetSectionForCurrentUser : styles.ActivityCommetSection} >
                                                <div className={styles.commentUsersContainer}>
                                                    <img src={comment.picture} alt="user pic" />
                                                    <span>{comment.userName}</span>
                                                </div>
                                                <div>
                                                    <p>{comment.comment}</p>
                                                </div>
                                                <div className={ comment.userID == currentUserId ? styles.commentActionsContainer : styles.commentActionsContainerHide}>
                                                    <span onClick={() => handleClickOpen(comment.id , comment.comment)}>
                                                        <EditIcon/>
                                                    </span>
                                                    <span onClick={()=> deleteComment(comment.id)}>
                                                       <DeleteIcon/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                               <div ref={commentDownSection} style={{height:"12vh" , float: "right"}}></div>
                            </div>
                           
                       </div>
                      
                         <div className={styles.commentFormContainer} >
                            <TextField
                                variant = "filled"
                                id="comment"
                                label="comment"
                                type="text"
                                required
                                fullWidth
                                onChange={(e)=> setcomment(e.target.value)}
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
              <br />
          </main>

        {/* update comment dialog */}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
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
       </UserLayout>
    </>
  );
}
