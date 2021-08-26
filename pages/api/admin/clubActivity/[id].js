import dbConnect from '../../../../utils/dbConnect';
import ClubActivity from '../../../../models/clubActivity';   
import  { ClubActivityValidations } from '../../../../utils/validation/validations';

dbConnect();

export default async (req, res) => {
    const {
        query: { id },
        method
    } = req;

    switch (method) {

        //getting a single club
        case 'GET':
            try {
                const club_activity = await ClubActivity.find({club_id: id} );

                if (!club_activity) {
                    return res.status(400).json({
                        success: false , 
                        message:"Club activity  is not found"
                    });
                }

                res.status(200).json({
                    success: true, 
                    club_activity 
                 });
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    error : error.message 
                });
            }
            break;
        
        //updatting a single club    
        case 'PUT':
            try {
                    
                const { error } = ClubActivityValidations(req.body);
                if (error)
                    return res.status(500).json({
                    success: false,     
                    message: error.details[0].message,
                });

                const club_activity = await ClubActivity.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!club_activity) {
                    return res.status(400).json({ 
                        success: false 
                    });
                }

                res.status(200).json({ 
                    success: true, 
                    message : "Club activity updated successfully" , 
                    club_activity
                });
            } catch (error) {
                res.status(400).json({ 
                    success: false,
                    message : error.message,
                });
            }
            break;

        //deletting a single club    
        case 'DELETE':
            try {
                const deletedClubActivity = await ClubActivity.deleteOne({ _id: id });

                if (!deletedClubActivity) {
                    return res.status(400).json({ success: false })
                }

                res.status(200).json({ 
                    success: true, 
                    message : "Club activity deleted successfully" 
                });
            } catch (error) {
                res.status(400).json({ success: false })
            }
            break;
        default:
            res.status(400).json({ success: false })
            break;
    }
}