const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/user';
// import  { loginValidations } from '../../../../utils/validation/validations';

dbConnect();

export default async (req, res) => {

    //Users login
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
            const fetched_user = await User.findOne({ email: email });
            if (!fetched_user) return  res.status(400).json({
                success: false , 
                message : "Wrong credentials"
            })
    
            const validPass = await bcrypt.compare(password, fetched_user.password);
            if (!validPass) return res.status(400).json({
                success: false , 
                message : "Wrong credentials"
            })

            await User.update(
                { _id: fetched_user._id  },
                { $set:
                   {
                     "isLoggedIn": true
                   }
                }
             )
            
            const token = jwt.sign({
                 _id: fetched_user._id , 
                 role: fetched_user.role ,
                 isLoggedIn : fetched_user.isLoggedIn,
                 isVerified : fetched_user.isVerified,
                 club_id : fetched_user.club_id
            }, process.env.TOKEN_USER);
                
            res.status(200).json({
                message: "you are loged in ",
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