import dbConnect from '../../../../utils/dbConnect';
import ClubActivity from '../../../../models/clubActivity';
import  { ClubActivityValidations } from '../../../../utils/validation/validations';
dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {

        //adding new club  
        case 'POST':
            const { error } = ClubActivityValidations(req.body);
            if (error)
                return res.status(400).json({
                success: false,     
                message: error.details[0].message,
            });

             const nameExists = await ClubActivity.findOne({ name: req.body.name});
             if (nameExists)
             return res.status(400).json({
                success: false,  
                message: "Club Activity name already exists",
             });


            try {
                const newClubActivity = await ClubActivity.create(req.body);

                res.status(201).json({ 
                    success: true, 
                    message: "Activity successfully created",
                    newClubActivity,
                 })
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    message: error.message
                });
            }
            break;


        default:
            res.status(400).json({ success: false , message: "something went wrong"});
            break;
    }
}