import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const data = await api.post<{ message: string; resetToken: string }>('/auth/forgot-password', { email });
      setMessage(data.message);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
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
        <h2 className="text-2xl font-bold font-serif-heading text-sanskrit-900">Reset your password</h2>
        <p className="mt-1 text-sm text-charcoal-600">Enter your email to receive password reset instructions</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="py-8 px-6 sm:px-10">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif-heading text-sanskrit-900">Reset Instructions Sent</h3>
              <p className="text-sm text-charcoal-600">{message}</p>
              {resetToken && (
                <div className="mt-4 p-3 bg-sanskrit-50 rounded-xl border border-sanskrit-200 text-xs">
                  <p className="font-semibold text-sanskrit-900 mb-1">Development Quick Link:</p>
                  <Link to={`/reset-password?token=${resetToken}`} className="text-sanskrit-600 font-bold underline break-all">
                    Click here to set new password
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Registered Email
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

              <Button variant="primary" size="lg" type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </Card>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-charcoal-500 hover:text-sanskrit-700">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
