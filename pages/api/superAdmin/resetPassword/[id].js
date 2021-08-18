const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import dbConnect from '../../../utils/dbConnect';
import SuperAdmin from '../../../models/superAdmin';


dbConnect();

export default async (req, res) => {
    const { query: { id },  method
    } = req;


    // superadmin reset password
    if ( method === "PUT"){
    try {

        const { password, newPassword } = req.body
        if(password === "" || password === undefined){
            return res.status(400).json({
               success: false , 
                message: 'Current Password required'
            });
        }
        else if(newPassword === "" || newPassword === undefined){
            return res.status(401).json({
                success: false , 
                message: 'new Password required'
            });
        }

        
        const super_Admin = await SuperAdmin.findOne({ _id: id })
        if (super_Admin) {
            
            bcrypt.compare(password, super_Admin.password, async (err, result) => {
                if (result) {
                const hashedPassword = await bcrypt.hash(newPassword, 10)
                super_Admin.password = hashedPassword
                const newPass = await super_Admin.save()
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
                message: 'Super Admin not found'
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