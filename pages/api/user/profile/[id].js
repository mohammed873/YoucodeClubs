import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/user';   
const bcrypt = require("bcryptjs");
import  { userValidationsForUpdate } from '../../../../utils/validation/validations';

dbConnect();

export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

    switch (method) {

        //get a single user
        case 'GET':
            try {
                
                const fetched_user = await User.findById(id);

                if (!fetched_user) {
                    return res.status(400).json({ 
                        success: false , 
                        message:"user is not found"
                    });
                }

                res.status(200).json({ 
                    success: true, 
                    fetched_user ,
              
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false  , 
                    error: error.message
                });
            }
            break;

        //updating  a single user info    
        case 'PUT':
            try {
                // const salt = await bcrypt.genSalt(10);
                // const hashpassword = await bcrypt.hash(req.body.password, salt);
                
                const { error } = userValidationsForUpdate(req.body);
                if (error)
                    return res.status(500).json({
                    success: false,     
                    message: error.details[0].message,
                });
               
                
                const fetched_user = await User.findByIdAndUpdate(id, req.body ,{
                    new: true,
                    runValidators: true
                });

                if (!fetched_user) {
                    return res.status(400).json({
                         success: false , 
                         error: error.message,
                    });
                }

                res.status(200).json({ 
                    success: true, 
                    message : "user info updated successfully",
                    fetched_user,
                   
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    error: error.message
                });
            }
            break;

        //deleting a single user account    
        case 'DELETE':
            try {
                const deleted_user = await User.deleteOne({ _id: id });

                if (!deleted_user) {
                    return res.status(400).json({
                         success: false,
                         message : "user acount not found" 
                        })
                }

                res.status(200).json({
                     success: true,
                     message : " user account deleted successfully"
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false  , 
                    error: error.message
                })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}