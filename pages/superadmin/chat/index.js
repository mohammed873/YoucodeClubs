import React , {useState , useEffect, useRef} from 'react';
import styles from '../../../styles/superadminChat.module.css'
import axios from 'axios'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import jwt from 'jwt-decode'
import moment from 'moment'
import { db } from '../../../firebase/firebaseConfig';
import {collection, onSnapshot , addDoc , where , orderBy , query , deleteDoc , doc  , setDoc,getDoc } from 'firebase/firestore';

export default function Chat() {
   const[admins , setAdmins] = useState(null)
   const[clubs , setClubs] = useState(null)
   const [message , setMessage] = useState(null)
   const[selectedClubId , setSelectedClubId]= useState(null)
   const[superAdmin , setSuperAdmin] = useState(null)
   const[clubGroubMessages , setClubGroubMessages] = useState(null)
   const[currentUserId , setCurrentUserId] = useState(null)
   const[ dataFetched , setDataFetched] = useState(false)
   const[updatedMessage , setUpdatedMessage] = useState(null)
   const [selectedMessageTobeUpdated , setSelectedMessageTobeUpdated] = useState(null)
   const[recieverId , setRecieverId] = useState(null)
   const[isAdminChat , setIsAdminChat] = useState(false)
   const[messagesBetweenAdminsAndSuperAdmin,setMessagesBetweenAdminsAndSuperAdmin] = useState(null)
   const[title ,setTitle] = useState(null)

   //create a ref for comment collection to use in post method
    const clubsGroubChatRef = collection(db , 'ClubsGroubChat');

    //create a ref for comment collection to use in post method
    const adminsAndSuperadminChatRef = collection(db , 'Admins&SuberAdminChat');

    //intialize useRef for scrolling down after sending a messageDownSection
    const messageDownSection = useRef()

    //related to material ui dailog(update comment)
    const [openUpdateMessage, setOpenUpdateMessage] = useState(false);
    
    const handleClickOpenUpdateMessage = (id , Message) => {
        setSelectedMessageTobeUpdated(id)
        setUpdatedMessage(Message);
        setOpenUpdateMessage(true);
    };

    const handleCloseUpdateMessage = () => {
        setOpenUpdateMessage(false);
    }; 

   //get all clubs 
   const getAllClubs = async () => {
        await axios.get("http://localhost:3000/api/superAdmin/clubs")
        .then( res => {
            setClubs(res.data.clubs)
            setSelectedClubId(res.data.clubs[1]._id)
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

    //create message for club groub chat
    const sendMessage = async () => {
        const date = new Date();
    
            const payload = {
                userID : superAdmin && superAdmin._id ,
                clubId: selectedClubId,
                message: message,
                picture : superAdmin && superAdmin.picture,
                userName : superAdmin && superAdmin.full_name,
                role : superAdmin && superAdmin.role,
                createdAt: date,
                updatedAt: date
            }
        
            if(message === null || message === "" ){
                toast.configure()
                toast.error("message must not be empty")
            }else{
                await addDoc(clubsGroubChatRef , payload)
                document.querySelector('#message').value= ''
                setMessage(null)
                toast.configure()
                toast.success("message sent successfully")
    
                //smooth scrool 
                messageDownSection.current.scrollIntoView({ behavior: 'smooth' })
            }
    }

    //get all groub chat message by club id on real time
    const getClubGroubChatMessages = async (id , title) => {
        setTitle(title)
        setIsAdminChat(false)
        setSelectedClubId(id);
        try {
            const q = query(collection(db, "ClubsGroubChat"), where("clubId", "==", id), orderBy("createdAt", "asc"));
            onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            setClubGroubMessages(data)
            setDataFetched(true)
        });
        } catch (error) {
            console.log(error);
        }
    
    }

    //delete document by id from the club groub chat collection
    const deleteMessageFromClubChatGroub = async (docId) => {
        try {
            const docRef = doc(db , "ClubsGroubChat" , docId);
            await deleteDoc(docRef);
            toast.configure()
            toast.success("message deleted successfully")
        } catch (error) {
            toast.configure()
            toast.error("something went wrong , try again later")
        }
    }

    //update document by id from the club groub chat collection
    const updateMessageFromClubGroubMessage = async () => {
        const date = new Date();
        const docRef = doc(db , "ClubsGroubChat" , selectedMessageTobeUpdated);
            const docSnap =   (await getDoc(docRef)).data();
            const payload = {
                userID : superAdmin && superAdmin._id ,
                clubId: selectedClubId ,
                message: updatedMessage,
                picture : superAdmin && superAdmin.picture,
                userName : superAdmin && superAdmin.full_name,
                role : superAdmin && superAdmin.role,
                createdAt: docSnap.createdAt,
                updatedAt: date
            }

            console.log(payload);

            if(updatedMessage === null || updatedMessage === "" ){
                toast.configure()
                toast.error("message must not be empty")
            }else{
                await setDoc(docRef , payload)
                document.querySelector('#updatedMessageForClubChat').value= ''
                setUpdatedMessage(null)
                toast.configure()
                toast.success("message updated successfully")
    
                handleCloseUpdateMessage()
                setUpdatedMessage(null)
            }
    }

    //create message for club groub chat
    const sendMessageBetweenAdminsAndSuperadmin = async () => {
        const date = new Date();
    
            const payload = {
                senderID : superAdmin && superAdmin._id ,
                recieverId: recieverId,
                message: message,
                picture : superAdmin && superAdmin.picture,
                userName : superAdmin && superAdmin.full_name,
                role : superAdmin && superAdmin.role,
                createdAt: date,
                updatedAt: date
            }
        
            if(message === null || message === "" ){
                toast.configure()
                toast.error("message must not be empty")
            }else{
                await addDoc(adminsAndSuperadminChatRef , payload)
                document.querySelector('#message').value= ''
                setMessage(null)
                toast.configure()
                toast.success("message sent successfully")
    
                //smooth scrool 
                messageDownSection.current.scrollIntoView({ behavior: 'smooth' })
            }
    }

    //get all groub chat message by recieverId between admins and super admin on real time
    const getMessagesBetweenAdminsAndSuperAdmin = async (id , title) => {
        setTitle(title)
        setIsAdminChat(true)
        setRecieverId(id);
        try {
            const q = query(collection(db, "Admins&SuberAdminChat"), where("recieverId", "==", id), orderBy("createdAt", "asc"));
            onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            setMessagesBetweenAdminsAndSuperAdmin(data)
            setDataFetched(true)
        });
        } catch (error) {
            console.log(error);
        }
    
    }

    //delete document by id from the chat between admins and superadmin
    const deleteMessageBetweenSuperAdminAndAdmins = async (docId) => {
        try {
            const docRef = doc(db , "Admins&SuberAdminChat" , docId);
            await deleteDoc(docRef);
            toast.configure()
            toast.success("message deleted successfully")
        } catch (error) {
            toast.configure()
            toast.error("something went wrong , try again later")
        }
    }

    //update document by id between admins and super admin
    const updateMessageBetweenAdminsAndSuperadmin = async () => {
        const date = new Date();
        const docRef = doc(db , "Admins&SuberAdminChat" , selectedMessageTobeUpdated);
            const docSnap =   (await getDoc(docRef)).data();
            const payload = {
                senderID : superAdmin && superAdmin._id ,
                recieverId: recieverId,
                message: updatedMessage,
                picture : superAdmin && superAdmin.picture,
                userName : superAdmin && superAdmin.full_name,
                role : superAdmin && superAdmin.role,
                createdAt: docSnap.createdAt,
                updatedAt: date
            }

            console.log(payload);

            if(updatedMessage === null || updatedMessage === "" ){
                toast.configure()
                toast.error("message must not be empty")
            }else{
                await setDoc(docRef , payload)
                document.querySelector('#updatedMessageForClubChat').value= ''
                setUpdatedMessage(null)
                toast.configure()
                toast.success("message updated successfully")
    
                handleCloseUpdateMessage()
                setUpdatedMessage(null)
            }
    }

    useEffect(() => {
        getAllAdmins()
        getAllClubs()
        getSuperAdminInfo()
    },[])
  return (
    <>
       <main>
           <div className={styles.chatContainer}>
               <div>
               <div className={styles.ClubTitle}>Clubs List</div>
                    <div className={styles.chatClubsSection}>
                        {clubs && clubs.map(club => {
                            return (
                                <div className={styles.chatClubDiv} key={club._id} onClick={() => getClubGroubChatMessages(club._id , club.name)}>
                                    <img src={club.picture} alt="club picture" />
                                </div>  
                            )
                        })}     
                    </div>
               </div>
               <br />
               <div className={styles.chatBodyContainer}>
                   <div className={styles.chatContentContainer}>
                   <div className={styles.clubDynamicTitle}>{title && title}</div>
                       <div className={styles.chatBodyContent}>
                           {isAdminChat ? 

                                messagesBetweenAdminsAndSuperAdmin && messagesBetweenAdminsAndSuperAdmin.length > 0 ? 
                                    messagesBetweenAdminsAndSuperAdmin && messagesBetweenAdminsAndSuperAdmin.map(message => {
                                        return (
                                        <div key={message.id}> 
                                            <div className={ message.senderID == currentUserId ? styles.chatmessageForCurrentUser : styles.chatmessage}>
                                                <div className={styles.userPictureContainer}>
                                                    <img src={message.picture} alt="user picture" />
                                                </div>
                                                <div className={styles.userMessage}>{message.message}</div>
                                            </div>
                                            <div className={ message.senderID == currentUserId ? styles.timeForCurrentUser : styles.timeForOtherUsers}>
                                                <p>{moment(message.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a') }</p>
                                                <div style={{width :"12px"}}></div>
                                                <div className={ message.senderID == currentUserId ? styles.showAction : styles.hideAction } >
                                                    <span onClick={() => handleClickOpenUpdateMessage(message.id , message.message)}>
                                                        <EditIcon/>
                                                    </span>
                                                    <span onClick={() => deleteMessageBetweenSuperAdminAndAdmins(message.id)}>
                                                        <DeleteIcon/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })
                                :
                                dataFetched ? <p className={styles.infoMessage}> There is no messages yet</p> : <p className={styles.infoMessage}>Select a club or a an admin to start a  conversation with</p> 
                                :
                                clubGroubMessages && clubGroubMessages.length > 0 ? 
                                    clubGroubMessages && clubGroubMessages.map(message => {
                                        return (
                                        <div key={message.id}> 
                                            <div className={ message.userID == currentUserId ? styles.chatmessageForCurrentUser : styles.chatmessage}>
                                                <div className={styles.userPictureContainer}>
                                                    <img src={message.picture} alt="user picture" />
                                                </div>
                                                <div className={styles.userMessage}>{message.message}</div>
                                            </div>
                                            <div className={ message.userID == currentUserId ? styles.timeForCurrentUser : styles.timeForOtherUsers}>
                                                <p>{moment(message.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a') }</p>
                                                <div style={{width :"12px"}}></div>
                                                <div className={ message.userID == currentUserId ? styles.showAction : styles.hideAction } >
                                                    <span onClick={() => handleClickOpenUpdateMessage(message.id , message.message)}>
                                                        <EditIcon/>
                                                    </span>
                                                    <span onClick={() => deleteMessageFromClubChatGroub(message.id)}>
                                                        <DeleteIcon/>
                                                    </span>
                                                 </div>
                                            </div>
                                        </div>
                                        )
                                    })
                                :
                                dataFetched ? <p className={styles.infoMessage}> There is no messages yet</p> : <p className={styles.infoMessage}>Select a club or a an admin to start a  conversation with</p> 
                           }
                          <div ref={messageDownSection} style={{height:"12vh" , float: "right"}}></div>
                       </div>
                       {dataFetched ? 
                            <>
                                <div className={styles.chatFormContainer}>
                                    <input 
                                        type="text" 
                                        placeholder="Write something"
                                        required
                                        id="message"
                                        onChange={(e)=> setMessage(e.target.value)}
                                    />
                                    {isAdminChat ? 
                                    <button onClick={sendMessageBetweenAdminsAndSuperadmin}>SEND</button>
                                    :
                                    <button onClick={sendMessage}>SEND</button>
                                    }
                                </div>
                                <br />
                            </>
                            :
                            <div></div>
                        }
                   </div>
                   <div className={styles.chatAdminsContainer}>
                       <div className={styles.Title}>Admins List</div>
                       <div className={styles.chatAdminDivInResponsiveMode}>
                            {admins && admins.map(admin =>{
                                    return (
                                        <div className={styles.chatAdminDiv} key={admin._id} onClick={() => getMessagesBetweenAdminsAndSuperAdmin(admin._id , admin.full_name)}>
                                            <div className={styles.adminInfo}>
                                                    <span>
                                                        <img src={admin.picture} alt="admin picture" />
                                                    </span>
                                                    <span id={styles.fullName}>{admin.full_name}</span>
                                            </div>
                                            <hr />
                                            <p>{admin.club[0].name}</p>
                                        </div>
                                    )
                                })}
                       </div>
                   </div>
               </div>
           </div>
          <div className={styles.spicer}></div>

            {/* update message Club chat groub dialog */}
            <Dialog open={openUpdateMessage} onClose={handleCloseUpdateMessage} aria-labelledby="form-dialog-title" fullWidth>
                <DialogTitle style={{backgroundColor: 'darkblue', color: 'white' , textAlign: 'center'}} id="form-dialog-title">Update message</DialogTitle>
                <br/>
                <DialogContent>
                    <TextField
                        id='updatedMessageForClubChat'
                        defaultValue={updatedMessage}
                        autoFocus
                        label="message"
                        type="text"
                        variant="filled"
                        required
                        fullWidth
                        onChange={(e)=>{setUpdatedMessage(e.target.value)}}
                    />
                    <br/> <br/>
                    {isAdminChat ?
                     <Button
                     className={styles.editBtn}
                     variant="contained"
                     color="primary"
                     size="small"
                     onClick={updateMessageBetweenAdminsAndSuperadmin}
                    >
                        Update 
                    </Button>
                    :
                    <Button
                        className={styles.editBtn}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={updateMessageFromClubGroubMessage}
                    >
                        Update 
                    </Button>
                    }
                </DialogContent>   
            </Dialog>
       </main>
    </>
  );
}
