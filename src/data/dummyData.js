export const currentUser = {
  id: 1, name: "Mohammed Sufiyan", username: "mdsufiyan04",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
  bio: "AI/ML Engineer & Full Stack Dev. Love building things that matter.",
  location: "Bengaluru, India", college: "MVJ College of Engineering",
  rating: 4.8, reviewCount: 12, completedExchanges: 9, profileCompletion: 85,
  joinedDate: "Jan 2025",
  skills: {
    offer: [
      { id: 1, name: "React", category: "Tech", level: "Advanced" },
      { id: 2, name: "Python", category: "Tech", level: "Advanced" },
      { id: 3, name: "Machine Learning", category: "Tech", level: "Intermediate" },
      { id: 4, name: "UI/UX Design", category: "Design", level: "Intermediate" },
    ],
    want: [
      { id: 5, name: "Flutter", category: "Tech", level: "Beginner" },
      { id: 6, name: "DevOps", category: "Tech", level: "Beginner" },
      { id: 7, name: "Video Editing", category: "Arts", level: "Beginner" },
    ],
  },
};

export const categories = [
  { id: 1, name: "Tech", icon: "💻", color: "bg-apple-bg" },
  { id: 2, name: "Design", icon: "🎨", color: "bg-apple-bg" },
  { id: 3, name: "Music", icon: "🎵", color: "bg-apple-bg" },
  { id: 4, name: "Languages", icon: "🌍", color: "bg-apple-bg" },
  { id: 5, name: "Fitness", icon: "💪", color: "bg-apple-bg" },
  { id: 6, name: "Business", icon: "📈", color: "bg-apple-bg" },
  { id: 7, name: "Arts", icon: "✏️", color: "bg-apple-bg" },
  { id: 8, name: "Cooking", icon: "🍳", color: "bg-apple-bg" },
];

export const users = [
  { id: 2, name: "Arjun Sharma", username: "arjun_dev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", bio: "Flutter developer & graphic designer.", location: "Mumbai, India", college: "IIT Bombay", rating: 4.9, reviewCount: 24, completedExchanges: 18, matchScore: 96, matchReason: "He offers Flutter which you want, and wants React which you offer.", skills: { offer: [{ id: 10, name: "Flutter", category: "Tech", level: "Advanced" }, { id: 11, name: "Figma", category: "Design", level: "Expert" }], want: [{ id: 13, name: "React", category: "Tech", level: "Intermediate" }] } },
  { id: 3, name: "Priya Nair", username: "priya_creates", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", bio: "Content creator and video editor.", location: "Kochi, India", college: "NIT Calicut", rating: 4.7, reviewCount: 15, completedExchanges: 11, matchScore: 88, matchReason: "She offers Video Editing which you want, and wants UI/UX Design.", skills: { offer: [{ id: 20, name: "Video Editing", category: "Arts", level: "Advanced" }, { id: 21, name: "Guitar", category: "Music", level: "Intermediate" }], want: [{ id: 23, name: "UI/UX Design", category: "Design", level: "Beginner" }] } },
  { id: 4, name: "Rahul Verma", username: "rahul_cloud", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", bio: "DevOps engineer obsessed with automation.", location: "Hyderabad, India", college: "BITS Pilani", rating: 4.6, reviewCount: 19, completedExchanges: 14, matchScore: 82, matchReason: "He offers DevOps which you want, and wants Python which you offer.", skills: { offer: [{ id: 30, name: "DevOps", category: "Tech", level: "Expert" }, { id: 31, name: "Docker", category: "Tech", level: "Advanced" }], want: [{ id: 33, name: "Python", category: "Tech", level: "Intermediate" }] } },
  { id: 5, name: "Sneha Kulkarni", username: "sneha_designs", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", bio: "Product designer who codes.", location: "Pune, India", college: "Symbiosis Institute", rating: 4.5, reviewCount: 8, completedExchanges: 6, matchScore: 74, matchReason: "She offers Figma and UI Design which complements your skill set.", skills: { offer: [{ id: 40, name: "Figma", category: "Design", level: "Expert" }, { id: 41, name: "Branding", category: "Design", level: "Advanced" }], want: [{ id: 43, name: "React", category: "Tech", level: "Intermediate" }] } },
  { id: 6, name: "Vikram Singh", username: "vikram_music", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", bio: "Music producer learning to code.", location: "Delhi, India", college: "Delhi University", rating: 4.3, reviewCount: 6, completedExchanges: 4, matchScore: 61, matchReason: "He offers Music Production as a great creative complement.", skills: { offer: [{ id: 50, name: "Music Production", category: "Music", level: "Expert" }], want: [{ id: 52, name: "Python", category: "Tech", level: "Beginner" }] } },
];

export const requests = [
  { id: 1, type: "incoming", user: { id: 2, name: "Arjun Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", college: "IIT Bombay", rating: 4.9 }, skillOffered: "Flutter", skillWanted: "React", message: "Hey! I can teach you Flutter in exchange for React. Interested?", status: "pending", date: "2 hours ago" },
  { id: 2, type: "incoming", user: { id: 3, name: "Priya Nair", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", college: "NIT Calicut", rating: 4.7 }, skillOffered: "Video Editing", skillWanted: "UI/UX Design", message: "Would love to exchange! I can help with video editing.", status: "pending", date: "5 hours ago" },
  { id: 3, type: "outgoing", user: { id: 4, name: "Rahul Verma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", college: "BITS Pilani", rating: 4.6 }, skillOffered: "Python", skillWanted: "DevOps", message: "Hi Rahul! Your DevOps skills are exactly what I need.", status: "accepted", date: "1 day ago" },
  { id: 4, type: "outgoing", user: { id: 5, name: "Sneha Kulkarni", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", college: "Symbiosis Institute", rating: 4.5 }, skillOffered: "React", skillWanted: "Figma", message: "Want to exchange React for Figma lessons?", status: "pending", date: "2 days ago" },
];

export const activeExchanges = [
  { id: 1, user: { id: 4, name: "Rahul Verma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", rating: 4.6 }, mySkill: "Python", theirSkill: "DevOps", progress: 60, sessionsCompleted: 3, totalSessions: 5, nextSession: "Tomorrow, 5:00 PM", status: "active" },
];

export const reviews = [
  { id: 1, author: { name: "Priya Nair", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", college: "NIT Calicut" }, rating: 5, text: "Mohammed is an incredible teacher. Explained React so clearly!", skill: "React", date: "2 weeks ago" },
  { id: 2, author: { name: "Sneha Kulkarni", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha", college: "Symbiosis Institute" }, rating: 5, text: "Super patient and knowledgeable. The ML sessions were perfect.", skill: "Machine Learning", date: "1 month ago" },
  { id: 3, author: { name: "Arjun Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", college: "IIT Bombay" }, rating: 4, text: "Great exchange! Mohammed knows his UI/UX stuff well.", skill: "UI/UX Design", date: "1 month ago" },
];

export const messages = [
  { id: 1, senderId: 4, text: "Hey! Ready for our DevOps session tomorrow?", time: "8:00 PM" },
  { id: 2, senderId: 1, text: "Absolutely! Should we cover Docker basics first?", time: "8:05 PM" },
  { id: 3, senderId: 4, text: "Perfect. I'll prepare a Docker + CI/CD walkthrough.", time: "8:10 PM" },
  { id: 4, senderId: 1, text: "Sounds great. See you tomorrow at 5!", time: "8:12 PM" },
];

export const aiMatches = [
  { id: 2, name: "Arjun Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", college: "IIT Bombay", rating: 4.9, matchScore: 96, matchReason: "He offers Flutter which you want, and wants React which you offer." },
  { id: 3, name: "Priya Nair", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", college: "NIT Calicut", rating: 4.7, matchScore: 88, matchReason: "She offers Video Editing which you want, and wants UI/UX Design." },
  { id: 4, name: "Rahul Verma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", college: "BITS Pilani", rating: 4.6, matchScore: 82, matchReason: "He offers DevOps which you want, and wants Python which you offer." },
];

export const stats = { totalUsers: 2847, totalExchanges: 12490, totalSkills: 384, countriesReached: 28 };

export const sampleProjects = [
  {
    id: 1,
    title: "EcoTrack Carbon Credit Platform",
    tagline: "Helping cities track and trade carbon credits using blockchain",
    category: "Tech",
    stage: "Building",
    admin: { name: "Mohammed Sufiyan", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed", college: "MVJ College" },
    roles: [
      { id: 1, title: "Blockchain Developer", skillsNeeded: "Solidity, Web3.js", filled: false },
      { id: 2, title: "UI Designer", skillsNeeded: "Figma, UI/UX Design", filled: true },
    ],
    members: [],
    githubUrl: "https://github.com",
    description: "EcoTrack is a blockchain-based carbon credit platform that allows urban green spaces to tokenize their carbon absorption and trade credits with corporations.",
  },
  {
    id: 2,
    title: "Elevate Mobile App",
    tagline: "React Native version of Elevate for iOS and Android",
    category: "Tech",
    stage: "Idea",
    admin: { name: "Yanu", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun", college: "IIT Bombay" },
    roles: [
      { id: 3, title: "React Native Developer", skillsNeeded: "React Native, Expo", filled: false },
      { id: 4, title: "Backend Developer", skillsNeeded: "Node.js, PostgreSQL", filled: false },
    ],
    members: [],
    description: "Building a mobile version of Elevate so students can exchange skills on the go.",
  },
];