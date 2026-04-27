import { format, addDays } from 'date-fns';

export type Location = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  image: string;
  location_phone_number?: number;
  location_website?: string;
};

export type Instructor = {
  id: string;
  name: string;
  bio: string;
  rating: number;
  specialties: string[];
  image: string;
  locationId: string;
  experience: string;
  certifications: string[];
  achievements: string[];
  email: string;
  classes: string[];
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

import locationsData from './locations.json';

interface RawLocation {
  location_name: string;
  location_address: string;
  location_lat: number;
  location_lng: number;
  location_phone_number?: number;
  location_website?: string;
  location_rating: number;
  location_image?: string;
}

function generateId(name: string): string {
  return `loc_${name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 30)}`;
}

export const LOCATIONS: Location[] = (locationsData as RawLocation[]).map((loc) => ({
  id: generateId(loc.location_name),
  name: loc.location_name,
  address: loc.location_address,
  lat: loc.location_lat,
  lng: loc.location_lng,
  rating: loc.location_rating,
  image: loc.location_image || '',
  location_phone_number: loc.location_phone_number,
  location_website: loc.location_website,
}));

export const MOCK_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst_tribal',
    name: 'Marcus Vance',
    bio: 'Former decathlete turned HYROX Master Trainer. Focuses on pacing and efficient movement standards.',
    rating: 4.9,
    specialties: ['Sled Push/Pull', 'Running Mechanics'],
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1470&auto=format&fit=crop',
    locationId: 'loc_tribal_fitness',
    experience: '12 years in functional fitness, 5 years HYROX coaching',
    certifications: ['HYROX Master Trainer', 'NASM CPT', 'CrossFit L2'],
    achievements: ['2023 HYROX World Champ', '3x Regional Winner'],
    email: 'marcus@tribal.fitness',
    classes: ['cls_1', 'cls_2'],
  },
  {
    id: 'inst_efx24',
    name: 'Sarah Jenkins',
    bio: 'Elite HYROX competitor. Sarah\'s classes are high energy and focus on building unbreakable endurance.',
    rating: 4.8,
    specialties: ['Rowing/SkiErg', 'Endurance'],
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop',
    locationId: 'loc_efx24_',
    experience: '8 years in endurance sports, 3 years HYROX coaching',
    certifications: ['HYROX Pro', 'ACE CPT', 'USATF Coach'],
    achievements: ['2024 HYROX Pro Finalist', '2x National Champ'],
    email: 'sarah@efx24.fit',
    classes: ['cls_3', 'cls_4'],
  },
  {
    id: 'inst_east',
    name: 'David Chen',
    bio: 'Strength and conditioning specialist. Helps beginners build the foundational strength needed for HYROX.',
    rating: 4.7,
    specialties: ['Wall Balls', 'Sandbag Lunges', 'Strength'],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop',
    locationId: 'loc_east_high_performance_centre',
    experience: '15 years in S&C, 4 years HYROX coaching',
    certifications: ['CSCS', 'USAW L1', 'HYROX Foundation'],
    achievements: ['Best Beginner Coach 2024'],
    email: 'david@east.hpc',
    classes: ['cls_5', 'cls_6'],
  },
  {
    id: 'inst_hof',
    name: 'James Liu',
    bio: 'Marathon runner turned HYROX coach. Specializes in running mechanics and cardio efficiency.',
    rating: 4.9,
    specialties: ['Running', 'Burpees', 'Cardio'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
    locationId: 'loc_house_of_fitness',
    experience: '10 years running coaching, 3 years HYROX',
    certifications: ['USATF Level 2', 'HYROX Trainer', 'RRCA Certified'],
    achievements: ['Sub-3 Hour Marathon', 'HYROX Age Group Winner'],
    email: 'james@hof.com',
    classes: ['cls_7', 'cls_8'],
  },
  {
    id: 'inst_midtown',
    name: 'Anna Wong',
    bio: 'Former CrossFit Games athlete. Expert in functional movement and high-intensity training.',
    rating: 4.8,
    specialties: ['Sandbag Lunges', 'Farmers Carry', 'Olympics Lifts'],
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop',
    locationId: 'loc_midtown28_fitness',
    experience: '7 years CrossFit, 4 years HYROX coaching',
    certifications: ['CrossFit L3', 'USAW L2', 'HYROX Pro'],
    achievements: ['CrossFit Regionals 2019', 'HYROX Hong Kong Champ'],
    email: 'anna@midtown28.fit',
    classes: ['cls_9', 'cls_10'],
  },
  {
    id: 'inst_bft',
    name: 'Ryan Mitchell',
    bio: 'International fitness coach with experience training athletes worldwide. Focus on metabolic conditioning.',
    rating: 4.7,
    specialties: ['Functional Strength', 'Kettlebells', 'HIIT'],
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop',
    locationId: 'loc_bft_causeway_bay',
    experience: '12 years in fitness industry, 3 years HYROX',
    certifications: ['KBC Level 2', 'NASM CPT', 'HYROX Trainer'],
    achievements: ['Multiple Half Ironmans Completed'],
    email: 'ryan@bft.com.au',
    classes: ['cls_11', 'cls_12'],
  },
];

const today = new Date();

export const MOCK_CLASSES: ClassSession[] = [
  // Tribal Fitness (loc_tribal_fitness)
  {
    id: 'cls_1',
    title: 'HYROX Foundation',
    type: 'Foundation',
    locationId: 'loc_tribal_fitness',
    instructorId: 'inst_tribal',
    date: format(today, 'yyyy-MM-dd'),
    time: '07:00',
    duration: 60,
    spotsTotal: 20,
    spotsBooked: 12,
    difficulty: 'Beginner',
    price: 20,
  },
  {
    id: 'cls_2',
    title: 'Sled Push & Pull Mastery',
    type: 'Skills',
    locationId: 'loc_tribal_fitness',
    instructorId: 'inst_tribal',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    time: '18:30',
    duration: 60,
    spotsTotal: 16,
    spotsBooked: 8,
    difficulty: 'Intermediate',
    price: 22,
  },
  // EFX24 大角咀 (loc_efx24_)
  {
    id: 'cls_3',
    title: 'HYROX Engine Builder',
    type: 'Endurance',
    locationId: 'loc_efx24_',
    instructorId: 'inst_efx24',
    date: format(today, 'yyyy-MM-dd'),
    time: '12:00',
    duration: 90,
    spotsTotal: 15,
    spotsBooked: 15,
    difficulty: 'Advanced',
    price: 25,
  },
  {
    id: 'cls_4',
    title: 'Rowing & SkiErg Techniques',
    type: 'Skills',
    locationId: 'loc_efx24_',
    instructorId: 'inst_efx24',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    time: '19:00',
    duration: 60,
    spotsTotal: 12,
    spotsBooked: 4,
    difficulty: 'Intermediate',
    price: 22,
  },
  // EAST High Performance Centre (loc_east_high_performance_centre)
  {
    id: 'cls_5',
    title: 'Wall Ball & Burpee Challenge',
    type: 'Endurance',
    locationId: 'loc_east_high_performance_centre',
    instructorId: 'inst_east',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    time: '08:00',
    duration: 75,
    spotsTotal: 18,
    spotsBooked: 11,
    difficulty: 'Intermediate',
    price: 24,
  },
  {
    id: 'cls_6',
    title: 'Full HYROX Simulation',
    type: 'Simulation',
    locationId: 'loc_east_high_performance_centre',
    instructorId: 'inst_east',
    date: format(addDays(today, 3), 'yyyy-MM-dd'),
    time: '10:00',
    duration: 120,
    spotsTotal: 24,
    spotsBooked: 18,
    difficulty: 'Advanced',
    price: 35,
  },
  // House of Fitness (loc_house_of_fitness)
  {
    id: 'cls_7',
    title: 'Running & Burpee Foundations',
    type: 'Foundation',
    locationId: 'loc_house_of_fitness',
    instructorId: 'inst_hof',
    date: format(today, 'yyyy-MM-dd'),
    time: '06:30',
    duration: 60,
    spotsTotal: 20,
    spotsBooked: 6,
    difficulty: 'Beginner',
    price: 20,
  },
  {
    id: 'cls_8',
    title: 'Cardio & Endurance Builder',
    type: 'Endurance',
    locationId: 'loc_house_of_fitness',
    instructorId: 'inst_hof',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    time: '17:00',
    duration: 90,
    spotsTotal: 16,
    spotsBooked: 14,
    difficulty: 'Advanced',
    price: 28,
  },
  // Midtown28 Fitness (loc_midtown28_fitness)
  {
    id: 'cls_9',
    title: 'Lower Body Strength & Lunges',
    type: 'Skills',
    locationId: 'loc_midtown28_fitness',
    instructorId: 'inst_midtown',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    time: '12:30',
    duration: 60,
    spotsTotal: 14,
    spotsBooked: 9,
    difficulty: 'Intermediate',
    price: 22,
  },
  {
    id: 'cls_10',
    title: 'Functional Fitness Extreme',
    type: 'Simulation',
    locationId: 'loc_midtown28_fitness',
    instructorId: 'inst_midtown',
    date: format(addDays(today, 4), 'yyyy-MM-dd'),
    time: '19:30',
    duration: 90,
    spotsTotal: 20,
    spotsBooked: 5,
    difficulty: 'Advanced',
    price: 30,
  },
  // BFT Causeway Bay (loc_bft_causeway_bay)
  {
    id: 'cls_11',
    title: 'Kettlebell & Strength Basics',
    type: 'Foundation',
    locationId: 'loc_bft_causeway_bay',
    instructorId: 'inst_bft',
    date: format(today, 'yyyy-MM-dd'),
    time: '18:00',
    duration: 60,
    spotsTotal: 24,
    spotsBooked: 16,
    difficulty: 'Beginner',
    price: 18,
  },
  {
    id: 'cls_12',
    title: 'MetCon Madness',
    type: 'Simulation',
    locationId: 'loc_bft_causeway_bay',
    instructorId: 'inst_bft',
    date: format(addDays(today, 2), 'yyyy-MM-dd'),
    time: '07:00',
    duration: 75,
    spotsTotal: 20,
    spotsBooked: 20,
    difficulty: 'Advanced',
    price: 25,
  },
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
