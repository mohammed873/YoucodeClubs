import dbConnect from '../../../../utils/dbConnect';
import ClubActivity from '../../../../models/clubActivity';   


dbConnect();

export default async (req, res) => {
    const { method ,  query: { id } } = req;

    switch (method) {

        //adding new club  
        case 'GET':
            
            try {
               
                const singleActivity = await ClubActivity.findById(id)
                if (!singleActivity) {
                    return res.status(400).json({
                        success: false , 
                        message:"Club activity  is not found"
                    });
                }

                res.status(200).json({
                    success: true, 
                    singleActivity 
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