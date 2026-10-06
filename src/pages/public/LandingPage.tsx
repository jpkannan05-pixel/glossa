import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import {
  BookOpen,
  Target,
  MessageSquare,
  AlertTriangle,
  FlaskConical,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sanskrit-50 text-charcoal-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-sanskrit-200/60 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sanskrit-600 flex items-center justify-center text-white font-bold font-serif-heading text-xl shadow-md">
              ग्लो
            </div>
            <span className="text-xl font-bold font-serif-heading text-sanskrit-900 tracking-wider">GLOSSA</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary">Start Learning</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-8 lg:py-28 bg-gradient-to-b from-white via-sanskrit-50 to-sanskrit-100/40">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sanskrit-100 border border-sanskrit-300 text-sanskrit-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>AI-Powered Sanskrit Learning & Computational Linguistics</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif-heading text-sanskrit-900 tracking-tight leading-tight mb-6">
            Learn Sanskrit. <br />
            <span className="text-sanskrit-600 bg-gradient-to-r from-sanskrit-600 via-sanskrit-500 to-gold-600 bg-clip-text text-transparent">
              Understand Sanskrit.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-charcoal-700 max-w-3xl mx-auto mb-10 leading-relaxed">
            An adaptive AI Sanskrit learning platform — Learn vocabulary, master grammar, practice conversation, and explore computational linguistics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore GLOSSA
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Core 6 Pillars Section */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-sanskrit-900 mb-4">
            Why Learn With GLOSSA?
          </h2>
          <p className="text-base text-charcoal-700">
            GLOSSA goes beyond plain translation by analyzing recurring learner mistakes and explaining the underlying computational linguistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Pillar 1: Learn */}
          <Card className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-sanskrit-100 text-sanskrit-700 flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900 mb-2">Learn</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed flex-1">
              Structured Sanskrit lessons covering essential vocabulary, declensions, verb conjugations, and conversational daily dialogues.
            </p>
          </Card>

          {/* Pillar 2: Practice */}
          <Card className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900 mb-2">Practice</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed flex-1">
              Interactive exercises including multiple choice, translation, word ordering, and error correction that adapt dynamically to your skill level.
            </p>
          </Card>

          {/* Pillar 3: AI Tutor */}
          <Card className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900 mb-2">AI Tutor</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed flex-1">
              Conversational Sanskrit practice with GLOSSA AI tutor. Get real-time corrections, grammatical justifications, and gentle feedback.
            </p>
          </Card>

          {/* Pillar 4: Error-Aware Learning */}
          <Card className="flex flex-col h-full border-2 border-sanskrit-500/20 bg-sanskrit-50/40">
            <div className="w-12 h-12 rounded-xl bg-sanskrit-600 text-white flex items-center justify-center mb-5 shadow-md">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900 mb-2">Error-Aware Learning</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed flex-1">
              Identifies recurring mistakes (like case confusion or gender agreement), points out WHY an answer is wrong, and provides targeted micro-lessons.
            </p>
          </Card>

          {/* Pillar 5: Linguistic Lab */}
          <Card className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-5">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900 mb-2">Linguistic Lab</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed flex-1">
              Explore Sanskrit through computational linguistics: tokenization, morphological stem parsing, POS tagging, and Kāraka syntax dependency trees.
            </p>
          </Card>

          {/* Pillar 6: Mastery */}
          <Card className="flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900 mb-2">Mastery Map</h3>
            <p className="text-sm text-charcoal-600 leading-relaxed flex-1">
              Track progress concept by concept across Nouns, Verbs, Sandhi, and Syntax with empirical accuracy scoring.
            </p>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-sanskrit-900 text-white text-center mt-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif-heading mb-6 tracking-tight">
            Begin Your Sanskrit Journey
          </h2>
          <p className="text-sanskrit-200 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Join GLOSSA today and experience error-aware adaptive Sanskrit learning crafted for scholars and modern language learners alike.
          </p>
          <Link to="/signup">
            <Button variant="gold" size="lg" className="px-10 py-4 text-base">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sanskrit-950 text-sanskrit-300 py-6 px-4 text-center text-xs border-t border-sanskrit-800">
        <p>© 2026 GLOSSA. All rights reserved. Learn Sanskrit. Understand Sanskrit.</p>
      </footer>
    </div>
  );
};
