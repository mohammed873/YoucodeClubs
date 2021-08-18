import { useRouter } from 'next/router'
import SuperAdminLayout from '../components/superAdminLayout/layout'
import UserLayout from '../components/UserLayout/layout'
import '../styles/globals.css'



function MyApp({ Component, pageProps }) {
  const { asPath  } = useRouter()
 
  const Layout = () => {
    if (asPath === '/superadmin/dashboard' || asPath === '/superadmin/profile' || asPath === '/superadmin/admins' || asPath === '/superadmin/clubs'){
      return (
        <SuperAdminLayout>
          <Component {...pageProps} />
        </SuperAdminLayout>
      )
    }else if(asPath === '/'){
      return(
        <UserLayout>
          <Component {...pageProps} />
        </UserLayout>
      )
    }else{
      return(
        <Component {...pageProps} />
      )
    }
  }
  return <Layout/>
}

export default MyApp