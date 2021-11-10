import bcrypt from "bcryptjs";
import crypto from "crypto";
import dbConnect from '../../../../utils/dbConnect';
import Admin from '../../../../models/admin';
import  {  sendMail  } from '../../../../utils/methods';


dbConnect();

export default async (req, res) => {
    const { method } = req;

    //Admin forget password
    if (method === 'POST') {
    try {

        const { email  } = req.body
    
        //check email before sending the fetch request to the server
        if(email === "" || email === undefined){

            return res.status(401).json({
                success: false , 
                message: 'Email address is required'
            });
        }

        //find super admin by email
        const fetched_admin = await Admin.findOne({email: email});
        if (fetched_admin) {
      
        //generate a unique resetToken
        const resetToken = crypto.randomBytes(32).toString("hex");

        //hasch the generated Reset token before saving it to the database
        fetched_admin.passwordResetToken  = crypto.createHash('sha256').update(resetToken).digest("hex");

        //set a 10 min expiration to the reset token
        fetched_admin.passwordResetExpiresIn = Date.now() + 10 * 60 * 60 * 1000;

        //save to the db 
        await fetched_admin.save({})

        //mail configations
        const to = "melhachimi514@gmail.com"
        const subject = "Request to reset password"
        const html = `
                <h3> hello you requested to reset your password! </h3>
                <P> click the following link to reset your password <a href="https://youcode-clubs.vercel.app/admin/forgotPassword/${resetToken}">RESET MY PASSWORD</a> </P>
                <h4>Note: This link will expire in 10 min</h4>
            `
        //send an email with the reset link 
        await sendMail(to ,subject, html)

        //send a message for theadmin to check his email
        res.status(200).json({ 
            success: true,
            message: "Check your email , and follow the instructions",
        })



         

        }else{
            return res.status(401).json({
                success: false , 
                message: 'Admin with this email address not found'
            }); 
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