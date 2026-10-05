import React, { useEffect, useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';
import { MasteryConcept } from '../../types';
import { Compass, CheckCircle2, Target, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MasteryPage: React.FC = () => {
  const [conceptMap, setConceptMap] = useState<MasteryConcept[]>([]);
  const [selectedConcept, setSelectedConcept] = useState<MasteryConcept | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMastery = async () => {
      try {
        const data = await api.get<{ conceptMap: MasteryConcept[] }>('/mastery');
        setConceptMap(data.conceptMap);
        if (data.conceptMap.length > 0) {
          setSelectedConcept(data.conceptMap[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMastery();
  }, []);

  if (isLoading) return <LoadingSpinner label="Generating Concept Mastery Map..." />;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Mastered': return <Badge variant="green">Mastered</Badge>;
      case 'Practicing': return <Badge variant="gold">Practicing</Badge>;
      case 'Learning': return <Badge variant="blue">Learning</Badge>;
      default: return <Badge variant="gray">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Concept Mastery Map</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Track your progress concept-by-concept across Grammar, Vocabulary, Syntax, and Conversation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Concept Map List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold font-serif-heading text-sanskrit-900">Sanskrit Grammar & Core Concepts</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {conceptMap.map(c => {
              const isSelected = selectedConcept?.concept_id === c.concept_id;
              return (
                <Card
                  key={c.concept_id}
                  onClick={() => setSelectedConcept(c)}
                  className={`p-5 cursor-pointer transition-all ${
                    isSelected ? 'border-2 border-sanskrit-600 bg-sanskrit-50/70 shadow-md' : 'border-sanskrit-200 hover:border-sanskrit-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">{c.category}</span>
                    {getStatusBadge(c.mastery_status)}
                  </div>

                  <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900">{c.name}</h3>

                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                      <span>Accuracy</span>
                      <span>{c.accuracy}%</span>
                    </div>
                    <ProgressBar value={c.accuracy} height="h-2" colorClass={c.accuracy >= 85 ? 'bg-emerald-500' : 'bg-sanskrit-600'} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Concept Deep Dive */}
        <div>
          <h2 className="text-lg font-bold font-serif-heading text-sanskrit-900 mb-4">Concept Insights</h2>
          {selectedConcept ? (
            <Card className="p-6 space-y-6 sticky top-24 border-sanskrit-200">
              <div className="flex items-center justify-between">
                <Badge variant="maroon">{selectedConcept.category}</Badge>
                {getStatusBadge(selectedConcept.mastery_status)}
              </div>

              <div>
                <h3 className="text-2xl font-bold font-serif-heading text-sanskrit-900">{selectedConcept.name}</h3>
                <p className="text-xs text-charcoal-500 mt-1">Detailed Mastery Breakdown</p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-sanskrit-50 rounded-2xl border border-sanskrit-200 text-center">
                <div>
                  <p className="text-xs text-charcoal-500">Accuracy</p>
                  <p className="text-xl font-bold text-sanskrit-900 font-serif-heading">{selectedConcept.accuracy}%</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal-500">Attempts</p>
                  <p className="text-xl font-bold text-sanskrit-900 font-serif-heading">{selectedConcept.attempt_count}</p>
                </div>
                <div>
                  <p className="text-xs text-charcoal-500">Mistakes</p>
                  <p className="text-xl font-bold text-sanskrit-900 font-serif-heading">{selectedConcept.mistake_count}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link to={`/practice?concept_id=${selectedConcept.concept_id}`}>
                  <Button variant="primary" size="md" className="w-full gap-2">
                    <Target className="w-4 h-4" />
                    <span>Practice This Concept</span>
                  </Button>
                </Link>

                <Link to="/learn">
                  <Button variant="outline" size="md" className="w-full gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Recommended Lesson</span>
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center text-charcoal-500 text-sm">
              Select a concept to inspect detailed accuracy and attempt metrics.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
