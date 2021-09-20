import dbConnect from '../../../utils/dbConnect';
import User from '../../../models/user';


dbConnect();

export default async (req, res) => {
    const { method } = req;

    if(method === "GET"){
        //getting all users
        try {
            const users = await User.aggregate([{
                $lookup: {
                    from: "clubs",
                    localField: "club_id",
                    foreignField: "_id",
                    as: "club"
                }
             }]);
            
            res.status(200).json({
                success: true,  
                 users 
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