import { MOCK_LOCATIONS, MOCK_INSTRUCTORS, MOCK_CLASSES, MOCK_FORUM_POSTS } from '@/data/mockData';

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function tokenize(text: string): Set<string> {
  return new Set(normalizeText(text).split(/\s+/).filter(w => w.length > 2));
}

function scoreMatch(queryTokens: Set<string>, text: string): number {
  const contentTokens = tokenize(text);
  let score = 0;
  for (const token of queryTokens) {
    if (contentTokens.has(token)) {
      score++;
    }
  }
  return score;
}

interface ScoredItem {
  text: string;
  score: number;
}

export function getSiteContent(): string {
  const locations = MOCK_LOCATIONS.map(loc => 
    `${loc.name}: ${loc.address}. Rating: ${loc.rating}. Facilities: ${loc.facilities.join(', ')}`
  ).join('\n');

  const instructors = MOCK_INSTRUCTORS.map(inst =>
    `${inst.name}: ${inst.bio}. Rating: ${inst.rating}. Specialties: ${inst.specialties.join(', ')}. Certifications: ${inst.certifications.join(', ')}. Experience: ${inst.experience}.`
  ).join('\n');

  const classes = MOCK_CLASSES.map(cls => {
    const loc = MOCK_LOCATIONS.find(l => l.id === cls.locationId);
    const inst = MOCK_INSTRUCTORS.find(i => i.id === cls.instructorId);
    return `${cls.title} (${cls.type}): ${cls.difficulty}, £${cls.price}, ${cls.duration}min at ${cls.time} on ${cls.date} at ${loc?.name} with ${inst?.name}. Spots: ${cls.spotsBooked}/${cls.spotsTotal}`;
  }).join('\n');

  const forumPosts = MOCK_FORUM_POSTS.map(post => {
    const replies = post.replyData?.map(r => `  - ${r.author}: ${r.content} (${r.likes} likes)`).join('\n') || '';
    return `${post.title}: ${post.content}\n  Tags: ${post.tags.join(', ')}\n  Replies:\n${replies}`;
  }).join('\n\n');

  return `LOCATIONS:\n${locations}\n\nINSTRUCTORS:\n${instructors}\n\nCLASSES:\n${classes}\n\nFORUM POSTS:\n${forumPosts}`;
}

export function getRelevantContext(query: string, maxItems: number = 5): string {
  if (!query.trim()) {
    return getSiteContent();
  }

  const queryTokens = tokenize(query);

  const locationScores: ScoredItem[] = MOCK_LOCATIONS.map(loc => ({
    text: `LOCATION: ${loc.name} - ${loc.address}. Rating: ${loc.rating}/5. Facilities: ${loc.facilities.join(', ')}`,
    score: scoreMatch(queryTokens, `${loc.name} ${loc.address} ${loc.facilities.join(' ')}`)
  }));

  const instructorScores: ScoredItem[] = MOCK_INSTRUCTORS.map(inst => ({
    text: `INSTRUCTOR: ${inst.name} - ${inst.bio}. Rating: ${inst.rating}/5. Specialties: ${inst.specialties.join(', ')}. Certifications: ${inst.certifications.join(', ')}. Experience: ${inst.experience}`,
    score: scoreMatch(queryTokens, `${inst.name} ${inst.bio} ${inst.specialties.join(' ')} ${inst.certifications.join(' ')}`)
  }));

  const classScores: ScoredItem[] = MOCK_CLASSES.map(cls => {
    const loc = MOCK_LOCATIONS.find(l => l.id === cls.locationId);
    const inst = MOCK_INSTRUCTORS.find(i => i.id === cls.instructorId);
    return {
      text: `CLASS: ${cls.title} - ${cls.type}, ${cls.difficulty}, £${cls.price}, ${cls.duration}min, ${cls.time} at ${loc?.name || 'TBD'}, Instructor: ${inst?.name || 'TBD'}. Spots available: ${cls.spotsTotal - cls.spotsBooked}/${cls.spotsTotal}`,
      score: scoreMatch(queryTokens, `${cls.title} ${cls.type} ${cls.difficulty} ${loc?.name || ''} ${inst?.name || ''}`)
    };
  });

  const forumScores: ScoredItem[] = MOCK_FORUM_POSTS.map(post => ({
    text: `FORUM: "${post.title}" - ${post.content} Tags: ${post.tags.join(', ')}`,
    score: scoreMatch(queryTokens, `${post.title} ${post.content} ${post.tags.join(' ')}`)
  }));

  const allItems: ScoredItem[] = [
    ...locationScores,
    ...instructorScores,
    ...classScores,
    ...forumScores
  ].filter(item => item.score > 0);

  if (allItems.length === 0) {
    return getSiteContent();
  }

  allItems.sort((a, b) => b.score - a.score);
  const topItems = allItems.slice(0, maxItems);

  return topItems.map(item => item.text).join('\n');
}