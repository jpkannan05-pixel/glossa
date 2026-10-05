import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignUpPage } from './pages/public/SignUpPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';

// Authenticated Pages
import { OnboardingPage } from './pages/authenticated/OnboardingPage';
import { DashboardPage } from './pages/authenticated/DashboardPage';
import { LearnPage } from './pages/authenticated/LearnPage';
import { LessonExperiencePage } from './pages/authenticated/LessonExperiencePage';
import { PracticePage } from './pages/authenticated/PracticePage';
import { ErrorPatternsPage } from './pages/authenticated/ErrorPatternsPage';
import { MasteryPage } from './pages/authenticated/MasteryPage';
import { ChatPage } from './pages/authenticated/ChatPage';
import { MissionsPage } from './pages/authenticated/MissionsPage';
import { StreakPage } from './pages/authenticated/StreakPage';
import { AchievementsPage } from './pages/authenticated/AchievementsPage';
import { LinguisticLabPage } from './pages/authenticated/LinguisticLabPage';
import { SanskritCulturePage } from './pages/authenticated/SanskritCulturePage';
import { ProfilePage } from './pages/authenticated/ProfilePage';
import { SettingsPage } from './pages/authenticated/SettingsPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner label="Authenticating session..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Public Route Wrapper (redirect logged in user to dashboard)
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner label="Loading GLOSSA..." />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><SignUpPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Authenticated Onboarding Route */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Main Authenticated Layout Routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:id" element={<LessonExperiencePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/error-patterns" element={<ErrorPatternsPage />} />
        <Route path="/mastery" element={<MasteryPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/missions" element={<MissionsPage />} />
        <Route path="/streak" element={<StreakPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/linguistic-lab" element={<LinguisticLabPage />} />
        <Route path="/culture" element={<SanskritCulturePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default App;
