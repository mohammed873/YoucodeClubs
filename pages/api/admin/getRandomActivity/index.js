import dbConnect from '../../../../utils/dbConnect';
import ClubActivity from '../../../../models/clubActivity';   


dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {

        //adding new club  
        case 'GET':
            
            try {
               
                const randomClubActivty = await ClubActivity.aggregate([{ $sample: { size: 1 } }])
                if (!randomClubActivty) {
                    return res.status(400).json({
                        success: false , 
                        message:"Club activity  is not found"
                    });
                }

                res.status(200).json({
                    success: true, 
                    randomClubActivty 
                 });
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    message: error.message
                });
            }
            break;


        default:
            res.status(400).json({ 
                success: false , 
                message: "something went wrong"
            });
            break;
    }
}