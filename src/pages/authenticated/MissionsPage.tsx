import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';
import { Mission } from '../../types';
import { Award, CheckCircle2, Sparkles, Send, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

export const MissionsPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [userSubmission, setUserSubmission] = useState('');
  const [evaluation, setEvaluation] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await api.get<{ missions: Mission[] }>('/missions');
        setMissions(data.missions);
        if (data.missions.length > 0) setSelectedMission(data.missions[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMissions();
  }, []);

  if (isLoading) return <LoadingSpinner label="Loading Sanskrit Missions..." />;

  const handleSubmitMission = async () => {
    if (!selectedMission || !userSubmission.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await api.post<any>(`/missions/${selectedMission.id}/submit`, {
        submission: userSubmission.trim(),
      });
      setEvaluation(res);
      if (res.is_passed) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.7 } });
        await refreshUser();
        // Refresh missions
        const data = await api.get<{ missions: Mission[] }>('/missions');
        setMissions(data.missions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Real-World Sanskrit Missions</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Apply your Sanskrit knowledge to real-life conversational tasks and earn bonus XP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Missions List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-serif-heading text-sanskrit-900">Available Missions</h2>
          {missions.map(m => {
            const isSelected = selectedMission?.id === m.id;
            const isCompleted = m.status === 'completed';

            return (
              <Card
                key={m.id}
                onClick={() => {
                  setSelectedMission(m);
                  setEvaluation(null);
                  setUserSubmission(m.user_submission || '');
                }}
                className={`p-5 cursor-pointer transition-all ${
                  isSelected ? 'border-2 border-sanskrit-600 bg-sanskrit-50/70 shadow-md' : 'border-sanskrit-200 hover:border-sanskrit-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={isCompleted ? 'green' : 'gold'}>
                    {isCompleted ? 'Completed' : `+${m.xp_reward} XP`}
                  </Badge>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>

                <h3 className="text-base font-bold font-serif-heading text-sanskrit-900">{m.title}</h3>
                <p className="text-xs text-charcoal-600 mt-1 line-clamp-2">{m.description}</p>
              </Card>
            );
          })}
        </div>

        {/* Selected Mission Active Panel */}
        <div className="lg:col-span-2">
          {selectedMission ? (
            <Card className="p-6 sm:p-8 space-y-6 border-sanskrit-200 shadow-lg">
              <div className="flex items-center justify-between border-b border-sanskrit-100 pb-4">
                <div>
                  <Badge variant="maroon">{selectedMission.category}</Badge>
                  <h2 className="text-2xl font-bold font-serif-heading text-sanskrit-900 mt-2">{selectedMission.title}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-charcoal-500 font-semibold block">Reward</span>
                  <span className="text-lg font-bold text-gold-600">+{selectedMission.xp_reward} XP</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-sanskrit-800 uppercase tracking-wider mb-1">Objective & Context</h4>
                <p className="text-sm text-charcoal-700 leading-relaxed">{selectedMission.description}</p>
              </div>

              <div className="p-4 bg-sanskrit-50 rounded-2xl border border-sanskrit-200 space-y-2">
                <h4 className="text-xs font-bold text-sanskrit-800 uppercase tracking-wider">Mission Task</h4>
                <p className="text-sm font-semibold text-sanskrit-900">{selectedMission.task_prompt}</p>
                <div className="text-xs italic text-charcoal-500 pt-1">
                  Sample Answer Reference: <span className="font-sanskrit text-sanskrit-800 font-medium">{selectedMission.sample_answer}</span>
                </div>
              </div>

              {/* Input Area */}
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Your Sanskrit Composition
                </label>
                <textarea
                  rows={4}
                  value={userSubmission}
                  onChange={e => setUserSubmission(e.target.value)}
                  placeholder="Compose your Sanskrit answer here..."
                  className="w-full p-4 rounded-xl border border-sanskrit-200 focus:ring-2 focus:ring-sanskrit-500 text-sm font-sanskrit font-medium"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitMission}
                disabled={!userSubmission.trim() || isSubmitting}
                className="w-full gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Evaluating Submission...' : 'Submit Mission'}</span>
              </Button>

              {/* Feedback Result */}
              {evaluation && (
                <div className={`p-5 rounded-2xl border ${evaluation.is_passed ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base font-serif-heading text-sanskrit-900">
                      {evaluation.is_passed ? 'Mission Accomplished! 🎉' : 'Needs Revision'}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                      +{evaluation.xp_earned} XP
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-700 leading-relaxed">{evaluation.feedback}</p>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-8 text-center text-charcoal-500">
              Select a mission from the list to view instructions and submit your response.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
