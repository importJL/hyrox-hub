import { format, addDays } from 'date-fns';

export type Location = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  facilities: string[];
  image: string;
};

export type Instructor = {
  id: string;
  name: string;
  bio: string;
  rating: number;
  specialties: string[];
  image: string;
  locationId: string;
};

export type ClassSession = {
  id: string;
  title: string;
  type: string; // e.g., "HYROX Foundation", "HYROX Pro", "HYROX Endurance"
  locationId: string;
  instructorId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  spotsTotal: number;
  spotsBooked: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
};

export type Review = {
  id: string;
  targetId: string; // classId, instructorId, or locationId
  targetType: 'class' | 'instructor' | 'location';
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

export type Reply = {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  likes: number;
};

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  replies: number;
  likes: number;
  tags: string[];
  replyData?: Reply[];
};

export type UserProfile = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  image: string;
  favoriteLocations: string[];
  pastClasses: string[]; // class ids
  upcomingClasses: string[]; // class ids
  isFriend: boolean;
};

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc_1',
    name: 'Iron Forge Fitness',
    address: '123 Power Ave, London',
    lat: 51.5074,
    lng: -0.1278,
    rating: 4.8,
    facilities: ['Showers', 'Locker Room', 'Protein Bar', 'Recovery Zone'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 'loc_2',
    name: 'Apex Performance Center',
    address: '45 Endurance St, London',
    lat: 51.5154,
    lng: -0.0978,
    rating: 4.9,
    facilities: ['Showers', 'Sauna', 'Ice Baths', 'Cafe'],
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop',
  },
  {
    id: 'loc_3',
    name: 'The Grindhouse',
    address: '78 Hustle Blvd, London',
    lat: 51.4974,
    lng: -0.1478,
    rating: 4.6,
    facilities: ['Locker Room', 'Parking', 'Pro Shop'],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1375&auto=format&fit=crop',
  }
];

export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst_1',
    name: 'Marcus Vance',
    bio: 'Former decathlete turned HYROX Master Trainer. Focuses on pacing and efficient movement standards.',
    rating: 4.9,
    specialties: ['Sled Push/Pull', 'Running Mechanics'],
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop',
    locationId: 'loc_1',
  },
  {
    id: 'inst_2',
    name: 'Sarah Jenkins',
    bio: 'Elite HYROX competitor. Sarah\'s classes are high energy and focus on building unbreakable endurance.',
    rating: 4.8,
    specialties: ['Rowing/SkiErg', 'Endurance'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
    locationId: 'loc_2',
  },
  {
    id: 'inst_3',
    name: 'David Chen',
    bio: 'Strength and conditioning specialist. Helps beginners build the foundational strength needed for HYROX.',
    rating: 4.7,
    specialties: ['Wall Balls', 'Sandbag Lunges', 'Strength'],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    locationId: 'loc_3',
  }
];

const today = new Date();

export const MOCK_CLASSES: ClassSession[] = [
  {
    id: 'cls_1',
    title: 'HYROX Foundation',
    type: 'Foundation',
    locationId: 'loc_3',
    instructorId: 'inst_3',
    date: format(today, 'yyyy-MM-dd'),
    time: '18:00',
    duration: 60,
    spotsTotal: 20,
    spotsBooked: 15,
    difficulty: 'Beginner',
    price: 20,
  },
  {
    id: 'cls_2',
    title: 'HYROX Engine Builder',
    type: 'Endurance',
    locationId: 'loc_2',
    instructorId: 'inst_2',
    date: format(today, 'yyyy-MM-dd'),
    time: '19:00',
    duration: 90,
    spotsTotal: 15,
    spotsBooked: 15,
    difficulty: 'Advanced',
    price: 25,
  },
  {
    id: 'cls_3',
    title: 'HYROX Skills: Sleds & Ergs',
    type: 'Skills',
    locationId: 'loc_1',
    instructorId: 'inst_1',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    time: '07:00',
    duration: 60,
    spotsTotal: 12,
    spotsBooked: 8,
    difficulty: 'Intermediate',
    price: 22,
  },
  {
    id: 'cls_4',
    title: 'HYROX Full Simulation',
    type: 'Simulation',
    locationId: 'loc_1',
    instructorId: 'inst_1',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    time: '09:00',
    duration: 120,
    spotsTotal: 24,
    spotsBooked: 10,
    difficulty: 'Advanced',
    price: 35,
  }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post_1',
    title: 'Best shoes for the sled push?',
    content: 'I keep slipping on the turf during the sled push. Any recommendations for shoes with good grip that are still good for the running segments?',
    author: 'HyroxRookie99',
    date: format(addDays(today, -2), 'yyyy-MM-dd'),
    replies: 14,
    likes: 23,
    tags: ['Gear', 'Sled Push'],
    replyData: [
      { id: 'reply_1_1', postId: 'post_1', author: 'MarcusVance', content: 'Nike Metcon series are great! They have a flat sole for sleds but still comfortable for running.', date: format(addDays(today, -2), 'yyyy-MM-dd'), likes: 8 },
      { id: 'reply_1_2', postId: 'post_1', author: 'SarahJ', content: 'Reebok Nano X3 is my go-to. The grip is insane on turf!', date: format(addDays(today, -1), 'yyyy-MM-dd'), likes: 5 },
      { id: 'reply_1_3', postId: 'post_1', author: 'HyroxRookie99', content: 'Thanks! Just ordered the Nanos. Hopefully they arrive before my race!', date: format(today, 'yyyy-MM-dd'), likes: 2 },
    ],
  },
  {
    id: 'post_2',
    title: 'Review: Iron Forge Fitness Simulation Class',
    content: 'Just did the full simulation at Iron Forge with Marcus. Brutal but exactly what I needed 4 weeks out from my race. The setup is identical to the real event.',
    author: 'EnduranceJunkie',
    date: format(addDays(today, -1), 'yyyy-MM-dd'),
    replies: 5,
    likes: 41,
    tags: ['Review', 'Iron Forge', 'Simulation'],
    replyData: [
      { id: 'reply_2_1', postId: 'post_2', author: 'MarcV', content: 'Glad you enjoyed it! The simulation setup is exactly event-spec. See you in 4 weeks!', date: format(addDays(today, -1), 'yyyy-MM-dd'), likes: 12 },
      { id: 'reply_2_2', postId: 'post_2', author: 'Jamie_T', content: 'How did your legs feel after? Thinking of booking this weekend.', date: format(addDays(today, -1), 'yyyy-MM-dd'), likes: 3 },
    ],
  },
  {
    id: 'post_3',
    title: 'Pacing strategy for Wall Balls',
    content: 'I always blow up on the wall balls at the end. Should I break them into sets of 10 or 15? What works best for you guys?',
    author: 'WallBallHater',
    date: format(today, 'yyyy-MM-dd'),
    replies: 8,
    likes: 12,
    tags: ['Strategy', 'Wall Balls'],
    replyData: [
      { id: 'reply_3_1', postId: 'post_3', author: 'CoachDavid', content: 'Sets of 10 with a quick breath in between. Consistency beats intensity here. Keep a steady pace!', date: format(today, 'yyyy-MM-dd'), likes: 6 },
      { id: 'reply_3_2', postId: 'post_3', author: 'EngineGuy', content: 'I personally do 15-10-5. Gets progressively easier which psychologically helps.', date: format(today, 'yyyy-MM-dd'), likes: 4 },
    ],
  },
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr_1',
    name: 'Alex Rivera',
    handle: '@alexr_hyrox',
    bio: 'Training for my first pro event in London. Focused on sleds and wall balls.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop',
    favoriteLocations: ['loc_1', 'loc_2'],
    pastClasses: ['cls_1'],
    upcomingClasses: ['cls_4'],
    isFriend: true,
  },
  {
    id: 'usr_2',
    name: 'Jamie Taylor',
    handle: '@jamie_sweats',
    bio: 'Masters competitor. Always looking for new training buddies for long engine sessions.',
    image: 'https://images.unsplash.com/photo-1590486663554-1eeeac5a2283?q=80&w=1374&auto=format&fit=crop',
    favoriteLocations: ['loc_3'],
    pastClasses: ['cls_2'],
    upcomingClasses: ['cls_3'],
    isFriend: false,
  },
  {
    id: 'usr_3',
    name: 'Sam Brooks',
    handle: '@sam_the_engine',
    bio: 'Endurance addict. Catch me at Apex.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    favoriteLocations: ['loc_2'],
    pastClasses: ['cls_1', 'cls_2'],
    upcomingClasses: [],
    isFriend: true,
  }
];
