import dbConnect from '../../../../utils/dbConnect';
import Admin from '../../../../models/admin';   
const bcrypt = require("bcryptjs");
import  { adminValidations } from '../../../../utils/validation/validations';

dbConnect();

export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

    switch (method) {

        //get admin info
        case 'GET':
            try {
           
                const admin = await Admin.aggregate([{
                    $lookup: {
                        from: "clubs",
                        localField: "club_id",
                        foreignField: "_id",
                        as: "club"
                    }
                }]);

                if (!admin) {
                    return res.status(400).json({
                        success: false , 
                        message:"admin  is not found"
                    });
                }

                res.status(200).json({
                    success: true, 
                    admin 
                 });
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    error : error.message 
                });
            }
            break;
         
        //updatting  admin info    
        case 'PUT':
        

            try {
                
                const { error } = adminValidations(req.body);
                    if (error)
                        return res.status(500).json({
                        success: false,     
                        message: error.details[0].message,
                    });
                
                const admin = await Admin.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!admin) {
                    return res.status(400).json({ 
                        success: false ,
                        message : "Admin not found"
                    });
                }

                res.status(200).json({ 
                    success: true, 
                    message : "Admin info updated successfully" , 
                    admin
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false ,
                    message: error.message
                });
            }
            break;
    
        case 'DELETE':
            res.status(400).json({ success: false })
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}