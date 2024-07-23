import dbConnect from "../../lib/dbconnect";
import EditorData from "../../models/editorDataModel";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            const { user } = req.query;
            const editorData = await EditorData.find({ user });
            res.status(200).json(editorData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
