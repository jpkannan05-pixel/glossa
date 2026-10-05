import React, { useEffect, useState, useRef } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { api } from '../../services/api';
import { ChatMessage } from '../../types';
import { MessageSquare, Send, Sparkles, AlertTriangle, BookOpen, Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [activeMode, setActiveMode] = useState('Conversation');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modes = [
    { code: 'Conversation', label: 'Conversation' },
    { code: 'Teacher', label: 'Grammar Teacher' },
    { code: 'Practice', label: 'Practice Exercises' },
    { code: 'Translation', label: 'Translation Assist' },
    { code: 'Strict Grammar', label: 'Strict Grammar' },
    { code: 'Gentle', label: 'Gentle Beginner' },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.get<{ history: ChatMessage[] }>('/ai/history');
        setMessages(data.history);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await api.post<{ chatEntry: ChatMessage }>('/ai/message', {
        mode: activeMode,
        message: userText,
      });

      setMessages(prev => [...prev, res.chatEntry]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoadingHistory) return <LoadingSpinner label="Initializing AI Tutor GLOSSA..." />;

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col space-y-4">
      {/* Header & Mode Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-sanskrit-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-serif-heading text-sanskrit-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-sanskrit-600" />
            <span>Chat with GLOSSA</span>
          </h1>
          <p className="text-xs text-charcoal-500">AI-powered Sanskrit conversational tutor & grammar assistant</p>
        </div>

        {/* Modes */}
        <div className="flex flex-wrap gap-1.5">
          {modes.map(m => (
            <button
              key={m.code}
              onClick={() => setActiveMode(m.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeMode === m.code
                  ? 'bg-sanskrit-600 text-white shadow-sm'
                  : 'bg-sanskrit-50 text-charcoal-700 hover:bg-sanskrit-100 border border-sanskrit-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Window */}
      <Card className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-sanskrit-50/40 border-sanskrit-200 flex flex-col">
        {messages.length === 0 ? (
          <div className="my-auto text-center space-y-3 py-8 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-sanskrit-100 text-sanskrit-700 flex items-center justify-center mx-auto shadow-inner">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900">
              Namaste! I am GLOSSA, your Sanskrit AI Tutor.
            </h3>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Ask me about grammar rules, practice Sanskrit sentences, or request translations. Select a tutoring mode above!
            </p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="space-y-4">
              {/* User Bubble */}
              <div className="flex items-start gap-3 justify-end">
                <div className="bg-sanskrit-600 text-white p-4 rounded-2xl rounded-tr-none max-w-xl shadow-md text-sm">
                  <p className="font-medium">{msg.message}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-sanskrit-200 text-sanskrit-900 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* AI Response Bubble */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sanskrit-900 text-gold-400 font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                  ग्लो
                </div>
                <div className="bg-white border border-sanskrit-200 p-5 rounded-2xl rounded-tl-none max-w-2xl shadow-card space-y-3 text-sm">
                  {msg.response.sanskrit && (
                    <div className="p-3 bg-sanskrit-50 rounded-xl border border-sanskrit-200">
                      <span className="text-xs font-bold text-sanskrit-700 uppercase tracking-wider block mb-1">Sanskrit</span>
                      <p className="text-lg font-bold text-sanskrit-900 font-sanskrit">{msg.response.sanskrit}</p>
                    </div>
                  )}

                  {msg.response.translation && (
                    <div>
                      <span className="text-xs font-bold text-charcoal-500 uppercase tracking-wider block mb-0.5">Translation</span>
                      <p className="text-charcoal-800">{msg.response.translation}</p>
                    </div>
                  )}

                  {msg.response.explanation && (
                    <div className="text-xs text-charcoal-600 leading-relaxed bg-sanskrit-50/50 p-2.5 rounded-lg border border-sanskrit-100">
                      💡 <span className="font-semibold text-sanskrit-900">Tutor Note:</span> {msg.response.explanation}
                    </div>
                  )}

                  {msg.response.grammar_correction && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Grammar Guidance: {msg.response.grammar_correction.grammar_concept}</span>
                      </div>
                      <p><strong>What you wrote:</strong> <span className="line-through text-red-600">{msg.response.grammar_correction.user_wrote}</span></p>
                      <p><strong>Better version:</strong> <span className="font-bold text-emerald-700">{msg.response.grammar_correction.better_version}</span></p>
                      <p className="text-charcoal-600"><strong>Why:</strong> {msg.response.grammar_correction.why}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {isSending && (
          <div className="flex items-center gap-3 text-xs font-semibold text-sanskrit-700">
            <div className="w-8 h-8 rounded-xl bg-sanskrit-900 text-gold-400 font-bold flex items-center justify-center text-xs">
              ग्लो
            </div>
            <div className="bg-white px-4 py-2.5 rounded-xl border border-sanskrit-200 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-sanskrit-600 rounded-full animate-ping"></div>
              <span>GLOSSA is formulating response in mode [{activeMode}]...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input Field */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder={`Type message for GLOSSA (${activeMode} mode)...`}
          className="flex-1 p-3.5 rounded-2xl border border-sanskrit-200 focus:outline-none focus:ring-2 focus:ring-sanskrit-500 bg-white text-sm"
        />
        <Button variant="primary" size="lg" type="submit" disabled={!inputMessage.trim() || isSending} className="gap-2 px-6">
          <span>Send</span>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
