import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/user';
import  { randomPassword, sendMail,  } from '../../../../utils/methods';
import  { userValidations } from '../../../../utils/validation/validations';


const bcrypt = require("bcryptjs");


dbConnect();

export default async (req, res) => {
    const { method } = req;

    if(method === "POST"){
        //adding new user
        const { error } = userValidations(req.body);
            if (error)
                return res.status(500).json({
                success: false,     
                message: error.details[0].message,
            });

            
            const emailExists = await User.findOne({ email: req.body.email});
            if (emailExists)
             return res.status(400).json({
                success: false,  
               message: "User exists , you only have the right to join one club , for more option check your profile",
            });

             //generate an activation code
             const activationCode = randomPassword(4);

            //hash password before saving
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(req.body.password, salt);

            const user = new User({
                full_name: req.body.full_name,
                email: req.body.email,
                password: hashpassword,
                picture: req.body.picture ,
                club_id : req.body.club_id,
                isLoggedIn: false,
                activationCode : activationCode
            });



             try {
                

                const newUser = await user.save();

                //mail configations
                const to = req.body.email
                const subject = "User acount Creation"
                const html = `congratulation ${req.body.full_name} your acount is successfully created 
                this is you activation code :   ${activationCode}`

                console.log(to)
                console.log(html)

                await sendMail(to ,subject, html)

                res.status(201).json({ 
                    message: "your acount is successfully created , check your email address for an activation code",
                    newUser,
                })
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    error: error.message
                });
            }

    }else{
        res.status(400).json({ 
            success: false , 
            error: "something went wrong"
        });
    }

}