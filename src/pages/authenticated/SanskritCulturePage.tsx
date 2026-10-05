import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Landmark, Sparkles, BookOpen, Scroll, Compass } from 'lucide-react';

export const SanskritCulturePage: React.FC = () => {
  const cultureCards = [
    {
      title: 'Pāṇini & the Aṣṭādhyāyī',
      category: 'Classical Scholar',
      snippet: 'Pāṇini (c. 4th century BCE) authored the Aṣṭādhyāyī, a generative grammar of 3,959 rules resembling modern computer programming languages.',
    },
    {
      title: 'Kālidāsa & Abhijñānaśākuntalam',
      category: 'Sanskrit Literature',
      snippet: 'Widely regarded as the greatest poet in classical Sanskrit literature, famous for masterpieces like Meghadūta and Abhijñānaśākuntalam.',
    },
    {
      title: 'The Structure of Devanagari',
      category: 'Linguistic Trivia',
      snippet: 'Devanagari is an abugida script arranged scientifically according to phonetic place of articulation (Kanthya, Tālavya, Mūrdhanya, Dantya, Oṣṭhya).',
    },
    {
      title: 'Pan-Indo-European Roots',
      category: 'Comparative Linguistics',
      snippet: 'Sanskrit belongs to the Indo-Aryan branch of the Indo-European language family, sharing cognates like Mātā (Mother - Meter/Mère) and Pitā (Father - Pater).',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-serif-heading text-sanskrit-900">Sanskrit Culture & Literature</h1>
        <p className="text-sm text-charcoal-600 mt-1">
          Explore the rich history, classical scholars, literature, and linguistic heritage of Sanskrit.
        </p>
      </div>

      {/* Did You Know? Feature Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-gold-500/10 via-sanskrit-100 to-sanskrit-50 border border-gold-300 shadow-sm flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gold-500 text-sanskrit-950 flex items-center justify-center font-bold flex-shrink-0 shadow-md">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gold-700">Did You Know?</span>
          <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900 mt-0.5">
            Pāṇini's Grammar is Turing-Complete
          </h3>
          <p className="text-xs text-charcoal-700 leading-relaxed mt-1">
            Pāṇini’s 4th-century BCE grammar uses auxiliary symbols, recursion, and rule precedence algorithms identical to context-free grammars used in modern compiler design.
          </p>
        </div>
      </div>

      {/* Culture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cultureCards.map((card, idx) => (
          <Card key={idx} className="p-6 space-y-3 border-sanskrit-200 hover:border-sanskrit-500">
            <Badge variant="gold">{card.category}</Badge>
            <h3 className="text-xl font-bold font-serif-heading text-sanskrit-900">{card.title}</h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">{card.snippet}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
