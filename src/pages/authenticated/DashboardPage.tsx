import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { XpBadge } from '../../components/gamification/XpBadge';
import { StreakBadge } from '../../components/gamification/StreakBadge';
import { ShieldBadge } from '../../components/gamification/ShieldBadge';
import { api } from '../../services/api';
import { Lesson } from '../../types';
import {
  BookOpen,
  Target,
  MessageSquare,
  FlaskConical,
  Sparkles,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, stats, preferences, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [recommendedLesson, setRecommendedLesson] = useState<Lesson | null>(null);
  const [weakConcepts, setWeakConcepts] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await refreshUser();
        const lessonsRes = await api.get<{ lessons: Lesson[] }>('/lessons');
        const firstUncompleted = lessonsRes.lessons.find(l => l.status !== 'completed');
        setRecommendedLesson(firstUncompleted || lessonsRes.lessons[0] || null);

        const profileRes = await api.get<any>('/users/me');
        setWeakConcepts(profileRes.weakConcepts || []);
        setRecentActivity(profileRes.recentActivity || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading || !user) {
    return <LoadingSpinner label="Loading your personalized dashboard..." />;
  }

  // Calculate daily XP progress (target: 20 XP)
  const dailyTargetXp = preferences?.daily_goal ? preferences.daily_goal * 2 : 20;
  const todayXp = Math.min(dailyTargetXp, user.xp % dailyTargetXp);

  return (
    <div className="space-y-8">
      {/* 1. Header Greeting */}
      <div className="bg-gradient-to-r from-sanskrit-900 via-sanskrit-800 to-sanskrit-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sanskrit-800/80 border border-sanskrit-600/50 text-gold-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Sanskrit Mastery Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-serif-heading tracking-tight">
              Welcome back, <span className="text-gold-400">{user.name}</span>
            </h1>
            <p className="text-sanskrit-200 text-sm mt-1 max-w-xl">
              {user.streak > 0
                ? `Keep your ${user.streak}-day streak going! Your adaptive Sanskrit learning engine is active.`
                : 'Your Sanskrit journey starts here. Complete today’s initial lesson to build your streak!'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <XpBadge xp={user.xp} />
            <StreakBadge streak={user.streak} />
            <ShieldBadge shields={user.shields} />
          </div>
        </div>
      </div>

      {/* 2. Top Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card hoverEffect={false} className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-lg shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Total XP</p>
            <p className="text-2xl font-bold text-sanskrit-900 font-serif-heading">{user.xp}</p>
          </div>
        </Card>

        <Card hoverEffect={false} className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg shadow-sm">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Streak</p>
            <p className="text-2xl font-bold text-sanskrit-900 font-serif-heading">{user.streak} Days</p>
          </div>
        </Card>

        <Card hoverEffect={false} className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sanskrit-100 text-sanskrit-700 flex items-center justify-center font-bold text-lg shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Lessons</p>
            <p className="text-2xl font-bold text-sanskrit-900 font-serif-heading">{stats?.completedLessons || 0}</p>
          </div>
        </Card>

        <Card hoverEffect={false} className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">Mastery</p>
            <p className="text-2xl font-bold text-sanskrit-900 font-serif-heading">{stats?.overallMastery || 0}%</p>
          </div>
        </Card>
      </div>

      {/* 3. Daily Goal & Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goal Progress */}
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sanskrit-700">Today's Goal</span>
              <Clock className="w-4 h-4 text-sanskrit-500" />
            </div>
            <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900">
              {todayXp} / {dailyTargetXp} XP
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              {todayXp >= dailyTargetXp ? '🎉 Daily goal achieved! Great work!' : 'Complete 1 lesson or practice exercise to reach your goal.'}
            </p>
          </div>

          <ProgressBar value={todayXp} max={dailyTargetXp} height="h-3" colorClass="bg-gradient-to-r from-gold-500 to-gold-600" />
        </Card>

        {/* Continue Learning Recommended Lesson */}
        <Card className="lg:col-span-2 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-2 border-sanskrit-500/20 bg-gradient-to-br from-white to-sanskrit-50">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sanskrit-100 text-sanskrit-800 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-sanskrit-600" />
              <span>Recommended Next Step</span>
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900">
              {recommendedLesson ? recommendedLesson.title : 'Essential Sanskrit Greetings'}
            </h3>
            <p className="text-xs text-charcoal-600 max-w-lg">
              {recommendedLesson ? recommendedLesson.description : 'Master foundational greetings like Namaste and Subhaprabhatam.'}
            </p>
          </div>

          <Link to={recommendedLesson ? `/learn/${recommendedLesson.id}` : '/learn/1'} className="flex-shrink-0">
            <Button variant="primary" size="lg" className="gap-2 w-full sm:w-auto">
              <span>Continue Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </div>

      {/* 4. Quick Actions */}
      <div>
        <h2 className="text-xl font-bold font-serif-heading text-sanskrit-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/learn">
            <Card className="p-4 flex flex-col items-center text-center gap-3 hover:border-sanskrit-500">
              <div className="w-10 h-10 rounded-xl bg-sanskrit-100 text-sanskrit-700 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-sanskrit-900">Continue Lesson</span>
            </Card>
          </Link>

          <Link to="/practice">
            <Card className="p-4 flex flex-col items-center text-center gap-3 hover:border-sanskrit-500">
              <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-sanskrit-900">Practice Hub</span>
            </Card>
          </Link>

          <Link to="/chat">
            <Card className="p-4 flex flex-col items-center text-center gap-3 hover:border-sanskrit-500">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-sanskrit-900">Chat with GLOSSA</span>
            </Card>
          </Link>

          <Link to="/linguistic-lab">
            <Card className="p-4 flex flex-col items-center text-center gap-3 hover:border-sanskrit-500">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-sanskrit-900">Analyze Sentence</span>
            </Card>
          </Link>
        </div>
      </div>

      {/* 5. Weak Concepts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Concepts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Targeted Concepts</span>
            </h3>
            <Link to="/error-patterns" className="text-xs font-semibold text-sanskrit-600 hover:underline">
              View All Patterns
            </Link>
          </div>

          {weakConcepts.length > 0 ? (
            <div className="space-y-3">
              {weakConcepts.map(c => (
                <div key={c.id} className="p-3 bg-sanskrit-50 rounded-xl border border-sanskrit-200 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-sanskrit-900">{c.name}</p>
                    <p className="text-xs text-charcoal-500">{c.mistakes} recorded mistakes</p>
                  </div>
                  <Link to={`/practice?concept_id=${c.id}`}>
                    <Button variant="secondary" size="sm">Practice</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Weak Concepts Yet!"
              description="As you complete practice questions, GLOSSA will detect recurring patterns and list weak concepts here for targeted exercises."
            />
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900 mb-4">Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((a, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-sanskrit-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-sanskrit-900">Attempted Question #{a.question_id}</span>
                    <p className="text-charcoal-500 truncate max-w-xs">Answer: {a.answer}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full font-bold ${a.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {a.is_correct ? 'Correct (+10 XP)' : 'Needs Review'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Your learning journey starts here."
              description="You have not completed any activities yet. Start your first lesson to earn XP and build your streak!"
              actionText="Start First Lesson"
              onAction={() => navigate('/learn')}
            />
          )}
        </Card>
      </div>
    </div>
  );
};
