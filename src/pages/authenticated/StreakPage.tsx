import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Flame, Shield, Calendar, Award } from 'lucide-react';

export const StreakPage: React.FC = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const data = await api.get<any>('/streak');
        setStreakData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStreak();
  }, []);

  if (isLoading || !user) return <LoadingSpinner label="Loading Streak Activity..." />;

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Streak & Sanskrit Shields</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Build consistent daily learning habits and protect your streak with earned Shields.
        </p>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 text-center space-y-2 border-orange-200 bg-orange-50/40">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Flame className="w-7 h-7 fill-orange-500 animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block">Current Streak</span>
          <span className="text-4xl font-bold font-serif-heading text-sanskrit-900">{user.streak} Days</span>
        </Card>

        <Card className="p-6 text-center space-y-2 border-sanskrit-200">
          <div className="w-12 h-12 rounded-2xl bg-sanskrit-100 text-sanskrit-700 flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block">Longest Streak</span>
          <span className="text-4xl font-bold font-serif-heading text-sanskrit-900">{user.longest_streak} Days</span>
        </Card>

        <Card className="p-6 text-center space-y-2 border-gold-200 bg-gold-50/40">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7 text-gold-600 fill-gold-200" />
          </div>
          <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider block">Available Shields</span>
          <span className="text-4xl font-bold font-serif-heading text-sanskrit-900">{user.shields}</span>
        </Card>
      </div>

      {/* Weekly Activity Grid */}
      <Card className="p-6 sm:p-8 space-y-4 border-sanskrit-200">
        <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sanskrit-600" />
          <span>Weekly Activity Grid</span>
        </h3>
        <p className="text-xs text-charcoal-600">
          Complete at least 1 lesson or practice activity every day to keep your flame burning.
        </p>

        <div className="grid grid-cols-7 gap-3 pt-4 text-center">
          {daysOfWeek.map((day, idx) => (
            <div key={day} className="space-y-2">
              <span className="text-xs font-semibold text-charcoal-500">{day}</span>
              <div className="w-10 h-10 rounded-2xl mx-auto flex items-center justify-center bg-sanskrit-100 text-sanskrit-400 font-bold border border-sanskrit-200">
                {idx === 0 ? <Flame className="w-5 h-5 text-orange-500" /> : '•'}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
