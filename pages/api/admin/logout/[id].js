import dbConnect from '../../../../utils/dbConnect';
import Admin from '../../../../models/admin';


dbConnect();

export default async (req, res) => {

    //Admin login
    if (req.method === 'POST') {
        const {
            query: { id },
            method
        } = req;
    
       try {
           
           const fetched_admin = await Admin.findByIdAndUpdate( 
            { _id: id },
            { $set:
               {
                 "isLoggedIn": false
               }
            }, 
            {
                    new: true,
                    runValidators: true
            });
                
            res.status(200).json({
            message: "you are loged out ",
            fetched_admin,
            });
       } catch (error) {
        res.json({
            success: false , 
            error: error.message
        })
       }
    } else {
       res.json({
           success: false , 
           message : "something went wrong"
        })
    }
  }