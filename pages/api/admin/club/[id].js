import dbConnect from '../../../../utils/dbConnect';
import Club from '../../../../models/club';   
import  { ClubValidations } from '../../../../utils/validation/validations';

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
                const club = await Club.findById(id);

                if (!club) {
                    return res.status(400).json({
                        success: false , 
                        message:"Club  is not found"
                    });
                }

                res.status(200).json({
                    success: true, 
                    club 
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
                    
                const { error } = ClubValidations(req.body);
                if (error)
                    return res.status(500).json({
                    success: false,     
                    message: error.details[0].message,
                });

                const club = await Club.findByIdAndUpdate(id, req.body, {
                    new: true,
                    runValidators: true
                });

                if (!club) {
                    return res.status(400).json({ 
                        success: false 
                    });
                }

                res.status(200).json({ 
                    success: true, 
                    message : "Club updated successfully" , 
                    club
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
                const deletedClub = await Club.deleteOne({ _id: id });

                if (!deletedClub) {
                    return res.status(400).json({ success: false })
                }

                res.status(200).json({ 
                    success: true, 
                    message : "Club deleted successfully" 
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