import dbConnect from '../../../../utils/dbConnect';
import Admin from '../../../../models/admin';
import  { randomPassword, sendMail,  } from '../../../../utils/methods';
import  { adminValidations } from '../../../../utils/validation/validations';


const bcrypt = require("bcryptjs");


dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {


        //getting all admins
        case 'GET':
            try {
                const admins = await Admin.aggregate([{
                    $lookup: {
                        from: "clubs",
                        localField: "club_id",
                        foreignField: "_id",
                        as: "club"
                    }
                }]);
                
                res.status(200).json({
                     success: true,  
                     admins 
                    })
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    error: error.message
                });
            }
            break;


        //adding new admin  
        case 'POST':
            const tempPassword = randomPassword(6);
            req.body.password = tempPassword;
            console.log(tempPassword);


            const { error } = adminValidations(req.body);
            if (error)
                return res.status(500).json({
                success: false,     
                message: error.details[0].message,
            });

            
            const emailExists = await Admin.findOne({ email: req.body.email});
            if (emailExists)
             return res.status(400).json({
                success: false,  
               message: "Email adress already exists",
            });

            //hash password before saving
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(req.body.password, salt);

            const admin = new Admin({
                full_name: req.body.full_name,
                email: req.body.email,
                password: hashpassword,
                picture: req.body.picture ,
                club_id : req.body.club_id,
                isLoggedIn: false,
                isRessted: false
            });

             try {
                const newAdmin = await admin.save();

                //mail configations
                const to = req.body.email
                const subject = "Admin acount Creation"
                const html = `congratulation ${req.body.full_name} your acount is successfully created 
                and this is your password :   ${tempPassword}`

                await sendMail(to ,subject, html)

                res.status(201).json({ 
                    message: "admin  successfully created",
                    newAdmin,
                })
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    error: error.message
                });
            }
            break;


        default:
            res.status(400).json({ 
                success: false , 
                error: error.message
            });
            break;
    }
}