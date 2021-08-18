import dbConnect from '../../../../utils/dbConnect';
import Club from '../../../../models/club';
import  { ClubValidations } from '../../../../utils/validation/validations';
dbConnect();

export default async (req, res) => {
    const { method } = req;

    switch (method) {


        //getting all clubs
        case 'GET':
            try {
                const clubs = await Club.find();

                res.status(200).json({ 
                    success: true,  
                    clubs 
                })
            } catch (error) {
                res.status(400).json({ 
                    success: false ,
                    message: error.message
                });
            }
            break;


        //adding new club  
        case 'POST':
            const { error } = ClubValidations(req.body);
            if (error)
                return res.status(400).json({
                success: false,     
                message: error.details[0].message,
            });

             const nameExists = await Club.findOne({ name: req.body.name});
             if (nameExists)
             return res.status(400).json({
                success: false,  
                message: "Club name already exists",
             });


            try {
                const newClub = await Club.create(req.body);

                res.status(201).json({ 
                    success: true, 
                    message: "club  successfully created",
                    newClub,
                 })
            } catch (error) {
                res.status(400).json({ 
                    success: false , 
                    message: error.message
                });
            }
            break;


        default:
            res.status(400).json({ success: false });
            break;
    }
}