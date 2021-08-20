import React from 'react';
// import styles from '../../../styles/adminDashbord.module.css';

export default function navBar({children}) {
  return (
    <>
    <main>
       <div className="AdminMainBody">
         <div  className="adminNavBarContainer">
           
         </div>
         <div  className="admincontentContainer">
            {children}
         </div>
       </div>
    </main>
    </>
  );
}
