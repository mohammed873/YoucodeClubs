import React , {useState , useEffect, useRef} from 'react';
import styles from '../../../styles/superadminChat.module.css'
import axios from 'axios'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
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


   //create a ref for comment collection to use in post method
    const clubsGroubChatRef = collection(db , 'ClubsGroubChat');

    //intialize useRef for scrolling down after sending a messageDownSection
    const messageDownSection = useRef()

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
    const getClubGroubChatMessages = async (id) => {
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

    useEffect(() => {
        getAllAdmins()
        getAllClubs()
        getSuperAdminInfo()
    },[])
  return (
    <>
       <main>
           <div className={styles.chatContainer}>
               <div className={styles.chatClubsSection}>
                  {clubs && clubs.map(club => {
                      return (
                        <div className={styles.chatClubDiv} key={club._id} onClick={() => getClubGroubChatMessages(club._id)}>
                             <img src={club.picture} alt="club picture" />
                        </div>  
                      )
                  })}     
               </div>
               <br />
               <div className={styles.chatBodyContainer}>
                   <div className={styles.chatContentContainer}>
                       <div className={styles.chatBodyContent}>
                           {clubGroubMessages && clubGroubMessages.length > 0 ? 
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
                                                    <span>
                                                        <EditIcon/>
                                                    </span>
                                                    <span>
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
                            <div className={styles.chatFormContainer}>
                                <input 
                                    type="text" 
                                    placeholder="Write something"
                                    required
                                    id="message"
                                    onChange={(e)=> setMessage(e.target.value)}
                                />
                                <button onClick={sendMessage}>SEND</button>
                            </div>
                            :
                            <div></div>
                        }
                   </div>
                   <div className={styles.chatAdminsContainer}>
                        {admins && admins.map(admin =>{
                            return (
                                <div className={styles.chatAdminDiv} key={admin._id}>
                                    <div className={styles.adminInfo}>
                                            <span>
                                                <img src={admin.picture} alt="admin picture" />
                                            </span>
                                            <span>{admin.full_name}</span>
                                    </div>
                                    <hr />
                                    <p>{admin.club[0].name}</p>
                                </div>
                            )
                        })}
                   </div>
               </div>
           </div>
       </main>
    </>
  );
}
