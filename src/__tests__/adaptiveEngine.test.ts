import { describe, it, expect } from 'vitest';
import { AdaptiveEngine } from '../../server/services/adaptiveEngine';

describe('AdaptiveEngine Unit Tests', () => {
  it('should correctly calculate user levels based on XP thresholds', () => {
    expect(AdaptiveEngine.calculateLevel(0)).toEqual({ level: 1, title: 'Beginner', nextLevelXp: 50 });
    expect(AdaptiveEngine.calculateLevel(45)).toEqual({ level: 1, title: 'Beginner', nextLevelXp: 50 });
    expect(AdaptiveEngine.calculateLevel(75)).toEqual({ level: 2, title: 'Explorer', nextLevelXp: 150 });
    expect(AdaptiveEngine.calculateLevel(200)).toEqual({ level: 3, title: 'Learner', nextLevelXp: 300 });
    expect(AdaptiveEngine.calculateLevel(400)).toEqual({ level: 4, title: 'Practitioner', nextLevelXp: 500 });
    expect(AdaptiveEngine.calculateLevel(600)).toEqual({ level: 5, title: 'Sanskrit Seeker', nextLevelXp: 800 });
  });

  it('should classify case ending errors correctly', () => {
    const errorInfo = AdaptiveEngine.classifyError('multiple_choice', 'Case endings', 'बालकम्', 'बालकः');
    expect(errorInfo.category).toBe('Case confusion');
    expect(errorInfo.explanation).toContain('Vibhakti');
  });

  it('should classify gender agreement errors correctly', () => {
    const errorInfo = AdaptiveEngine.classifyError('multiple_choice', 'Gender agreement', 'सः', 'सा');
    expect(errorInfo.category).toBe('Gender agreement');
  });

  it('should classify verb conjugation errors correctly', () => {
    const errorInfo = AdaptiveEngine.classifyError('multiple_choice', 'Verb conjugation', 'पठामि', 'पठति');
    expect(errorInfo.category).toBe('Verb conjugation');
  });
});
