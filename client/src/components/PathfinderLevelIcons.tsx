import React from 'react';

export type PathfinderLevel = 'Novice' | 'Pathfinder' | 'Seeker' | 'Meister' | 'GrandMeister';

export interface PathfinderLevelData {
  name: PathfinderLevel;
  badge_icon: string;
  badge_emoji: string;
  color: string;
  description: string;
}

export const pathfinderLevels: PathfinderLevelData[] = [
  {
    name: 'Novice',
    badge_icon: 'leaf',
    badge_emoji: '🍃',
    color: '#10b981',
    description: 'The First Step on the Path - New finders starting their journey on FinderMeister'
  },
  {
    name: 'Pathfinder',
    badge_icon: 'compass',
    badge_emoji: '🧭',
    color: '#f59e0b',
    description: 'The Trailblazer of New Routes - Building experience with successful finds'
  },
  {
    name: 'Seeker',
    badge_icon: 'eye',
    badge_emoji: '👁️',
    color: '#3b82f6',
    description: 'The Knowledge Collector - Skilled finders with proven excellence'
  },
  {
    name: 'Meister',
    badge_icon: 'torch',
    badge_emoji: '🔥',
    color: '#8b5cf6',
    description: 'The Master of Craft - Expert finders with exceptional performance'
  },
  {
    name: 'GrandMeister',
    badge_icon: 'crown',
    badge_emoji: '👑',
    color: '#000000',
    description: 'The Legendary Elite - Pinnacle of FinderMeister achievement'
  }
];

interface PathfinderLevelIconProps {
  level: PathfinderLevel;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-sm',
  md: 'w-8 h-8 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl'
};

export const PathfinderLevelIcon: React.FC<PathfinderLevelIconProps> = ({ 
  level, 
  size = 'md', 
  showLabel = false,
  className = ''
}) => {
  const levelData = pathfinderLevels.find(l => l.name === level);
  
  if (!levelData) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center border-2 shadow-lg`}
        style={{ 
          backgroundColor: levelData.name === 'GrandMeister' ? `${levelData.color}30` : `${levelData.color}20`,
          borderColor: levelData.color,
          color: levelData.color,
          boxShadow: levelData.name === 'GrandMeister' ? `0 4px 12px ${levelData.color}40` : undefined
        }}
        title={levelData.description}
      >
        <span 
          className={levelData.name === 'GrandMeister' ? "text-xl font-bold" : "text-lg"}
          style={{
            filter: levelData.name === 'GrandMeister' ? 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))' : undefined
          }}
        >
          {levelData.badge_emoji}
        </span>
      </div>
      {showLabel && (
        <span className="text-xs font-medium mt-1 text-center" style={{ color: levelData.color }}>
          {levelData.name}
        </span>
      )}
    </div>
  );
};

interface PathfinderLevelBadgeProps {
  level: PathfinderLevel;
  showDescription?: boolean;
  className?: string;
}

export const PathfinderLevelBadge: React.FC<PathfinderLevelBadgeProps> = ({ 
  level, 
  showDescription = false,
  className = ''
}) => {
  const levelData = pathfinderLevels.find(l => l.name === level);
  
  if (!levelData) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className="w-6 h-6 rounded-full flex items-center justify-center border text-sm"
        style={{ 
          backgroundColor: `${levelData.color}20`,
          borderColor: levelData.color,
          color: levelData.color
        }}
        title={levelData.description}
      >
        {levelData.badge_emoji}
      </div>
      <div>
        <span className="font-medium" style={{ color: levelData.color }}>
          {levelData.name}
        </span>
        {showDescription && (
          <p className="text-xs text-gray-600">{levelData.description}</p>
        )}
      </div>
    </div>
  );
};

interface PathfinderLevelProgressProps {
  currentLevel: PathfinderLevel;
  progress?: number; // 0-100
  className?: string;
}

export const PathfinderLevelProgress: React.FC<PathfinderLevelProgressProps> = ({ 
  currentLevel, 
  progress = 0,
  className = ''
}) => {
  const currentLevelIndex = pathfinderLevels.findIndex(l => l.name === currentLevel);
  const currentLevelData = pathfinderLevels[currentLevelIndex];
  
  if (!currentLevelData) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <PathfinderLevelBadge level={currentLevel} />
        <span className="text-sm text-gray-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${progress}%`,
            backgroundColor: currentLevelData.color
          }}
        />
      </div>
    </div>
  );
};

// Default export
export default {
  PathfinderLevelIcon,
  PathfinderLevelBadge,
  PathfinderLevelProgress,
  pathfinderLevels
};