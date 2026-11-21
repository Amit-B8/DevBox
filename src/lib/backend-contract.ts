export const usageActions = ['tool_view', 'calculate', 'convert', 'generate', 'copy_result'] as const;
export type UsageAction = typeof usageActions[number];
export const feedbackCategories = ['bug_report', 'feature_request', 'suggestion', 'general_feedback'] as const;
export type FeedbackCategory = typeof feedbackCategories[number];
export const feedbackLabels: Record<FeedbackCategory, string> = {
  bug_report: 'Bug report', feature_request: 'Feature request',
  suggestion: 'Suggestion', general_feedback: 'General feedback',
};
export const feedbackMinLength = 10;
export const feedbackMaxLength = 2000;
