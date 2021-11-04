import { useRouter } from 'next/router'
import SuperAdminLayout from '../components/superAdminLayout/layout'
import AdminLayout from '../components/AdminLayout/layout'
import UserLayout from '../components/UserLayout/layout'
import '../styles/globals.css'



function MyApp({ Component, pageProps }) {
  const { asPath  } = useRouter()
 
  const Layout = () => {
    if (asPath === '/superadmin/dashboard' || asPath === '/superadmin/profile' || asPath === '/superadmin/admins' || asPath === '/superadmin/clubs' || asPath === '/superadmin/chat'){
      return (
        <SuperAdminLayout>
          <Component {...pageProps} />
        </SuperAdminLayout>
      )
    }else if(asPath === '/admin/dashboard' || asPath === '/admin/club' || asPath === '/admin/profile' || asPath === '/admin/activity' || asPath === '/admin/chat'){
      return(
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      )
    }else if(asPath === '/user/dashboard'|| asPath === '/user/profile' || asPath === '/user/userClub' || asPath === '/user/chat'){
      return(
        <UserLayout>
          <Component {...pageProps} />
        </UserLayout>
      
      )
    }else {
      return <Component {...pageProps} />
    }
  }
  return <Layout/>
}

export default MyApp