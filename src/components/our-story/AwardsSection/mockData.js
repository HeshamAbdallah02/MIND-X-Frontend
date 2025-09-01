// frontend/src/components/our-story/AwardsSection/mockData.js
// Temporary mock data for development - will be replaced by backend API

export const mockAwards = [
  {
    _id: '1',
    title: 'First Place - National Robotics Championship',
    description: 'Our autonomous robot secured first place in the advanced category, showcasing innovative AI navigation algorithms.',
    year: '2023',
    iconType: 'trophy',
    type: 'gold',
    position: '1st Place',
    organization: 'National Robotics Federation'
  },
  {
    _id: '2', 
    title: 'Innovation Excellence Award',
    description: 'Recognized for breakthrough work in machine learning applications for educational technology.',
    year: '2023',
    iconType: 'star',
    type: 'special',
    position: 'Excellence Award',
    organization: 'Ministry of Education'
  },
  {
    _id: '3',
    title: 'Regional Programming Contest - 2nd Place',
    description: 'Our team demonstrated exceptional problem-solving skills in this prestigious coding competition.',
    year: '2022',
    iconType: 'medal',
    type: 'silver',
    position: '2nd Place',
    organization: 'ACM Regional'
  },
  {
    _id: '4',
    title: 'Best Student Startup Award',
    description: 'Our EdTech startup was recognized for its potential to transform learning experiences.',
    year: '2022',
    iconType: 'crown',
    type: 'gold',
    position: 'Best Startup',
    organization: 'University Innovation Hub'
  },
  {
    _id: '5',
    title: 'Community Impact Achievement',
    description: 'Honored for our volunteer tech education program that reached over 500 students.',
    year: '2021',
    iconType: 'award',
    type: 'achievement',
    position: 'Impact Award',
    organization: 'Community Foundation'
  },
  {
    _id: '6',
    title: 'Third Place - International Hackathon',
    description: 'Built an AI-powered accessibility tool that impressed judges from around the world.',
    year: '2021',
    iconType: 'certificate',
    type: 'bronze',
    position: '3rd Place',
    organization: 'Global Hackathon Alliance'
  }
];

export const mockSettings = {
  title: 'Awards & Achievements',
  subtitle: 'Celebrating excellence, innovation, and impact through our journey.',
  titleColor: '#ffffff',
  subtitleColor: '#e5e7eb',
  backgroundImage: {
    url: 'https://res.cloudinary.com/dwqk6jf1j/image/upload/v1756648689/mind-x/file_eqduf5.jpg'
    //'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&crop=center', // Space/technology theme
  },
  overlayColor: '#1a1a2e',
  overlayOpacity: 0.85,
};
