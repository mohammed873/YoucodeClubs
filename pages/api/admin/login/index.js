const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import dbConnect from '../../../../utils/dbConnect';
import Admin from '../../../../models/admin';
// import  { loginValidations } from '../../../../utils/validation/validations';

dbConnect();

export default async (req, res) => {

    //admins login
    if (req.method === 'POST') {
    
       try {
            const { email , password } = req.body;

            if(email === ""){
                return  res.status(400).json({
                    success: false , 
                    message : "please fill your email address"
                })
            }
            else if (password === ""){
                return  res.status(400).json({
                    success: false , 
                    message : "please fill your password"
                })
            }
            const fetched_admin = await Admin.findOne({ email: email });
            if (!fetched_admin) return  res.status(400).json({
                success: false , 
                message : "Wrong credentials"
            })
    
            const validPass = await bcrypt.compare(password, fetched_admin.password);
            if (!validPass) return res.status(400).json({
                success: false , 
                message : "Wrong credentials"
            })

            await Admin.update(
                { _id: fetched_admin._id  },
                { $set:
                   {
                     "isLoggedIn": true
                   }
                }
             )
            
            const token = jwt.sign({
                 _id: fetched_admin._id , 
                 role: fetched_admin.role ,
                 isLoggedIn : fetched_admin.isLoggedIn,
                 isRessted : fetched_admin.isRessted,
                 club_id : fetched_admin.club_id
            }, process.env.TOKEN_ADMINS);
                
            res.status(200).json({
            message: "you are loged in",
            token,
            });
       } catch (error) {
        res.json({
            success: false , 
            message: error.message
        })
       }
    } else {
       res.json({
           success: false , 
           message : "something went wrong"
        })
    }
  }