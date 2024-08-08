import User from "../models/User";
import Level from "../models/Level";
const LEVELS = [
  { level: 1, expRequired: 50, title: "Novice", skills: ["Button Masher", "Beginner's Luck"], coins: 10 },
  { level: 2, expRequired: 150, title: "Apprentice", skills: ["Combo Initiate", "Quick Learner"], coins: 20 },
  { level: 3, expRequired: 300, title: "Journeyman", skills: ["Skill Shot", "Tactical Thinker"], coins: 30 },
  { level: 4, expRequired: 500, title: "Skilled", skills: ["Combo Master", "Resourceful"], coins: 40 },
  { level: 5, expRequired: 750, title: "Expert", skills: ["Master Strategist", "Precision Strike"], coins: 50 },
  { level: 6, expRequired: 1050, title: "Master", skills: ["Ultimate Combo", "Veteran's Instinct"], coins: 60 },
  { level: 7, expRequired: 1400, title: "Grandmaster", skills: ["Grandmaster Tactician", "Aura of Command"], coins: 70 },
  { level: 8, expRequired: 1800, title: "Legend", skills: ["Legendary Hero", "Mythic Power"], coins: 80 },
  { level: 9, expRequired: 2250, title: "Champion", skills: ["Unstoppable Force", "Battle Hardened"], coins: 90 },
  { level: 10, expRequired: 2750, title: "Mythic", skills: ["Mythic Overlord", "Reality Bender"], coins: 100 }
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
  const newSkills = newLevel.skills.filter(skill => !user.skills.includes(skill));
  console.log("NEW SKILLS = ",newSkills)
    if (newSkills.length > 0) {
      user.skills.push(...newSkills);
    }
  const coins=0;
  user.coins += newLevel.coins || 0;

  await user.save();
};

export { gainExp, getUserLevel,LEVELS };
