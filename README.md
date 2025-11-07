# Student Synergy

**Student Synergy** is a gamified productivity and collaboration platform for students. It helps users stay consistent with self-learning tasks, track progress, take timed quizzes, and earn rewards — all within a clean and intuitive interface.

> 🔧 Built with: Next.js • TypeScript • Tailwind CSS • MongoDB • NextAuth.js 

Website Link : [https://student-synergy.vercel.app/](https://student-synergy.vercel.app/)
---

## 🚀 Features

- ✅ **Authentication & Authorization** – Secure login with session handling via NextAuth.js
- 🗓️ **Gamified Task System** – Add tasks, mark them as complete, and earn reward points
- ⏳ **Quiz Module** *(in progress)* – Time-bound quizzes with question creation and scoring logic
- 📈 **Dashboard** – Displays task progress, XP, and consistency metrics
- 🔔 **Notifications** *(planned)* – Task and quiz reminders using cron jobs or external workers

---

## 🧠 Concept

The goal is to make productivity *engaging* for students — combining self-assigned tasks, a reward system, and quiz-based reinforcement to boost accountability and learning consistency.

---

## 🧪 Tech Stack

| Layer        | Tech Used                                 |
|--------------|-------------------------------------------|
| Frontend     | Next.js, TypeScript, Tailwind CSS         |
| Backend API  | Next.js API routes                        |
| Database     | MongoDB with Mongoose                     |
| Auth         | NextAuth.js                               |
| Deployment   | Vercel (for frontend/backend)             |

---

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/IOutis/Student-Synergy.git
cd Learners-Edge

# Install dependencies
npm install

# Add environment variables
cp .env.example .env.local
# Fill in MongoDB URI, Auth secrets, etc.

# Run the development server
npm run dev
```
## 📌 To-Do / Roadmap

- 🎨 **Redesign the frontend and landing page**
  - Improve overall UI/UX
  - Add clear navigation, onboarding, and visual branding

- 🧪 **Quiz Module**
  - Create and edit quizzes
  - Add timer functionality for timed quizzes
  - Implement scoring system and quiz analytics

- 🏆 **Reward System**
  - Introduce XP, level progression, and task streak tracking
  - Provide visual feedback for user motivation and consistency

- 📲 **Push Notifications**
  - Integrate OneSignal or equivalent
  - Use Cron jobs or background tasks to trigger reminders

- 📤 **Email Summaries**
  - Weekly reports of completed tasks, streaks, and upcoming goals

