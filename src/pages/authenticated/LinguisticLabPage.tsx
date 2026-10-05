import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { WordAnalysis, SentenceAnalysis } from '../../types';
import { FlaskConical, Search, GitMerge, ArrowDown, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const LinguisticLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'word' | 'sentence'>('sentence');

  // Word Analyzer State
  const [inputWord, setInputWord] = useState('बालकः');
  const [wordResult, setWordResult] = useState<WordAnalysis | null>(null);
  const [isAnalyzingWord, setIsAnalyzingWord] = useState(false);

  // Sentence Analyzer State
  const [inputSentence, setInputSentence] = useState('बालकः जलम् पिबति');
  const [sentenceResult, setSentenceResult] = useState<SentenceAnalysis | null>(null);
  const [isAnalyzingSentence, setIsAnalyzingSentence] = useState(false);

  // Modal for Why? interactive explanation
  const [whyModalContent, setWhyModalContent] = useState<string | null>(null);

  const handleAnalyzeWord = async () => {
    if (!inputWord.trim()) return;
    setIsAnalyzingWord(true);
    try {
      const data = await api.post<{ analysis: WordAnalysis }>('/linguistics/analyze-word', { word: inputWord.trim() });
      setWordResult(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingWord(false);
    }
  };

  const handleAnalyzeSentence = async () => {
    if (!inputSentence.trim()) return;
    setIsAnalyzingSentence(true);
    try {
      const data = await api.post<{ analysis: SentenceAnalysis }>('/linguistics/analyze-sentence', { sentence: inputSentence.trim() });
      setSentenceResult(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingSentence(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mb-2">
          <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
          <span>Computational Linguistics Engine</span>
        </div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Linguistic Lab</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Deconstruct Sanskrit word morphology and analyze sentence syntax via Kāraka dependency parsing pipelines.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-sanskrit-200 pb-3">
        <button
          onClick={() => setActiveTab('sentence')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sentence'
              ? 'bg-sanskrit-600 text-white shadow-md'
              : 'bg-white text-charcoal-700 hover:bg-sanskrit-100 border border-sanskrit-200'
          }`}
        >
          Sentence Syntax Analyzer (Kāraka Pipeline)
        </button>
        <button
          onClick={() => setActiveTab('word')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'word'
              ? 'bg-sanskrit-600 text-white shadow-md'
              : 'bg-white text-charcoal-700 hover:bg-sanskrit-100 border border-sanskrit-200'
          }`}
        >
          Morphological Word Analyzer
        </button>
      </div>

      {/* 1. Sentence Analyzer View */}
      {activeTab === 'sentence' && (
        <div className="space-y-6 max-w-4xl">
          <Card className="p-6 space-y-4 border-sanskrit-200">
            <label className="block text-xs font-bold text-sanskrit-900 uppercase tracking-wider">
              Enter Sanskrit Sentence (Devanagari or IAST)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={inputSentence}
                onChange={e => setInputSentence(e.target.value)}
                placeholder="e.g. बालकः जलम् पिबति"
                className="flex-1 p-3.5 rounded-xl border border-sanskrit-200 focus:ring-2 focus:ring-sanskrit-500 font-sanskrit text-base font-semibold"
              />
              <Button variant="primary" size="lg" onClick={handleAnalyzeSentence} disabled={isAnalyzingSentence} className="gap-2">
                <Search className="w-4 h-4" />
                <span>{isAnalyzingSentence ? 'Analyzing Pipeline...' : 'Run Pipeline'}</span>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-medium text-charcoal-600 pt-1">
              <span>Try sample sentences:</span>
              {['बालकः जलम् पिबति', 'अहम् विद्यालयम् गच्छामि', 'सा पुस्तकम् पठति'].map(sample => (
                <button
                  key={sample}
                  onClick={() => setInputSentence(sample)}
                  className="px-2.5 py-1 bg-sanskrit-100 hover:bg-sanskrit-200 text-sanskrit-900 font-sanskrit rounded-lg border border-sanskrit-200 transition-colors"
                >
                  {sample}
                </button>
              ))}
            </div>
          </Card>

          {sentenceResult && (
            <div className="space-y-6">
              {/* Computational Pipeline Visualization */}
              <Card className="p-6 sm:p-8 space-y-6 border-sanskrit-200">
                <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900 flex items-center gap-2">
                  <GitMerge className="w-5 h-5 text-sanskrit-600" />
                  <span>Computational Linguistics Pipeline</span>
                </h3>

                <div className="space-y-4">
                  {sentenceResult.pipelineSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="p-4 bg-white rounded-2xl border border-sanskrit-200 shadow-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sanskrit-700 uppercase tracking-wider">{step.step}</span>
                          <span className="text-xs font-semibold text-charcoal-500">{step.title}</span>
                        </div>
                        <p className="text-sm font-semibold text-sanskrit-900 font-sanskrit">{step.output}</p>
                      </div>
                      {idx < sentenceResult.pipelineSteps.length - 1 && (
                        <div className="flex justify-center my-1 text-sanskrit-400">
                          <ArrowDown className="w-4 h-4 animate-bounce" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Syntactic Tree Breakdown */}
              <Card className="p-6 sm:p-8 space-y-4 border-sanskrit-200">
                <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900">Kāraka Dependency Graph Nodes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {sentenceResult.syntaxTree.map(node => (
                    <div key={node.id} className="p-4 bg-sanskrit-50 rounded-2xl border border-sanskrit-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sanskrit-800">Node #{node.id}</span>
                        <Badge variant={node.role.includes('Kartā') ? 'maroon' : node.role.includes('Karma') ? 'gold' : 'blue'}>
                          {node.role}
                        </Badge>
                      </div>
                      <h4 className="text-lg font-bold font-sanskrit text-sanskrit-900">{node.word}</h4>
                      <p className="text-xs text-charcoal-600">POS: {node.pos}</p>
                      <button
                        onClick={() =>
                          setWhyModalContent(
                            `Why is "${node.word}" assigned the role of [${node.role}]?\n\nBecause in Sanskrit grammar, ${
                              node.role.includes('Kartā')
                                ? 'the subject (Kartā) performs the independent action and takes Prathamā Vibhakti.'
                                : node.role.includes('Karma')
                                ? 'the direct object (Karma) receives the outcome of the verb and takes Dvitīyā Vibhakti.'
                                : 'it governs the main verb action in Present Tense (लट् लकार).'
                            }`
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sanskrit-600 hover:underline pt-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why this form?</span>
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* 2. Word Analyzer View */}
      {activeTab === 'word' && (
        <div className="space-y-6 max-w-3xl">
          <Card className="p-6 space-y-4 border-sanskrit-200">
            <label className="block text-xs font-bold text-sanskrit-900 uppercase tracking-wider">
              Enter Sanskrit Word
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={inputWord}
                onChange={e => setInputWord(e.target.value)}
                placeholder="e.g. बालकः"
                className="flex-1 p-3.5 rounded-xl border border-sanskrit-200 focus:ring-2 focus:ring-sanskrit-500 font-sanskrit text-lg font-semibold"
              />
              <Button variant="primary" size="lg" onClick={handleAnalyzeWord} disabled={isAnalyzingWord} className="gap-2">
                <Search className="w-4 h-4" />
                <span>{isAnalyzingWord ? 'Analyzing...' : 'Analyze Word'}</span>
              </Button>
            </div>
          </Card>

          {wordResult && (
            <Card className="p-6 sm:p-8 space-y-6 border-sanskrit-200 shadow-lg">
              <div className="flex items-center justify-between border-b border-sanskrit-100 pb-4">
                <div>
                  <span className="text-xs text-charcoal-500 uppercase tracking-wider font-semibold">Analyzed Lemma</span>
                  <h2 className="text-3xl font-bold font-sanskrit text-sanskrit-900">{wordResult.word}</h2>
                </div>
                <Badge variant={wordResult.confidence === 'High' ? 'green' : 'amber'}>
                  Confidence: {wordResult.confidence}
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-sanskrit-50 rounded-xl border border-sanskrit-200">
                  <span className="text-[11px] font-bold text-charcoal-500 uppercase block">Part of Speech</span>
                  <span className="text-sm font-semibold text-sanskrit-900">{wordResult.pos}</span>
                </div>
                <div className="p-3.5 bg-sanskrit-50 rounded-xl border border-sanskrit-200">
                  <span className="text-[11px] font-bold text-charcoal-500 uppercase block">Stem / Dhātu</span>
                  <span className="text-sm font-semibold text-sanskrit-900 font-sanskrit">{wordResult.dhatuOrPratipadika}</span>
                </div>
                <div className="p-3.5 bg-sanskrit-50 rounded-xl border border-sanskrit-200">
                  <span className="text-[11px] font-bold text-charcoal-500 uppercase block">Gender</span>
                  <span className="text-sm font-semibold text-sanskrit-900">{wordResult.gender || 'N/A'}</span>
                </div>
                <div className="p-3.5 bg-sanskrit-50 rounded-xl border border-sanskrit-200">
                  <span className="text-[11px] font-bold text-charcoal-500 uppercase block">Number</span>
                  <span className="text-sm font-semibold text-sanskrit-900">{wordResult.number || 'N/A'}</span>
                </div>
                <div className="p-3.5 bg-sanskrit-50 rounded-xl border border-sanskrit-200 col-span-2">
                  <span className="text-[11px] font-bold text-charcoal-500 uppercase block">Case / Tense</span>
                  <span className="text-sm font-semibold text-sanskrit-900">{wordResult.caseOrTense || 'N/A'}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-sanskrit-200 space-y-1">
                <h4 className="text-xs font-bold text-sanskrit-800 uppercase tracking-wider">Morphological Breakdown</h4>
                <p className="text-sm font-bold text-sanskrit-900 font-sanskrit">{wordResult.morphology}</p>
                <p className="text-xs text-charcoal-600 mt-2 leading-relaxed">{wordResult.explanation}</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Why? Modal Overlay */}
      {whyModalContent && (
        <div className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sanskrit-600" />
              <span>Grammar Justification</span>
            </h3>
            <p className="text-sm text-charcoal-700 whitespace-pre-line leading-relaxed">{whyModalContent}</p>
            <Button variant="primary" size="md" onClick={() => setWhyModalContent(null)} className="w-full">
              Close Explanation
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};
