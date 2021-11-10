import dbConnect from '../../../../utils/dbConnect';
import SuperAdmin from '../../../../models/superAdmin';   
import crypto from 'crypto';
const bcrypt = require("bcryptjs");

dbConnect();

export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

     //superadmin reset password in case it is forgetten
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


            const super_admin = await SuperAdmin.findOne({ 
                passwordResetToken: hashedToken ,
                passwordResetExpiresIn : {$gt : new Date()}
            });

            if (!super_admin) return  res.status(400).json({
                 success: false , 
                 message : "Token is invalid or has expired"
            })
     
            //update the password and reset the token & the expiration sate to undefiend
            super_admin.password = hashedPassword;
            super_admin.passwordResetToken = undefined;
            super_admin.passwordResetExpiresIn = undefined;

            //save the new password
            await super_admin.save()

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