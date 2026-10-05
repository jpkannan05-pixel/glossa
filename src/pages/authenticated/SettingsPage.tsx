import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Settings as SettingsIcon, Bell, Moon, Sun, Shield, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { preferences, updatePreferences } = useAuth();
  const [explanationLang, setExplanationLang] = useState<'English' | 'Tamil'>(preferences?.explanation_language || 'English');
  const [teachingStyle, setTeachingStyle] = useState(preferences?.teaching_style || 'Simple explanations');
  const [darkMode, setDarkMode] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    try {
      await updatePreferences({
        explanation_language: explanationLang,
        teaching_style: teachingStyle,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Settings & Preferences</h1>
        <p className="text-sm text-charcoal-600 mt-1">Configure your GLOSSA learning environment and account settings.</p>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold">
          Settings saved successfully!
        </div>
      )}

      {/* Learning Preferences */}
      <Card className="p-6 space-y-6 border-sanskrit-200">
        <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900 border-b border-sanskrit-100 pb-3">
          Learning & Explanation Preferences
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">Explanation Language</label>
            <div className="grid grid-cols-2 gap-4">
              {['English', 'Tamil'].map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setExplanationLang(lang as 'English' | 'Tamil')}
                  className={`p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                    explanationLang === lang
                      ? 'border-sanskrit-600 bg-sanskrit-50 text-sanskrit-900 ring-2 ring-sanskrit-500'
                      : 'border-sanskrit-200 bg-white text-charcoal-700'
                  }`}
                >
                  {lang === 'English' ? 'English' : 'Tamil (தமிழ்)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase mb-1.5">Teaching Style</label>
            <select
              value={teachingStyle}
              onChange={e => setTeachingStyle(e.target.value)}
              className="w-full p-3 rounded-xl border border-sanskrit-200 text-sm font-medium"
            >
              {['Simple explanations', 'Detailed grammar', 'Conversation focused', 'Practice focused'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleSave} className="w-full sm:w-auto">
          Save Preferences
        </Button>
      </Card>

      {/* Appearance & Notifications */}
      <Card className="p-6 space-y-6 border-sanskrit-200">
        <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900 border-b border-sanskrit-100 pb-3">
          Appearance & Reminders
        </h3>

        <div className="flex items-center justify-between p-4 bg-sanskrit-50 rounded-xl border border-sanskrit-200">
          <div>
            <span className="text-sm font-bold text-sanskrit-900 block">Daily Learning Reminders</span>
            <span className="text-xs text-charcoal-600">Receive notifications to maintain your daily streak</span>
          </div>
          <button
            onClick={() => setReminders(!reminders)}
            className={`w-12 h-6 rounded-full transition-colors p-1 ${reminders ? 'bg-sanskrit-600' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reminders ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </Card>
    </div>
  );
};
