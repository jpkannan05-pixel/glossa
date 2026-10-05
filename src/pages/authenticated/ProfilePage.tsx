import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { User as UserIcon, Mail, Award, Sparkles, Edit3, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, preferences, stats, updatePreferences } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [sanskritLevel, setSanskritLevel] = useState(preferences?.sanskrit_level || 'Complete Beginner');
  const [dailyGoal, setDailyGoal] = useState(preferences?.daily_goal || 15);
  const [explanationLang, setExplanationLang] = useState<'English' | 'Tamil'>(preferences?.explanation_language || 'English');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePreferences({
        sanskrit_level: sanskritLevel,
        daily_goal: dailyGoal,
        explanation_language: explanationLang,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">User Profile</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Manage your personal account information and learning preferences.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <Card className="p-6 sm:p-8 space-y-6 border-sanskrit-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-sanskrit-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sanskrit-600 text-white font-bold font-serif-heading text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif-heading text-sanskrit-900">{user.name}</h2>
              <p className="text-xs text-sanskrit-600 font-medium">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="maroon">Level {user.level}</Badge>
                <Badge variant="gold">{preferences?.sanskrit_level || 'Beginner'}</Badge>
              </div>
            </div>
          </div>

          <Button variant="outline" size="md" onClick={() => setIsEditing(!isEditing)} className="gap-2">
            <Edit3 className="w-4 h-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </Button>
        </div>

        {/* Edit / View Form */}
        {isEditing ? (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">Proficiency Level</label>
              <select
                value={sanskritLevel}
                onChange={e => setSanskritLevel(e.target.value)}
                className="w-full p-3 rounded-xl border border-sanskrit-200 text-sm"
              >
                {['Complete Beginner', 'Beginner', 'Intermediate', 'Advanced'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">Explanation Language</label>
              <select
                value={explanationLang}
                onChange={e => setExplanationLang(e.target.value as 'English' | 'Tamil')}
                className="w-full p-3 rounded-xl border border-sanskrit-200 text-sm"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
              </select>
            </div>

            <Button variant="primary" size="lg" onClick={handleSave} disabled={isSaving} className="w-full">
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-sanskrit-50 rounded-2xl border border-sanskrit-100">
              <span className="text-xs font-semibold text-charcoal-500 uppercase">XP</span>
              <p className="text-2xl font-bold font-serif-heading text-sanskrit-900">{user.xp}</p>
            </div>
            <div className="p-4 bg-sanskrit-50 rounded-2xl border border-sanskrit-100">
              <span className="text-xs font-semibold text-charcoal-500 uppercase">Streak</span>
              <p className="text-2xl font-bold font-serif-heading text-sanskrit-900">{user.streak} Days</p>
            </div>
            <div className="p-4 bg-sanskrit-50 rounded-2xl border border-sanskrit-100">
              <span className="text-xs font-semibold text-charcoal-500 uppercase">Completed</span>
              <p className="text-2xl font-bold font-serif-heading text-sanskrit-900">{stats?.completedLessons || 0}</p>
            </div>
            <div className="p-4 bg-sanskrit-50 rounded-2xl border border-sanskrit-100">
              <span className="text-xs font-semibold text-charcoal-500 uppercase">Mastery</span>
              <p className="text-2xl font-bold font-serif-heading text-sanskrit-900">{stats?.overallMastery || 0}%</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
