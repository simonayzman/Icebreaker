const matches = {
  'u1-u2': { commonQuestions: ['q5', 'q7'], matchStrength: 0.85 },
  'u1-u3': { commonQuestions: ['q4', 'q7'], matchStrength: 0.1 },
  'u1-u4': { commonQuestions: ['q4', 'q5', 'q7'], matchStrength: 0.75 },
  'u1-u5': { commonQuestions: [], matchStrength: 0 },
  'u2-u3': { commonQuestions: ['q7'], matchStrength: 0.75 },
  'u2-u4': { commonQuestions: ['q5', 'q6', 'q7'], matchStrength: 0.35 },
  'u2-u5': { commonQuestions: [], matchStrength: 0 },
  'u3-u4': { commonQuestions: ['q3', 'q4', 'q7'], matchStrength: 0.65 },
  'u3-u5': { commonQuestions: [], matchStrength: 0 },
  'u4-u5': { commonQuestions: ['q2'], matchStrength: 0.35 },
};

export default matches;
