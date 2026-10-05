import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';
import { Question, EvaluationResult } from '../../types';
import { Target, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

export const PracticePage: React.FC = () => {
  const [exercises, setExercises] = useState<Question[]>([]);
  const [activeType, setActiveType] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await api.get<{ exercises: Question[] }>('/practice');
        setExercises(data.exercises);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExercises();
  }, []);

  if (isLoading) return <LoadingSpinner label="Loading Practice Hub Exercises..." />;

  const types = [
    { code: 'all', label: 'All Exercises' },
    { code: 'multiple_choice', label: 'Multiple Choice' },
    { code: 'translation', label: 'Translation' },
    { code: 'fill_blank', label: 'Fill in Blank' },
    { code: 'word_order', label: 'Word Ordering' },
    { code: 'grammar_id', label: 'Grammar Identification' },
  ];

  const filtered = activeType === 'all'
    ? exercises
    : exercises.filter(e => e.question_type === activeType);

  const currentQuestion = filtered[currentIndex];

  const handleSubmit = async () => {
    if (!selectedAnswer || !currentQuestion) return;
    try {
      const res = await api.post<{ evaluation: EvaluationResult }>('/lessons/submit-answer', {
        question_id: currentQuestion.id,
        answer: selectedAnswer,
      });
      setEvaluation(res.evaluation);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = () => {
    setEvaluation(null);
    setSelectedAnswer('');
    if (currentIndex + 1 < filtered.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Practice Hub</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Strengthen your Sanskrit mastery with targeted drills across all core question types.
        </p>
      </div>

      {/* Type Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-sanskrit-200 pb-3">
        {types.map(t => (
          <button
            key={t.code}
            onClick={() => {
              setActiveType(t.code);
              setCurrentIndex(0);
              setEvaluation(null);
              setSelectedAnswer('');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeType === t.code
                ? 'bg-sanskrit-600 text-white shadow-md'
                : 'bg-white text-charcoal-700 hover:bg-sanskrit-100 border border-sanskrit-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Practice Interactive Card */}
      {currentQuestion ? (
        <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-sanskrit-200 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <Badge variant="gold">{currentQuestion.grammar_concept_name || 'Grammar'}</Badge>
            <span className="text-xs font-semibold text-charcoal-500">
              Exercise {currentIndex + 1} of {filtered.length}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-sanskrit-900">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          {currentQuestion.options && currentQuestion.options.length > 0 ? (
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={!!evaluation}
                  onClick={() => setSelectedAnswer(opt)}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                    selectedAnswer === opt
                      ? 'border-sanskrit-600 bg-sanskrit-50 text-sanskrit-900 ring-2 ring-sanskrit-500'
                      : 'border-sanskrit-200 bg-white text-charcoal-800 hover:border-sanskrit-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={selectedAnswer}
              disabled={!!evaluation}
              onChange={e => setSelectedAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-4 rounded-xl border border-sanskrit-200 focus:ring-2 focus:ring-sanskrit-500 text-sm"
            />
          )}

          {!evaluation ? (
            <Button variant="primary" size="lg" onClick={handleSubmit} disabled={!selectedAnswer} className="w-full">
              Check Answer
            </Button>
          ) : (
            <div className={`p-6 rounded-2xl border space-y-4 ${evaluation.is_correct ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-base font-serif-heading flex items-center gap-2">
                  {evaluation.is_correct ? (
                    <span className="text-emerald-700 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Correct! (+10 XP)</span>
                  ) : (
                    <span className="text-amber-800 flex items-center gap-2"><XCircle className="w-5 h-5" /> Keep Learning!</span>
                  )}
                </span>
              </div>

              {!evaluation.is_correct && (
                <p className="text-xs text-charcoal-700 leading-relaxed">{evaluation.why_wrong}</p>
              )}

              <Button variant="primary" size="md" onClick={handleNext} className="w-full">
                Next Exercise
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <Card className="p-8 text-center max-w-md mx-auto">
          <p className="text-sm font-bold text-charcoal-600">No exercises found for this category.</p>
        </Card>
      )}
    </div>
  );
};
