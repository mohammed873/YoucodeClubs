import React , {useState , useEffect, useRef} from 'react';
import styles from '../../../styles/adminChat.module.css'
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
   const[admin , setAdmin] = useState(null)
   const[superAdmins , setSuperAdmins] = useState(null)
   const[clubGroubMessages , setClubGroubMessages] = useState(null)
   const[currentUserId , setCurrentUserId] = useState(null)
   const[ dataFetched , setDataFetched] = useState(false)
   const[updatedMessage , setUpdatedMessage] = useState(null)
   const [selectedMessageTobeUpdated , setSelectedMessageTobeUpdated] = useState(null)
   const[recieverId , setRecieverId] = useState(null)
   const[target , setTarget] = useState(false)
   const[messagesBetweenAdminsAndSuperAdmin,setMessagesBetweenAdminsAndSuperAdmin] = useState(null)
   const[messagesBetweenAdmins,setMessagesBetweenAdmins] = useState(null)
   const[messagesBetweenAdminsAndUsers , setMessagesBetweenAdminsAndUsers] = useState(null)
   const[users,setUsers] = useState(null)
   const[title ,setTitle] = useState(null)

   //For Responsive style
   const[showClub , setShowClub] = useState(true)
   const[showAdmins , setShowAdmins] = useState(false)
   const[showSuperAdmin , setShowSuperAdmin] = useState(false)
   const[showUsers , setShowUsers] = useState(false)

   const handleShowClubs = () => {
        setShowAdmins(false)
        setShowSuperAdmin(false)
        setShowUsers(false)
        setShowClub(true)
   }
   const handleShowUsers = () => {
        setShowAdmins(false)
        setShowSuperAdmin(false)
        setShowUsers(true)
        setShowClub(false)
   }
   const handleShowAdmins = () => {
        setShowAdmins(true)
        setShowSuperAdmin(false)
        setShowUsers(false)
        setShowClub(false)
   }
   const handleShowSuperAdmins = () => {
        setShowAdmins(false)
        setShowSuperAdmin(true)
        setShowUsers(false)
        setShowClub(false)
   }

   //create a ref for comment collection to use in post method
    const clubsGroubChatRef = collection(db , 'ClubsGroubChat');

    //create a ref for chat between admins and superadmin collection to use in post method
    const adminsAndSuperAdminChatRef = collection(db , 'Admins&SuberAdminChat');

    //create a ref for chat between admins collection to use in post method
    const adminsChatRef = collection(db , 'AdminsChat');

    //create a ref for chat between admins and users collection to use in post method
    const adminsAndUsersChatRef = collection(db , 'admins&UsersChat');

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
        await axios.get("https://youcode-clubs.vercel.app/api/superAdmin/clubs")
        .then( res => {
            setClubs(res.data.clubs)
            setSelectedClubId(res.data.clubs[1]._id)
        }).catch(err =>{
            console.log(err);
        })
    }

    //get all admins
    const getAllAdmins = async () => {
        await axios.get("https://youcode-clubs.vercel.app/api/superAdmin/admins")
        .then( res => {
            setAdmins(res.data.admins)
        }).catch(err =>{
            console.log(err);
        })
    }

    //get all users
    const getAllUsers = async () => {
        const token = localStorage.getItem('adminToken')
        const club_id = jwt(token).club_id
        await axios.get("https://youcode-clubs.vercel.app/api/user/")
        .then( res => {
            const Data = res.data.users
            const CurrentAdminClubUsers =  Data.filter(user => user.club_id === club_id )
            setUsers(CurrentAdminClubUsers)
        }).catch(err =>{
            console.log(err);
        })
    }

    //get admin  info
    const getAdminInfo = async () =>{
        const token = localStorage.getItem('adminToken')
        const id = jwt(token)._id
        await axios.get('https://youcode-clubs.vercel.app/api/admin/profile/'+ id)
        .then(res => {
        setAdmin(res.data.admin)

        setCurrentUserId(id)
        }).catch(err => {
        console.log(err)
        })
    }

    //get superadmin info 
    const getSuperAdminsInfo = async () => {
        axios.get('https://youcode-clubs.vercel.app/api/superAdmin')
            .then(res => {
                setSuperAdmins(res.data.superAdmins)
            }).catch(err => {
                console.log(err);
            })
    }




    //create message for club groub chat
    const sendMessage = async () => {
        const date = new Date();
    
            const payload = {
                userID : admin && admin[0]._id ,
                clubId: selectedClubId,
                message: message,
                picture : admin && admin[0].picture,
                userName : admin && admin[0].full_name,
                role : admin && admin[0].role,
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
        setTarget("groubMessages")
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
            //smooth scrool 
            messageDownSection.current.scrollIntoView({ behavior: 'smooth' })
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
                userID : admin && admin[0]._id ,
                clubId: selectedClubId ,
                message: updatedMessage,
                picture : admin && admin[0].picture,
                userName : admin && admin[0].full_name,
                role : admin && admin[0].role,
                createdAt: docSnap.createdAt,
                updatedAt: date
            }

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




    //create message between admins and superadmin
    const sendMessageBetweenAdminsAndSuperAdmin = async () => {
        const date = new Date();
    
            const payload = {
                superAdminId : recieverId ,
                adminId: admin && admin[0]._id,
                senderID : admin && admin[0]._id,
                message: message,
                picture : admin && admin[0].picture,
                userName : admin && admin[0].full_name,
                role : admin && admin[0].role,
                createdAt: date,
                updatedAt: date
            }
        
            if(message === null || message === "" ){
                toast.configure()
                toast.error("message must not be empty")
            }else{
                await addDoc(adminsAndSuperAdminChatRef , payload)
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
        setTarget("messagesBetweenAdminsAndSuperadmin")
        setRecieverId(id);
        try {
            const q = query(collection(db, "Admins&SuberAdminChat"), orderBy("createdAt", "asc"));
            onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            setMessagesBetweenAdminsAndSuperAdmin(data)
            setDataFetched(true)
            //smooth scrool 
            messageDownSection.current.scrollIntoView({ behavior: 'smooth' })
        });
        } catch (error) {
            console.log(error);
        }
    
    }

    //delete document by id from the chat between admins and admin
    const deleteMessageBetweenadminAndSuperAdmin = async (docId) => {
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
    const updateMessageBetweenAdminsAndSuperAdmin = async () => {
        const date = new Date();
        const docRef = doc(db , "Admins&SuberAdminChat" , selectedMessageTobeUpdated);
            const docSnap =   (await getDoc(docRef)).data();
            const payload = {
                superAdminId : recieverId ,
                adminId: admin && admin[0]._id,
                senderID : admin && admin[0]._id ,
                message: updatedMessage,
                picture : admin && admin[0].picture,
                userName : admin && admin[0].full_name,
                role : admin && admin[0].role,
                createdAt: docSnap.createdAt,
                updatedAt: date
            }

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




    //get messages between admins 
    const getMessagesBetweenAdmins = async (id , title) => {
        setTarget("adminsChat")
        setRecieverId(id);
        setTitle(title)
        try {
            const q = query(collection(db, "AdminsChat"), orderBy("createdAt", "asc"));
            onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            setMessagesBetweenAdmins(data)
            setDataFetched(true)
            //smooth scrool 
            messageDownSection.current.scrollIntoView({ behavior: 'smooth' })
        });
        } catch (error) {
            console.log(error);
        }
    }

    // create messages between admins
    const sendMessageBtweenAdmin = async () => {
        const date = new Date();
    
        const payload = {
            recieverAdminId : recieverId ,
            senderAdminId: admin && admin[0]._id,
            senderID : admin && admin[0]._id,
            message: message,
            picture : admin && admin[0].picture,
            userName : admin && admin[0].full_name,
            role : admin && admin[0].role,
            createdAt: date,
            updatedAt: date
        }
    
        if(message === null || message === "" ){
            toast.configure()
            toast.error("message must not be empty")
        }else{
            await addDoc(adminsChatRef , payload)
            document.querySelector('#message').value= ''
            setMessage(null)
            toast.configure()
            toast.success("message sent successfully")

            //smooth scrool 
            messageDownSection.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    //delete message between admins
    const deleteMessageBetweenadmins = async (docId) => {
        try {
            const docRef = doc(db , "AdminsChat" , docId);
            await deleteDoc(docRef);
            toast.configure()
            toast.success("message deleted successfully")
        } catch (error) {
            toast.configure()
            toast.error("something went wrong , try again later")
        }
    }

    //update document by id between admins
    const updateMessageBetweenAdmins = async () => {
        const date = new Date();
        const docRef = doc(db , "AdminsChat" , selectedMessageTobeUpdated);
            const docSnap =   (await getDoc(docRef)).data();
            const payload = {
                recieverAdminId : recieverId ,
                senderAdminId: admin && admin[0]._id,
                senderID : admin && admin[0]._id,
                message: updatedMessage,
                picture : admin && admin[0].picture,
                userName : admin && admin[0].full_name,
                role : admin && admin[0].role,
                createdAt: docSnap.createdAt,
                updatedAt: date
            }

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



    //get messages between admin and users
    const getMessagesBetweenAdminAndUsers = async (id , title) => {
        setTarget("admin&users")
        setRecieverId(id);
        setTitle(title)
        try {
            const q = query(collection(db, "admins&UsersChat"), orderBy("createdAt", "asc"));
            onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            setMessagesBetweenAdminsAndUsers(data)
            setDataFetched(true)
            //smooth scrool 
            messageDownSection.current.scrollIntoView({ behavior: 'smooth' })
        });
        } catch (error) {
            console.log(error);
        }
    }

    // create messages between admins and users
    const sendMessageBetweenAdminAndUsers = async () => {
        const date = new Date();
    
        const payload = {
            userId : recieverId ,
            AdminId: admin && admin[0]._id,
            senderID : admin && admin[0]._id,
            message: message,
            picture : admin && admin[0].picture,
            userName : admin && admin[0].full_name,
            role : admin && admin[0].role,
            createdAt: date,
            updatedAt: date
        }
    
        if(message === null || message === "" ){
            toast.configure()
            toast.error("message must not be empty")
        }else{
            await addDoc(adminsAndUsersChatRef , payload)
            document.querySelector('#message').value= ''
            setMessage(null)
            toast.configure()
            toast.success("message sent successfully")

            //smooth scrool 
            messageDownSection.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    // delte messages between admins and users
    const deleteMessageBetweenadminsAndUsers = async (docId) => {
        try {
            const docRef = doc(db , "admins&UsersChat" , docId);
            await deleteDoc(docRef);
            toast.configure()
            toast.success("message deleted successfully")
        } catch (error) {
            toast.configure()
            toast.error("something went wrong , try again later" , error)
        }
    }

    //update message between admins and users 
    const updateMessageBetweenAdminsAndUsers = async () => {
        const date = new Date();
        const docRef = doc(db , "admins&UsersChat" , selectedMessageTobeUpdated);
            const docSnap =   (await getDoc(docRef)).data();
            const payload = {
                userId : recieverId ,
                AdminId: admin && admin[0]._id,
                senderID : admin && admin[0]._id,
                message: updatedMessage,
                picture : admin && admin[0].picture,
                userName : admin && admin[0].full_name,
                role : admin && admin[0].role,
                createdAt: docSnap.createdAt,
                updatedAt: date
            }

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
        getAdminInfo()
        getSuperAdminsInfo()
        getAllUsers()
    },[])
  return (
    <>
       <main>
           <div className={styles.chatContainer}>
               <div className={styles.chatBodyContainer}>
                   <div className={styles.chatContentContainer}>
                   <div className={dataFetched ? styles.clubDynamicTitle : styles.noChatTargetSelected}>{title && title}</div>
                       <div className={styles.chatBodyContent}>
                           
                           {
                            dataFetched ?  
                           
                           
                               target === "messagesBetweenAdminsAndSuperadmin" ? 
                                    messagesBetweenAdminsAndSuperAdmin && messagesBetweenAdminsAndSuperAdmin.length > 0 ? 
                                        messagesBetweenAdminsAndSuperAdmin && messagesBetweenAdminsAndSuperAdmin.map(message => {
                                            return (
                                            <div key={message.id} className={message.adminId == currentUserId && message.superAdminId == recieverId ? styles.showMessages : styles.hideMessages}> 
                                                <div className={ message.senderID == currentUserId ? styles.chatmessageForCurrentUser : styles.chatmessage}>
                                                    <div className={styles.userPictureContainer}>
                                                        <img src={message.picture} alt="user picture" />
                                                    </div>
                                                    <div className={styles.userMessage}>{message.message}</div>
                                                </div>
                                                <div className={ message.senderID == currentUserId ? styles.timeForCurrentUser : styles.timeForOtherUsers}>
                                                    <p>{moment(message.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a') }</p>
                                                    <div className={ message.senderID == currentUserId ? styles.timeExtraSpcaeForCurrentUser : styles.timeExtraSpcaeForOtherUsers}></div>
                                                    <div className={ message.senderID == currentUserId ? styles.showAction : styles.hideAction } >
                                                        <span onClick={() => handleClickOpenUpdateMessage(message.id , message.message)}>
                                                            <EditIcon/>
                                                        </span>
                                                        <span onClick={() => deleteMessageBetweenadminAndSuperAdmin(message.id)}>
                                                            <DeleteIcon/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })
                                    :
                                    dataFetched ? <p className={styles.infoMessage}> There is no messages yet</p> : <p className={styles.infoMessage}>Select a club or a an admin to start a  conversation with</p> 
                                : target === "groubMessages" ? 

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
                                                     <div className={ message.userID == currentUserId ? styles.timeExtraSpcaeForCurrentUser : styles.timeExtraSpcaeForOtherUsers}></div>
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

                                : target === "adminsChat" ? 

                                        messagesBetweenAdmins && messagesBetweenAdmins.length > 0 ? 
                                        messagesBetweenAdmins && messagesBetweenAdmins.map(message => {
                                            return (
                                            <div 
                                               key={message.id} 
                                               className={
                                                   message.senderAdminId == currentUserId && message.recieverAdminId == recieverId || message.senderAdminId == recieverId  && message.recieverAdminId == currentUserId ? 
                                                   styles.showMessages : styles.hideMessages
                                                }
                                            > 
                                                <div className={ message.senderID == currentUserId ? styles.chatmessageForCurrentUser : styles.chatmessage}>
                                                    <div className={styles.userPictureContainer}>
                                                        <img src={message.picture} alt="user picture" />
                                                    </div>
                                                    <div className={styles.userMessage}>{message.message}</div>
                                                </div>
                                                <div className={ message.senderID == currentUserId ? styles.timeForCurrentUser : styles.timeForOtherUsers}>
                                                    <p>{moment(message.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a') }</p>
                                                    <div className={ message.senderID == currentUserId ? styles.timeExtraSpcaeForCurrentUser : styles.timeExtraSpcaeForOtherUsers}></div>
                                                    <div className={ message.senderID == currentUserId ? styles.showAction : styles.hideAction } >
                                                        <span onClick={() => handleClickOpenUpdateMessage(message.id , message.message)}>
                                                            <EditIcon/>
                                                        </span>
                                                        <span onClick={() => deleteMessageBetweenadmins(message.id)}>
                                                            <DeleteIcon/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })
                                    :
                                    dataFetched ? <p className={styles.infoMessage}> There is no messages yet</p> : <p className={styles.infoMessage}>Select a club or a an admin to start a  conversation with</p>
                                
                                : target === "admin&users" ? 

                                    messagesBetweenAdminsAndUsers && messagesBetweenAdminsAndUsers.length > 0 ? 
                                    messagesBetweenAdminsAndUsers && messagesBetweenAdminsAndUsers.map(message => {
                                        return (
                                        <div 
                                            key={message.id} 
                                            className={message.AdminId == currentUserId && message.userId == recieverId || message.AdminId == recieverId  && message.userId == currentUserId ? styles.showMessages : styles.hideMessages}
                                        > 
                                            <div className={ message.senderID == currentUserId ? styles.chatmessageForCurrentUser : styles.chatmessage}>
                                                <div className={styles.userPictureContainer}>
                                                    <img src={message.picture} alt="user picture" />
                                                </div>
                                                <div className={styles.userMessage}>{message.message}</div>
                                            </div>
                                            <div className={ message.senderID == currentUserId ? styles.timeForCurrentUser : styles.timeForOtherUsers}>
                                                <p>{moment(message.createdAt.toDate()).format('MMMM Do YYYY, h:mm:ss a') }</p>
                                                <div className={ message.senderID == currentUserId ? styles.timeExtraSpcaeForCurrentUser : styles.timeExtraSpcaeForOtherUsers}></div>
                                                <div className={ message.senderID == currentUserId ? styles.showAction : styles.hideAction } >
                                                    <span onClick={() => handleClickOpenUpdateMessage(message.id , message.message)}>
                                                        <EditIcon/>
                                                    </span>
                                                    <span onClick={() => deleteMessageBetweenadminsAndUsers(message.id)}>
                                                        <DeleteIcon/>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        )
                                    })
                                :
                                dataFetched ? <p className={styles.infoMessage}> There is no messages yet</p> : <p className={styles.infoMessage}>Select a club or a an admin to start a  conversation with</p>
                            : null
                            : <p className={styles.infoMessage}>Select with whom you want to talk </p>  
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
                                    {target === "messagesBetweenAdminsAndSuperadmin" ? 
                                        <button onClick={sendMessageBetweenAdminsAndSuperAdmin}>SEND</button>
                                    : target === "groubMessages" ?
                                        <button onClick={sendMessage}>SEND</button>
                                    : target === "adminsChat" ?
                                        <button onClick={sendMessageBtweenAdmin}>SEND</button>
                                    : target === "admin&users" ?
                                        <button onClick={sendMessageBetweenAdminAndUsers}>SEND</button>
                                    : null
                                    }
                                </div>
                                <br /><br />
                            </>
                            :
                            <div></div>
                        }
                   </div>
                   <div className={styles.chatAdminsContainer}>
                       <div className={styles.spaceBeforeBtns}></div>
                       <div className={styles.showChatTargetsContainer}>
                           <span className={styles.showClubsBtn} onClick={handleShowClubs}>Clubs</span>
                           <span className={styles.showSuperAdminsBtn} onClick={handleShowSuperAdmins}>Super Admin</span>
                           <span className={styles.showAdminsBtn} onClick={handleShowAdmins}>Admins</span>
                           <span className={styles.showUsersBtn} onClick={handleShowUsers}>Users</span>
                       </div>
                       <div className={styles.spaceAfterBtns}></div>
                        <div className={showClub ? styles.adminListContainer : styles.Hidden}>
                            <div className={styles.Title}>Clubs List</div>
                            <div className={styles.chatAdminDivInResponsiveMode}>
                                    {clubs && clubs.map(club =>{
                                            return (
                                                <div className={styles.chatClubDiv} key={club._id} onClick={() => getClubGroubChatMessages(club._id , club.name)}>
                                                      <div>  <p className={styles.clubName}>{club.name}</p></div>
                                                 <div style={{position: "absolute"}}>   <img src={club.picture} alt="club picture" /></div>
                                                
                                                </div>  
                                            )
                                        })}
                            </div>
                        </div>

                        <div className={showSuperAdmin ? styles.superAdminsContainer : styles.Hidden}>
                            <div className={styles.Title}>Super Admins List</div>
                            <div className={styles.chatAdminDivInResponsiveMode}>
                                    {superAdmins && superAdmins.map(superAdmin =>{
                                            return (
                                                <div 
                                                    className={styles.chatSuperAdminDiv}
                                                    key={superAdmin._id} 
                                                    onClick={() => getMessagesBetweenAdminsAndSuperAdmin(superAdmin._id , superAdmin.full_name)}
                                                >
                                                    <div className={styles.adminInfo}>
                                                            <span>
                                                                <img src={superAdmin.picture} alt="admin picture" />
                                                            </span>
                                                            <span id={styles.fullName}>{superAdmin.full_name}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                            </div>
                        </div>

                        <div className={showAdmins ? styles.adminListContainer : styles.Hidden}>
                            <div className={styles.Title}>Admins List</div>
                            <div className={styles.chatAdminDivInResponsiveMode}>
                                    {admins && admins.map(admin =>{
                                            return (
                                                <div 
                                                    className={currentUserId === admin._id ? styles.chatAdminDivForCurrentUser : styles.chatAdminDiv} 
                                                    key={admin._id} 
                                                    onClick={() => getMessagesBetweenAdmins(admin._id , admin.full_name)}
                                                >
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

                        <div className={showUsers ? styles.superAdminsContainer : styles.Hidden}>
                            <div className={styles.Title}>Users List</div>
                            <div className={styles.chatAdminDivInResponsiveMode}>
                                    {users && users.map(user =>{
                                            return (
                                                <div 
                                                    className={styles.chatSuperAdminDiv}
                                                    key={user._id} 
                                                    onClick={() => getMessagesBetweenAdminAndUsers(user._id , user.full_name)}
                                                >
                                                    <div className={styles.adminInfo}>
                                                            <span>
                                                                <img src={user.picture} alt="admin picture" />
                                                            </span>
                                                            <span id={styles.fullName}>{user.full_name}</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                            </div>
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
                    {target === "messagesBetweenAdminsAndSuperadmin" ?
                     <Button
                     className={styles.editBtn}
                     variant="contained"
                     color="primary"
                     size="small"
                     onClick={updateMessageBetweenAdminsAndSuperAdmin}
                    >
                        Update
                    </Button>
                    : target === "groubMessages" ?
                    <Button
                        className={styles.editBtn}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={updateMessageFromClubGroubMessage}
                    >
                        Update
                    </Button>
                    : target === "adminsChat" ?
                    <Button
                        className={styles.editBtn}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={updateMessageBetweenAdmins}
                    >
                        Update
                    </Button>

                    : target === "admin&users" ?
                    <Button
                        className={styles.editBtn}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={updateMessageBetweenAdminsAndUsers}
                    >
                        Update
                    </Button>
                    : null
                    }
                </DialogContent>   
            </Dialog>
       </main>
    </>
  );
}
