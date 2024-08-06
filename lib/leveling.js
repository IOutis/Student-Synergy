import User from "../models/User";
import Level from "../models/Level";
const LEVELS = [
  { "level": 1, "expRequired": 50, "title": "Novice" },
  { "level": 2, "expRequired": 150, "title": "Apprentice" },
  { "level": 3, "expRequired": 300, "title": "Journeyman" },
  { "level": 4, "expRequired": 500, "title": "Skilled" },
  { "level": 5, "expRequired": 750, "title": "Expert" },
  { "level": 6, "expRequired": 1050, "title": "Master" },
  { "level": 7, "expRequired": 1400, "title": "Grandmaster" },
  { "level": 8, "expRequired": 1800, "title": "Legend" },
  { "level": 9, "expRequired": 2250, "title": "Champion" },
  { "level": 10, "expRequired": 2750, "title": "Mythic" }
];
const getUserLevel = (exp) => {
  // console.log("What happened here??")
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (exp > LEVELS[i].expRequired) {
      // console.log("i+1 = ",i+1);
      // console.log("level length = ",LEVELS.length);
      return LEVELS[i+1]?LEVELS[i+1]:LEVELS[i];
    }
  }
  return LEVELS[0];
};

const gainExp = async (userId, expGained) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  // console.log("Experience Gained : ", expGained);
  // console.log("Email : ", user.email);
  
  user.experience += expGained;
  if(user.experience < 0){
    user.experience = 0;
  }
  // console.log("User experience : ", user.experience);

  const newLevel = getUserLevel(user.experience);
  // console.log("User new level : ", newLevel);
  // console.log("User current level : ", user.level);

  if (user.level !== newLevel.level) {
    user.level = newLevel.level; // Assign only the level number
    // Add logic to grant new skills or rewards
  }

  await user.save();
};

export { gainExp, getUserLevel,LEVELS };
