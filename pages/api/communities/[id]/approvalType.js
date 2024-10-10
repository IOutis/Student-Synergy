import Community from "../../../../models/CommunityModel";
import dbConnect from "../../../../lib/dbconnect";


export default async function approvalHandler(){
    await dbConnect()
    const { method, body } = req;
    const {id} = req.query

}