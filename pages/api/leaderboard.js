import dbConnect from "../../lib/dbconnect";
import User from "../../models/User";

export default async function fetchUsers(req,res){
    try{
        await dbConnect();
        const users = await User.find().sort({experience:-1});
        res.json(users);
    }
    catch(err){
        console.log(err);
    }
}