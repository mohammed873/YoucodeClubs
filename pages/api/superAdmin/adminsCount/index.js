import dbConnect from '../../../../utils/dbConnect';
import Admin from '../../../../models/admin';   

dbConnect();

export default async (req, res) => {
    const { method } = req;

    if(method === "GET"){
        try {
            const adminsCount = await Admin.count();

            res.status(200).json({
                success: true,  
                adminsCount 
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

