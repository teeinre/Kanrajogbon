
import { Badge } from "@/components/ui/badge";
import { pathfinderLevels, PathfinderLevel } from "./PathfinderLevelIcons";

interface FinderLevelBadgeProps {
  completedJobs: number;
  averageRating?: number;
  className?: string;
}

// Static level requirements based on the seed data
const levelRequirements = [
  { name: 'Novice', minJobs: 0, minRating: 0, order: 1 },
  { name: 'Pathfinder', minJobs: 2, minRating: 4.0, order: 2 },
  { name: 'Seeker', minJobs: 10, minRating: 4.2, order: 3 },
  { name: 'Meister', minJobs: 25, minRating: 4.5, order: 4 },
  { name: 'GrandMeister', minJobs: 50, minRating: 4.8, order: 5 }
];

export function FinderLevelBadge({ completedJobs, averageRating = 0, className }: FinderLevelBadgeProps) {
  const getFinderLevel = (jobs: number, rating: number) => {
    // Sort requirements by order descending to find highest qualifying level
    const sortedRequirements = [...levelRequirements].sort((a, b) => b.order - a.order);
    
    // Find the highest level the finder qualifies for
    for (const requirement of sortedRequirements) {
      const meetsJobRequirement = jobs >= requirement.minJobs;
      const meetsRatingRequirement = rating >= requirement.minRating;

      if (meetsJobRequirement && meetsRatingRequirement) {
        const levelData = pathfinderLevels.find(l => l.name === requirement.name);
        if (levelData) {
          return {
            level: levelData.name,
            emoji: levelData.badge_emoji,
            color: levelData.color
          };
        }
      }
    }

    // Default to Novice level
    const noviceLevel = pathfinderLevels.find(l => l.name === 'Novice');
    return {
      level: noviceLevel?.name || 'Novice',
      emoji: noviceLevel?.badge_emoji || '🍃',
      color: noviceLevel?.color || '#10b981'
    };
  };

  const { level, emoji, color } = getFinderLevel(completedJobs, averageRating);

  return (
    <Badge 
      className={`font-semibold px-3 py-1.5 ${className} flex items-center gap-2 border-0`}
      style={{ backgroundColor: color, color: 'white' }}
    >
      <span className="text-sm">{emoji}</span>
      <span>{level}</span>
    </Badge>
  );
}
