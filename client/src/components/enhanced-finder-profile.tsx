import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Clock, Coins, CheckCircle } from "lucide-react";

interface EnhancedFinderProfileProps {
  finderId: string;
}

interface FinderLevel {
  id: string;
  name: string;
  description: string;
  color: string;
  badgeEmoji: string;
  monthlyTokens: number;
}

interface FinderProfile {
  id: string;
  userId: string;
  jobsCompleted: number;
  totalEarned: number;
  availableBalance: number;
  averageRating: number;
  currentLevelId: string;
  bio: string;
  category: string;
  categories: string[];
  skills: string[];
  hourlyRate: number;
  isVerified: boolean;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
  };
  currentLevel?: FinderLevel;
}

export function EnhancedFinderProfile({ finderId }: EnhancedFinderProfileProps) {
  const { data: finder, isLoading } = useQuery<FinderProfile>({
    queryKey: [`/api/finder/profile/${finderId}`],
    enabled: !!finderId
  });

  const { data: finderLevel } = useQuery<FinderLevel>({
    queryKey: [`/api/finder-levels/${finder?.currentLevelId}`],
    enabled: !!finder?.currentLevelId
  });

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!finder) {
    return <div>Finder profile not found</div>;
  }

  const displayLevel = finderLevel || {
    name: 'Novice',
    description: 'Starting their journey',
    color: '#10b981',
    badgeEmoji: '🍃',
    monthlyTokens: 20
  };

  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < Math.floor(finder.averageRating || 0)
          ? 'text-yellow-400 fill-current'
          : i < (finder.averageRating || 0)
          ? 'text-yellow-400 fill-current opacity-50'
          : 'text-gray-300'
      }`}
    />
  ));

  return (
    <div className="space-y-6">
      {/* Level and Rating Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Finder Status</span>
            </span>
            {finder.isVerified && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${displayLevel.color}20`, color: displayLevel.color }}
                >
                  {displayLevel.badgeEmoji}
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: displayLevel.color }}>
                    {displayLevel.name}
                  </h3>
                  <p className="text-sm text-gray-600">{displayLevel.description}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Monthly Tokens</span>
                  <Badge variant="outline">{displayLevel.monthlyTokens} tokens</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium">
                    {new Date(finder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating and Stats */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                    {finder.averageRating.toFixed(1)}/5.0
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {ratingStars}
                  <span className="text-sm text-gray-600 ml-2">
                    ({finder.jobsCompleted} jobs)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {finder.jobsCompleted}
                  </div>
                  <div className="text-xs text-gray-600">Jobs Completed</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${finder.totalEarned.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Total Earned</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="w-5 h-5" />
            <span>Available Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-600">
                ${finder.availableBalance.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Available for withdrawal
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                <Clock className="w-3 h-3 mr-1" />
                Auto-credited
              </Badge>
              <p className="text-xs text-gray-500">
                Funds are automatically credited after 24h holding period
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills and Categories */}
      {(finder.skills?.length > 0 || finder.categories?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finder.categories?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {finder.categories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {finder.skills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {finder.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bio */}
      {finder.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{finder.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}