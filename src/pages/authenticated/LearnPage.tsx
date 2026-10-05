import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';
import { Lesson } from '../../types';
import { BookOpen, Sparkles, CheckCircle2, PlayCircle, Lock } from 'lucide-react';

export const LearnPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await api.get<{ lessons: Lesson[] }>('/lessons');
        setLessons(data.lessons);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLessons();
  }, []);

  if (isLoading) return <LoadingSpinner label="Loading Sanskrit Learning Modules..." />;

  const categories = ['All', 'Vocabulary', 'Grammar', 'Conversation'];
  const filteredLessons = activeCategory === 'All'
    ? lessons
    : lessons.filter(l => l.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Structured Sanskrit Lessons</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Master vocabulary, declensions, verb conjugations, and real-world conversations step by step.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-sanskrit-200 pb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-sanskrit-600 text-white shadow-md'
                : 'bg-white text-charcoal-700 hover:bg-sanskrit-100 border border-sanskrit-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson, idx) => {
          const isCompleted = lesson.status === 'completed';

          return (
            <Card key={lesson.id} className="flex flex-col justify-between h-full border border-sanskrit-200 hover:border-sanskrit-500">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={lesson.category === 'Grammar' ? 'maroon' : lesson.category === 'Vocabulary' ? 'gold' : 'blue'}>
                    {lesson.category}
                  </Badge>
                  <span className="text-xs font-semibold text-charcoal-500">{lesson.level}</span>
                </div>

                <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900 leading-snug">
                  {idx + 1}. {lesson.title}
                </h3>

                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sanskrit-100 flex items-center justify-between">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed ({lesson.score}%)</span>
                  </div>
                ) : (
                  <span className="text-xs text-charcoal-500 font-medium">Ready to start</span>
                )}

                <Link to={`/learn/${lesson.id}`}>
                  <Button variant={isCompleted ? 'secondary' : 'primary'} size="sm" className="gap-1.5">
                    <PlayCircle className="w-4 h-4" />
                    <span>{isCompleted ? 'Review' : 'Start Lesson'}</span>
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
