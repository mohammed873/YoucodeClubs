const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import dbConnect from '../../../../utils/dbConnect';
import SuperAdmin from '../../../../models/superAdmin';


dbConnect();

export default async (req, res) => {

    //superadmin login
    if (req.method === 'POST') {
        const {
            query: { id },
            method
        } = req;
    
       try {
           
           const super_admin = await SuperAdmin.findByIdAndUpdate( 
            { _id: id },
            { $set:
               {
                 "isLoggedIn": false
               }
            }, 
            {
                    new: true,
                    runValidators: true
            });
                
            res.status(200).json({
            message: "you are loged out ",
            super_admin,
            });
       } catch (error) {
        res.json({
            success: false , 
            error: error.message
        })
       }
    } else {
       res.json({
           success: false , 
           message : "something went wrong"
        })
    }
  }