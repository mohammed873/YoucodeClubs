import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/user';   

dbConnect();

export default async (req, res) => {
    const { method } = req;

    if(method === "GET"){
        try {
            const usersCount = await User.count();

            res.status(200).json({
                success: true,  
                usersCount 
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

