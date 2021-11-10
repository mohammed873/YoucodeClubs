import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/user';
// import  { loginValidations } from '../../../../utils/validation/validations';

dbConnect();

export default async (req, res) => {

    //Users verify code verification
    if (req.method === 'POST') {
    
       try {
            const { activationCode , id} = req.body;

            if(activationCode === ""){
                return  res.status(400).json({
                    success: false , 
                    message : "please enter a verification code"
                })
            }
            const fetched_user = await User.findOne({ _id: id });
            if (!fetched_user) return  res.status(400).json({
                success: false , 
                message : "User not found"
            })

            if (fetched_user.activationCode === activationCode) {

                await User.update(
                    { _id: fetched_user._id  },
                    { $set:
                       {
                         "isVerified": true
                       }
                    }
                 )
                     
                res.status(200).json({
                    message: "Welcome to youcode clubs platform ",
                });

            }
            else{
                return  res.status(400).json({
                    success: false , 
                    message : "Wrong verification code , please rechek your email again"
                })
            }
    
            
       } catch (error) {
            res.json({
                success: false , 
                message: error.message
            })
       }

    } 
    else {
       res.json({
           success: false , 
           message : "something went wrong"
        })
    }
  }