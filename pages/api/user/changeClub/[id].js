import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/user';

dbConnect();

export default async (req, res) => {

    //Users verify code verification
    if (req.method === 'PUT') {
      

       try {
            const { club_id } = req.body;
            const {
                query: { id },
            } = req;

            if(club_id === ""){
                return  res.status(400).json({
                    success: false , 
                    message : "please enter a verification code"
                })
            }
            const fetched_user = await User.findOne({ _id: id });
            if (!fetched_user) return  res.status(400).json({
                success: false , 
                message : "User not found"
            })

            await User.update(
                { _id: fetched_user._id  },
                    { $set:
                       {
                         "club_id": club_id
                       }
                    }
                )
                     
            res.status(200).json({
                message: "You have successfully changed your club",
            });
            
       } catch (error) {
            res.json({
                success: false , 
                message: error.message
            })
       }

    } 
    else {
       res.json({
           success: false , 
           message : "something went wrong"
        })
    }
  }