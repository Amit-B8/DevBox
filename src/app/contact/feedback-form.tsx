'use client';

import { useState, type FormEvent } from 'react';
import { apiUrl, feedbackAvailable } from '@/lib/backend-client';
import { feedbackCategories, feedbackLabels, feedbackMinLength, feedbackMaxLength, type FeedbackCategory } from '@/lib/backend-contract';

export default function FeedbackForm() {
  const [category, setCategory] = useState<FeedbackCategory>('general_feedback');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  if (!feedbackAvailable()) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError(''); setSuccess(false);
    const trimmed = message.trim();
    if (trimmed.length < feedbackMinLength || trimmed.length > feedbackMaxLength) {
      setError('Please enter 10 to 2000 characters.'); return;
    }
    setBusy(true);
    try {
      const response = await fetch(apiUrl('/api/feedback')!, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ category, message: trimmed }),
      });
      if (!response.ok) {
        setError(response.status === 429 ? 'Too many submissions. Please wait a minute and try again.'
          : response.status === 400 ? 'Check your category and message length.'
          : 'Feedback is temporarily unavailable. Please try again later.');
        return;
      }
      setMessage(''); setSuccess(true);
    } catch { setError('Could not send your feedback. Check your connection and try again.'); }
    finally { setBusy(false); }
  }
  const field = 'mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white';
  return (
    <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6" aria-busy={busy}>
      <h2 className="text-xl font-semibold">Send feedback</h2>
      <p id="feedback-help" className="text-sm text-gray-400">Please leave out personal details, passwords, documents, and medical or financial information.</p>
      <label className="block text-sm">Category
        <select value={category} disabled={busy} onChange={event => { setCategory(event.target.value as FeedbackCategory); setSuccess(false); }} className={field}>
          {feedbackCategories.map(value => <option key={value} value={value}>{feedbackLabels[value]}</option>)}
        </select>
      </label>
      <label className="block text-sm">Message
        <textarea required minLength={feedbackMinLength} maxLength={feedbackMaxLength} rows={5} value={message} disabled={busy}
          aria-describedby="feedback-help feedback-length feedback-error" aria-invalid={!!error}
          onChange={event => { setMessage(event.target.value); setError(''); setSuccess(false); }} className={field} />
      </label>
      <p id="feedback-length" className="text-sm text-gray-400">{message.length} / 2000 characters (minimum 10)</p>
      <p id="feedback-error" role="alert" className="text-sm text-red-400">{error}</p>
      <p role="status" className="text-sm text-emerald-400">{success ? 'Thanks! Your feedback was received.' : ''}</p>
      <button type="submit" disabled={busy} className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500 disabled:opacity-50">
        {busy ? 'Sending...' : 'Send feedback'}
      </button>
    </form>
  );
}
