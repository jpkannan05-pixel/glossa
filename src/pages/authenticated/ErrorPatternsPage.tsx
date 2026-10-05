import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { api } from '../../services/api';
import { ErrorPatternCard } from '../../types';
import { AlertTriangle, CheckCircle2, Target, Lightbulb, ArrowRight } from 'lucide-react';

export const ErrorPatternsPage: React.FC = () => {
  const [patterns, setPatterns] = useState<ErrorPatternCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchErrorPatterns = async () => {
      try {
        const data = await api.get<{ patterns: ErrorPatternCard[] }>('/errors');
        setPatterns(data.patterns);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchErrorPatterns();
  }, []);

  if (isLoading) return <LoadingSpinner label="Analyzing Learner Error Patterns..." />;

  const needsPractice = patterns.filter(p => p.status === 'Needs Practice');

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sanskrit-100 text-sanskrit-800 text-xs font-semibold mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-sanskrit-600" />
          <span>Error-Aware Adaptive Learning Engine</span>
        </div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Your Learning Patterns</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          GLOSSA tracks your recurring mistakes to identify weak concepts and provide targeted practice.
        </p>
      </div>

      {/* Hero Banner for Pattern Detected */}
      {needsPractice.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Pattern Detected</span>
              <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900">
                You frequently confuse <span className="text-sanskrit-700">{needsPractice[0].concept_name}</span>
              </h3>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Recommended Mini Lesson: "Understanding {needsPractice[0].concept_name}"
              </p>
            </div>
          </div>

          <Link to={`/practice?concept_id=${needsPractice[0].concept_id}`}>
            <Button variant="primary" size="md" className="gap-2 whitespace-nowrap">
              <span>Start Mini Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patterns.map(p => (
          <Card key={p.concept_id} className="flex flex-col justify-between h-full border-sanskrit-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={p.status === 'Needs Practice' ? 'amber' : p.status === 'Learning' ? 'blue' : p.status === 'Strong' ? 'green' : 'gray'}
                >
                  {p.status}
                </Badge>
                <span className="text-xs font-bold text-sanskrit-800">Accuracy: {p.accuracy}%</span>
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900">{p.concept_name}</h3>
                <p className="text-xs text-charcoal-500 mt-1">{p.totalMistakes} recorded mistakes</p>
              </div>

              <div className="p-3 bg-sanskrit-50 rounded-xl border border-sanskrit-200/80 space-y-1">
                <span className="text-[11px] font-bold text-sanskrit-700 uppercase tracking-wider flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-gold-600" />
                  <span>Recommendation</span>
                </span>
                <p className="text-xs text-charcoal-700 leading-relaxed">{p.recommendation}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sanskrit-100">
              <Link to={`/practice?concept_id=${p.concept_id}`}>
                <Button variant="secondary" size="sm" className="w-full gap-2">
                  <Target className="w-4 h-4" />
                  <span>Targeted Practice</span>
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
