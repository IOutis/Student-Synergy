import EditorData from "../../models/editorDataModel";
import dbConnect from '../../lib/dbconnect';

export default async function getNoteHandler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const note = await EditorData.findById(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(200).json(note);
    } catch (error) {
      console.error("Error retrieving note:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
