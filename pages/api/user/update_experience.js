// pages/api/user/update_experience.js
import dbConnect from '../../../lib/dbconnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PATCH') {
    try {
      const { userId, xp } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const maxExp = user.level * 30; // Example formula for max XP per level
      user.experience += xp;

      while (user.experience >= maxExp) {
        user.experience -= maxExp;
        user.level += 1;
        user.skills.push(`Skill ${user.level}`); // Example skill, can be more creative
        user.coins += 10; // Example coins awarded per level
      }

      await user.save();
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
