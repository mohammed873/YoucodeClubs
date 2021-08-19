const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import dbConnect from '../../../../utils/dbConnect';
import Admin from '../../../../models/admin';


dbConnect();

export default async (req, res) => {
    const { query: { id },  method
    } = req;


    // Admin reset password
    if ( method === "PUT"){
    try {

        const { defaultPassword, newPassword } = req.body
        if(defaultPassword === "" || defaultPassword === undefined){
            return res.status(400).json({
               success: false , 
                message: 'Default Password required'
            });
        }
        else if(newPassword === "" || newPassword === undefined){
            return res.status(401).json({
                success: false , 
                message: 'new Password required'
            });
        }

        
        const fetched_admin = await Admin.findOne({ _id: id })
        if (fetched_admin) {
            
            bcrypt.compare(defaultPassword, fetched_admin.password, async (err, result) => {
                if (result) {
                const hashedPassword = await bcrypt.hash(newPassword, 10)
                fetched_admin.password = hashedPassword

                await Admin.update(
                    { _id: fetched_admin._id  },
                    { $set:
                       {
                         "isRessted": true
                       }
                    }
                 )

                // fetched_admin.isRessted = true
                const newPass = await fetched_admin.save()
                res.status(200).json({ 
                    success: true, 
                    message : "password updated successfully",              
                });
                } else {
                    return res.status(401).json({
                        success: false , 
                        message: 'Wrong Password'
                    });
                }
            })

        }else{
            return res.status(401).json({
                success: false , 
                message: ' Admin not found'
            })
        }

        
    } catch (error) {
        console.log(error.message)
    }

    // in case red. method was not a PUT request
    } else {
       res.json({
           success: false , 
           message : "something went wrong"
        })
    }
  }