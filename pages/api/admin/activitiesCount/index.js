import dbConnect from '../../../../utils/dbConnect';
import ClubActivity from '../../../../models/clubActivity';   

dbConnect();

export default async (req, res) => {
    const { method } = req;

    if(method === "GET"){
        try {
            const activitiesCount = await ClubActivity.count();

            res.status(200).json({
                success: true,  
                activitiesCount 
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

