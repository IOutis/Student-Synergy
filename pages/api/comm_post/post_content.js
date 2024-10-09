import { createRouter } from 'next-connect';
import multer from 'multer';
import dbConnect from '../../../lib/dbconnect';
import PostData from '../../../models/Comm_Post';
import Community from '../../../models/CommunityModel';
import Section from '../../../models/SectionsModel';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = createRouter();

// Use multer to handle multipart/form-data
router.use(upload.none());

router.post(async (req, res) => {
  await dbConnect();

  try {
    const { content, user, email, title, keywords, isPrivate, id } = req.body;
    // console.log(isPrivate)
    // Validate required fields
    if (!content || !user || !title || !keywords) {
      throw new Error("Content, user, title, and keywords fields are required");
    }

    // Prepare the post data
    const newPostData = new PostData({
      user,
      email,
      content,
      title,
      keywords,
      isPrivate: isPrivate === 'true' // Ensure that isPrivate is handled as a boolean
    });

    // Save the post
    const savedData = await newPostData.save();

    // If the post is private, associate it with the community
    if (isPrivate === 'true' && id) {
      const section = await Section.findById(id);
      console.log("section: ",section)

      if (!section) {
        throw new Error("Community not found");
      }

      section.posts.push(savedData._id);
      await section.save();
      console.log("saved section : ",section)
    }

    res.status(201).json(savedData);
  } catch (error) {
    console.error("Error saving data:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();
