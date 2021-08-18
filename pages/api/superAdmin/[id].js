import dbConnect from '../../../utils/dbConnect';
import SuperAdmin from '../../../models/superadmin';   
const bcrypt = require("bcryptjs");
import  { SuperAdminValidationsForUpdate } from '../../../utils/validation/validations';

dbConnect();

export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

    switch (method) {

        //get a single super admin
        case 'GET':
            try {
                const super_admin = await SuperAdmin.findById(id);

                if (!super_admin) {
                    return res.status(400).json({ 
                        success: false , 
                        message:"SuperAdmin is not found"
                    });
                }

                res.status(200).json({ 
                    success: true, 
                    super_admin  
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false  , 
                    error: error.message
                });
            }
            break;

        //updating  a single super admin    
        case 'PUT':
            try {
                // const salt = await bcrypt.genSalt(10);
                // const hashpassword = await bcrypt.hash(req.body.password, salt);
                
                const { error } = SuperAdminValidationsForUpdate(req.body);
                if (error)
                    return res.status(500).json({
                    success: false,     
                    message: error.details[0].message,
                });
               
                
                const super_admin = await SuperAdmin.findByIdAndUpdate(id, req.body ,{
                    new: true,
                    runValidators: true
                });

                if (!super_admin) {
                    return res.status(400).json({
                         success: false , 
                         error: error.message,
                    });
                }

                res.status(200).json({ 
                    success: true, 
                    message : "super admin info updated successfully",
                    super_admin,
                   
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    error: error.message
                });
            }
            break;

        //deleting a single super admin    
        case 'DELETE':
            try {
                const deleted_super_admin = await SuperAdmin.deleteOne({ _id: id });

                if (!deleted_super_admin) {
                    return res.status(400).json({
                         success: false,
                         message : "super admin isn't found" 
                        })
                }

                res.status(200).json({
                     success: true,
                     message : "super admin deleted successfully"
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