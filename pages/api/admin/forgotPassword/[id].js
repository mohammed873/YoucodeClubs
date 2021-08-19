import dbConnect from '../../../../utils/dbConnect';
import Admin from '../../../../models/admin';   
import crypto from 'crypto';
const bcrypt = require("bcryptjs");

dbConnect();

export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

     //Admin login
     if (method === 'PUT') {
    
        try {
            //hash the token param 
            const hashedToken = crypto.createHash('sha256').update(id).digest('hex');

             const { password } = req.body;
             const hashedPassword = await bcrypt.hash(password, 10)

             if (password === "" || password === undefined) {
                 return  res.status(400).json({
                     success: false , 
                     message : "please fill your password"
                })
             }


            const fetched_admin = await Admin.findOne({ 
                passwordResetToken: hashedToken ,
                passwordResetExpiresIn : {$gt : new Date()}
            });

            if (!fetched_admin) return  res.status(400).json({
                 success: false , 
                 message : "Token is invalid or has expired"
            })
     
            //update the password and reset the token & the expiration sate to undefiend
            fetched_admin.password = hashedPassword;
            fetched_admin.passwordResetToken = undefined;
            fetched_admin.passwordResetExpiresIn = undefined;

            //save the new password
            await fetched_admin.save()

            //send success message
            return res.status(200).json({
                success: true , 
                message: 'password updated successfully'
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