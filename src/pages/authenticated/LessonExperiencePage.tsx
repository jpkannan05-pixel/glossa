import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { Lesson, Question, EvaluationResult } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

export const LessonExperiencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isMistakeAttempted, setIsMistakeAttempted] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const data = await api.get<{ lesson: Lesson; questions: Question[] }>(`/lessons/${id}`);
        setLesson(data.lesson);
        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessonDetail();
  }, [id]);

  if (isLoading || !lesson) return <LoadingSpinner label="Loading Lesson Experience..." />;
  if (questions.length === 0) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto space-y-4">
        <h2 className="text-xl font-bold font-serif-heading">No Questions in this Lesson</h2>
        <Link to="/learn">
          <Button variant="primary">Return to Lessons</Button>
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) return;
    setIsSubmitting(true);

    try {
      const res = await api.post<{ evaluation: EvaluationResult }>('/lessons/submit-answer', {
        question_id: currentQuestion.id,
        answer: selectedAnswer,
        is_previous_mistake: isMistakeAttempted,
      });

      setEvaluation(res.evaluation);
      if (res.evaluation.is_correct) {
        setTotalXpEarned(prev => prev + res.evaluation.xp_earned);
        if (res.evaluation.self_correction_bonus) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    setEvaluation(null);
    setSelectedAnswer('');
    setIsMistakeAttempted(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Complete entire lesson
      try {
        await api.post(`/lessons/${lesson.id}/complete`, { score: 100 });
        await refreshUser();
        setLessonCompleted(true);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTryAgain = () => {
    setEvaluation(null);
    setSelectedAnswer('');
    setIsMistakeAttempted(true); // Flag that user is self-correcting
  };

  if (lessonCompleted) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-6">
        <Card className="p-8 sm:p-10 space-y-6 shadow-xl border-2 border-gold-400">
          <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto text-gold-600 shadow-inner">
            <Sparkles className="w-10 h-10 animate-bounce" />
          </div>

          <h2 className="text-3xl font-bold font-serif-heading text-sanskrit-900">
            Lesson Completed!
          </h2>

          <p className="text-sm text-charcoal-600">
            You have successfully finished <span className="font-bold text-sanskrit-800">{lesson.title}</span>.
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gold-50 border border-gold-300 text-sanskrit-900 font-bold text-lg">
            <Sparkles className="w-5 h-5 text-gold-600" />
            <span>+25 Lesson Bonus XP</span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/learn">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Back to Lessons
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header & Progress Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link to="/learn" className="text-xs font-bold text-sanskrit-600 hover:underline">
          ← Exit Lesson
        </Link>
        <span className="text-xs font-bold text-charcoal-500">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <ProgressBar value={((currentIndex + 1) / questions.length) * 100} height="h-3" colorClass="bg-sanskrit-600" />

      {/* Main Question Card */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-sanskrit-200">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Badge variant="maroon">{currentQuestion.grammar_concept_name || 'Grammar'}</Badge>
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              {currentQuestion.question_type.replace('_', ' ')}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-sanskrit-900 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Question Input / Multiple Choice Options */}
        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!!evaluation}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${
                  selectedAnswer === option
                    ? 'border-sanskrit-600 bg-sanskrit-50 text-sanskrit-900 ring-2 ring-sanskrit-500'
                    : 'border-sanskrit-200 bg-white text-charcoal-800 hover:border-sanskrit-400'
                }`}
              >
                <span>{option}</span>
                {selectedAnswer === option && <CheckCircle2 className="w-5 h-5 text-sanskrit-600" />}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={selectedAnswer}
              disabled={!!evaluation}
              onChange={e => setSelectedAnswer(e.target.value)}
              placeholder="Type your answer in Sanskrit or English..."
              className="w-full p-4 rounded-xl border border-sanskrit-200 focus:ring-2 focus:ring-sanskrit-500 text-sm font-medium"
            />
          </div>
        )}

        {/* Submit Button before evaluation */}
        {!evaluation && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Answer'}
          </Button>
        )}

        {/* Evaluation Feedback Panel */}
        {evaluation && (
          <div className={`p-6 rounded-2xl border space-y-4 ${
            evaluation.is_correct
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/80 border-amber-300 text-charcoal-900'
          }`}>
            {/* Header Feedback */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {evaluation.is_correct ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                )}
                <h3 className="text-lg font-bold font-serif-heading">
                  {evaluation.is_correct ? 'Correct Answer!' : 'Not Quite Right'}
                </h3>
              </div>

              {evaluation.is_correct && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    +{evaluation.xp_earned} XP
                  </span>
                  {evaluation.self_correction_bonus && (
                    <span className="text-xs font-bold text-gold-700 bg-gold-100 px-3 py-1 rounded-full animate-bounce">
                      Self-Correction Bonus +5 XP
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Error Aware Detailed Breakdown for Incorrect Answers */}
            {!evaluation.is_correct && (
              <div className="space-y-3 text-xs sm:text-sm pt-2 border-t border-amber-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="font-semibold text-charcoal-500 block text-[11px] uppercase">Your Answer</span>
                    <span className="font-bold text-red-700">{evaluation.user_answer}</span>
                  </div>
                  <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <span className="font-semibold text-charcoal-500 block text-[11px] uppercase">Correct Answer</span>
                    <span className="font-bold text-emerald-700">{evaluation.correct_answer}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Error Category: {evaluation.error_category}</span>
                  </div>
                  <p className="text-charcoal-700 leading-relaxed">{evaluation.why_wrong}</p>
                  {evaluation.example && (
                    <div className="mt-2 text-xs italic bg-sanskrit-50 p-2 rounded-lg text-sanskrit-900 border border-sanskrit-200">
                      💡 Example: {evaluation.example}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions: Try Again vs Continue */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {!evaluation.is_correct && (
                <Button variant="outline" size="md" onClick={handleTryAgain} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </Button>
              )}
              <Button variant="primary" size="md" onClick={handleNextQuestion} className="gap-2 sm:ml-auto">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
