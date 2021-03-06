import React ,{useState , useEffect} from 'react';
import styles from '../../../styles/adminClub.module.css'
import axios from 'axios'
import Head from 'next/head'
import jwt from 'jwt-decode'
import EditIcon from '@material-ui/icons/Edit';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SaveIcon from '@material-ui/icons/Save';
import DialogTitle from '@material-ui/core/DialogTitle';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Club() {
    
    const [club , setClub ] = useState([])
    const [name , setName ] = useState('')
    const [description , setDescription ] = useState('')
    const [picture , setPicture] = useState('')


    //related to material ui dailog (update)
    const [openUpdate, setOpenUpdate] = useState(false);

    //open update dialog
    const handleClickOpenUpdate = () => {
        setOpenUpdate(true);
        setName(club.name);
        setDescription(club.description);
        setPicture(club.picture);
    }

    //close update dialog
    const handleCloseUpdate = () => {
        setOpenUpdate(false);
    }; 

    //get the admin club 
    const getClubInfo = async () => {
        const adminToken = localStorage.getItem('adminToken')
        const club_id = jwt(adminToken).club_id
       
        await axios.get('https://youcode-clubs.vercel.app/api/admin/club/' + club_id)
        .then(res =>{
            setClub(res.data.club);
        }).catch(err =>{
            console.log(err);
        })
    }

    //update a single club by id
    const editClub = async (id ) => {
 
        const picture =  await pictureUpload()

        await axios.put('https://youcode-clubs.vercel.app/api/superAdmin/clubs/' + id,{
        name ,
        description ,
        picture ,
        })
        .then((res) =>{

        toast.configure()
        toast.success(res.data.message)
    
        handleCloseUpdate()
        getClubInfo()
        }).catch((err) =>{
        toast.configure()
        toast.error(err.response.data.message)
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
        
        return res2.url
    }

    useEffect(() => {
        getClubInfo()
    },[])
  return (
    <>
       <main>
           <Head>
                <title>youcodeClubs || admin || club</title>
                <meta name="description" content="Generated by create next app" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
           </Head>
           <div className={styles.clubContainer}>
                <div className={styles.clubDetailsContainer}>
                    <h1>{club.name}</h1>
                    <br/>
                    <p>{club.description}</p>
                    <br/> 
                    <Button
                        className={styles.editClubBtn}
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={ () => handleClickOpenUpdate(club._id)}
                    >
                        Edit Club Info
                    </Button>
                </div>
                <div className={styles.clubImageContainer}>
                    <img src={club.picture} alt="club pic" />
                </div>
           </div>
           <br/>

           <Dialog open={openUpdate} onClose={handleCloseUpdate} aria-labelledby="form-dialog-title" fullWidth>
             <DialogTitle id="form-dialog-title" style={{backgroundColor: 'green', color: 'white' , textAlign: 'center'}}>update Club details</DialogTitle>
                <br/>
                <DialogContent>
                    <TextField
                        defaultValue={club.name}
                        id='name'
                        autoFocus
                        label="Club Name"
                        type="text"
                        variant="filled"
                        fullWidth
                        onChange={(e)=>{setName(e.target.value)}}
                    />
                    <br/> <br/>
                    <TextField 
                      defaultValue={club.description}
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
                    <div class="mb-3">
                      <label htmlFor="formFile" class="form-label">Choose an Image</label>
                      <input 
                        style={{width: '85%'}} 
                        class="form-control" type="file" id="formFile"  
                        onChange={(e)=>setPicture(e.target.files[0])}
                      />
                      <div className={styles.edditedPictureContainer}>
                           <img src={club.picture} alt="club pic" />
                      </div>
                    </div>
                    <Button
                        className={styles.editBtn}
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<SaveIcon />}
                        onClick={()=>editClub(club._id)}
                    >
                        Save
                    </Button>
              </DialogContent>   
            </Dialog> 
       </main>
    </>
  );
}
