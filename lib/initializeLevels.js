import mongoose from 'mongoose';
import dbConnect from '../lib/dbconnect';
import Level from '../models/Level';

// Initialize levels in the database
const initializeLevels = async () => {
  await dbConnect();

  const levels = [
    { level: 1, expRequired: 30, title: "Newbie" },
    { level: 2, expRequired: 100, title: "Novice" },
    { level: 3, expRequired: 170, title: "Apprentice" },
    // Add more levels as needed
  ];

  for (const levelData of levels) {
    const level = new Level(levelData);
    await level.save();
  }

  console.log('Levels initialized in the database');
  mongoose.connection.close();
};

initializeLevels().catch((error) => {
  console.error('Error initializing levels:', error);
  mongoose.connection.close();
});
