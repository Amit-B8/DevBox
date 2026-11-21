import { tools } from '../src/data/tools';
import { usageActions, feedbackCategories, feedbackMinLength, feedbackMaxLength, type UsageAction, type FeedbackCategory } from '../src/lib/backend-contract';

const toolIds = new Set(tools.map(tool => tool.id));
export type Usage = { toolId: string; action: UsageAction };
export type Feedback = { toolId?: string; category: FeedbackCategory; message: string };
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a JSON object.');
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, allowed: string[]) {
  if (Object.keys(value).some(key => !allowed.includes(key))) throw new Error('Unexpected fields.');
}
export function validateUsage(value: unknown): Usage {
  const data = object(value);
  keys(data, ['toolId', 'action']);
  if (typeof data.toolId !== 'string' || !toolIds.has(data.toolId)) throw new Error('Unknown tool.');
  if (!usageActions.includes(data.action as UsageAction)) throw new Error('Unsupported action.');
  return { toolId: data.toolId, action: data.action as UsageAction };
}
export function validateFeedback(value: unknown): Feedback {
  const data = object(value);
  keys(data, ['toolId', 'category', 'message']);
  if (data.toolId !== undefined && (typeof data.toolId !== 'string' || !toolIds.has(data.toolId))) throw new Error('Unknown tool.');
  if (!feedbackCategories.includes(data.category as FeedbackCategory)) throw new Error('Choose a valid feedback category.');
  if (typeof data.message !== 'string' || data.message.trim().length < feedbackMinLength || data.message.trim().length > feedbackMaxLength) {
    throw new Error('Message must contain 10 to 2000 characters.');
  }
  return { toolId: data.toolId as string | undefined, category: data.category as FeedbackCategory, message: data.message.trim() };
}
