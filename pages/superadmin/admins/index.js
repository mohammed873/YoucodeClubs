import React , {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Head from 'next/head'
import axios from 'axios'
import MaterialTable from 'material-table'
import styles from '../../../styles/admins.module.css'
import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormControl } from '@material-ui/core'
import { InputLabel } from '@material-ui/core'
import { Select } from '@material-ui/core'
import { MenuItem } from '@material-ui/core'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const useStyles = makeStyles((theme) => ({
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function Admins() {   
//input states
const [full_name , setFullName] = useState('')
const [email , setEmail] = useState('')
const [club_id , setClub_id] = useState('')
const [picture , setPicture] = useState('')


//clubs State
const [clubs , setClubs] = useState([])

//admin to be eddited states  
const [edditedAdmin , setEdditedAdmin] = useState([])

//admins State
const [admins , setAdmins] = useState([])


//related to material ui dailog
const [open, setOpen] = useState(false);
const classes = useStyles();

const handleClickOpen = () => {
    setOpen(true);
};
  
const handleClose = () => {
    setOpen(false);
};   

//empty all inputs after submmit
const emptyInputs = () => {
    document.querySelector('#email').value = ''
    document.querySelector('#full_name').value = ''
    document.querySelector('#club_id').value = ''

    //empty states
    setFullName('')
    setEmail('')
    setPicture('')
    setClub_id('')
}

//adding new admin
const addAdmin = async () => {
    const picture =  await pictureUpload()

    await axios.post('http://localhost:3000/api/superAdmin/admins',{
     full_name,
     email ,
     club_id ,
     picture 
   }).then(res =>{
    //fire up success notifications
       toast.configure()
       toast.success(res.data.message)  
    //fetch all admin
        getAllAdmins()
    //empty inputs
        emptyInputs()
    //close modal
         handleClose()  

   }).catch(err =>{
    toast.configure()
    toast.error(err.response.data.message)
   })

}

//get all clubs 
const getAllClubs = async () => {
    await axios.get("http://localhost:3000/api/superAdmin/clubs")
    .then( res => {
        setClubs(res.data.clubs)
    }).catch(err =>{
        console.log(err);
    })
}

//get all admins
const getAllAdmins = async () => {
    await axios.get("http://localhost:3000/api/superAdmin/admins")
    .then( res => {
        setAdmins(res.data.admins)
    }).catch(err =>{
        console.log(err);
    })
}

//related to material ui dailog (update)
const [openupdate, setOpenUpdate] = useState(false);

//close update dialog
const handleCloseUpdate = () => {
  setOpenUpdate(false);
}; 

//show update model and fetch data 
const handleClickOpenUpdate = async (id) => {
   await axios.get('http://localhost:3000/api/superAdmin/admins/'+id)
   .then((res) =>{

       //set the state with the admin to be edited
        setEdditedAdmin(res.data.admin)

        //open the modal
        setOpenUpdate(true);

        //set the admins attributes to be update
        setFullName(res.data.admin.full_name)
        setEmail(res.data.admin.email)
        setClub_id(res.data.admin.club_id)
        setPicture(res.data.admin.picture)

   }).catch((err) =>{
     console.log(err);
   })
 
};

//update admins info 
const updateAdminInfo = async (id) => {

   const picture =  await pictureUpload()

   await axios.put("http://localhost:3000/api/superAdmin/admins/" + id,{
    full_name,
    email,
    club_id,
    picture
   })
   .then( res => {
    
    //empty qll inputs field   
    emptyInputs()   

    //recal the get all admins function
    getAllAdmins()

    //close the update modal
    handleCloseUpdate()

    //fire up success notifications
    toast.configure()
    toast.success(res.data.message)

   }).catch(err =>{
    toast.configure()
    toast.error(err.response.data.message)
   })
}

//delete Admin by id
const deleteAdmin = async (id) => {
    await axios.delete('http://localhost:3000/api/superAdmin/admins/'+id)
    .then(res => {
        getAllAdmins()
        toast.configure()
        toast.success(res.data.message)
    }).catch(err => {
        console.log(err);
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
    getAllClubs()
    getAllAdmins()
}, [])
  return (
    <>
       <Head>
        <title>Create Next Ap</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></link>
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>
      <main style={{ marginTop: "-85px"}}>
         <div className={styles.headerContainer}>
             <h1>ALL CLUB ADMINS</h1>
             <Button variant="contained" onClick={handleClickOpen}>Add new admin</Button>
         </div> 
         <br/>
        <div className={styles.tableContainer}>
            <MaterialTable
                title=""
                columns={[
                    { 
                        title: 'Avatar', 
                        field: 'picture', 
                        render: rowData => <img src={rowData.picture} style={{width: 50 , height: 50, borderRadius: '50%'}}/> 
                    },
                    { title: 'Full Name', field: 'full_name' },
                    { title: 'email', field: 'email' },
                    { 
                        title: 'Online', 
                        field: 'isLoggedIn',
                        lookup : { true : "online" , false : "offline"}
                    },
                    { title: 'Club Name', field: 'club[0].name'},
                ]}
                data={admins} 
                actions={[
                    {
                        icon: 'edit',
                        tooltip: 'editt admin',
                        onClick: (event, rowData) => {
                            handleClickOpenUpdate(rowData._id)
                        }
                    },
                    {
                      icon: 'delete',
                      tooltip: 'delete admin',
                      onClick: (event, rowData) => {
                        deleteAdmin(rowData._id)
                      }
                    },
                   
                  ]}
                options={{
                    headerStyle: {
                    backgroundColor: '#01579b',
                    color: '#FFF'
                    },
                    exportButton: true,
                    actionsColumnIndex: -1,
                }}    
            />
        </div>
        
        {/* add new admin dailog */}
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
            <DialogTitle style={{backgroundColor: 'darkblue', color: 'white' , textAlign: 'center'}} id="form-dialog-title">Adding new Admins</DialogTitle>
            <br/>
            <DialogContent>
                <TextField
                    id='full_name'
                    autoFocus
                    label="Full Name"
                    type="text"
                    variant="filled"
                    fullWidth
                    onChange={(e)=>{setFullName(e.target.value)}}
                />
                <br/> <br/>
                <TextField 
                   id='email'
                   label="email" 
                   type="email"
                   variant="filled"
                   fullWidth
                   onChange={(e)=>{setEmail(e.target.value)}}
                />
                <br/> <br/>
                <FormControl variant="filled" fullWidth>
                    <InputLabel id="demo-simple-select-filled-label">Clubs</InputLabel>
                    <Select
                      id="club_id"
                      onChange={(e)=>{setClub_id(e.target.value)}}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {clubs.map(club  =>  <MenuItem value={club._id}>{club.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <br/><br/>
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
                    onClick={()=> addAdmin()}
                >
                    Save
                </Button>
            </DialogContent>
        </Dialog>


        {/* update club dialog */}
        <Dialog open={openupdate} onClose={handleCloseUpdate} aria-labelledby="form-dialog-title" fullWidth>
             <DialogTitle id="form-dialog-title" style={{backgroundColor: 'green', color: 'white' , textAlign: 'center'}}>Update Admin details</DialogTitle>
                <br/>
                <DialogContent>
                <TextField
                    defaultValue={edditedAdmin.full_name}
                    id='full_name'
                    autoFocus
                    label="Full Name"
                    type="text"
                    variant="filled"
                    fullWidth
                    onChange={(e)=>{setFullName(e.target.value)}}
                />
                <br/> <br/>
                <TextField 
                   defaultValue={edditedAdmin.email}
                   id='email'
                   label="email" 
                   type="email"
                   variant="filled"
                   fullWidth
                   onChange={(e)=>{setEmail(e.target.value)}}
                />
                <br/> <br/>
                  <FormControl fullWidth variant="filled" >
                        <Select
                            id="club_id"
                            defaultValue={edditedAdmin.club_id}
                            onChange={(e)=>{setClub_id(e.target.value)}}
                            displayEmpty
                            className={classes.selectEmpty}
                       
                        >
                            <MenuItem value={edditedAdmin.club_id} >
                            <em>none</em>
                            </MenuItem>
                           {clubs.map(club  =>  <MenuItem value={club._id}>{club.name}</MenuItem>)}
                        </Select>
                </FormControl>
                <br/><br/>
                <div class="mb-3">
                    <label for="formFile" class="form-label">Choose a picture</label>
                    <input style={{width: '85%'}} class="form-control" type="file" id="formFile"  onChange={(e)=>setPicture(e.target.files[0])}/>
                    <div className={styles.edditedPictureContainer}>
                        <img src={edditedAdmin.picture} alt="club pic" />
                    </div>
                </div>
                <Button
                    className={styles.editBtn}
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<EditIcon />}
                    onClick={()=>updateAdminInfo(edditedAdmin._id)}
                >
                    Edit
                </Button>
            </DialogContent>  
        </Dialog>     
      </main>
    </>
  );
}


