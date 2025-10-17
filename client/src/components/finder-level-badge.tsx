
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

interface FinderLevelBadgeProps {
  completedJobs: number;
  averageRating?: number;
  className?: string;
}

interface FinderLevel {
  id: string;
  name: string;
  minJobsCompleted: number;
  minRating: string;
  minReviewPercentage?: number;
  badgeEmoji: string;
  badgeIcon?: string;
  icon?: string;
  color: string;
  order: number;
  isActive: boolean;
}

export function FinderLevelBadge({ completedJobs, averageRating = 0, className }: FinderLevelBadgeProps) {
  const { data: levels = [] } = useQuery<FinderLevel[]>({
    queryKey: ["/api/admin/finder-levels"],
  });

  const getFinderLevel = (jobs: number, rating: number) => {
    if (levels.length === 0) {
      return {
        level: "Novice",
        icon: "users",
        color: "#9ca3af"
      };
    }

    // Filter only active levels and sort by order descending
    const sortedLevels = levels
      .filter(level => level.isActive)
      .sort((a, b) => b.order - a.order);

    if (sortedLevels.length === 0) {
      return {
        level: "Novice",
        icon: "users",
        color: "#9ca3af"
      };
    }

    // Find the highest level the finder qualifies for
    for (const level of sortedLevels) {
      const meetsJobRequirement = jobs >= (level.minJobsCompleted || 0);
      
      // Support both minRating and minReviewPercentage fields
      const minRatingValue = level.minRating 
        ? parseFloat(level.minRating) 
        : (level.minReviewPercentage ? level.minReviewPercentage / 20 : 0); // Convert percentage to 5-star scale
      
      const meetsRatingRequirement = rating >= minRatingValue;

      if (meetsJobRequirement && meetsRatingRequirement) {
        return {
          level: level.name,
          icon: level.badgeIcon || level.icon || "users",
          color: level.color || "#9ca3af"
        };
      }
    }

    // Default to lowest level
    const lowestLevel = sortedLevels[sortedLevels.length - 1];
    return {
      level: lowestLevel.name,
      icon: lowestLevel.badgeIcon || lowestLevel.icon || "users",
      color: lowestLevel.color || "#9ca3af"
    };
  };

  const { level, icon, color } = getFinderLevel(completedJobs, averageRating);

  return (
    <Badge 
      className={`font-semibold px-3 py-1.5 ${className} flex items-center gap-2 border-0`}
      style={{ backgroundColor: color, color: 'white' }}
    >
      <Users className="w-4 h-4" />
      <span>{level}</span>
    </Badge>
  );
}
