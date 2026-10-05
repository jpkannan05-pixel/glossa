import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Sparkles, Check, ArrowRight, BookOpen, Clock, Languages, Lightbulb, Compass } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const navigate = useNavigate();

  const [sanskritLevel, setSanskritLevel] = useState('Complete Beginner');
  const [learningGoals, setLearningGoals] = useState<string[]>(['Vocabulary', 'Grammar']);
  const [dailyGoal, setDailyGoal] = useState<number>(15);
  const [explanationLang, setExplanationLang] = useState<'English' | 'Tamil'>('English');
  const [teachingStyle, setTeachingStyle] = useState('Simple explanations');
  const [isSaving, setIsSaving] = useState(false);

  const toggleGoal = (goal: string) => {
    if (learningGoals.includes(goal)) {
      if (learningGoals.length > 1) {
        setLearningGoals(learningGoals.filter(g => g !== goal));
      }
    } else {
      setLearningGoals([...learningGoals, goal]);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      await updatePreferences({
        sanskrit_level: sanskritLevel,
        learning_goal: learningGoals,
        daily_goal: dailyGoal,
        explanation_language: explanationLang,
        teaching_style: teachingStyle,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-sanskrit-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sanskrit-100 text-sanskrit-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Welcome to GLOSSA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-sanskrit-900">
            Personalize Your Sanskrit Learning
          </h1>
          <p className="text-sm text-charcoal-600 mt-2">
            Tailor your adaptive learning path, daily goals, and explanation languages.
          </p>
        </div>

        <Card className="p-6 sm:p-10 space-y-8 shadow-xl">
          {/* 1. Sanskrit Level */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold font-serif-heading text-sanskrit-900 mb-3">
              <Compass className="w-4 h-4 text-sanskrit-600" />
              <span>What is your current Sanskrit proficiency level?</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Complete Beginner', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSanskritLevel(lvl)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    sanskritLevel === lvl
                      ? 'border-sanskrit-600 bg-sanskrit-600 text-white shadow-md'
                      : 'border-sanskrit-200 bg-white text-charcoal-700 hover:border-sanskrit-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Learning Goal */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold font-serif-heading text-sanskrit-900 mb-3">
              <BookOpen className="w-4 h-4 text-sanskrit-600" />
              <span>What are your learning goals? (Select multiple)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Speaking',
                'Reading',
                'Writing',
                'Grammar',
                'Vocabulary',
                'Academic Sanskrit',
                'Cultural understanding',
              ].map(goal => {
                const isSelected = learningGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-gold-500 bg-gold-50 text-sanskrit-900 shadow-sm'
                        : 'border-sanskrit-200 bg-white text-charcoal-700 hover:border-sanskrit-300'
                    }`}
                  >
                    <span>{goal}</span>
                    {isSelected && <Check className="w-4 h-4 text-gold-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Daily Learning Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold font-serif-heading text-sanskrit-900 mb-3">
              <Clock className="w-4 h-4 text-sanskrit-600" />
              <span>How much time can you commit daily?</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { time: 5, label: '5 Minutes' },
                { time: 10, label: '10 Minutes' },
                { time: 15, label: '15 Minutes' },
                { time: 20, label: '20+ Minutes' },
              ].map(item => (
                <button
                  key={item.time}
                  type="button"
                  onClick={() => setDailyGoal(item.time)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    dailyGoal === item.time
                      ? 'border-sanskrit-600 bg-sanskrit-600 text-white shadow-md'
                      : 'border-sanskrit-200 bg-white text-charcoal-700 hover:border-sanskrit-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Explanation Language */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold font-serif-heading text-sanskrit-900 mb-3">
              <Languages className="w-4 h-4 text-sanskrit-600" />
              <span>Preferred Explanation Language</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { code: 'English', name: 'English', native: 'English' },
                { code: 'Tamil', name: 'Tamil', native: 'தமிழ்' },
              ].map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setExplanationLang(lang.code as 'English' | 'Tamil')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    explanationLang === lang.code
                      ? 'border-sanskrit-600 bg-sanskrit-50 text-sanskrit-900 font-bold ring-2 ring-sanskrit-500'
                      : 'border-sanskrit-200 bg-white text-charcoal-700 hover:border-sanskrit-400'
                  }`}
                >
                  <p className="text-sm font-bold">{lang.name}</p>
                  <p className="text-xs text-sanskrit-600">{lang.native}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Teaching Style */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold font-serif-heading text-sanskrit-900 mb-3">
              <Lightbulb className="w-4 h-4 text-sanskrit-600" />
              <span>Preferred Teaching Style</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Simple explanations', 'Detailed grammar', 'Conversation focused', 'Practice focused'].map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTeachingStyle(style)}
                  className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    teachingStyle === style
                      ? 'border-sanskrit-600 bg-sanskrit-600 text-white shadow-md'
                      : 'border-sanskrit-200 bg-white text-charcoal-700 hover:border-sanskrit-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-sanskrit-100 flex justify-end">
            <Button variant="primary" size="lg" onClick={handleComplete} disabled={isSaving} className="gap-2 px-8">
              <span>{isSaving ? 'Saving...' : 'Enter GLOSSA Dashboard'}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
