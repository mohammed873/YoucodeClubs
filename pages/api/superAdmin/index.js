import dbConnect from '../../../utils/dbConnect';
import SuperAdmin from '../../../models/superAdmin';
const bcrypt = require("bcryptjs");

dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {


        //getting all users
        case 'GET':
            try {
                const superAdmins = await SuperAdmin.find();

                res.status(200).json({ 
                    success: true,  
                    superAdmins 
                })
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    error: error.message
                });
            }
            break;


        //adding new super admin    
        case 'POST':
             const emailExist = await SuperAdmin.findOne({ email: req.body.email});
             if (emailExist)
             return res.status(400).json({
               message: "Email address already exists",
             });

            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(req.body.password, salt);

            const super_admin = new SuperAdmin({
                full_name: req.body.full_name,
                email: req.body.email,
                password: hashpassword,
                picture: req.body.picture,
                isLoggedIn : false
            });

             try {
                const newSuperAdmin = await super_admin.save();

                res.status(201).json({ 
                    message: "SuperAdmin successfully created",
                    newSuperAdmin,
                 })
            } catch (error) {
                res.status(400).json({ success: false , error: error.message});
            }
            break;


        default:
            res.status(400).json({ success: false });
            break;
    }
}