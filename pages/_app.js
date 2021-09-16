import { useRouter } from 'next/router'
import SuperAdminLayout from '../components/superAdminLayout/layout'
import AdminLayout from '../components/AdminLayout/layout'
import UserLayout from '../components/UserLayout/layout'
import '../styles/globals.css'



function MyApp({ Component, pageProps }) {
  const { asPath  } = useRouter()
 
  const Layout = () => {
    /* eslint-disable */
    if (asPath === '/superadmin/dashboard' || asPath === '/superadmin/profile' || asPath === '/superadmin/admins' || asPath === '/superadmin/clubs'){
      return (
        <SuperAdminLayout>
          <Component {...pageProps} />
        </SuperAdminLayout>
      )
    }else if(asPath === '/admin/dashboard' || asPath === '/admin/club' || asPath === '/admin/profile' || asPath === '/admin/activity'){
      /* eslint-disable */
      return(
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      )
    }else{
      /* eslint-disable */
      return(
        <Component {...pageProps} />
      )
    }
  }
  return <Layout/>
}

export default MyApp