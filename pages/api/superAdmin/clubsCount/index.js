import dbConnect from '../../../../utils/dbConnect';
import Club from '../../../../models/club';   

dbConnect();

export default async (req, res) => {
    const { method } = req;

    if(method === "GET"){
        try {
            const clubsCount = await Club.count();

            res.status(200).json({
                success: true,  
                clubsCount 
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

