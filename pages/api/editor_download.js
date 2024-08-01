// pages/api/editor_download.js
import dbConnect from '../../lib/dbconnect';
import EditorData from '../../models/editorDataModel';
import { asBlob } from 'html-docx-js-typescript';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  try {
    // Fetch note details from the database
    const note = await EditorData.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Assuming the note document has a 'content' field containing the HTML string
    const htmlContent = note.content;

    // Convert HTML to DOCX
    const docxBuffer = await HTMLtoDOCX(htmlContent);

    // Set up the response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${note.title}.docx`);
    res.send(docxBuffer);
  } catch (error) {
    console.error("Error generating DOCX:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
