import React , {useState , useEffect , useRef} from 'react';
import Head from 'next/head'
import axios from 'axios'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SaveIcon from '@material-ui/icons/Save';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from '../../../styles/adminActivity.module.css';
import jwt from 'jwt-decode'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { db } from '../../../firebase/firebaseConfig';
import {collection, onSnapshot , addDoc , where , orderBy , query , deleteDoc , doc  , setDoc,getDoc } from 'firebase/firestore';

export default function Activity() {
    const [name, setName] = useState('')
    const [description , setDescription] = useState('')
    const [date, setDate] = React.useState(new Date());
    const [picture , setPicture] = useState('')
    const [comments , setComments] = useState(null);
    const [comment , setComment] = useState(null)
    const [admin ,setAdmin] = useState(null)
    const [updatedComment , setUpdatedComment] = useState(null)
    const [selectedCommentId , setSelectedCommentId] = useState(null)

    //create a new state to store all club activities
    const [activities , setActivities] = useState(null)

    //create a new state to store random fetched club activity
    const [randomActivity , setRandomActivity] = useState(null)

    //create a new state to store random fetched club activity
     const [singleActivity , setSingleActivity] = useState(null)

    //random state first time page load
    const [ random , setRandom] = useState(true)

    //related to material ui dailog (post)
    const [open, setOpen] = useState(false);

    //create a ref for comment collection to use in post method
    const commentsRef = collection(db , 'comments');

    //current userid , for setting a specific style while displaying the comments
    const [currentUserId , setCurrentUserId] = useState(null) 

    //intialize useRef for scrolling down into a specific section after sending a comment
    const commentDownSection = useRef();

    const handleDateChange = (date) => {
        setDate(date);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    //related to material ui dailog (post)
    const [openUpdate, setOpenUpdate] = useState(false);

    const handleClickOpenUpdate = () => {
        setOpenUpdate(true);

        setName(singleActivity.name)
        setDescription(singleActivity.description)
        setDate(singleActivity.date)
        setPicture(singleActivity.picture)
    };
     
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    };

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

    //get a random club activity
    const getRandomActivity = async () => {

        await axios.get('https://youcode-clubs.vercel.app/api/admin/getRandomActivity')
        .then( res =>{
            setRandomActivity(res.data.randomClubActivty)
            getComments(res.data.randomClubActivty[0]._id)
            console.log(res.data.randomClubActivty[0]._id)

        }).catch( err => {
            console.log(err);
        })
    }

    //get all club activity by club id
    const getAllClubActivities = async () => {
        const adminToken = localStorage.getItem('adminToken')
        const club_id = jwt(adminToken).club_id
        
        await axios.get('https://youcode-clubs.vercel.app/api/admin/clubActivity/' + club_id)
        .then( res =>{
            setActivities(res.data.club_activity);
        }).catch( err =>{
            console.log(err);
        })
    }

    //add new club activity
    const addNewActivity = async () => {
        const picture =  await pictureUpload()

        const adminToken = localStorage.getItem('adminToken')
        const club_id = jwt(adminToken).club_id

        await axios.post('https://youcode-clubs.vercel.app/api/admin/clubActivity',{
            name,
            description,
            date ,
            picture,
            club_id
        })
        .then(res => {
            toast.configure()
            toast.success(res.data.message)

            //empty all fields after successful submmit
            emptyInputs()

            //close dialog
            handleClose()

            //get all new added activity
            getAllClubActivities()

        }).catch(err => {
            toast.configure()
            toast.error(err.response.data.message)
        })
    }

    //update a single club activity by _id
    const updateClubActivity = async (id) => {
        const picture =  await pictureUpload()

        const adminToken = localStorage.getItem('adminToken')
        const club_id = jwt(adminToken).club_id

        await axios.put('https://youcode-clubs.vercel.app/api/admin/clubActivity/' + id , {
            name,
            club_id,
            description,
            date , 
            picture
        }).then(res =>{
            //empty all fields inputs after updating
            emptyInputs()

            //close update dialog
            handleCloseUpdate()

            //get new updated data
            getSingleActivity(id)
            getAllClubActivities()

            //fire up success notifications
            toast.configure()
            toast.success(res.data.message)
        }).catch(err =>{
            console.log(err)
        })
    }

    //get single activity by id 
    const getSingleActivity = async (id) => {
       await axios.get(' https://youcode-clubs.vercel.app/api/admin/getSingleActivity/' + id)
       .then(res =>{
        setSingleActivity(res.data.singleActivity)
        console.log(res.data.singleActivity._id);
        getComments(res.data.singleActivity._id)
        setRandom(false)
       }).catch(err => {
           console.log(err)
       })
    }

    //uploading image using cloudinary
    const pictureUpload = async () => {

        const data = new FormData()
        data.append("file", picture)
        data.append("upload_preset", "youcodeClubs")
        data.append("cloud_name", "dtq13h9rg" )
    
    
        const res = await fetch("	https://api.cloudinary.com/v1_1/dtq13h9rg/image/upload",{
        method : "POST",
        body : data
        })
        const res2 = await res.json() 
        console.log(res2);
        return res2.url
    }

    //empty all inputs after submmit
    const emptyInputs = () => {
        document.querySelector('#name').value = ''
        document.querySelector('#description').value = ''
        document.querySelector('#date').value = ''
        
        // empty states  
        setName('')
        setDescription('')
        setPicture('')
        setDate('')
    }

    //deleting an activity by id
    const deletedClubActivity = async (id) => {
        await axios.delete('https://youcode-clubs.vercel.app/api/admin/clubActivity/' + id)
        .then(res =>{
            toast.configure()
            toast.success(res.data.message)

            //get data after deleting activity
            getAllClubActivities()
            //set random to true 
            setRandom(true)
            getRandomActivity()
        }).catch(err =>{
            console.log(err);
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

    //get admin personel info
    const getAdminInfo = async () => {
        const admin_token = localStorage.getItem('adminToken')
        const id = jwt(admin_token)._id
        console.log(id , "admin id");

        await axios.get('https://youcode-clubs.vercel.app/api/admin/profile/' + id)
        .then(res => {
            setAdmin(res.data.admin)
            setCurrentUserId(res.data.admin[0]._id)
        }).catch(err => {
           console.log(err);
        })
    }

    //create comment
    const createComment = async () => {
        const date = new Date();

        if(random){
            const payload = {
                userID : admin[0] && admin[0]._id ,
                eventId: randomActivity[0]._id ,
                comment: comment,
                picture : admin[0] && admin[0].picture,
                userName : admin[0] && admin[0].full_name,
                role : admin[0] && admin[0].role,
                createdAt: date,
                updatedAt: date
            }

            console.log(payload);

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
    
        }else{
            const payload = {
                userID : admin[0] && admin[0]._id ,
                eventId: singleActivity._id ,
                comment: comment,
                picture : admin[0] && admin[0].picture,
                userName : admin[0] && admin[0].full_name,
                role : admin[0] && admin[0].role,
                createdAt: date,
                updatedAt: date
            }

            console.log(payload);

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
        if(random){
            const docSnap =   (await getDoc(docRef)).data();
            const payload = {
                userID : admin[0] && admin[0]._id ,
                eventId: randomActivity[0]._id ,
                comment: updatedComment,
                picture : admin[0] && admin[0].picture,
                userName : admin[0] && admin[0].full_name,
                role : admin[0] && admin[0].role,
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
    
        }else{
            const docSnap =   (await getDoc(docRef)).data();
            const payload = {
                userID : admin[0] && admin[0]._id ,
                eventId: singleActivity._id ,
                comment: updatedComment,
                picture : admin[0] && admin[0].picture,
                userName : admin[0] && admin[0].full_name,
                role : admin[0] && admin[0].role,
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
    }



     useEffect(() => {
        getAllClubActivities()
        getRandomActivity()  
        getAdminInfo()     
     },[])
  return (
    <>
        <Head>
          <title>youcode clubs || activity page</title>
          <meta name="description" content="this page is for adding , deleting and updating an activity by the admin" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
          <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
       </Head>
       <main>
          <div className={styles.activityContainer}>
              <div className={styles.singleActivtyDetails}>
                  <div className={styles.activityImageContainer}>
                      <img src={random ? randomActivity && randomActivity[0].picture : singleActivity && singleActivity.picture} alt="activity image" />
                  </div>
                  <div className={styles.activityDetailsContainer}>
                        {random ? "" :   <span className={styles.listDeleteActivityBtn} onClick={() => deletedClubActivity(singleActivity._id)}>
                              <DeleteIcon/>
                        </span>}
                        {random ? "" : <span className={styles.listEditActivityBtn} onClick={() => handleClickOpenUpdate()}>
                              <EditIcon/>
                        </span>}
                      <h1>{random ? randomActivity && randomActivity[0].name : singleActivity && singleActivity.name}</h1>
                      <p>{random ? randomActivity && randomActivity[0].description : singleActivity && singleActivity.description}</p>
                      <br/>
                      <span>{random ? randomActivity && moment(randomActivity[0].date).format('MMMM Do YYYY, h:mm:ss a')  : singleActivity && moment(singleActivity.date).format('MMMM Do YYYY, h:mm:ss a')}</span>
                  </div>
                  <div className={styles.ActivityCommentsContainer}>
                      {comments && comments.map(comment =>{
                          return(
                              <>
                                <div className={ comment.userID == currentUserId ? styles.ActivityCommetSectionForCurrentUser : styles.ActivityCommetSection} key={comment.id}>
                                    <div className={styles.commentUsersContainer}>
                                        <img src={comment.picture} alt="user pic" />
                                        <span>{comment.userName}</span>
                                    </div>
                                    <div>
                                        <p>{comment.comment}</p>
                                    </div>
                                    <div className={ comment.userID == currentUserId ? styles.commentActionsContainer : styles.commentActionsContainerHide}>
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
              <div className={styles.activityList}>
                <Tooltip title="Add new activiy" >
                  <IconButton aria-label="Add new activiy"  className={styles.activityBtn} onClick={handleClickOpen} >
                    <AddCircleIcon/>
                  </IconButton>
                </Tooltip> 
                <br/>
                <br/>
                {activities && activities.map(activity =>{
                    
                    return <>
                       <div key={activity._id} className={styles.listSingleActivityContainer} onClick={() => getSingleActivity(activity._id)}>
                            <img src={activity.picture} alt="activity picture" />
                            <p>{activity.name}</p>
                        </div>
                        <br/>
                    </>
                })}
               
              </div>
              <br/>
          </div>
          <br/>
       </main>

        {/* add activity dialog */}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
            <DialogTitle style={{backgroundColor: 'darkblue', color: 'white' , textAlign: 'center'}} id="form-dialog-title">Adding new Activity</DialogTitle>
            <br/>
            <DialogContent>
                <TextField
                    id='name'
                    autoFocus
                    label="Activity Name"
                    type="text"
                    variant="filled"
                    fullWidth
                    onChange={(e)=>{setName(e.target.value)}}
                />
                <br/> <br/>
                <TextField 
                   id='description'
                   label="description" 
                   type="text"
                   variant="filled"
                   fullWidth
                   multiline
                   rows={4}
                   onChange={(e)=>{setDescription(e.target.value)}}
                />
                <br/> <br/>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        margin="normal"
                        id="date"
                        label="Date"
                        format="MM/dd/yyyy"
                        value={date}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        fullWidth
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <br/> <br/>
                <div class="mb-3">
                    <label for="formFile" class="form-label">Choose an Image</label>
                    <input class="form-control" type="file" id="formFile"  onChange={(e)=>setPicture(e.target.files[0])}/>
                </div>
                <Button
                    className={styles.saveBtn}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={addNewActivity}
                >
                    Save
                </Button>
            </DialogContent>   
        </Dialog>

        {/* update activity dialog */}
        <Dialog open={openUpdate} onClose={handleCloseUpdate} aria-labelledby="form-dialog-title" fullWidth>
            <DialogTitle style={{backgroundColor: 'green', color: 'white' , textAlign: 'center'}} id="form-dialog-title">Update new Activity</DialogTitle>
            <br/>
            <DialogContent>
                <TextField
                    id='name'
                    defaultValue={name}
                    autoFocus
                    label="Activity Name"
                    type="text"
                    variant="filled"
                    fullWidth
                    onChange={(e)=>{setName(e.target.value)}}
                />
                <br/> <br/>
                <TextField 
                   id='description'
                   defaultValue={description}
                   label="description" 
                   type="text"
                   variant="filled"
                   fullWidth
                   multiline
                   rows={4}
                   onChange={(e)=>{setDescription(e.target.value)}}
                />
                <br/> <br/>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        margin="normal"
                        defaultValue={date}
                        id="date"
                        label="Date"
                        format="MM/dd/yyyy"
                        value={date}
                        onChange={handleDateChange}
                        minDate={new Date()}
                        fullWidth
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </MuiPickersUtilsProvider>
                <br/> <br/>
                <div class="mb-3">
                    <label htmlFor="formFile" class="form-label">Choose an Image</label>
                    <input 
                        style={{width: '85%'}} 
                        class="form-control" type="file" id="formFile"  
                        onChange={(e)=>setPicture(e.target.files[0])}
                    />
                    <div className={styles.edditedPictureContainer}>
                        <img src={picture} alt="club pic" />
                    </div>
                </div>
                <Button
                    className={styles.saveBtn}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={() => updateClubActivity(singleActivity._id)}
                >
                    Save
                </Button>
            </DialogContent>   
        </Dialog>

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
    </>
  );
}
