import User from "../models/User";
import Level from "../models/Level";
const LEVELS = [
  { level: 1, expRequired: 30, title: "Newbie" },
  { level: 2, expRequired: 100, title: "Novice" },
  { level: 3, expRequired: 170, title: "Apprentice" },
  // Add more levels as needed
];
const getUserLevel = (exp) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (exp > LEVELS[i].expRequired) {
      return LEVELS[i+1];
    }
  }
  return LEVELS[0];
};

const gainExp = async (userId, expGained) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  console.log("Experience Gained : ", expGained);
  console.log("Email : ", user.email);
  
  user.experience += expGained;
  if(user.experience < 0){
    user.experience = 0;
  }
  console.log("User experience : ", user.experience);

  const newLevel = getUserLevel(user.experience);
  console.log("User new level : ", newLevel);
  console.log("User current level : ", user.level);

  if (user.level !== newLevel.level) {
    user.level = newLevel.level; // Assign only the level number
    // Add logic to grant new skills or rewards
  }

  await user.save();
};

export { gainExp, getUserLevel,LEVELS };
