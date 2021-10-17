import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/user';


dbConnect();

export default async (req, res) => {

    //user logout
    if (req.method === 'POST') {
        const {
            query: { id },
        } = req;
    
       try {
           
           const fetched_user = await User.findByIdAndUpdate( 
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
            fetched_user,
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