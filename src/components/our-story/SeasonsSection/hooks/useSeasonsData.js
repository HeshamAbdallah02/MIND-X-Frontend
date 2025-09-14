// frontend/src/components/our-story/SeasonsSection/hooks/useSeasonsData.js
import { useQuery } from '@tanstack/react-query';
import { getSeasons } from '../../../../services/seasonsAPI';

// Mock data for development
const mockSeasonsData = [
  {
    id: '2020-21',
    year: '2020/21',
    theme: 'Resilience & Innovation',
    coverImage: '/images/seasons/2020-21-cover.jpg',
    boardMembers: [
      {
        id: 1,
        name: 'Ahmed Hassan',
        position: 'President',
        avatar: '/images/board/ahmed-hassan.jpg',
        isLeader: true,
        profileUrl: 'https://linkedin.com/in/ahmed-hassan'
      },
      {
        id: 2,
        name: 'Fatima Al-Zahra',
        position: 'Vice President',
        avatar: '/images/board/fatima-alzahra.jpg',
        profileUrl: 'https://linkedin.com/in/fatima-alzahra'
      },
      {
        id: 3,
        name: 'Omar Mansour',
        position: 'Technical Lead',
        avatar: '/images/board/omar-mansour.jpg',
        profileUrl: 'https://github.com/omar-mansour'
      },
      {
        id: 4,
        name: 'Sara Ibrahim',
        position: 'Marketing Director',
        avatar: '/images/board/sara-ibrahim.jpg',
        profileUrl: 'https://twitter.com/sara_ibrahim'
      },
      {
        id: 5,
        name: 'Mohamed Ali',
        position: 'Events Coordinator',
        avatar: '/images/board/mohamed-ali.jpg',
        profileUrl: ''
      },
      {
        id: 6,
        name: 'Nour El-Din',
        position: 'Community Manager',
        avatar: '/images/board/nour-eldin.jpg',
        profileUrl: 'https://instagram.com/nour_eldin'
      }
    ],
    highlights: [
      'Successfully transitioned to virtual events during pandemic',
      'Launched the first MIND-X mobile application',
      'Organized 15+ online workshops and seminars',
      'Reached 500+ active community members',
      'Established partnerships with 8 tech companies'
    ]
  },
  {
    id: '2021-22',
    year: '2021/22',
    theme: 'Digital Transformation',
    coverImage: '/images/seasons/2021-22-cover.jpg',
    boardMembers: [
      {
        id: 7,
        name: 'Youssef Ahmed',
        position: 'President',
        avatar: '/images/board/youssef-ahmed.jpg',
        isLeader: true,
        profileUrl: 'https://linkedin.com/in/youssef-ahmed'
      },
      {
        id: 8,
        name: 'Lina Mahmoud',
        position: 'Vice President',
        avatar: '/images/board/lina-mahmoud.jpg',
        profileUrl: 'https://twitter.com/lina_mahmoud'
      },
      {
        id: 9,
        name: 'Kareem Osama',
        position: 'CTO',
        avatar: '/images/board/kareem-osama.jpg',
        profileUrl: 'https://github.com/kareem-osama'
      },
      {
        id: 10,
        name: 'Dina Salah',
        position: 'Creative Director',
        avatar: '/images/board/dina-salah.jpg',
        profileUrl: 'https://behance.net/dina_salah'
      },
      {
        id: 11,
        name: 'Amr Khaled',
        position: 'Operations Manager',
        avatar: '/images/board/amr-khaled.jpg',
        profileUrl: ''
      },
      {
        id: 12,
        name: 'Rana Mostafa',
        position: 'PR Specialist',
        avatar: '/images/board/rana-mostafa.jpg',
        profileUrl: 'https://instagram.com/rana_mostafa'
      }
    ],
    highlights: [
      'Hosted the largest hybrid tech conference in Egypt',
      'Launched AI & Machine Learning bootcamp series',
      'Created the MIND-X startup incubator program',
      'Achieved 1000+ community members milestone',
      'Won "Best Tech Community" award in MENA region'
    ]
  },
  {
    id: '2022-23',
    year: '2022/23',
    theme: 'Innovation & Impact',
    coverImage: '/images/seasons/2022-23-cover.jpg',
    boardMembers: [
      {
        id: 13,
        name: 'Menna Tarek',
        position: 'President',
        avatar: '/images/board/menna-tarek.jpg',
        isLeader: true
      },
      {
        id: 14,
        name: 'Hassan Omar',
        position: 'Vice President',
        avatar: '/images/board/hassan-omar.jpg'
      },
      {
        id: 15,
        name: 'Yasmin Farid',
        position: 'Head of Innovation',
        avatar: '/images/board/yasmin-farid.jpg'
      },
      {
        id: 16,
        name: 'Mahmoud Reda',
        position: 'Technical Director',
        avatar: '/images/board/mahmoud-reda.jpg'
      },
      {
        id: 17,
        name: 'Salma Hassan',
        position: 'Partnerships Lead',
        avatar: '/images/board/salma-hassan.jpg'
      },
      {
        id: 18,
        name: 'Karim Nabil',
        position: 'Strategy Advisor',
        avatar: '/images/board/karim-nabil.jpg'
      }
    ],
    highlights: [
      'Established international chapters in 3 countries',
      'Launched MIND-X scholarship program for underrepresented groups',
      'Organized 25+ technical workshops and hackathons',
      'Reached 2000+ active members across all platforms',
      'Published research papers on emerging technologies'
    ]
  }
];

const fetchSeasonsData = async () => {
  try {
    const data = await getSeasons();
    
    // Transform backend data to match frontend expectations
    const transformedData = data.map(season => ({
      id: season._id,
      year: season.academicYear.replace('-', '/'), // Convert '2020-2021' to '2020/21'
      theme: season.theme, // Use theme field from backend
      coverImage: season.coverImage?.url || '/images/seasons/default-cover.jpg',
      boardMembers: season.boardMembers.map(member => ({
        id: member._id,
        name: member.name,
        position: member.position,
        avatar: member.avatar?.url || '/images/board/default-avatar.jpg',
        isLeader: member.isLeader || false,
        bio: member.bio,
        profileUrl: member.profileUrl || ''
      })),
      highlights: season.highlights.map(highlight => ({
        id: highlight._id,
        title: highlight.title,
        description: highlight.description,
        image: highlight.image?.url
      }))
    }));
    
    return transformedData;
  } catch (error) {
    console.warn('Seasons API not available, using mock data:', error.message);
    // Return mock data for development
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSeasonsData), 800); // Simulate API delay
    });
  }
};

export const useSeasonsData = () => {
  return useQuery({
    queryKey: ['seasons'],
    queryFn: fetchSeasonsData,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export default useSeasonsData;
