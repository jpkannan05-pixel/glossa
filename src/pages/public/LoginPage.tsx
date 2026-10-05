import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sanskrit-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-sanskrit-600 flex items-center justify-center text-white font-bold font-serif-heading text-xl shadow-md">
            ग्लो
          </div>
          <span className="text-2xl font-bold font-serif-heading text-sanskrit-900 tracking-wider">GLOSSA</span>
        </Link>
        <h2 className="text-2xl font-bold font-serif-heading text-sanskrit-900">Sign in to your account</h2>
        <p className="mt-1 text-sm text-charcoal-600">Continue your adaptive Sanskrit journey</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="py-8 px-6 sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sanskrit-200 focus:outline-none focus:ring-2 focus:ring-sanskrit-500 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-sanskrit-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-sanskrit-200 focus:outline-none focus:ring-2 focus:ring-sanskrit-500 text-sm"
                  required
                />
              </div>
            </div>

            <Button variant="primary" size="lg" type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-charcoal-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-sanskrit-600 hover:underline">
              Create Account
            </Link>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-sanskrit-700">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
