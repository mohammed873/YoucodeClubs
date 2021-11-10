import react , {useState, useEffect} from 'react'
import Head from 'next/head'
import styles from '../../../styles/dashboard.module.css'
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import CategoryIcon from '@material-ui/icons/Category';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Roll from 'react-reveal/Bounce';
import axios from 'axios';
import MaterialTable from 'material-table'
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function dashboard() {
  const [usersCount , setUsersCount] = useState(0)
  const [clubsCount , setClubsCount] = useState(0)
  const [adminsCount , setAdminsCount] = useState(0)
  const [users , setUsers] = useState([])

  //get the users count
  const fetchUsersCount = async () => {
      axios.get('https://youcode-clubs.vercel.app/api/superAdmin/usersCount')
           .then(res =>{
            setUsersCount(res.data.usersCount)
           }).catch(err =>{
             console.log(err)
           })
  }

  //get the clubs count
  const fetchClubsCount = async () => {
    axios.get('https://youcode-clubs.vercel.app/api/superAdmin/clubsCount')
         .then(res =>{
          setClubsCount(res.data.clubsCount)
         }).catch(err =>{
           console.log(err)
         })
  }

  //get the admins count
  const fetchAdminsCount = async () => {
    axios.get('https://youcode-clubs.vercel.app/api/superAdmin/adminsCount')
         .then(res =>{
          setAdminsCount(res.data.adminsCount)
         }).catch(err =>{
           console.log(err)
         })
  }

  //fetch all users list
  const fetchUersList = async () => {
    axios.get('https://youcode-clubs.vercel.app/api/user')
         .then(res =>{
          setUsers(res.data.users)
         }).catch(err =>{
           console.log(err)
         })
  }

  //delete user by id
  const deleteUser = async (id) => {
    await axios.delete('https://youcode-clubs.vercel.app/api/user/profile/'+id)
    .then(res => {
        fetchUersList()
        fetchUsersCount()
        toast.configure()
        toast.success(res.data.message)
    }).catch(err => {
        console.log(err);
    })
}

  useEffect (() => {
    fetchUsersCount()
    fetchAdminsCount()
    fetchClubsCount()
    fetchUersList()
  }, [])

  return (
    <div>
      <Head>
        <title>Youcode Clubs || superAdmin || dashboard</title>
        <meta name="description" content="this dashboard is how a super admin can manage clubs and admins" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      <main>
         <div className={styles.statsContainer}>
           <div className={styles.stats}>
              <EmojiPeopleIcon/>
              <h2>{usersCount}</h2>
              <Roll left>
                <p>All clubs Members</p>
              </Roll>
           </div>
           <div  className={styles.stats}>
                <CategoryIcon/>
                <h2>{clubsCount}</h2>
                <Roll left>
                  <p> Clubs </p>
                </Roll>
              
           </div>
           <div  className={styles.stats}>
              <SupervisorAccountIcon/>
              <h2>{adminsCount}</h2>
              <Roll left>
                <p>Admins</p>
              </Roll>
           
           </div>
         </div>
         <br/>
         <div className={styles.tableContainer}>
            <MaterialTable
                title=" Users List"
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
                data={users} 
                actions={[
                    {
                      icon: 'delete',
                      tooltip: 'delete user',
                      onClick: (event, rowData) => {
                        deleteUser(rowData._id)
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
      </main>
    </div>
  )
}
