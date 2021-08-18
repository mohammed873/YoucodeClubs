const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import dbConnect from '../../../../utils/dbConnect';
import SuperAdmin from '../../../../models/superAdmin';
// import  { loginValidations } from '../../../../utils/validation/validations';

dbConnect();

export default async (req, res) => {

    //superadmin login
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
            const super_admin = await SuperAdmin.findOne({ email: email });
            if (!super_admin) return  res.status(400).json({
                success: false , 
                message : "Wrong credentials"
            })
    
            const validPass = await bcrypt.compare(password, super_admin.password);
            if (!validPass) return res.status(400).json({
                success: false , 
                message : "Wrong credentials"
            })

            await SuperAdmin.update(
                { _id: super_admin._id  },
                { $set:
                   {
                     "isLoggedIn": true
                   }
                }
             )
            
            const token = jwt.sign({
                 _id: super_admin._id , 
                 role: super_admin.role ,
                 isLoggedIn : super_admin.isLoggedIn
            }, process.env.TOKEN_SUPER_ADMIN);
                
            res.status(200).json({
            message: "you are loged in",
            token,
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