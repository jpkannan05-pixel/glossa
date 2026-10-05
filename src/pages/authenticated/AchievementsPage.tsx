import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';
import { Achievement } from '../../types';
import { Trophy, Lock, CheckCircle2, Sparkles, BookOpen, Target, MessageSquare, Flame } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const data = await api.get<{ achievements: Achievement[] }>('/achievements');
        setAchievements(data.achievements);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  if (isLoading) return <LoadingSpinner label="Loading Achievements..." />;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <BookOpen className="w-6 h-6" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6" />;
      case 'MessageSquare': return <MessageSquare className="w-6 h-6" />;
      case 'Target': return <Target className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      default: return <Trophy className="w-6 h-6" />;
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Sanskrit Badges & Achievements</h1>
          <p className="text-sm text-charcoal-600 mt-1">
            Unlock achievements by hitting real milestones in lessons, AI tutoring, and streak consistency.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gold-100 border border-gold-300 text-gold-800 font-bold text-sm">
          <Trophy className="w-5 h-5 text-gold-600" />
          <span>{unlockedCount} / {achievements.length} Unlocked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map(a => (
          <Card
            key={a.id}
            className={`p-6 flex flex-col justify-between h-full border transition-all ${
              a.isUnlocked
                ? 'border-2 border-gold-400 bg-gradient-to-br from-white to-gold-50/30 shadow-md'
                : 'border-sanskrit-200 opacity-75 bg-sanskrit-50/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    a.isUnlocked ? 'bg-gold-500 text-sanskrit-950 font-bold' : 'bg-sanskrit-200 text-charcoal-500'
                  }`}
                >
                  {getIcon(a.icon)}
                </div>

                <Badge variant={a.isUnlocked ? 'gold' : 'gray'}>
                  {a.isUnlocked ? 'Unlocked' : 'Locked'}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900">{a.name}</h3>
                <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">{a.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-sanskrit-100 flex items-center justify-between text-xs font-semibold">
              {a.isUnlocked ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Unlocked
                </span>
              ) : (
                <span className="text-charcoal-400 flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  Requires condition
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
