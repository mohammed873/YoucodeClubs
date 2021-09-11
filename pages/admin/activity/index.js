import React , {useState , useEffect} from 'react';
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
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function Activity() {
    const [name, setName] = useState('')
    const [description , setDescription] = useState('')
    const [date, setDate] = React.useState(new Date());
    const [picture , setPicture] = useState('')

    const handleDateChange = (date) => {
        setDate(date);
    };

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

    //get a random club activity
    const getRandomActivity = async () => {

        await axios.get('http://localhost:3000/api/admin/getRandomActivity')
        .then( res =>{
            setRandomActivity(res.data.randomClubActivty)
            console.log(res.data.randomClubActivty)
        }).catch( err => {
            console.log(err);
        })
    }

    //get all club activity by club id
    const getAllClubActivities = async () => {
        const adminToken = localStorage.getItem('adminToken')
        const club_id = jwt(adminToken).club_id
        
        await axios.get('http://localhost:3000/api/admin/clubActivity/' + club_id)
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

        await axios.post('http://localhost:3000/api/admin/clubActivity',{
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

        await axios.put('http://localhost:3000/api/admin/clubActivity/' + id , {
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
       await axios.get(' http://localhost:3000/api/admin/getSingleActivity/' + id)
       .then(res =>{
        setSingleActivity(res.data.singleActivity)
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
        await axios.delete('http://localhost:3000/api/admin/clubActivity/' + id)
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

     useEffect(() => {
        getAllClubActivities()
        getRandomActivity()
       
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
                      <span>{random ? randomActivity && randomActivity[0].date : singleActivity && singleActivity.date}</span>
                  </div>
                  <div className={styles.ActivityCommentsContainer}>

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
    </>
  );
}
